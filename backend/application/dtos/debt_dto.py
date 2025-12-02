"""
Debt DTO (Data Transfer Object) for the application layer.
"""
from dataclasses import dataclass
from datetime import datetime, date
from decimal import Decimal
from typing import Optional


@dataclass
class DebtDTO:
    """
    Debt veri transfer objesi
    """
    id: Optional[int] = None
    customer_id: int = 0
    customer_name: Optional[str] = None
    debt_type: str = "DEBT"  # DEBT or CREDIT
    amount: Decimal = Decimal('0.00')
    description: Optional[str] = None
    is_paid: bool = False
    paid_at: Optional[datetime] = None
    paid_by_id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by_id: Optional[int] = None
    due_date: Optional[date] = None
    
    def to_dict(self) -> dict:
        """DTO'yu dictionary'e çevir"""
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'customer_name': self.customer_name,
            'debt_type': self.debt_type,
            'debt_type_display': 'Borç' if self.debt_type == 'DEBT' else 'Alacak',
            'amount': float(self.amount),
            'description': self.description,
            'is_paid': self.is_paid,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'paid_by_id': self.paid_by_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'created_by_id': self.created_by_id,
            'due_date': self.due_date.isoformat() if self.due_date else None,
        }

