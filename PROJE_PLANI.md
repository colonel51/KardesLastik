# KardesLastik Veresiye Defteri - Proje Planı

## 📋 Proje Yapısı

### Backend Sayfaları
1. **Ana Sayfa** (`/`)
   - Hoş geldiniz mesajı
   - Kısa tanıtım
   - Özellikler

2. **Hakkımızda** (`/hakkimizda/`)
   - Şirket bilgileri
   - Misyon/Vizyon

3. **Hizmetlerimiz** (`/hizmetlerimiz/`)
   - Sunulan hizmetler

4. **İletişim** (`/iletisim/`)
   - İletişim bilgileri
   - İletişim formu

5. **Login** (`/login/`)
   - Sadece admin girişi
   - Django admin paneli entegrasyonu

6. **Veresiye Defteri** (`/veresiye/`) - Sonra eklenecek
   - Müşteri listesi
   - Borç/Alacak takibi
   - Ödeme kayıtları

## 🗂️ Dosya Yapısı

```
backend/
├── interfaces/
│   └── web/
│       ├── views.py          # Web view'ları
│       ├── urls.py           # URL routing
│       └── forms.py          # Form'lar (iletişim için)

frontend/
├── base.html                 # Ana layout şablonu
├── index.html                # Ana sayfa
├── about.html                # Hakkımızda
├── services.html             # Hizmetlerimiz
├── contact.html              # İletişim
└── static/
    └── css/
        └── style.css         # Ana CSS dosyası
```

## 🔐 Authentication
- Django admin sistemi kullanılacak
- Login sayfası Django'nun built-in login'i kullanacak
- Sadece admin kullanıcıları giriş yapabilecek

## 🎨 Frontend
- Şimdilik Django templates kullanılacak
- Sonra React entegrasyonu yapılacak
- Modern ve responsive tasarım

