"""
Customer model for the veresiye defteri application.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class Customer(models.Model):
    """
    Müşteri modeli - Veresiye defteri için müşteri bilgileri
    """
    
    class Meta:
        verbose_name = _('Müşteri')
        verbose_name_plural = _('Müşteriler')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['phone']),
            models.Index(fields=['-created_at']),
        ]
    
    # Temel Bilgiler
    first_name = models.CharField(
        _('Ad'),
        max_length=100,
        help_text=_('Müşterinin adı')
    )
    
    last_name = models.CharField(
        _('Soyad'),
        max_length=100,
        help_text=_('Müşterinin soyadı')
    )
    
    phone = models.CharField(
        _('Telefon'),
        max_length=20,
        unique=True,
        help_text=_('Müşteri telefon numarası')
    )
    
    email = models.EmailField(
        _('E-posta'),
        blank=True,
        null=True,
        help_text=_('Müşteri e-posta adresi')
    )
    
    address = models.TextField(
        _('Adres'),
        blank=True,
        null=True,
        help_text=_('Müşteri adresi')
    )
    
    # Durum Bilgileri
    is_active = models.BooleanField(
        _('Aktif'),
        default=True,
        help_text=_('Müşteri aktif mi?')
    )
    
    notes = models.TextField(
        _('Notlar'),
        blank=True,
        null=True,
        help_text=_('Müşteri hakkında ek notlar')
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
        related_name='created_customers',
        verbose_name=_('Oluşturan')
    )
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.phone})"
    
    @property
    def full_name(self):
        """Tam ad"""
        return f"{self.first_name} {self.last_name}"
    
    @property
    def total_debt(self):
        """Toplam borç tutarı"""
        from django.db.models import Sum
        result = self.debts.filter(
            is_paid=False,
            debt_type='DEBT'
        ).aggregate(
            total=Sum('amount')
        )
        return result['total'] or 0
    
    @property
    def total_paid(self):
        """Toplam ödenen tutar"""
        from django.db.models import Sum
        result = self.debts.filter(
            is_paid=True
        ).aggregate(
            total=Sum('amount')
        )
        return result['total'] or 0

