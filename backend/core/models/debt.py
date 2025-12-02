"""
Debt model for the veresiye defteri application.
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from decimal import Decimal


class Debt(models.Model):
    """
    Borç/Alacak modeli - Müşteri borç kayıtları
    """
    
    class DebtType(models.TextChoices):
        DEBT = 'DEBT', _('Borç')
        CREDIT = 'CREDIT', _('Alacak')
    
    class Meta:
        verbose_name = _('Borç/Alacak')
        verbose_name_plural = _('Borçlar/Alacaklar')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['customer', '-created_at']),
            models.Index(fields=['is_paid']),
            models.Index(fields=['debt_type']),
        ]
    
    # İlişkiler
    customer = models.ForeignKey(
        'Customer',
        on_delete=models.CASCADE,
        related_name='debts',
        verbose_name=_('Müşteri')
    )
    
    # Borç Bilgileri
    debt_type = models.CharField(
        _('Tür'),
        max_length=10,
        choices=DebtType.choices,
        default=DebtType.DEBT,
        help_text=_('Borç mu, alacak mı?')
    )
    
    amount = models.DecimalField(
        _('Tutar'),
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text=_('Borç/Alacak tutarı')
    )
    
    description = models.TextField(
        _('Açıklama'),
        blank=True,
        null=True,
        help_text=_('Borç/Alacak açıklaması')
    )
    
    # Ödeme Bilgileri
    is_paid = models.BooleanField(
        _('Ödendi'),
        default=False,
        help_text=_('Borç ödendi mi?')
    )
    
    paid_at = models.DateTimeField(
        _('Ödeme Tarihi'),
        blank=True,
        null=True,
        help_text=_('Borç ödeme tarihi')
    )
    
    paid_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='paid_debts',
        verbose_name=_('Ödeyen')
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
        related_name='created_debts',
        verbose_name=_('Oluşturan')
    )
    
    due_date = models.DateField(
        _('Vade Tarihi'),
        blank=True,
        null=True,
        help_text=_('Borç vade tarihi')
    )
    
    def __str__(self):
        status = _('Ödendi') if self.is_paid else _('Ödenmedi')
        return f"{self.customer.full_name} - {self.amount} TL ({status})"
    
    def mark_as_paid(self, user=None):
        """Borcu ödendi olarak işaretle"""
        from django.utils import timezone
        self.is_paid = True
        self.paid_at = timezone.now()
        if user:
            self.paid_by = user
        self.save()
    
    def mark_as_unpaid(self):
        """Borcu ödenmedi olarak işaretle"""
        self.is_paid = False
        self.paid_at = None
        self.paid_by = None
        self.save()

