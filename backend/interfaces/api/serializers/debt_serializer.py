"""
Debt Serializers for API endpoints.
"""
from rest_framework import serializers
from decimal import Decimal


class DebtSerializer(serializers.Serializer):
    """
    Debt serializer for create/update operations
    """
    id = serializers.IntegerField(read_only=True)
    customer_id = serializers.IntegerField(required=True)
    customer_name = serializers.CharField(read_only=True, required=False)
    debt_type = serializers.ChoiceField(
        choices=['DEBT', 'CREDIT'],
        default='DEBT',
        required=False
    )
    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=True,
        min_value=Decimal('0.01')
    )
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True
    )
    is_paid = serializers.BooleanField(default=False, required=False)
    
    # Read-only fields
    paid_at = serializers.DateTimeField(read_only=True, required=False)
    paid_by_id = serializers.IntegerField(read_only=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_by_id = serializers.IntegerField(read_only=True, required=False)
    due_date = serializers.DateField(required=False, allow_null=True)
    
    def validate_customer_id(self, value):
        """Müşteri ID validasyonu"""
        from backend.core.models import Customer
        try:
            Customer.objects.get(id=value, is_active=True)
        except Customer.DoesNotExist:
            raise serializers.ValidationError("Aktif bir müşteri bulunamadı.")
        return value
    
    def validate_amount(self, value):
        """Tutar validasyonu"""
        if value <= 0:
            raise serializers.ValidationError("Tutar 0'dan büyük olmalıdır.")
        return value


class DebtListSerializer(serializers.Serializer):
    """
    Debt serializer for list operations (optimized)
    """
    id = serializers.IntegerField(read_only=True)
    customer_id = serializers.IntegerField(read_only=True)
    customer_name = serializers.CharField(read_only=True)
    debt_type = serializers.CharField(read_only=True)
    debt_type_display = serializers.CharField(read_only=True)
    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )
    description = serializers.CharField(read_only=True)
    is_paid = serializers.BooleanField(read_only=True)
    due_date = serializers.DateField(read_only=True, allow_null=True)
    created_at = serializers.DateTimeField(read_only=True)
    paid_at = serializers.DateTimeField(read_only=True, allow_null=True)

