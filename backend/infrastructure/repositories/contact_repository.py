"""
Contact Message Repository Implementation using Django ORM.
"""
from typing import List, Optional
from backend.core.models import ContactMessage
from backend.application.abstracts.repository_abstract import IContactRepository
from backend.application.dtos.contact_dto import ContactMessageDTO


class ContactRepository(IContactRepository):
    """
    Contact Message Repository Implementation
    """
    
    def _model_to_dto(self, contact_message: ContactMessage) -> ContactMessageDTO:
        """Model'i DTO'ya çevir"""
        return ContactMessageDTO(
            id=contact_message.id,
            name=contact_message.name,
            email=contact_message.email,
            phone=contact_message.phone,
            message=contact_message.message,
            is_read=contact_message.is_read,
            created_at=contact_message.created_at,
        )
    
    def create(self, contact_dto: ContactMessageDTO) -> ContactMessageDTO:
        """Yeni iletişim mesajı oluştur"""
        contact_message = ContactMessage.objects.create(
            name=contact_dto.name,
            email=contact_dto.email,
            phone=contact_dto.phone,
            message=contact_dto.message,
            is_read=False,
        )
        return self._model_to_dto(contact_message)
    
    def get_by_id(self, message_id: int) -> Optional[ContactMessageDTO]:
        """ID'ye göre mesaj getir"""
        try:
            contact_message = ContactMessage.objects.get(id=message_id)
            return self._model_to_dto(contact_message)
        except ContactMessage.DoesNotExist:
            return None
    
    def get_all(self, is_read: Optional[bool] = None) -> List[ContactMessageDTO]:
        """Tüm mesajları getir"""
        queryset = ContactMessage.objects.all()
        
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read)
        
        queryset = queryset.order_by('-created_at', '-is_read')
        
        return [self._model_to_dto(msg) for msg in queryset]
    
    def mark_as_read(self, message_id: int) -> bool:
        """Mesajı okundu olarak işaretle"""
        try:
            contact_message = ContactMessage.objects.get(id=message_id)
            contact_message.mark_as_read()
            return True
        except ContactMessage.DoesNotExist:
            return False
    
    def delete(self, message_id: int) -> bool:
        """Mesajı sil"""
        try:
            contact_message = ContactMessage.objects.get(id=message_id)
            contact_message.delete()
            return True
        except ContactMessage.DoesNotExist:
            return False

