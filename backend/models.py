"""
Backend models module.
Backend app models are defined in core.models
"""
# Import models from core.models to make them available to Django
from backend.core.models.customer import Customer
from backend.core.models.debt import Debt
from backend.core.models.gallery import GalleryImage
from backend.core.models.contact import ContactMessage

__all__ = ['Customer', 'Debt', 'GalleryImage', 'ContactMessage']
