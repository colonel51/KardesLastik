"""
Debt Repository Implementation using Django ORM.
"""
from typing import List, Optional
from django.utils import timezone
from django.db.models import Sum, Q
from decimal import Decimal
from backend.core.models import Debt
from backend.application.abstracts.repository_abstract import IDebtRepository
from backend.application.dtos.debt_dto import DebtDTO


class DebtRepository(IDebtRepository):
    """
    Debt Repository Implementation
    """
    
    def _model_to_dto(self, debt: Debt) -> DebtDTO:
        """Model'i DTO'ya çevir"""
        return DebtDTO(
            id=debt.id,
            customer_id=debt.customer_id,
            customer_name=debt.customer.full_name if debt.customer else None,
            debt_type=debt.debt_type,
            amount=debt.amount,
            description=debt.description,
            is_paid=debt.is_paid,
            paid_at=debt.paid_at,
            paid_by_id=debt.paid_by_id,
            created_at=debt.created_at,
            updated_at=debt.updated_at,
            created_by_id=debt.created_by_id,
            due_date=debt.due_date,
        )
    
    def create(self, debt_dto: DebtDTO) -> DebtDTO:
        """Yeni borç/alacak kaydı oluştur"""
        from backend.core.models import Customer
        
        customer = Customer.objects.get(id=debt_dto.customer_id)
        
        debt = Debt.objects.create(
            customer=customer,
            debt_type=debt_dto.debt_type,
            amount=debt_dto.amount,
            description=debt_dto.description,
            is_paid=debt_dto.is_paid,
            due_date=debt_dto.due_date,
            created_by_id=debt_dto.created_by_id,
        )
        
        if debt_dto.is_paid:
            debt.mark_as_paid()
        
        return self._model_to_dto(debt)
    
    def get_by_id(self, debt_id: int) -> Optional[DebtDTO]:
        """ID'ye göre borç getir"""
        try:
            debt = Debt.objects.select_related('customer').get(id=debt_id)
            return self._model_to_dto(debt)
        except Debt.DoesNotExist:
            return None
    
    def get_by_customer_id(self, customer_id: int, is_paid: Optional[bool] = None) -> List[DebtDTO]:
        """Müşteriye ait borçları getir"""
        queryset = Debt.objects.select_related('customer').filter(customer_id=customer_id)
        
        if is_paid is not None:
            queryset = queryset.filter(is_paid=is_paid)
        
        queryset = queryset.order_by('-created_at')
        
        return [self._model_to_dto(debt) for debt in queryset]
    
    def get_all(self, is_paid: Optional[bool] = None, debt_type: Optional[str] = None) -> List[DebtDTO]:
        """Tüm borçları getir"""
        queryset = Debt.objects.select_related('customer').all()
        
        if is_paid is not None:
            queryset = queryset.filter(is_paid=is_paid)
        
        if debt_type:
            queryset = queryset.filter(debt_type=debt_type)
        
        queryset = queryset.order_by('-created_at')
        
        return [self._model_to_dto(debt) for debt in queryset]
    
    def update(self, debt_id: int, debt_dto: DebtDTO) -> Optional[DebtDTO]:
        """Borç bilgilerini güncelle"""
        try:
            debt = Debt.objects.get(id=debt_id)
            debt.debt_type = debt_dto.debt_type
            debt.amount = debt_dto.amount
            debt.description = debt_dto.description
            debt.due_date = debt_dto.due_date
            
            # Ödeme durumu değiştiyse
            if debt_dto.is_paid and not debt.is_paid:
                debt.mark_as_paid()
            elif not debt_dto.is_paid and debt.is_paid:
                debt.mark_as_unpaid()
            
            debt.save()
            return self._model_to_dto(debt)
        except Debt.DoesNotExist:
            return None
    
    def delete(self, debt_id: int) -> bool:
        """Borç kaydını sil"""
        try:
            debt = Debt.objects.get(id=debt_id)
            debt.delete()
            return True
        except Debt.DoesNotExist:
            return False
    
    def mark_as_paid(self, debt_id: int, user_id: Optional[int] = None) -> bool:
        """Borcu ödendi olarak işaretle"""
        try:
            from django.contrib.auth.models import User
            debt = Debt.objects.get(id=debt_id)
            user = User.objects.get(id=user_id) if user_id else None
            debt.mark_as_paid(user)
            return True
        except (Debt.DoesNotExist, User.DoesNotExist):
            return False
    
    def mark_as_unpaid(self, debt_id: int) -> bool:
        """Borcu ödenmedi olarak işaretle"""
        try:
            debt = Debt.objects.get(id=debt_id)
            debt.mark_as_unpaid()
            return True
        except Debt.DoesNotExist:
            return False
    
    def get_customer_total_debt(self, customer_id: int) -> float:
        """Müşterinin toplam borç tutarını getir"""
        result = Debt.objects.filter(
            customer_id=customer_id,
            is_paid=False,
            debt_type='DEBT'
        ).aggregate(
            total=Sum('amount')
        )
        return float(result['total'] or 0)

