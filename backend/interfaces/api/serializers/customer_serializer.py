"""
Customer Serializers for API endpoints.
"""
from rest_framework import serializers
from decimal import Decimal


class CustomerSerializer(serializers.Serializer):
    """
    Customer serializer for create/update operations
    """
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(max_length=100, required=True)
    last_name = serializers.CharField(max_length=100, required=True)
    phone = serializers.CharField(max_length=20, required=True)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    is_active = serializers.BooleanField(default=True, required=False)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    # Read-only fields
    full_name = serializers.CharField(read_only=True)
    total_debt = serializers.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        read_only=True,
        default=Decimal('0.00')
    )
    total_paid = serializers.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        read_only=True,
        default=Decimal('0.00')
    )
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_by_id = serializers.IntegerField(read_only=True, required=False)
    
    def validate_phone(self, value):
        """Telefon numarası validasyonu"""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Telefon numarası en az 10 karakter olmalıdır.")
        return value.strip()
    
    def validate_email(self, value):
        """E-posta validasyonu"""
        if value and len(value.strip()) == 0:
            return None
        return value


class CustomerListSerializer(serializers.Serializer):
    """
    Customer serializer for list operations (optimized)
    """
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    full_name = serializers.CharField(read_only=True)
    phone = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    total_debt = serializers.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        read_only=True,
        default=Decimal('0.00')
    )
    created_at = serializers.DateTimeField(read_only=True)

