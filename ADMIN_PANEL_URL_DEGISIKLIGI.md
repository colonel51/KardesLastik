# ✅ Admin Panel URL Değişikliği

## 🔄 Yapılan Değişiklik

React admin paneli URL'leri `/admin/` yerine `/yonetim/` olarak değiştirildi.

### Neden?
- Vite proxy ayarı `/admin` route'unu Django admin paneline yönlendiriyor
- Bu yüzden React admin paneli için farklı bir URL kullanıyoruz

## 📍 Yeni URL'ler

### React Admin Panel
- **Login:** `http://localhost:3000/yonetim/login`
- **Dashboard:** `http://localhost:3000/yonetim/dashboard`
- **Veresiye Defteri:** `http://localhost:3000/yonetim/debts`

### Django Admin Panel (değişmedi)
- **Admin Panel:** `http://127.0.0.1:8000/admin/`

## ✅ Güncellenen Dosyalar

1. `frontend/src/App.tsx` - Route'lar `/yonetim/` olarak güncellendi
2. `frontend/src/components/AdminLayout.tsx` - Navigation link'leri güncellendi
3. `frontend/src/components/ProtectedRoute.tsx` - Login redirect güncellendi
4. `frontend/src/components/Layout.tsx` - Navbar link güncellendi
5. `frontend/src/pages/admin/AdminLoginPage.tsx` - Redirect güncellendi
6. `frontend/src/services/api.ts` - Error redirect güncellendi

## 🚀 Kullanım

1. Ana sayfadan "Admin Girişi" linkine tıklayın
2. Veya direkt `/yonetim/login` adresine gidin
3. Login yaptıktan sonra `/yonetim/dashboard` adresine yönlendirileceksiniz

