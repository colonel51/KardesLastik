# 🚀 DigitalOcean Deployment - Hızlı Başlangıç

Bu dosya, projeyi DigitalOcean'a deploy etmek için gerekli tüm bilgileri içerir.

## 📚 Dokümantasyon Dosyaları

1. **DIGITALOCEAN_DEPLOYMENT.md** - Detaylı adım adım deployment rehberi
2. **DEPLOYMENT_CHECKLIST.md** - Yapılacaklar listesi ve kontrol listesi
3. **KardesLastik/settings_production.py.example** - Production settings örneği

## ⚡ Hızlı Kurulum (Özet)

### 1. Sunucu Hazırlığı
```bash
# Sunucuya bağlan
ssh root@YOUR_DROPLET_IP

# Sistem güncellemesi
apt update && apt upgrade -y

# Gerekli paketleri kur
apt install -y python3 python3-pip python3-venv python3-dev \
  postgresql postgresql-contrib libpq-dev \
  nginx supervisor git build-essential

# Node.js kur
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Certbot kur (SSL için)
apt install -y certbot python3-certbot-nginx
```

### 2. Veritabanı Kurulumu
```bash
sudo -u postgres psql
CREATE DATABASE kardeslastik_db;
CREATE USER kardeslastik_user WITH PASSWORD 'GÜÇLÜ_ŞİFRE';
ALTER ROLE kardeslastik_user SET client_encoding TO 'utf8';
ALTER ROLE kardeslastik_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE kardeslastik_user SET timezone TO 'Europe/Istanbul';
GRANT ALL PRIVILEGES ON DATABASE kardeslastik_db TO kardeslastik_user;
\q
```

### 3. Proje Kurulumu
```bash
# Kullanıcı oluştur
adduser kardeslastik
usermod -aG sudo kardeslastik
su - kardeslastik

# Proje klasörü
mkdir -p /home/kardeslastik/app
cd /home/kardeslastik/app

# Git'ten clone (veya dosyaları yükle)
git clone YOUR_REPO_URL .

# Virtual environment
python3 -m venv venv
source venv/bin/activate

# Backend bağımlılıkları
pip install --upgrade pip
pip install -r requirements.txt

# .env dosyası oluştur (DIGITALOCEAN_DEPLOYMENT.md'deki örneğe göre)
nano .env

# Migration ve static files
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput

# Frontend
cd frontend
npm install
npm run build
```

### 4. Nginx Yapılandırması
```bash
sudo nano /etc/nginx/sites-available/kardeslastik
# (DIGITALOCEAN_DEPLOYMENT.md'deki config'i kullan)

sudo ln -s /etc/nginx/sites-available/kardeslastik /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Supervisor Yapılandırması
```bash
sudo nano /etc/supervisor/conf.d/kardeslastik.conf
# (DIGITALOCEAN_DEPLOYMENT.md'deki config'i kullan)

mkdir -p /home/kardeslastik/app/logs
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start kardeslastik
```

### 6. SSL Sertifikası
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 📝 Önemli Notlar

1. **SECRET_KEY:** Mutlaka güçlü bir değer kullanın
2. **DEBUG:** Production'da `False` olmalı
3. **ALLOWED_HOSTS:** Domain adreslerinizi ekleyin
4. **Database:** PostgreSQL kullanın (SQLite production için uygun değil)
5. **SSL:** HTTPS için mutlaka SSL sertifikası kurun
6. **Backup:** Düzenli veritabanı yedekleri alın

## 🔄 Güncelleme

```bash
cd /home/kardeslastik/app
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
cd frontend && npm install && npm run build
sudo supervisorctl restart kardeslastik
```

## 🆘 Sorun Giderme

Detaylı sorun giderme için `DIGITALOCEAN_DEPLOYMENT.md` dosyasındaki "Sorun Giderme" bölümüne bakın.

## 📞 Destek

Herhangi bir sorunla karşılaşırsanız:
1. Log dosyalarını kontrol edin
2. `DEPLOYMENT_CHECKLIST.md` dosyasındaki adımları kontrol edin
3. `DIGITALOCEAN_DEPLOYMENT.md` dosyasındaki detaylı rehberi inceleyin

