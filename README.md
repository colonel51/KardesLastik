## Sanal Makine Çalıştırma

### Hızlı Başlatma (Önerilen)
```powershell
.\start.ps1
```

### Manuel Başlatma

1. **Sanal ortamı aktif et:**
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

2. **Veritabanı migration'larını çalıştır:**
   ```powershell
   python manage.py migrate
   ```

3. **Django sunucusunu başlat:**
   ```powershell
   python manage.py runserver
   ```

4. **Tarayıcıda aç:**
   - Ana sayfa: http://127.0.0.1:8000
   - Admin paneli: http://127.0.0.1:8000/admin/

## Proje Durumu

✅ Sanal ortam aktif  
✅ Django 4.2.15 yüklü  
✅ Veritabanı migration'ları tamamlandı  
✅ Sunucu çalışıyor