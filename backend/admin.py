"""
Django admin configuration for backend models.
"""
from django.contrib import admin
from backend.core.models import Customer, Debt, GalleryImage, ContactMessage


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    """
    Customer admin configuration
    """
    list_display = [
        'full_name',
        'phone',
        'email',
        'total_debt',
        'total_paid',
        'is_active',
        'created_at',
    ]
    
    list_filter = [
        'is_active',
        'created_at',
    ]
    
    search_fields = [
        'first_name',
        'last_name',
        'phone',
        'email',
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'total_debt',
        'total_paid',
    ]
    
    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('first_name', 'last_name', 'phone', 'email')
        }),
        ('Adres Bilgileri', {
            'fields': ('address',),
            'classes': ('collapse',)
        }),
        ('Durum', {
            'fields': ('is_active',)
        }),
        ('Notlar', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Borç Bilgileri', {
            'fields': ('total_debt', 'total_paid',),
            'classes': ('collapse',)
        }),
        ('Sistem Bilgileri', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset"""
        qs = super().get_queryset(request)
        return qs.select_related('created_by')


@admin.register(Debt)
class DebtAdmin(admin.ModelAdmin):
    """
    Debt admin configuration
    """
    list_display = [
        'customer',
        'debt_type',
        'amount',
        'is_paid',
        'due_date',
        'created_at',
    ]
    
    list_filter = [
        'debt_type',
        'is_paid',
        'created_at',
        'due_date',
    ]
    
    search_fields = [
        'customer__first_name',
        'customer__last_name',
        'customer__phone',
        'description',
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'paid_at',
    ]
    
    fieldsets = (
        ('Borç Bilgileri', {
            'fields': ('customer', 'debt_type', 'amount', 'description')
        }),
        ('Ödeme Bilgileri', {
            'fields': ('is_paid', 'paid_at', 'paid_by', 'due_date')
        }),
        ('Sistem Bilgileri', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset"""
        qs = super().get_queryset(request)
        return qs.select_related('customer', 'created_by', 'paid_by')
    
    actions = ['mark_as_paid', 'mark_as_unpaid']
    
    def mark_as_paid(self, request, queryset):
        """Seçili borçları ödendi olarak işaretle"""
        count = 0
        for debt in queryset:
            if not debt.is_paid:
                debt.mark_as_paid(request.user)
                count += 1
        self.message_user(request, f'{count} borç ödendi olarak işaretlendi.')
    mark_as_paid.short_description = 'Seçili borçları ödendi olarak işaretle'
    
    def mark_as_unpaid(self, request, queryset):
        """Seçili borçları ödenmedi olarak işaretle"""
        count = 0
        for debt in queryset:
            if debt.is_paid:
                debt.mark_as_unpaid()
                count += 1
        self.message_user(request, f'{count} borç ödenmedi olarak işaretlendi.')
    mark_as_unpaid.short_description = 'Seçili borçları ödenmedi olarak işaretle'


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    """
    Gallery Image admin configuration
    """
    list_display = [
        'title',
        'image_preview',
        'is_active',
        'order',
        'created_at',
    ]
    
    list_filter = [
        'is_active',
        'created_at',
    ]
    
    search_fields = [
        'title',
        'description',
    ]
    
    readonly_fields = [
        'image_preview',
        'created_at',
        'updated_at',
    ]
    
    fieldsets = (
        ('Resim Bilgileri', {
            'fields': ('title', 'description', 'image', 'image_preview')
        }),
        ('Durum', {
            'fields': ('is_active', 'order')
        }),
        ('Sistem Bilgileri', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Resim önizlemesi"""
        if obj.image:
            return f'<img src="{obj.image.url}" style="max-width: 200px; max-height: 200px;" />'
        return "-"
    image_preview.allow_tags = True
    image_preview.short_description = 'Önizleme'


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """
    Contact Message admin configuration
    """
    list_display = [
        'name',
        'email',
        'phone',
        'is_read',
        'created_at',
    ]
    
    list_filter = [
        'is_read',
        'created_at',
    ]
    
    search_fields = [
        'name',
        'email',
        'phone',
        'message',
    ]
    
    readonly_fields = [
        'created_at',
    ]
    
    fieldsets = (
        ('İletişim Bilgileri', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Mesaj', {
            'fields': ('message',)
        }),
        ('Durum', {
            'fields': ('is_read',)
        }),
        ('Sistem Bilgileri', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        """Seçili mesajları okundu olarak işaretle"""
        count = queryset.filter(is_read=False).update(is_read=True)
        self.message_user(request, f'{count} mesaj okundu olarak işaretlendi.')
    mark_as_read.short_description = 'Seçili mesajları okundu olarak işaretle'
    
    def mark_as_unread(self, request, queryset):
        """Seçili mesajları okunmadı olarak işaretle"""
        count = queryset.filter(is_read=True).update(is_read=False)
        self.message_user(request, f'{count} mesaj okunmadı olarak işaretlendi.')
    mark_as_unread.short_description = 'Seçili mesajları okunmadı olarak işaretle'
