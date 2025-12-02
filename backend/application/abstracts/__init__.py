"""
Abstract interfaces module.
"""
from backend.application.abstracts.repository_abstract import (
    ICustomerRepository,
    IDebtRepository,
    IGalleryRepository,
)

__all__ = [
    'ICustomerRepository',
    'IDebtRepository',
    'IGalleryRepository',
]

