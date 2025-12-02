"""
Contact Message Serializers for API endpoints.
"""
from rest_framework import serializers


class ContactMessageSerializer(serializers.Serializer):
    """
    Contact Message serializer for create operations
    """
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=200, required=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True)
    message = serializers.CharField(required=True)
    
    # Read-only fields
    is_read = serializers.BooleanField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    
    def validate_name(self, value):
        """Ad validasyonu"""
        if not value or not value.strip():
            raise serializers.ValidationError("Ad soyad boş olamaz.")
        return value.strip()
    
    def validate_message(self, value):
        """Mesaj validasyonu"""
        if not value or not value.strip():
            raise serializers.ValidationError("Mesaj boş olamaz.")
        return value.strip()


class ContactMessageListSerializer(serializers.Serializer):
    """
    Contact Message serializer for list operations
    """
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    phone = serializers.CharField(read_only=True)
    message = serializers.CharField(read_only=True)
    is_read = serializers.BooleanField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

