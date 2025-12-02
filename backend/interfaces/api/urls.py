"""
API URL patterns for the backend application.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from backend.interfaces.api.views.customer_viewset import CustomerViewSet
from backend.interfaces.api.views.debt_viewset import DebtViewSet
from backend.interfaces.api.views.gallery_viewset import GalleryViewSet
from backend.interfaces.api.views.contact_viewset import ContactViewSet
from backend.interfaces.api.views.auth_view import login_view

# API router for automatic URL generation
router = DefaultRouter()

# Register ViewSets
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'debts', DebtViewSet, basename='debt')
router.register(r'gallery', GalleryViewSet, basename='gallery')
router.register(r'contact', ContactViewSet, basename='contact')

# API URL patterns
urlpatterns = [
    path('auth/login/', login_view, name='api-login'),
    path('', include(router.urls)),
]
