"""
Debt ViewSet for API endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from decimal import Decimal

from backend.interfaces.api.serializers.debt_serializer import (
    DebtSerializer,
    DebtListSerializer,
)
from backend.infrastructure.repositories import DebtRepository
from backend.application.dtos.debt_dto import DebtDTO


class DebtViewSet(viewsets.ViewSet):
    """
    Debt ViewSet
    CRUD operations for Debt model
    """
    permission_classes = [IsAdminUser]
    
    def get_serializer_class(self):
        """List için optimize edilmiş serializer kullan"""
        if self.action == 'list':
            return DebtListSerializer
        return DebtSerializer
    
    def list(self, request):
        """
        GET /api/debts/
        Borç listesi
        """
        repository = DebtRepository()
        
        # Query parameters
        is_paid = request.query_params.get('is_paid', None)
        debt_type = request.query_params.get('debt_type', None)
        customer_id = request.query_params.get('customer_id', None)
        
        # Filtreleme
        is_paid_filter = None
        if is_paid is not None:
            is_paid_filter = is_paid.lower() == 'true'
        
        if customer_id:
            debts = repository.get_by_customer_id(int(customer_id), is_paid=is_paid_filter)
        else:
            debts = repository.get_all(is_paid=is_paid_filter, debt_type=debt_type)
        
        # Serialize
        serializer = DebtListSerializer([d.to_dict() for d in debts], many=True)
        
        return Response({
            'count': len(debts),
            'results': serializer.data
        })
    
    def retrieve(self, request, pk=None):
        """
        GET /api/debts/{id}/
        Tek borç detayı
        """
        repository = DebtRepository()
        debt = repository.get_by_id(int(pk))
        
        if not debt:
            return Response(
                {'detail': 'Borç kaydı bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = DebtSerializer(debt.to_dict())
        return Response(serializer.data)
    
    def create(self, request):
        """
        POST /api/debts/
        Yeni borç/alacak kaydı oluştur
        """
        serializer = DebtSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # DTO oluştur
        debt_dto = DebtDTO(
            customer_id=serializer.validated_data['customer_id'],
            debt_type=serializer.validated_data.get('debt_type', 'DEBT'),
            amount=serializer.validated_data['amount'],
            description=serializer.validated_data.get('description'),
            is_paid=serializer.validated_data.get('is_paid', False),
            due_date=serializer.validated_data.get('due_date'),
            created_by_id=request.user.id if request.user.is_authenticated else None,
        )
        
        # Repository ile kaydet
        repository = DebtRepository()
        debt = repository.create(debt_dto)
        
        # Response
        response_serializer = DebtSerializer(debt.to_dict())
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, pk=None):
        """
        PUT /api/debts/{id}/
        Borç güncelle (tüm alanlar)
        """
        repository = DebtRepository()
        debt = repository.get_by_id(int(pk))
        
        if not debt:
            return Response(
                {'detail': 'Borç kaydı bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = DebtSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # DTO oluştur
        debt_dto = DebtDTO(
            id=debt.id,
            customer_id=serializer.validated_data['customer_id'],
            debt_type=serializer.validated_data.get('debt_type', 'DEBT'),
            amount=serializer.validated_data['amount'],
            description=serializer.validated_data.get('description'),
            is_paid=serializer.validated_data.get('is_paid', False),
            due_date=serializer.validated_data.get('due_date'),
        )
        
        # Güncelle
        updated_debt = repository.update(int(pk), debt_dto)
        
        if not updated_debt:
            return Response(
                {'detail': 'Güncelleme başarısız.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Response
        response_serializer = DebtSerializer(updated_debt.to_dict())
        return Response(response_serializer.data)
    
    def partial_update(self, request, pk=None):
        """
        PATCH /api/debts/{id}/
        Borç kısmi güncelle (bazı alanlar)
        """
        repository = DebtRepository()
        debt = repository.get_by_id(int(pk))
        
        if not debt:
            return Response(
                {'detail': 'Borç kaydı bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Mevcut verilerle merge
        serializer = DebtSerializer(debt.to_dict(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # DTO oluştur (sadece güncellenen alanlar)
        debt_dto = DebtDTO(
            id=debt.id,
            customer_id=serializer.validated_data.get('customer_id', debt.customer_id),
            debt_type=serializer.validated_data.get('debt_type', debt.debt_type),
            amount=serializer.validated_data.get('amount', debt.amount),
            description=serializer.validated_data.get('description', debt.description),
            is_paid=serializer.validated_data.get('is_paid', debt.is_paid),
            due_date=serializer.validated_data.get('due_date', debt.due_date),
        )
        
        # Güncelle
        updated_debt = repository.update(int(pk), debt_dto)
        
        if not updated_debt:
            return Response(
                {'detail': 'Güncelleme başarısız.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Response
        response_serializer = DebtSerializer(updated_debt.to_dict())
        return Response(response_serializer.data)
    
    def destroy(self, request, pk=None):
        """
        DELETE /api/debts/{id}/
        Borç kaydını sil
        """
        repository = DebtRepository()
        success = repository.delete(int(pk))
        
        if not success:
            return Response(
                {'detail': 'Borç kaydı bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """
        POST /api/debts/{id}/mark_paid/
        Borcu ödendi olarak işaretle
        """
        repository = DebtRepository()
        success = repository.mark_as_paid(int(pk), request.user.id if request.user.is_authenticated else None)
        
        if not success:
            return Response(
                {'detail': 'Borç kaydı bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Güncellenmiş borç bilgisini getir
        debt = repository.get_by_id(int(pk))
        serializer = DebtSerializer(debt.to_dict())
        
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_unpaid(self, request, pk=None):
        """
        POST /api/debts/{id}/mark_unpaid/
        Borcu ödenmedi olarak işaretle
        """
        repository = DebtRepository()
        success = repository.mark_as_unpaid(int(pk))
        
        if not success:
            return Response(
                {'detail': 'Borç kaydı bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Güncellenmiş borç bilgisini getir
        debt = repository.get_by_id(int(pk))
        serializer = DebtSerializer(debt.to_dict())
        
        return Response(serializer.data)

