"""
Customer Repository Implementation using Django ORM.
"""
from typing import List, Optional
from django.db.models import Q, Sum
from django.db import models
from backend.core.models import Customer
from backend.application.abstracts.repository_abstract import ICustomerRepository
from backend.application.dtos.customer_dto import CustomerDTO
from decimal import Decimal


class CustomerRepository(ICustomerRepository):
    """
    Customer Repository Implementation
    """
    
    def _model_to_dto(self, customer: Customer) -> CustomerDTO:
        """Model'i DTO'ya çevir"""
        total_debt = Decimal(str(customer.total_debt))
        total_paid = Decimal(str(customer.total_paid))
        
        return CustomerDTO(
            id=customer.id,
            first_name=customer.first_name,
            last_name=customer.last_name,
            phone=customer.phone,
            email=customer.email,
            address=customer.address,
            is_active=customer.is_active,
            notes=customer.notes,
            created_at=customer.created_at,
            updated_at=customer.updated_at,
            created_by_id=customer.created_by_id,
            total_debt=total_debt,
            total_paid=total_paid,
        )
    
    def create(self, customer_dto: CustomerDTO) -> CustomerDTO:
        """Yeni müşteri oluştur"""
        customer = Customer.objects.create(
            first_name=customer_dto.first_name,
            last_name=customer_dto.last_name,
            phone=customer_dto.phone,
            email=customer_dto.email,
            address=customer_dto.address,
            is_active=customer_dto.is_active,
            notes=customer_dto.notes,
            created_by_id=customer_dto.created_by_id,
        )
        return self._model_to_dto(customer)
    
    def get_by_id(self, customer_id: int) -> Optional[CustomerDTO]:
        """ID'ye göre müşteri getir"""
        try:
            customer = Customer.objects.get(id=customer_id)
            return self._model_to_dto(customer)
        except Customer.DoesNotExist:
            return None
    
    def get_by_phone(self, phone: str) -> Optional[CustomerDTO]:
        """Telefona göre müşteri getir"""
        try:
            customer = Customer.objects.get(phone=phone)
            return self._model_to_dto(customer)
        except Customer.DoesNotExist:
            return None
    
    def get_all(self, is_active: Optional[bool] = None) -> List[CustomerDTO]:
        """Tüm müşterileri getir"""
        queryset = Customer.objects.all()
        
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        
        return [self._model_to_dto(customer) for customer in queryset]
    
    def update(self, customer_id: int, customer_dto: CustomerDTO) -> Optional[CustomerDTO]:
        """Müşteri bilgilerini güncelle"""
        try:
            customer = Customer.objects.get(id=customer_id)
            customer.first_name = customer_dto.first_name
            customer.last_name = customer_dto.last_name
            customer.phone = customer_dto.phone
            customer.email = customer_dto.email
            customer.address = customer_dto.address
            customer.is_active = customer_dto.is_active
            customer.notes = customer_dto.notes
            customer.save()
            return self._model_to_dto(customer)
        except Customer.DoesNotExist:
            return None
    
    def delete(self, customer_id: int) -> bool:
        """Müşteriyi sil (soft delete)"""
        try:
            customer = Customer.objects.get(id=customer_id)
            customer.is_active = False
            customer.save()
            return True
        except Customer.DoesNotExist:
            return False
    
    def search(self, query: str) -> List[CustomerDTO]:
        """Müşteri ara (isim, telefon, email)"""
        queryset = Customer.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(phone__icontains=query) |
            Q(email__icontains=query)
        )
        return [self._model_to_dto(customer) for customer in queryset]

