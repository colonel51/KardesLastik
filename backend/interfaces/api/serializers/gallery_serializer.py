"""
Gallery Image Serializers for API endpoints.
"""
from rest_framework import serializers


class GalleryImageSerializer(serializers.Serializer):
    """
    Gallery Image serializer for create/update operations
    """
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=200, required=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    image = serializers.ImageField(required=True, write_only=True)
    is_active = serializers.BooleanField(default=True, required=False)
    order = serializers.IntegerField(default=0, required=False)
    
    # Read-only fields
    image_url = serializers.CharField(read_only=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_by_id = serializers.IntegerField(read_only=True, required=False)
    
    def validate_title(self, value):
        """Başlık validasyonu"""
        if not value or not value.strip():
            raise serializers.ValidationError("Başlık boş olamaz.")
        return value.strip()
    
    def validate_order(self, value):
        """Sıra validasyonu"""
        if value < 0:
            raise serializers.ValidationError("Sıra değeri 0 veya daha büyük olmalıdır.")
        return value


class GalleryImageListSerializer(serializers.Serializer):
    """
    Gallery Image serializer for list operations (optimized)
    """
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    image_url = serializers.CharField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    order = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
