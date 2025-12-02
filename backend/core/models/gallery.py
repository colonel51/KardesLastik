"""
Gallery model for image gallery.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class GalleryImage(models.Model):
    """
    Galeri resmi modeli
    """
    
    class Meta:
        verbose_name = _('Galeri Resmi')
        verbose_name_plural = _('Galeri Resimleri')
        ordering = ['order', '-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['is_active']),
        ]
    
    # Resim Bilgileri
    title = models.CharField(
        _('Başlık'),
        max_length=200,
        help_text=_('Resim başlığı')
    )
    
    description = models.TextField(
        _('Açıklama'),
        blank=True,
        null=True,
        help_text=_('Resim açıklaması')
    )
    
    image = models.ImageField(
        _('Resim'),
        upload_to='gallery/',
        help_text=_('Galeri resmi')
    )
    
    # Durum
    is_active = models.BooleanField(
        _('Aktif'),
        default=True,
        help_text=_('Resim aktif mi?')
    )
    
    # Sıralama
    order = models.IntegerField(
        _('Sıra'),
        default=0,
        help_text=_('Gösterim sırası (küçük sayı önce gösterilir)')
    )
    
    # Tarih Bilgileri
    created_at = models.DateTimeField(
        _('Oluşturulma Tarihi'),
        auto_now_add=True
    )
    
    updated_at = models.DateTimeField(
        _('Güncellenme Tarihi'),
        auto_now=True
    )
    
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_gallery_images',
        verbose_name=_('Oluşturan')
    )
    
    def __str__(self):
        return f"{self.title}"
    
    @property
    def image_url(self):
        """Resim URL'i"""
        if self.image:
            return self.image.url
        return None

