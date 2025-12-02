# KardesLastik Projesi - Kurulum ve Çalıştırma Rehberi

## Proje Durumu

✅ **Proje Yapısı:**
- Django 4.2.15 projesi
- Backend uygulaması mevcut (backend/)
- REST Framework entegrasyonu
- JWT Authentication
- Channels (WebSocket desteği)
- Auditlog (Değişiklik kayıtları)

## Sanal Ortamı Çalıştırma

### PowerShell ile:
```powershell
.\.venv\Scripts\Activate.ps1
```

### CMD ile:
```cmd
.venv\Scripts\activate.bat
```

## Kurulum Adımları

1. **Sanal ortamı aktif et**
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

2. **Bağımlılıkları kontrol et**
   ```powershell
   pip install -r requirements.txt
   ```

3. **Veritabanı migration'larını çalıştır**
   ```powershell
   python manage.py migrate
   ```

4. **Superuser oluştur (isteğe bağlı)**
   ```powershell
   python manage.py createsuperuser
   ```

5. **Django sunucusunu başlat**
   ```powershell
   python manage.py runserver
   ```

## Önemli Notlar

- Veritabanı: SQLite (db.sqlite3)
- Port: Varsayılan olarak http://127.0.0.1:8000
- Admin Panel: http://127.0.0.1:8000/admin/

