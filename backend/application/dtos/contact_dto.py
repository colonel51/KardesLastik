"""
Contact Message DTO (Data Transfer Object) for the application layer.
"""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class ContactMessageDTO:
    """
    Contact Message veri transfer objesi
    """
    id: Optional[int] = None
    name: str = ""
    email: str = ""
    phone: Optional[str] = None
    message: str = ""
    is_read: bool = False
    created_at: Optional[datetime] = None
    
    def to_dict(self) -> dict:
        """DTO'yu dictionary'e çevir"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

