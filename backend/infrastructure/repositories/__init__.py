"""
Repository implementations module.
"""
from backend.infrastructure.repositories.customer_repository import CustomerRepository
from backend.infrastructure.repositories.debt_repository import DebtRepository
from backend.infrastructure.repositories.gallery_repository import GalleryRepository
from backend.infrastructure.repositories.contact_repository import ContactRepository

__all__ = [
    'CustomerRepository',
    'DebtRepository',
    'GalleryRepository',
    'ContactRepository',
]

