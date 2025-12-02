"""
Gallery Repository Implementation using Django ORM.
"""
from typing import List, Optional
from backend.core.models import GalleryImage
from backend.application.abstracts.repository_abstract import IGalleryRepository
from backend.application.dtos.gallery_dto import GalleryImageDTO


class GalleryRepository(IGalleryRepository):
    """
    Gallery Repository Implementation
    """
    
    def _model_to_dto(self, gallery_image: GalleryImage) -> GalleryImageDTO:
        """Model'i DTO'ya çevir"""
        return GalleryImageDTO(
            id=gallery_image.id,
            title=gallery_image.title,
            description=gallery_image.description,
            image_url=gallery_image.image_url,
            is_active=gallery_image.is_active,
            order=gallery_image.order,
            created_at=gallery_image.created_at,
            updated_at=gallery_image.updated_at,
            created_by_id=gallery_image.created_by_id,
        )
    
    def create(self, gallery_dto, image_file) -> GalleryImageDTO:
        """Yeni galeri resmi oluştur"""
        gallery_image = GalleryImage.objects.create(
            title=gallery_dto.title,
            description=gallery_dto.description,
            image=image_file,
            is_active=gallery_dto.is_active,
            order=gallery_dto.order,
            created_by_id=gallery_dto.created_by_id,
        )
        return self._model_to_dto(gallery_image)
    
    def get_by_id(self, image_id: int) -> Optional[GalleryImageDTO]:
        """ID'ye göre galeri resmi getir"""
        try:
            gallery_image = GalleryImage.objects.get(id=image_id)
            return self._model_to_dto(gallery_image)
        except GalleryImage.DoesNotExist:
            return None
    
    def get_all(self, is_active: Optional[bool] = None) -> List[GalleryImageDTO]:
        """Tüm galeri resimlerini getir"""
        queryset = GalleryImage.objects.all()
        
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        
        queryset = queryset.order_by('order', '-created_at')
        
        return [self._model_to_dto(img) for img in queryset]
    
    def update(self, image_id: int, gallery_dto: GalleryImageDTO) -> Optional[GalleryImageDTO]:
        """Galeri resmi bilgilerini güncelle"""
        try:
            gallery_image = GalleryImage.objects.get(id=image_id)
            gallery_image.title = gallery_dto.title
            gallery_image.description = gallery_dto.description
            gallery_image.is_active = gallery_dto.is_active
            gallery_image.order = gallery_dto.order
            gallery_image.save()
            return self._model_to_dto(gallery_image)
        except GalleryImage.DoesNotExist:
            return None
    
    def delete(self, image_id: int) -> bool:
        """Galeri resmini sil"""
        try:
            gallery_image = GalleryImage.objects.get(id=image_id)
            gallery_image.delete()
            return True
        except GalleryImage.DoesNotExist:
            return False

