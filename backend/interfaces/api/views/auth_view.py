"""
Authentication views for JWT token generation.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    POST /api/auth/login/
    JWT token almak için login endpoint'i
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Kullanıcı adı ve şifre gereklidir.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Kullanıcıyı doğrula
    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {'error': 'Geçersiz kullanıcı adı veya şifre.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Sadece admin kullanıcılar giriş yapabilir
    if not user.is_staff:
        return Response(
            {'error': 'Sadece admin kullanıcıları giriş yapabilir.'},
            status=status.HTTP_403_FORBIDDEN
        )

    # JWT token oluştur
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
        }
    }, status=status.HTTP_200_OK)

