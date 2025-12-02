"""
Customer ViewSet for API endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Q

from backend.interfaces.api.serializers.customer_serializer import (
    CustomerSerializer,
    CustomerListSerializer,
)
from backend.infrastructure.repositories import CustomerRepository
from backend.application.dtos.customer_dto import CustomerDTO


class CustomerViewSet(viewsets.ViewSet):
    """
    Customer ViewSet
    CRUD operations for Customer model
    """
    permission_classes = [IsAdminUser]
    
    def get_serializer_class(self):
        """List için optimize edilmiş serializer kullan"""
        if self.action == 'list':
            return CustomerListSerializer
        return CustomerSerializer
    
    def list(self, request):
        """
        GET /api/customers/
        Müşteri listesi
        """
        repository = CustomerRepository()
        
        # Query parameters
        is_active = request.query_params.get('is_active', None)
        search = request.query_params.get('search', None)
        
        # Filtreleme
        if search:
            customers = repository.search(search)
        else:
            is_active_filter = None
            if is_active is not None:
                is_active_filter = is_active.lower() == 'true'
            customers = repository.get_all(is_active=is_active_filter)
        
        # Serialize
        serializer = CustomerListSerializer([c.to_dict() for c in customers], many=True)
        
        return Response({
            'count': len(customers),
            'results': serializer.data
        })
    
    def retrieve(self, request, pk=None):
        """
        GET /api/customers/{id}/
        Tek müşteri detayı
        """
        repository = CustomerRepository()
        customer = repository.get_by_id(int(pk))
        
        if not customer:
            return Response(
                {'detail': 'Müşteri bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CustomerSerializer(customer.to_dict())
        return Response(serializer.data)
    
    def create(self, request):
        """
        POST /api/customers/
        Yeni müşteri oluştur
        """
        serializer = CustomerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # DTO oluştur
        customer_dto = CustomerDTO(
            first_name=serializer.validated_data['first_name'],
            last_name=serializer.validated_data['last_name'],
            phone=serializer.validated_data['phone'],
            email=serializer.validated_data.get('email'),
            address=serializer.validated_data.get('address'),
            is_active=serializer.validated_data.get('is_active', True),
            notes=serializer.validated_data.get('notes'),
            created_by_id=request.user.id if request.user.is_authenticated else None,
        )
        
        # Repository ile kaydet
        repository = CustomerRepository()
        
        # Telefon kontrolü
        existing = repository.get_by_phone(customer_dto.phone)
        if existing:
            return Response(
                {'phone': ['Bu telefon numarası zaten kullanılıyor.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        customer = repository.create(customer_dto)
        
        # Response
        response_serializer = CustomerSerializer(customer.to_dict())
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, pk=None):
        """
        PUT /api/customers/{id}/
        Müşteri güncelle (tüm alanlar)
        """
        repository = CustomerRepository()
        customer = repository.get_by_id(int(pk))
        
        if not customer:
            return Response(
                {'detail': 'Müşteri bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CustomerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # DTO oluştur
        customer_dto = CustomerDTO(
            id=customer.id,
            first_name=serializer.validated_data['first_name'],
            last_name=serializer.validated_data['last_name'],
            phone=serializer.validated_data['phone'],
            email=serializer.validated_data.get('email'),
            address=serializer.validated_data.get('address'),
            is_active=serializer.validated_data.get('is_active', True),
            notes=serializer.validated_data.get('notes'),
        )
        
        # Telefon kontrolü (farklı bir müşteriye aitse)
        if customer_dto.phone != customer.phone:
            existing = repository.get_by_phone(customer_dto.phone)
            if existing and existing.id != customer.id:
                return Response(
                    {'phone': ['Bu telefon numarası zaten kullanılıyor.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Güncelle
        updated_customer = repository.update(int(pk), customer_dto)
        
        if not updated_customer:
            return Response(
                {'detail': 'Güncelleme başarısız.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Response
        response_serializer = CustomerSerializer(updated_customer.to_dict())
        return Response(response_serializer.data)
    
    def partial_update(self, request, pk=None):
        """
        PATCH /api/customers/{id}/
        Müşteri kısmi güncelle (bazı alanlar)
        """
        repository = CustomerRepository()
        customer = repository.get_by_id(int(pk))
        
        if not customer:
            return Response(
                {'detail': 'Müşteri bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Mevcut verilerle merge
        serializer = CustomerSerializer(customer.to_dict(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # DTO oluştur (sadece güncellenen alanlar)
        customer_dto = CustomerDTO(
            id=customer.id,
            first_name=serializer.validated_data.get('first_name', customer.first_name),
            last_name=serializer.validated_data.get('last_name', customer.last_name),
            phone=serializer.validated_data.get('phone', customer.phone),
            email=serializer.validated_data.get('email', customer.email),
            address=serializer.validated_data.get('address', customer.address),
            is_active=serializer.validated_data.get('is_active', customer.is_active),
            notes=serializer.validated_data.get('notes', customer.notes),
        )
        
        # Telefon kontrolü
        if customer_dto.phone != customer.phone:
            existing = repository.get_by_phone(customer_dto.phone)
            if existing and existing.id != customer.id:
                return Response(
                    {'phone': ['Bu telefon numarası zaten kullanılıyor.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Güncelle
        updated_customer = repository.update(int(pk), customer_dto)
        
        if not updated_customer:
            return Response(
                {'detail': 'Güncelleme başarısız.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Response
        response_serializer = CustomerSerializer(updated_customer.to_dict())
        return Response(response_serializer.data)
    
    def destroy(self, request, pk=None):
        """
        DELETE /api/customers/{id}/
        Müşteri sil (soft delete)
        """
        repository = CustomerRepository()
        success = repository.delete(int(pk))
        
        if not success:
            return Response(
                {'detail': 'Müşteri bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['get'])
    def debts(self, request, pk=None):
        """
        GET /api/customers/{id}/debts/
        Müşterinin borçlarını getir
        """
        from backend.infrastructure.repositories import DebtRepository
        
        repository = DebtRepository()
        is_paid = request.query_params.get('is_paid', None)
        
        is_paid_filter = None
        if is_paid is not None:
            is_paid_filter = is_paid.lower() == 'true'
        
        debts = repository.get_by_customer_id(int(pk), is_paid=is_paid_filter)
        
        from backend.interfaces.api.serializers.debt_serializer import DebtListSerializer
        serializer = DebtListSerializer([d.to_dict() for d in debts], many=True)
        
        return Response({
            'count': len(debts),
            'results': serializer.data
        })

