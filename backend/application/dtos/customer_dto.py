"""
Customer DTO (Data Transfer Object) for the application layer.
"""
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from typing import Optional


@dataclass
class CustomerDTO:
    """
    Customer veri transfer objesi
    """
    id: Optional[int] = None
    first_name: str = ""
    last_name: str = ""
    phone: str = ""
    email: Optional[str] = None
    address: Optional[str] = None
    is_active: bool = True
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by_id: Optional[int] = None
    total_debt: Decimal = Decimal('0.00')
    total_paid: Decimal = Decimal('0.00')
    
    @property
    def full_name(self) -> str:
        """Tam ad"""
        return f"{self.first_name} {self.last_name}".strip()
    
    def to_dict(self) -> dict:
        """DTO'yu dictionary'e çevir"""
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'is_active': self.is_active,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'created_by_id': self.created_by_id,
            'total_debt': float(self.total_debt),
            'total_paid': float(self.total_paid),
        }

