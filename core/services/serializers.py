# core/services/serializers.py
from rest_framework import serializers
from .models import Service


class ServiceListSerializer(serializers.ModelSerializer):
    short_description = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ('id', 'title', 'slug', 'short_description', 'price', 'image_url', 'sort_order')

    def get_short_description(self, obj: Service) -> str:
        text = (obj.description or '').strip()
        limit = 100

        if len(text) <= limit:
            return text

        i = limit
        n = len(text)
        while i < n and not text[i].isspace():
            i += 1

        snippet = text[:i].rstrip()
        return snippet + '...'

    def get_image_url(self, obj: Service) -> str | None:
        request = self.context.get('request')
        if obj.image:
            url = obj.image.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None


class ServiceDetailSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = (
            'id', 'title', 'slug', 'description', 'price', 'image_url',
            'is_active', 'created_at', 'updated_at', 'sort_order'
        )

    def get_image_url(self, obj: Service) -> str | None:
        request = self.context.get('request')
        if obj.image:
            url = obj.image.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None
