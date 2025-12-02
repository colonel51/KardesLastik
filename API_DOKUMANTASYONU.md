# API Dokümantasyonu - Veresiye Defteri

## 🔐 Authentication

API endpoint'leri JWT (JSON Web Token) authentication kullanır. Tüm istekler için admin kullanıcısı olmanız gerekir.

### JWT Token Alma

```bash
POST /admin/login/
# Django admin panelinden login olarak token alınabilir
# veya token endpoint'i oluşturulabilir
```

## 📍 Base URL

```
http://127.0.0.1:8000/api/
```

## 📚 Endpoints

### Customer Endpoints

#### 1. Müşteri Listesi
```
GET /api/customers/
```

**Query Parameters:**
- `is_active` (boolean, optional): Aktif müşterileri filtrele
- `search` (string, optional): Arama (isim, telefon, email)

**Response:**
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "first_name": "Ahmet",
      "last_name": "Yılmaz",
      "full_name": "Ahmet Yılmaz",
      "phone": "05551234567",
      "email": "ahmet@example.com",
      "is_active": true,
      "total_debt": "500.00",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 2. Müşteri Detayı
```
GET /api/customers/{id}/
```

**Response:**
```json
{
  "id": 1,
  "first_name": "Ahmet",
  "last_name": "Yılmaz",
  "full_name": "Ahmet Yılmaz",
  "phone": "05551234567",
  "email": "ahmet@example.com",
  "address": "İstanbul",
  "is_active": true,
  "notes": "Vip müşteri",
  "total_debt": "500.00",
  "total_paid": "200.00",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-16T14:20:00Z"
}
```

#### 3. Yeni Müşteri Oluştur
```
POST /api/customers/
```

**Request Body:**
```json
{
  "first_name": "Ahmet",
  "last_name": "Yılmaz",
  "phone": "05551234567",
  "email": "ahmet@example.com",
  "address": "İstanbul",
  "is_active": true,
  "notes": "Vip müşteri"
}
```

**Response:** `201 Created` - Customer object

#### 4. Müşteri Güncelle (Tüm Alanlar)
```
PUT /api/customers/{id}/
```

**Request Body:** (CustomerSerializer - tüm alanlar gerekli)

#### 5. Müşteri Kısmi Güncelle
```
PATCH /api/customers/{id}/
```

**Request Body:**
```json
{
  "email": "yeniemail@example.com",
  "is_active": false
}
```

#### 6. Müşteri Sil (Soft Delete)
```
DELETE /api/customers/{id}/
```

**Response:** `204 No Content`

#### 7. Müşterinin Borçları
```
GET /api/customers/{id}/debts/
```

**Query Parameters:**
- `is_paid` (boolean, optional): Ödenen/ödenmeyen borçları filtrele

**Response:**
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "customer_id": 1,
      "customer_name": "Ahmet Yılmaz",
      "debt_type": "DEBT",
      "debt_type_display": "Borç",
      "amount": "500.00",
      "description": "Araba lastiği",
      "is_paid": false,
      "due_date": "2024-02-01",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Debt Endpoints

#### 1. Borç Listesi
```
GET /api/debts/
```

**Query Parameters:**
- `is_paid` (boolean, optional): Ödenen/ödenmeyen borçları filtrele
- `debt_type` (string, optional): "DEBT" veya "CREDIT"
- `customer_id` (integer, optional): Belirli müşterinin borçları

**Response:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "customer_id": 1,
      "customer_name": "Ahmet Yılmaz",
      "debt_type": "DEBT",
      "debt_type_display": "Borç",
      "amount": "500.00",
      "description": "Araba lastiği",
      "is_paid": false,
      "due_date": "2024-02-01",
      "created_at": "2024-01-15T10:30:00Z",
      "paid_at": null
    }
  ]
}
```

#### 2. Borç Detayı
```
GET /api/debts/{id}/
```

#### 3. Yeni Borç/Alacak Oluştur
```
POST /api/debts/
```

**Request Body:**
```json
{
  "customer_id": 1,
  "debt_type": "DEBT",
  "amount": "500.00",
  "description": "Araba lastiği",
  "is_paid": false,
  "due_date": "2024-02-01"
}
```

**Response:** `201 Created` - Debt object

#### 4. Borç Güncelle
```
PUT /api/debts/{id}/
PATCH /api/debts/{id}/
```

#### 5. Borç Sil
```
DELETE /api/debts/{id}/
```

#### 6. Borcu Ödendi Olarak İşaretle
```
POST /api/debts/{id}/mark_paid/
```

**Response:** Updated Debt object

#### 7. Borcu Ödenmedi Olarak İşaretle
```
POST /api/debts/{id}/mark_unpaid/
```

**Response:** Updated Debt object

---

## 📝 Serializers

### CustomerSerializer

**Create/Update için:**
```python
{
  "first_name": "string (required, max 100)",
  "last_name": "string (required, max 100)",
  "phone": "string (required, min 10 chars)",
  "email": "email (optional)",
  "address": "string (optional)",
  "is_active": "boolean (default: true)",
  "notes": "string (optional)"
}
```

### DebtSerializer

**Create/Update için:**
```python
{
  "customer_id": "integer (required)",
  "debt_type": "string (DEBT|CREDIT, default: DEBT)",
  "amount": "decimal (required, min: 0.01)",
  "description": "string (optional)",
  "is_paid": "boolean (default: false)",
  "due_date": "date (optional, YYYY-MM-DD)"
}
```

---

## 🔒 Permissions

- Tüm endpoint'ler için **IsAdminUser** permission gereklidir
- Sadece admin kullanıcıları API'ye erişebilir
- JWT token ile authentication yapılır

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Müşteri bulunamadı."
}
```

---

## 🌐 CORS Configuration

React frontend için CORS ayarları yapılandırılmıştır:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

---

## 📦 Örnek Kullanım (React)

### Fetch ile API Kullanımı

```javascript
// Token ile istek
const token = localStorage.getItem('access_token');

fetch('http://127.0.0.1:8000/api/customers/', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### Axios ile API Kullanımı

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - Token ekle
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Kullanım
api.get('customers/')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

