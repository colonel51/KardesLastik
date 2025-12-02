"""
Payment DTO (Data Transfer Object) for the application layer.
"""
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from typing import Optional


@dataclass
class PaymentDTO:
    """
    Payment veri transfer objesi - Borç ödeme işlemleri için
    """
    debt_id: int = 0
    customer_id: int = 0
    amount: Decimal = Decimal('0.00')
    payment_date: Optional[datetime] = None
    notes: Optional[str] = None
    paid_by_id: Optional[int] = None
    
    def to_dict(self) -> dict:
        """DTO'yu dictionary'e çevir"""
        return {
            'debt_id': self.debt_id,
            'customer_id': self.customer_id,
            'amount': float(self.amount),
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'notes': self.notes,
            'paid_by_id': self.paid_by_id,
        }

