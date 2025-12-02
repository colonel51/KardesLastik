"""
Contact Message ViewSet for API endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny

from backend.interfaces.api.serializers.contact_serializer import (
    ContactMessageSerializer,
    ContactMessageListSerializer,
)
from backend.infrastructure.repositories import ContactRepository
from backend.application.dtos.contact_dto import ContactMessageDTO


class ContactViewSet(viewsets.ViewSet):
    """
    Contact Message ViewSet
    CRUD operations for Contact Message model
    """
    
    def get_permissions(self):
        """Create için public, diğer işlemler için admin gerekli"""
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get_serializer_class(self):
        """List için optimize edilmiş serializer kullan"""
        if self.action == 'list':
            return ContactMessageListSerializer
        return ContactMessageSerializer
    
    def create(self, request):
        """
        POST /api/contact/
        Yeni iletişim mesajı oluştur (public)
        """
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # DTO oluştur
        contact_dto = ContactMessageDTO(
            name=serializer.validated_data['name'],
            email=serializer.validated_data['email'],
            phone=serializer.validated_data.get('phone'),
            message=serializer.validated_data['message'],
            is_read=False,
        )
        
        # Repository ile kaydet
        repository = ContactRepository()
        message = repository.create(contact_dto)
        
        # Response
        response_serializer = ContactMessageSerializer(message.to_dict())
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    def list(self, request):
        """
        GET /api/contact/
        İletişim mesajları listesi (admin only)
        """
        repository = ContactRepository()
        
        # Query parameters
        is_read = request.query_params.get('is_read', None)
        
        # Filtreleme
        is_read_filter = None
        if is_read is not None:
            is_read_filter = is_read.lower() == 'true'
        
        messages = repository.get_all(is_read=is_read_filter)
        
        # Serialize
        serializer = ContactMessageListSerializer([msg.to_dict() for msg in messages], many=True)
        
        return Response({
            'count': len(messages),
            'results': serializer.data
        })
    
    def retrieve(self, request, pk=None):
        """
        GET /api/contact/{id}/
        Tek mesaj detayı (admin only)
        """
        repository = ContactRepository()
        message = repository.get_by_id(int(pk))
        
        if not message:
            return Response(
                {'detail': 'Mesaj bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ContactMessageSerializer(message.to_dict())
        return Response(serializer.data)
    
    def destroy(self, request, pk=None):
        """
        DELETE /api/contact/{id}/
        Mesajı sil (admin only)
        """
        repository = ContactRepository()
        success = repository.delete(int(pk))
        
        if not success:
            return Response(
                {'detail': 'Mesaj bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """
        POST /api/contact/{id}/mark_as_read/
        Mesajı okundu olarak işaretle (admin only)
        """
        repository = ContactRepository()
        success = repository.mark_as_read(int(pk))
        
        if not success:
            return Response(
                {'detail': 'Mesaj bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        message = repository.get_by_id(int(pk))
        serializer = ContactMessageSerializer(message.to_dict())
        return Response(serializer.data)

