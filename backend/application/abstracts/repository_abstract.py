"""
Repository Abstract interfaces for the application layer.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from backend.application.dtos.customer_dto import CustomerDTO
from backend.application.dtos.debt_dto import DebtDTO
from backend.application.dtos.contact_dto import ContactMessageDTO


class ICustomerRepository(ABC):
    """
    Customer Repository Abstract Interface
    """
    
    @abstractmethod
    def create(self, customer_dto: CustomerDTO) -> CustomerDTO:
        """Yeni müşteri oluştur"""
        pass
    
    @abstractmethod
    def get_by_id(self, customer_id: int) -> Optional[CustomerDTO]:
        """ID'ye göre müşteri getir"""
        pass
    
    @abstractmethod
    def get_by_phone(self, phone: str) -> Optional[CustomerDTO]:
        """Telefona göre müşteri getir"""
        pass
    
    @abstractmethod
    def get_all(self, is_active: Optional[bool] = None) -> List[CustomerDTO]:
        """Tüm müşterileri getir"""
        pass
    
    @abstractmethod
    def update(self, customer_id: int, customer_dto: CustomerDTO) -> Optional[CustomerDTO]:
        """Müşteri bilgilerini güncelle"""
        pass
    
    @abstractmethod
    def delete(self, customer_id: int) -> bool:
        """Müşteriyi sil (soft delete)"""
        pass
    
    @abstractmethod
    def search(self, query: str) -> List[CustomerDTO]:
        """Müşteri ara (isim, telefon, email)"""
        pass


class IDebtRepository(ABC):
    """
    Debt Repository Abstract Interface
    """
    
    @abstractmethod
    def create(self, debt_dto: DebtDTO) -> DebtDTO:
        """Yeni borç/alacak kaydı oluştur"""
        pass
    
    @abstractmethod
    def get_by_id(self, debt_id: int) -> Optional[DebtDTO]:
        """ID'ye göre borç getir"""
        pass
    
    @abstractmethod
    def get_by_customer_id(self, customer_id: int, is_paid: Optional[bool] = None) -> List[DebtDTO]:
        """Müşteriye ait borçları getir"""
        pass
    
    @abstractmethod
    def get_all(self, is_paid: Optional[bool] = None, debt_type: Optional[str] = None) -> List[DebtDTO]:
        """Tüm borçları getir"""
        pass
    
    @abstractmethod
    def update(self, debt_id: int, debt_dto: DebtDTO) -> Optional[DebtDTO]:
        """Borç bilgilerini güncelle"""
        pass
    
    @abstractmethod
    def delete(self, debt_id: int) -> bool:
        """Borç kaydını sil"""
        pass
    
    @abstractmethod
    def mark_as_paid(self, debt_id: int, user_id: Optional[int] = None) -> bool:
        """Borcu ödendi olarak işaretle"""
        pass
    
    @abstractmethod
    def mark_as_unpaid(self, debt_id: int) -> bool:
        """Borcu ödenmedi olarak işaretle"""
        pass
    
    @abstractmethod
    def get_customer_total_debt(self, customer_id: int) -> float:
        """Müşterinin toplam borç tutarını getir"""
        pass


class IGalleryRepository(ABC):
    """
    Gallery Repository Abstract Interface
    """
    
    @abstractmethod
    def create(self, gallery_dto, image_file):
        """Yeni galeri resmi oluştur"""
        pass
    
    @abstractmethod
    def get_by_id(self, image_id: int):
        """ID'ye göre galeri resmi getir"""
        pass
    
    @abstractmethod
    def get_all(self, is_active: Optional[bool] = None):
        """Tüm galeri resimlerini getir"""
        pass
    
    @abstractmethod
    def update(self, image_id: int, gallery_dto):
        """Galeri resmi bilgilerini güncelle"""
        pass
    
    @abstractmethod
    def delete(self, image_id: int) -> bool:
        """Galeri resmini sil"""
        pass


class IContactRepository(ABC):
    """
    Contact Message Repository Abstract Interface
    """
    
    @abstractmethod
    def create(self, contact_dto: ContactMessageDTO) -> ContactMessageDTO:
        """Yeni iletişim mesajı oluştur"""
        pass
    
    @abstractmethod
    def get_by_id(self, message_id: int) -> Optional[ContactMessageDTO]:
        """ID'ye göre mesaj getir"""
        pass
    
    @abstractmethod
    def get_all(self, is_read: Optional[bool] = None) -> List[ContactMessageDTO]:
        """Tüm mesajları getir"""
        pass
    
    @abstractmethod
    def mark_as_read(self, message_id: int) -> bool:
        """Mesajı okundu olarak işaretle"""
        pass
    
    @abstractmethod
    def delete(self, message_id: int) -> bool:
        """Mesajı sil"""
        pass

