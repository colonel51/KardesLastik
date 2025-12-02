# SEO Ayarları ve Google Optimizasyonu

Bu dokümantasyon, projede yapılan SEO iyileştirmelerini ve Google için yapılması gereken ek ayarları açıklar.

## ✅ Yapılan SEO İyileştirmeleri

### 1. Structured Data (Schema.org JSON-LD)
- ✅ LocalBusiness schema eklendi (Ana sayfa ve İletişim sayfası)
- ✅ İşletme bilgileri, adres, telefon, çalışma saatleri
- ✅ Coğrafi koordinatlar (Google Maps için)
- ✅ Hizmetler listesi

### 2. Meta Tags
- ✅ Title ve description (her sayfa için)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Robots meta tags

### 3. Dosyalar
- ✅ `robots.txt` - Arama motoru yönlendirmeleri
- ✅ `sitemap.xml` - Site haritası
- ✅ `security.txt` - Güvenlik bilgileri

## 🔧 Yapılması Gereken Ayarlar

### 1. Domain ve URL'leri Güncelleme

**Değiştirilmesi gereken dosyalar:**

1. `frontend/index.html`
   - `https://yourdomain.com` → Gerçek domain adresiniz
   - Open Graph image URL'leri
   - Twitter image URL'leri

2. `frontend/src/components/PageTitle.tsx`
   - `baseUrl` değişkenini gerçek domain ile değiştirin

3. `frontend/public/sitemap.xml`
   - Tüm `https://yourdomain.com` URL'lerini gerçek domain ile değiştirin
   - `lastmod` tarihlerini güncelleyin

4. `frontend/public/robots.txt`
   - Sitemap URL'ini gerçek domain ile değiştirin

### 2. Google Search Console

1. [Google Search Console](https://search.google.com/search-console) hesabı oluşturun
2. Sitenizi ekleyin
3. Doğrulama yöntemini seçin:
   - **HTML tag yöntemi:** `index.html` dosyasındaki yorum satırını açın ve verification code'unuzu ekleyin:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```
   - **Alternatif:** HTML dosyası veya DNS yöntemi de kullanılabilir

4. Sitemap'i gönderin:
   - Search Console > Sitemaps > `https://yourdomain.com/sitemap.xml`

### 3. Google Analytics (Opsiyonel)

1. [Google Analytics](https://analytics.google.com/) hesabı oluşturun
2. Measurement ID'yi alın
3. `.env` dosyası oluşturun:
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. `frontend/src/App.tsx` dosyasına GoogleAnalytics component'ini ekleyin:
   ```tsx
   import GoogleAnalytics from './components/GoogleAnalytics';
   
   function App() {
     return (
       <>
         <GoogleAnalytics />
         {/* ... diğer kodlar */}
       </>
     );
   }
   ```

### 4. Görseller ve Logo

1. **Favicon:** `frontend/public/` klasörüne favicon.ico ekleyin
2. **Open Graph Image:** 1200x630px boyutunda bir görsel oluşturun
3. **Twitter Image:** 1200x675px boyutunda bir görsel oluşturun
4. Görselleri `frontend/public/` klasörüne ekleyin
5. `index.html` dosyasındaki görsel URL'lerini güncelleyin

### 5. Google My Business

1. [Google My Business](https://www.google.com/business/) hesabı oluşturun
2. İşletme bilgilerinizi ekleyin:
   - İsim: Kardeş Demir Doğrama ve Lastik
   - Adres: Sağlık Mahallesi, Unnamed Road, 51600 Altunhisar/Niğde
   - Telefon: +90 541 463 6726
   - Kategori: Otomotiv, Demir Doğrama
3. İşletmenizi doğrulayın
4. Fotoğraflar ekleyin

### 6. Local SEO İyileştirmeleri

1. **NAP (Name, Address, Phone) Tutarlılığı:**
   - Tüm platformlarda aynı bilgileri kullanın
   - Google My Business, Facebook, Yelp, vb.

2. **Yerel Dizinler:**
   - Yerel işletme dizinlerine kayıt olun
   - Müşteri yorumları toplayın

3. **İçerik:**
   - "Altunhisar lastik", "Niğde demir doğrama" gibi yerel anahtar kelimeler kullanın
   - Blog yazıları ekleyebilirsiniz (ileride)

## 📊 SEO Kontrol Listesi

- [x] Meta tags (title, description)
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured Data (Schema.org)
- [x] Robots.txt
- [x] Sitemap.xml
- [x] Canonical URLs
- [ ] Domain URL'lerini güncelleme
- [ ] Google Search Console doğrulama
- [ ] Sitemap gönderimi
- [ ] Google Analytics kurulumu (opsiyonel)
- [ ] Favicon ekleme
- [ ] Open Graph görselleri
- [ ] Google My Business kaydı
- [ ] Mobil uyumluluk testi
- [ ] Sayfa hızı optimizasyonu
- [ ] SSL sertifikası (HTTPS)

## 🔍 SEO Test Araçları

1. **Google Rich Results Test:**
   https://search.google.com/test/rich-results
   - Structured data'yı test edin

2. **Google Mobile-Friendly Test:**
   https://search.google.com/test/mobile-friendly
   - Mobil uyumluluğu kontrol edin

3. **PageSpeed Insights:**
   https://pagespeed.web.dev/
   - Sayfa hızını test edin

4. **Schema Markup Validator:**
   https://validator.schema.org/
   - Schema.org yapısını doğrulayın

## 📝 Notlar

- Production'a geçmeden önce tüm `yourdomain.com` referanslarını gerçek domain ile değiştirin
- Google Search Console'da sitemap'i gönderdikten sonra birkaç gün bekleyin
- Structured data değişiklikleri Google tarafından indekslenmesi birkaç hafta sürebilir
- Düzenli olarak Google Search Console'u kontrol edin

