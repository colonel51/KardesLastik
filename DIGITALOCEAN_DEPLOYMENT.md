# DigitalOcean Deployment Rehberi

Bu rehber, Kardeş Demir Doğrama ve Lastik projesini DigitalOcean'a deploy etmek için adım adım talimatlar içerir.

## 📋 Ön Hazırlık

### 1. DigitalOcean Hesabı ve Droplet Oluşturma

1. [DigitalOcean](https://www.digitalocean.com/) hesabı oluşturun
2. Yeni bir Droplet oluşturun:
   - **Image:** Ubuntu 22.04 LTS
   - **Plan:** En az 2GB RAM (önerilen: 4GB)
   - **Region:** Avrupa (Amsterdam veya Frankfurt) veya size yakın
   - **Authentication:** SSH keys (önerilir) veya Password
   - **Hostname:** kardeslastik (veya istediğiniz isim)

### 2. Domain Ayarları (Opsiyonel)

1. Domain'inizi DigitalOcean'a ekleyin
2. DNS kayıtlarını yapılandırın:
   - A Record: `@` → Droplet IP adresi
   - A Record: `www` → Droplet IP adresi

## 🚀 Sunucu Kurulumu

### Adım 1: Sunucuya Bağlanma

```bash
ssh root@YOUR_DROPLET_IP
```

### Adım 2: Sistem Güncellemesi

```bash
apt update && apt upgrade -y
```

### Adım 3: Temel Paketlerin Kurulumu

```bash
# Python ve pip
apt install -y python3 python3-pip python3-venv python3-dev

# PostgreSQL (SQLite yerine production için)
apt install -y postgresql postgresql-contrib libpq-dev

# Nginx (Web server)
apt install -y nginx

# Supervisor (Process manager)
apt install -y supervisor

# Git
apt install -y git

# Build tools (bazı Python paketleri için)
apt install -y build-essential

# Node.js ve npm (Frontend için)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Certbot (SSL sertifikası için)
apt install -y certbot python3-certbot-nginx
```

### Adım 4: PostgreSQL Veritabanı Kurulumu

```bash
# PostgreSQL'e geçiş yap
sudo -u postgres psql

# PostgreSQL içinde:
CREATE DATABASE kardeslastik_db;
CREATE USER kardeslastik_user WITH PASSWORD 'GÜÇLÜ_ŞİFRE_BURAYA';
ALTER ROLE kardeslastik_user SET client_encoding TO 'utf8';
ALTER ROLE kardeslastik_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE kardeslastik_user SET timezone TO 'Europe/Istanbul';
GRANT ALL PRIVILEGES ON DATABASE kardeslastik_db TO kardeslastik_user;
\q
```

### Adım 5: Kullanıcı Oluşturma

```bash
# Yeni bir kullanıcı oluştur (root yerine)
adduser kardeslastik
usermod -aG sudo kardeslastik

# Kullanıcıya geçiş yap
su - kardeslastik
```

### Adım 6: Proje Klasörü Oluşturma

```bash
# Ana dizin
mkdir -p /home/kardeslastik/app
cd /home/kardeslastik/app
```

## 📦 Proje Kurulumu

### Adım 1: Git Repository'den Clone

```bash
# Git repository'nizi clone edin
git clone YOUR_GIT_REPOSITORY_URL .

# Veya manuel olarak dosyaları yükleyin
```

### Adım 2: Backend Kurulumu

```bash
# Python virtual environment oluştur
python3 -m venv venv
source venv/bin/activate

# Bağımlılıkları yükle
pip install --upgrade pip
pip install -r requirements.txt

# .env dosyası oluştur
nano .env
```

**.env dosyası içeriği:**
```env
# Django Settings
SECRET_KEY=YOUR_SECRET_KEY_HERE
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,YOUR_DROPLET_IP

# Database
DB_NAME=kardeslastik_db
DB_USER=kardeslastik_user
DB_PASSWORD=GÜÇLÜ_ŞİFRE_BURAYA
DB_HOST=localhost
DB_PORT=5432

# Static & Media
STATIC_ROOT=/home/kardeslastik/app/staticfiles
MEDIA_ROOT=/home/kardeslastik/app/media

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Frontend API URL
VITE_API_BASE_URL=https://yourdomain.com/api
```

### Adım 3: Django Settings Güncelleme

`KardesLastik/settings.py` dosyasını production için güncelleyin:

```python
import os
from pathlib import Path

# .env dosyasından değişkenleri oku
from dotenv import load_dotenv
load_dotenv()

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'kardeslastik_db'),
        'USER': os.getenv('DB_USER', 'kardeslastik_user'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Static files
STATIC_ROOT = os.getenv('STATIC_ROOT', os.path.join(BASE_DIR, 'staticfiles'))
MEDIA_ROOT = os.getenv('MEDIA_ROOT', os.path.join(BASE_DIR, 'media'))

# CORS
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
```

### Adım 4: Django Migration ve Static Files

```bash
# Migration'ları çalıştır
python manage.py migrate

# Superuser oluştur
python manage.py createsuperuser

# Static files'ları topla
python manage.py collectstatic --noinput
```

### Adım 5: Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Production build
npm run build

# Build dosyalarını backend'e kopyala (veya Nginx'te serve et)
# Bu adım deployment stratejinize göre değişir
```

## 🔧 Nginx Yapılandırması

### Nginx Config Dosyası Oluşturma

```bash
sudo nano /etc/nginx/sites-available/kardeslastik
```

**İçerik:**
```nginx
# Backend API (Django)
upstream django {
    server 127.0.0.1:8000;
}

# Frontend (React)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend static files
    location / {
        root /home/kardeslastik/app/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Media files
    location /media/ {
        alias /home/kardeslastik/app/media/;
    }

    # Static files
    location /static/ {
        alias /home/kardeslastik/app/staticfiles/;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Nginx'i Aktif Etme

```bash
# Symlink oluştur
sudo ln -s /etc/nginx/sites-available/kardeslastik /etc/nginx/sites-enabled/

# Test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl restart nginx
```

## 🔄 Supervisor Yapılandırması

### Supervisor Config Dosyası

```bash
sudo nano /etc/supervisor/conf.d/kardeslastik.conf
```

**İçerik:**
```ini
[program:kardeslastik]
command=/home/kardeslastik/app/venv/bin/gunicorn KardesLastik.wsgi:application --bind 127.0.0.1:8000 --workers 3
directory=/home/kardeslastik/app
user=kardeslastik
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/home/kardeslastik/app/logs/gunicorn.log
```

### Supervisor'ı Başlatma

```bash
# Log klasörü oluştur
mkdir -p /home/kardeslastik/app/logs

# Supervisor'ı yeniden yükle
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start kardeslastik

# Durumu kontrol et
sudo supervisorctl status
```

## 🔒 SSL Sertifikası (HTTPS)

```bash
# Certbot ile SSL sertifikası al
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Otomatik yenileme test et
sudo certbot renew --dry-run
```

## 📝 Gunicorn Kurulumu

```bash
# Virtual environment içinde
source /home/kardeslastik/app/venv/bin/activate
pip install gunicorn

# Test et
gunicorn KardesLastik.wsgi:application --bind 127.0.0.1:8000
```

## 🔄 Güncelleme İşlemi

Yeni bir güncelleme geldiğinde:

```bash
cd /home/kardeslastik/app

# Git'ten çek
git pull origin main

# Backend güncellemeleri
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Frontend güncellemeleri
cd frontend
npm install
npm run build

# Supervisor'ı yeniden başlat
sudo supervisorctl restart kardeslastik

# Nginx'i yeniden yükle (gerekirse)
sudo systemctl reload nginx
```

## 🔐 Güvenlik Ayarları

### Firewall Yapılandırması

```bash
# UFW firewall aktif et
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### Django Secret Key Güvenliği

```bash
# Güçlü bir secret key oluştur
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# .env dosyasına ekle
```

## 📊 Monitoring ve Loglar

### Log Dosyaları

```bash
# Gunicorn logları
tail -f /home/kardeslastik/app/logs/gunicorn.log

# Nginx logları
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Supervisor logları
sudo tail -f /var/log/supervisor/supervisord.log
```

## 🐛 Sorun Giderme

### Django çalışmıyor
```bash
# Supervisor durumunu kontrol et
sudo supervisorctl status kardeslastik

# Logları kontrol et
tail -f /home/kardeslastik/app/logs/gunicorn.log

# Manuel test
cd /home/kardeslastik/app
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

### Nginx hataları
```bash
# Nginx config test
sudo nginx -t

# Nginx logları
sudo tail -f /var/log/nginx/error.log
```

### Veritabanı bağlantı sorunları
```bash
# PostgreSQL bağlantısını test et
sudo -u postgres psql -d kardeslastik_db -U kardeslastik_user
```

## 📋 Önemli Notlar

1. **Secret Key:** Production'da mutlaka güçlü bir secret key kullanın
2. **DEBUG:** Production'da `DEBUG=False` olmalı
3. **ALLOWED_HOSTS:** Domain adreslerinizi ekleyin
4. **Database:** SQLite yerine PostgreSQL kullanın
5. **Static Files:** `collectstatic` komutunu çalıştırın
6. **Media Files:** Media klasörüne yazma izni verin
7. **SSL:** HTTPS için SSL sertifikası kurun
8. **Backup:** Düzenli veritabanı yedekleri alın

## 🔄 Otomatik Deployment (Opsiyonel)

GitHub Actions veya benzeri CI/CD kullanarak otomatik deployment yapabilirsiniz. Detaylar için `DEPLOYMENT_AUTOMATION.md` dosyasına bakabilirsiniz.

