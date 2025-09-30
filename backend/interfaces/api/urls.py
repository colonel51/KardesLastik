"""
API URL patterns for the backend application.
This module contains all API endpoint URL patterns.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# API router for automatic URL generation
router = DefaultRouter()

# API URL patterns
urlpatterns = [
    path('api/', include(router.urls)),
]
