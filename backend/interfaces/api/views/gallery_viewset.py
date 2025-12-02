"""
Gallery ViewSet for API endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny

from backend.interfaces.api.serializers.gallery_serializer import (
    GalleryImageSerializer,
    GalleryImageListSerializer,
)
from backend.infrastructure.repositories import GalleryRepository
from backend.application.dtos.gallery_dto import GalleryImageDTO


class GalleryViewSet(viewsets.ViewSet):
    """
    Gallery ViewSet
    CRUD operations for Gallery Image model
    """
    
    def get_permissions(self):
        """List için public, diğer işlemler için admin gerekli"""
        if self.action == 'list' or self.action == 'retrieve':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get_serializer_class(self):
        """List için optimize edilmiş serializer kullan"""
        if self.action == 'list':
            return GalleryImageListSerializer
        return GalleryImageSerializer
    
    def list(self, request):
        """
        GET /api/gallery/
        Galeri resmi listesi
        """
        repository = GalleryRepository()
        
        # Query parameters
        is_active = request.query_params.get('is_active', None)
        
        # Filtreleme
        is_active_filter = None
        if is_active is not None:
            is_active_filter = is_active.lower() == 'true'
        
        images = repository.get_all(is_active=is_active_filter)
        
        # Serialize
        serializer = GalleryImageListSerializer([img.to_dict() for img in images], many=True)
        
        return Response({
            'count': len(images),
            'results': serializer.data
        })
    
    def retrieve(self, request, pk=None):
        """
        GET /api/gallery/{id}/
        Tek galeri resmi detayı
        """
        repository = GalleryRepository()
        image = repository.get_by_id(int(pk))
        
        if not image:
            return Response(
                {'detail': 'Galeri resmi bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = GalleryImageSerializer(image.to_dict())
        return Response(serializer.data)
    
    def create(self, request):
        """
        POST /api/gallery/
        Yeni galeri resmi oluştur
        """
        serializer = GalleryImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # DTO oluştur
        gallery_dto = GalleryImageDTO(
            title=serializer.validated_data['title'],
            description=serializer.validated_data.get('description'),
            is_active=serializer.validated_data.get('is_active', True),
            order=serializer.validated_data.get('order', 0),
            created_by_id=request.user.id if request.user.is_authenticated else None,
        )
        
        # Resim dosyası
        image_file = request.FILES.get('image')
        if not image_file:
            return Response(
                {'image': ['Resim dosyası gereklidir.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Repository ile kaydet
        repository = GalleryRepository()
        image = repository.create(gallery_dto, image_file)
        
        # Response
        response_serializer = GalleryImageSerializer(image.to_dict())
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, pk=None):
        """
        PUT /api/gallery/{id}/
        Galeri resmi güncelle (tüm alanlar)
        """
        repository = GalleryRepository()
        image = repository.get_by_id(int(pk))
        
        if not image:
            return Response(
                {'detail': 'Galeri resmi bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = GalleryImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # DTO oluştur
        gallery_dto = GalleryImageDTO(
            id=image.id,
            title=serializer.validated_data['title'],
            description=serializer.validated_data.get('description'),
            is_active=serializer.validated_data.get('is_active', True),
            order=serializer.validated_data.get('order', 0),
        )
        
        # Güncelle
        updated_image = repository.update(int(pk), gallery_dto)
        
        if not updated_image:
            return Response(
                {'detail': 'Güncelleme başarısız.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Response
        response_serializer = GalleryImageSerializer(updated_image.to_dict())
        return Response(response_serializer.data)
    
    def partial_update(self, request, pk=None):
        """
        PATCH /api/gallery/{id}/
        Galeri resmi kısmi güncelle (bazı alanlar)
        """
        repository = GalleryRepository()
        image = repository.get_by_id(int(pk))
        
        if not image:
            return Response(
                {'detail': 'Galeri resmi bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Mevcut verilerle merge
        serializer = GalleryImageSerializer(image.to_dict(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # DTO oluştur (sadece güncellenen alanlar)
        gallery_dto = GalleryImageDTO(
            id=image.id,
            title=serializer.validated_data.get('title', image.title),
            description=serializer.validated_data.get('description', image.description),
            is_active=serializer.validated_data.get('is_active', image.is_active),
            order=serializer.validated_data.get('order', image.order),
        )
        
        # Güncelle
        updated_image = repository.update(int(pk), gallery_dto)
        
        if not updated_image:
            return Response(
                {'detail': 'Güncelleme başarısız.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Response
        response_serializer = GalleryImageSerializer(updated_image.to_dict())
        return Response(response_serializer.data)
    
    def destroy(self, request, pk=None):
        """
        DELETE /api/gallery/{id}/
        Galeri resmini sil
        """
        repository = GalleryRepository()
        success = repository.delete(int(pk))
        
        if not success:
            return Response(
                {'detail': 'Galeri resmi bulunamadı.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

