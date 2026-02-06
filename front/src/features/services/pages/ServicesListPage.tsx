// front/src/features/services/pages/ServiceListPage.tsx
import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { fetchServices } from '../model/slice';
import ServiceCard from '../components/ServiceCard';
import styles from './servicesList.module.scss';
import RevealOnScroll from '../../shared/components/RevealOnScroll';

// Ручной порядок карточек по slug (меняйте как нужно)
// Если массив пуст — используется порядок API (sort_order, затем title)
const SERVICES_ORDER: string[] = [
  'holodnoe-vosstanovlenie',
  'botoks',
  'keratinovoe-vypryamlenie',
  'piling-kozhi-golovy',
  'slozhnoe-okrashivanie',
  'kudryavyj-metod',
  'biozavivka',
  'muzhskaya-biozavivka'
];

const ServicesListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loadingList, errorList } = useAppSelector((s) => s.services);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const orderedList = useMemo(() => {
    if (!SERVICES_ORDER.length) return list;

    const indexMap = new Map(SERVICES_ORDER.map((slug, i) => [slug, i]));
    const MAX = Number.MAX_SAFE_INTEGER;

    return [...list].sort((a, b) => {
      const ai = indexMap.get(a.slug);
      const bi = indexMap.get(b.slug);
      const av = ai !== undefined ? ai : MAX;
      const bv = bi !== undefined ? bi : MAX;
      if (av !== bv) return av - bv;

      const aOrder = a.sort_order ?? MAX;
      const bOrder = b.sort_order ?? MAX;
      if (aOrder !== bOrder) return aOrder - bOrder;

      return a.title.localeCompare(b.title, 'ru');
    });
  }, [list]);

  // Надёжное восстановление скролла после возврата с деталки
  useEffect(() => {
    if (loadingList) return;
    if (!orderedList.length) return;

    const shouldRestore = sessionStorage.getItem('services_restore') === '1';
    const yStr = sessionStorage.getItem('services_scroll') ?? '0';
    const y = Number(yStr);

    if (!shouldRestore || Number.isNaN(y)) return;

    let attempts = 0;
    const maxAttempts = 40;
    const pad = 200;
    const tryRestore = () => {
      attempts += 1;
      const ready = document.documentElement.scrollHeight >= y + pad;
      if (ready || attempts >= maxAttempts) {
        window.scrollTo({ top: y, left: 0, behavior: 'auto' });
        sessionStorage.removeItem('services_restore');
        sessionStorage.removeItem('services_scroll');
      } else {
        requestAnimationFrame(tryRestore);
      }
    };

    requestAnimationFrame(tryRestore);
  }, [loadingList, orderedList.length]);

  if (loadingList) return <div className={styles.center}>Загрузка услуг...</div>;
  if (errorList) return <div className={styles.centerError}>Ошибка: {errorList}</div>;
  if (!list.length) return <div className={styles.center}>Услуги не найдены</div>;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.pageTitle}>Наши услуги</h1>
      <div className={styles.grid}>
        {orderedList.map((s, idx) => (
          <RevealOnScroll
            key={s.id}
            /** небольшой стэггер, чтобы соседние карточки приходили «волной» */
            delayMs={(idx % 8) * 40}
            intensity="base"
            options={{ threshold: 0.2, rootMargin: '0px 0px -10% 0px', once: true }}
          >
            <ServiceCard service={s} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
};

export default ServicesListPage;
