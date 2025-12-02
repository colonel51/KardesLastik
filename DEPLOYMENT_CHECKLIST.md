# DigitalOcean Deployment Checklist

Bu checklist, DigitalOcean'a deploy etmeden önce yapılması gerekenleri içerir.

## ✅ Ön Hazırlık Checklist

- [ ] DigitalOcean hesabı oluşturuldu
- [ ] Droplet oluşturuldu (Ubuntu 22.04 LTS, min 2GB RAM)
- [ ] Domain adresi hazır (opsiyonel)
- [ ] SSH key'ler yapılandırıldı
- [ ] Git repository'ye push yapıldı

## ✅ Sunucu Kurulum Checklist

- [ ] Sunucuya SSH ile bağlanıldı
- [ ] Sistem güncellemesi yapıldı (`apt update && apt upgrade`)
- [ ] Python 3 ve pip kuruldu
- [ ] PostgreSQL kuruldu ve veritabanı oluşturuldu
- [ ] Nginx kuruldu
- [ ] Supervisor kuruldu
- [ ] Node.js ve npm kuruldu
- [ ] Certbot kuruldu (SSL için)
- [ ] Gunicorn kuruldu
- [ ] Firewall yapılandırıldı (UFW)

## ✅ Proje Kurulum Checklist

- [ ] Proje klasörü oluşturuldu (`/home/kardeslastik/app`)
- [ ] Git repository clone edildi
- [ ] Python virtual environment oluşturuldu
- [ ] Backend bağımlılıkları yüklendi (`pip install -r requirements.txt`)
- [ ] `.env` dosyası oluşturuldu ve yapılandırıldı
- [ ] `settings.py` production için güncellendi
- [ ] Django migration'ları çalıştırıldı (`python manage.py migrate`)
- [ ] Superuser oluşturuldu (`python manage.py createsuperuser`)
- [ ] Static files toplandı (`python manage.py collectstatic`)
- [ ] Frontend bağımlılıkları yüklendi (`npm install`)
- [ ] Frontend build yapıldı (`npm run build`)

## ✅ Yapılandırma Checklist

- [ ] Nginx config dosyası oluşturuldu (`/etc/nginx/sites-available/kardeslastik`)
- [ ] Nginx config aktif edildi (symlink)
- [ ] Nginx test edildi (`nginx -t`)
- [ ] Supervisor config dosyası oluşturuldu (`/etc/supervisor/conf.d/kardeslastik.conf`)
- [ ] Supervisor servisi başlatıldı
- [ ] Log klasörleri oluşturuldu
- [ ] Media klasörüne yazma izni verildi

## ✅ Güvenlik Checklist

- [ ] Django `SECRET_KEY` güçlü bir değerle değiştirildi
- [ ] `DEBUG=False` yapıldı
- [ ] `ALLOWED_HOSTS` domain adresleriyle güncellendi
- [ ] `.env` dosyası `.gitignore`'a eklendi
- [ ] Veritabanı şifresi güçlü bir değerle ayarlandı
- [ ] SSL sertifikası kuruldu (Certbot)
- [ ] Firewall aktif edildi ve yapılandırıldı
- [ ] SSH key authentication aktif edildi (password authentication kapatıldı)

## ✅ Test Checklist

- [ ] Frontend sayfası açılıyor (`https://yourdomain.com`)
- [ ] Backend API çalışıyor (`https://yourdomain.com/api/`)
- [ ] Django Admin çalışıyor (`https://yourdomain.com/admin/`)
- [ ] Static files yükleniyor (CSS, JS, images)
- [ ] Media files yükleniyor (upload edilen dosyalar)
- [ ] HTTPS çalışıyor (SSL sertifikası)
- [ ] Login/Logout işlemleri çalışıyor
- [ ] API endpoint'leri test edildi

## ✅ Monitoring Checklist

- [ ] Gunicorn logları kontrol edildi
- [ ] Nginx logları kontrol edildi
- [ ] Supervisor durumu kontrol edildi
- [ ] Disk kullanımı kontrol edildi
- [ ] Memory kullanımı kontrol edildi

## 📝 Önemli Dosyalar ve Konumlar

- **Proje Dizini:** `/home/kardeslastik/app`
- **Virtual Environment:** `/home/kardeslastik/app/venv`
- **Nginx Config:** `/etc/nginx/sites-available/kardeslastik`
- **Supervisor Config:** `/etc/supervisor/conf.d/kardeslastik.conf`
- **Gunicorn Logs:** `/home/kardeslastik/app/logs/gunicorn.log`
- **Nginx Logs:** `/var/log/nginx/`
- **Environment Variables:** `/home/kardeslastik/app/.env`
- **Static Files:** `/home/kardeslastik/app/staticfiles`
- **Media Files:** `/home/kardeslastik/app/media`
- **Frontend Build:** `/home/kardeslastik/app/frontend/dist`

## 🔄 Güncelleme Komutları

```bash
# Proje güncelleme
cd /home/kardeslastik/app
git pull origin main

# Backend güncelleme
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Frontend güncelleme
cd frontend
npm install
npm run build

# Servisleri yeniden başlat
sudo supervisorctl restart kardeslastik
sudo systemctl reload nginx
```

## 🆘 Acil Durum Komutları

```bash
# Servisleri durdur
sudo supervisorctl stop kardeslastik
sudo systemctl stop nginx

# Servisleri başlat
sudo supervisorctl start kardeslastik
sudo systemctl start nginx

# Logları görüntüle
tail -f /home/kardeslastik/app/logs/gunicorn.log
sudo tail -f /var/log/nginx/error.log

# Supervisor durumu
sudo supervisorctl status

# Nginx test
sudo nginx -t
```

