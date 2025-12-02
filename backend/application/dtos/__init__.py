"""
DTOs (Data Transfer Objects) module.
"""
from backend.application.dtos.customer_dto import CustomerDTO
from backend.application.dtos.debt_dto import DebtDTO
from backend.application.dtos.payment_dto import PaymentDTO
from backend.application.dtos.gallery_dto import GalleryImageDTO

__all__ = [
    'CustomerDTO',
    'DebtDTO',
    'PaymentDTO',
    'GalleryImageDTO',
]

