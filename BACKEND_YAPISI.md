# Backend Yapısı - Veresiye Defteri

## ✅ Oluşturulan Yapı

### 1. Core Models ✅

#### Customer Model (`backend/core/models/customer.py`)
- **Alanlar:**
  - `first_name`, `last_name`: Ad ve soyad
  - `phone`: Telefon (unique)
  - `email`: E-posta
  - `address`: Adres
  - `is_active`: Aktif durumu
  - `notes`: Notlar
  - `created_at`, `updated_at`: Tarih bilgileri
  - `created_by`: Oluşturan kullanıcı

- **Property'ler:**
  - `full_name`: Tam ad
  - `total_debt`: Toplam borç tutarı
  - `total_paid`: Toplam ödenen tutar

#### Debt Model (`backend/core/models/debt.py`)
- **Alanlar:**
  - `customer`: Müşteri ilişkisi (ForeignKey)
  - `debt_type`: Borç/Alacak türü (DEBT/CREDIT)
  - `amount`: Tutar
  - `description`: Açıklama
  - `is_paid`: Ödeme durumu
  - `paid_at`: Ödeme tarihi
  - `paid_by`: Ödeyen kullanıcı
  - `due_date`: Vade tarihi
  - `created_at`, `updated_at`: Tarih bilgileri
  - `created_by`: Oluşturan kullanıcı

- **Metodlar:**
  - `mark_as_paid(user)`: Borcu ödendi olarak işaretle
  - `mark_as_unpaid()`: Borcu ödenmedi olarak işaretle

### 2. DTOs (Data Transfer Objects) ✅

#### CustomerDTO (`backend/application/dtos/customer_dto.py`)
- Tüm customer alanları
- `full_name` property
- `to_dict()` metodu

#### DebtDTO (`backend/application/dtos/debt_dto.py`)
- Tüm debt alanları
- `customer_name` alanı (ilişkili müşteri adı)
- `to_dict()` metodu

#### PaymentDTO (`backend/application/dtos/payment_dto.py`)
- Borç ödeme işlemleri için
- `debt_id`, `customer_id`, `amount`, `payment_date`, `notes`

### 3. Repository Abstracts (Interfaces) ✅

#### ICustomerRepository (`backend/application/abstracts/repository_abstract.py`)
- `create(customer_dto)`: Yeni müşteri oluştur
- `get_by_id(customer_id)`: ID'ye göre getir
- `get_by_phone(phone)`: Telefona göre getir
- `get_all(is_active)`: Tüm müşterileri getir
- `update(customer_id, customer_dto)`: Güncelle
- `delete(customer_id)`: Sil (soft delete)
- `search(query)`: Ara

#### IDebtRepository (`backend/application/abstracts/repository_abstract.py`)
- `create(debt_dto)`: Yeni borç oluştur
- `get_by_id(debt_id)`: ID'ye göre getir
- `get_by_customer_id(customer_id, is_paid)`: Müşteri borçları
- `get_all(is_paid, debt_type)`: Tüm borçlar
- `update(debt_id, debt_dto)`: Güncelle
- `delete(debt_id)`: Sil
- `mark_as_paid(debt_id, user_id)`: Ödendi işaretle
- `mark_as_unpaid(debt_id)`: Ödenmedi işaretle
- `get_customer_total_debt(customer_id)`: Toplam borç tutarı

### 4. Repository Implementations ✅

#### CustomerRepository (`backend/infrastructure/repositories/customer_repository.py`)
- ICustomerRepository implementasyonu
- Django ORM kullanıyor
- Model-DTO dönüşümleri

#### DebtRepository (`backend/infrastructure/repositories/debt_repository.py`)
- IDebtRepository implementasyonu
- Django ORM kullanıyor
- Model-DTO dönüşümleri
- Optimize edilmiş queryset'ler (select_related)

### 5. Admin Panel ✅

#### CustomerAdmin (`backend/admin.py`)
- List display: Ad, telefon, e-posta, toplam borç
- Filter: Aktif durumu, oluşturulma tarihi
- Search: Ad, soyad, telefon, e-posta
- Fieldsets: Düzenli form yapısı

#### DebtAdmin (`backend/admin.py`)
- List display: Müşteri, tür, tutar, ödeme durumu
- Filter: Tür, ödeme durumu, tarih
- Search: Müşteri bilgileri, açıklama
- Actions: Toplu ödendi/ödenmedi işaretleme

## 📁 Dosya Yapısı

```
backend/
├── core/
│   └── models/
│       ├── __init__.py
│       ├── customer.py      ✅
│       └── debt.py          ✅
├── application/
│   ├── abstracts/
│   │   ├── __init__.py
│   │   └── repository_abstract.py  ✅
│   └── dtos/
│       ├── __init__.py
│       ├── customer_dto.py   ✅
│       ├── debt_dto.py       ✅
│       └── payment_dto.py    ✅
├── infrastructure/
│   └── repositories/
│       ├── __init__.py
│       ├── customer_repository.py  ✅
│       └── debt_repository.py      ✅
├── admin.py                  ✅
└── models.py                 ✅
```

## 🔄 Clean Architecture Katmanları

1. **Core Layer** (Domain)
   - Models: İş mantığı modelleri

2. **Application Layer**
   - DTOs: Veri transfer objeleri
   - Abstracts: Repository interface'leri
   - Use Cases: (Sonra eklenecek)
   - Services: (Sonra eklenecek)

3. **Infrastructure Layer**
   - Repository Implementations: Django ORM kullanımı

4. **Interface Layer**
   - API: REST endpoints (Sonra eklenecek)
   - Web: Frontend sayfaları (Sonra eklenecek)

## 🎯 Kullanım Örneği

```python
from backend.infrastructure.repositories import CustomerRepository, DebtRepository
from backend.application.dtos import CustomerDTO, DebtDTO

# Repository'leri oluştur
customer_repo = CustomerRepository()
debt_repo = DebtRepository()

# Yeni müşteri oluştur
customer_dto = CustomerDTO(
    first_name="Ahmet",
    last_name="Yılmaz",
    phone="05551234567"
)
customer = customer_repo.create(customer_dto)

# Yeni borç ekle
debt_dto = DebtDTO(
    customer_id=customer.id,
    amount=Decimal("500.00"),
    description="Araba lastiği"
)
debt = debt_repo.create(debt_dto)
```

## 📊 Database

- ✅ Migration'lar oluşturuldu
- ✅ Tablolar oluşturuldu
- ✅ İndeksler eklendi

## 🚀 Sonraki Adımlar

1. Use Cases oluştur (iş mantığı)
2. Services oluştur (servis katmanı)
3. API endpoints ekle (REST)
4. Frontend sayfaları ekle

