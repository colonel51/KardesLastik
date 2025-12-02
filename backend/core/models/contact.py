"""
Contact Message model for contact form submissions.
"""
from django.db import models
from django.utils.translation import gettext_lazy as _


class ContactMessage(models.Model):
    """
    İletişim mesajı modeli
    """
    
    class Meta:
        verbose_name = _('İletişim Mesajı')
        verbose_name_plural = _('İletişim Mesajları')
        ordering = ['-created_at', '-is_read']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['is_read']),
        ]
    
    # İletişim Bilgileri
    name = models.CharField(
        _('Ad Soyad'),
        max_length=200,
        help_text=_('Gönderenin adı ve soyadı')
    )
    
    email = models.EmailField(
        _('E-posta'),
        help_text=_('Gönderenin e-posta adresi')
    )
    
    phone = models.CharField(
        _('Telefon'),
        max_length=20,
        blank=True,
        null=True,
        help_text=_('Gönderenin telefon numarası')
    )
    
    message = models.TextField(
        _('Mesaj'),
        help_text=_('Gönderilen mesaj')
    )
    
    # Durum
    is_read = models.BooleanField(
        _('Okundu'),
        default=False,
        help_text=_('Mesaj okundu mu?')
    )
    
    # Tarih Bilgileri
    created_at = models.DateTimeField(
        _('Oluşturulma Tarihi'),
        auto_now_add=True
    )
    
    def __str__(self):
        return f"{self.name} - {self.email} ({self.created_at.strftime('%d.%m.%Y %H:%M')})"
    
    def mark_as_read(self):
        """Mesajı okundu olarak işaretle"""
        self.is_read = True
        self.save(update_fields=['is_read'])

