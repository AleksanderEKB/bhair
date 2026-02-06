# core/services/models.py
from django.db import models
from django.utils.text import slugify
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.core.files.storage import FileSystemStorage
import os
import shutil


def service_image_upload_to(instance, filename):
    return f"services/{instance.slug or 'service'}/{filename}"


class Service(models.Model):
    title = models.CharField('Название', max_length=255)
    slug = models.SlugField('Слаг', max_length=255, unique=True, blank=True)
    image = models.ImageField('Изображение', upload_to=service_image_upload_to, blank=True, null=True)
    description = models.TextField('Описание')
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2)
    is_active = models.BooleanField('Активна', default=True)

    # Новое поле для ручной сортировки
    sort_order = models.PositiveIntegerField('Порядок', default=0, db_index=True)

    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'
        # По умолчанию сортируем по sort_order, затем по title
        ordering = ['sort_order', 'title']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # автогенерация slug при отсутствии
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Service.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        super().save(*args, **kwargs)

        # Приведение изображения к стандартному размеру
        if self.image:
            try:
                img = Image.open(self.image)
                img = img.convert('RGB')
                target_size = (1024, 1024)
                img = img.resize(target_size, Image.Resampling.LANCZOS)

                buffer = BytesIO()
                img.save(buffer, format='JPEG', quality=85)
                buffer.seek(0)

                file_name = self.image.name.split('/')[-1]
                self.image.save(file_name, ContentFile(buffer.read()), save=False)

                super().save(update_fields=['image'])
            except Exception:
                # игнорируем проблемы с обработкой изображения
                pass


# --- СИГНАЛЫ ---

@receiver(post_delete, sender=Service)
def delete_service_media_dir_on_delete(sender, instance: Service, **kwargs):
    """
    При удалении услуги:
      1) Удаляем сам файл изображения (для не-FS стораджей это единственный шаг)
      2) Если сторадж файловый (FileSystemStorage), удаляем всю директорию services/<slug>/ полностью
         (включая все оставшиеся изображения/файлы).
    """
    # 1) Удаляем сам файл (на всякий)
    try:
        if instance.image:
            instance.image.delete(save=False)
    except Exception:
        pass

    # 2) Удаляем директорию services/<slug>/ целиком (только для локального FileSystemStorage)
    try:
        storage = getattr(instance.image, 'storage', None)
        if isinstance(storage, FileSystemStorage):
            rel_dir = f"services/{(instance.slug or 'service')}"
            try:
                abs_dir = storage.path(rel_dir)
            except Exception:
                abs_dir = None

            if abs_dir and os.path.isdir(abs_dir):
                shutil.rmtree(abs_dir, ignore_errors=True)
    except Exception:
        # для S3 и пр. стораджей "директории" нет — пропускаем
        pass


@receiver(pre_save, sender=Service)
def delete_old_service_image_on_change(sender, instance: Service, **kwargs):
    """
    При замене изображения удаляем только старый файл.
    Папку НЕ трогаем.
    """
    if not instance.pk:
        return
    try:
        old = Service.objects.get(pk=instance.pk)
    except Service.DoesNotExist:
        return

    old_file = old.image
    new_file = instance.image

    if old_file and old_file != new_file:
        try:
            old_file.delete(save=False)
        except Exception:
            pass
