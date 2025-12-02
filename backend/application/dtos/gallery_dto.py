"""
Gallery DTO (Data Transfer Object) for the application layer.
"""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class GalleryImageDTO:
    """
    Gallery Image veri transfer objesi
    """
    id: Optional[int] = None
    title: str = ""
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True
    order: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by_id: Optional[int] = None
    
    def to_dict(self) -> dict:
        """DTO'yu dictionary'e çevir"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'image_url': self.image_url,
            'is_active': self.is_active,
            'order': self.order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'created_by_id': self.created_by_id,
        }

