# Kardeş Demir Doğrama ve Lastik - React Frontend

React + TypeScript + Vite ile oluşturulmuş frontend uygulaması.

## 🚀 Kurulum

```bash
cd frontend
npm install
```

## 🛠️ Geliştirme

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 📦 Build

Production build için:

```bash
npm run build
```

## 📁 Proje Yapısı

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   └── Layout.tsx   # Ana layout component
│   ├── pages/           # Sayfa componentleri
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── LoginPage.tsx
│   ├── config/          # Yapılandırma dosyaları
│   │   └── api.ts       # API endpoint'leri
│   ├── services/        # API servisleri
│   │   └── api.ts       # Axios instance
│   ├── App.tsx          # Ana component
│   └── main.tsx         # Entry point
├── public/              # Static dosyalar
└── package.json
```

## 🔗 API Entegrasyonu

Backend API'ye bağlanmak için:

- API Base URL: `http://127.0.0.1:8000/api/`
- Proxy ayarı: Vite config'de yapılandırıldı
- Authentication: JWT token (localStorage)

## 📝 Sayfalar

- `/` - Ana Sayfa
- `/hakkimizda` - Hakkımızda
- `/hizmetlerimiz` - Hizmetlerimiz
- `/iletisim` - İletişim
- `/login` - Giriş Sayfası

## 🎨 Stil

- CSS modules kullanılmaktadır
- Responsive tasarım
- Modern ve temiz arayüz
