# 🧪 Panduan Testing API dengan Swagger UI

> **Testing API SkillConnect tanpa perlu clone repo atau setup local server**

Dokumentasi ini menjelaskan cara testing API endpoints langsung dari browser menggunakan Swagger UI yang sudah live di production.

---

## 📋 Table of Contents

- [Akses Swagger UI](#-akses-swagger-ui)
- [Keuntungan Testing dengan Swagger](#-keuntungan-testing-dengan-swagger)
- [Cara Testing Tanpa Authentication](#-cara-testing-tanpa-authentication)
- [Cara Testing dengan Authentication](#-cara-testing-dengan-authentication)
- [Testing Flow per Module](#-testing-flow-per-module)
- [Common Issues & Solutions](#-common-issues--solutions)
- [Tips & Tricks](#-tips--tricks)

---

## 🌐 Akses Swagger UI

**Live Swagger Documentation:**
https://api-ppl.vinmedia.my.id/api-docs/#/

Swagger UI ini adalah **interactive API documentation** yang memungkinkan kamu:
- ✅ Melihat semua available endpoints
- ✅ Testing endpoints langsung dari browser
- ✅ Melihat request/response schema
- ✅ Melihat validation rules
- ✅ Testing dengan real data

**Tidak perlu:**
- ❌ Clone repository
- ❌ Install dependencies
- ❌ Setup database local
- ❌ Install Postman atau tools lain

---

## 🎯 Keuntungan Testing dengan Swagger

### 1. **Interactive Documentation**
- Semua endpoints terdokumentasi lengkap
- Bisa langsung test tanpa tools tambahan
- Schema dan validation rules jelas

### 2. **Real-time Testing**
- Test langsung ke production/staging server
- Response real dari database
- Tidak perlu mock data

### 3. **Easy Collaboration**
- Share URL ke team members
- Frontend bisa test API sebelum integrate
- QA bisa test tanpa setup teknis

### 4. **No Setup Required**
- Buka browser → Test API
- Perfect untuk quick testing
- Ideal untuk demo ke client/stakeholder

---

## 🔓 Cara Testing Tanpa Authentication

Beberapa endpoints bisa di-test tanpa login (public endpoints).

### Step-by-Step:

#### 1. **Buka Swagger UI**
```
https://api-ppl.vinmedia.my.id/api-docs/#/
```

#### 2. **Pilih Module & Endpoint**
Contoh: Test "Health Check"
- Scroll ke **"Health"** section
- Click endpoint `GET /health`

#### 3. **Click "Try it out"**
- Button "Try it out" akan muncul di kanan atas

#### 4. **Execute Request**
- Click button **"Execute"**
- Lihat response di bawah

#### 5. **Analyze Response**
```json
{
  "status": "OK",
  "timestamp": "2025-01-02T10:30:00.000Z",
  "database": {
    "status": "Connected",
    "host": "localhost",
    "database": "skillconnect"
  }
}
```

### Public Endpoints yang Bisa Langsung Dicoba:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/health` | GET | Health check |
| `/api/users/register` | POST | Register user baru |
| `/api/users/login` | POST | Login user |
| `/api/services` | GET | List public services |
| `/api/services/{id}` | GET | Detail service |

---

## 🔐 Cara Testing dengan Authentication

Untuk protected endpoints, kamu perlu JWT token.

### Step-by-Step:

#### 1. **Register atau Login**

**Option A: Register User Baru**
- Buka endpoint `POST /api/users/register`
- Click "Try it out"
- Fill request body:
  ```json
  {
    "nama": "Test User",
    "email": "testuser@example.com",
    "password": "password123",
    "no_telepon": "081234567890",
    "role": "customer"
  }
  ```
- Click "Execute"
- Copy **token** dari response

**Option B: Login dengan User Existing**
- Buka endpoint `POST /api/users/login`
- Click "Try it out"
- Fill request body:
  ```json
  {
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```
- Click "Execute"
- Copy **token** dari response

Response akan seperti ini:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. **Authorize di Swagger**

- Scroll ke **atas halaman**
- Click button **"Authorize"** 🔓 (di kanan atas)
- Masukkan token dengan format:
  ```
  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
  ⚠️ **PENTING:** Harus ada kata "Bearer" + spasi + token!

- Click **"Authorize"**
- Click **"Close"**

#### 3. **Test Protected Endpoints**

Sekarang kamu bisa test semua protected endpoints:
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/services` - Create service (seller only)
- `POST /api/orders` - Create order
- Dan semua protected endpoints lainnya

Token akan **automatically attached** ke setiap request!

---

## 📚 Testing Flow per Module

### Module 1: User Management

**Flow Testing:**
```
1. Register user baru
   POST /api/users/register
   → Copy token

2. Authorize dengan token

3. Get profile
   GET /api/users/profile

4. Update profile
   PUT /api/users/profile

5. Upload avatar
   POST /api/users/avatar

6. Change password
   PUT /api/users/password

7. Request reset password
   POST /api/users/forgot-password

8. Logout
   POST /api/users/logout
```

### Module 2: Service Listing

**Flow Testing:**
```
1. List semua services (public)
   GET /api/services

2. Search services
   GET /api/services?search=fotografi&kategori_id=1

3. Get service detail
   GET /api/services/{id}

4. Login sebagai seller
   POST /api/users/login

5. Create service baru
   POST /api/services

6. Update service
   PUT /api/services/{id}

7. Delete service
   DELETE /api/services/{id}
```

### Module 3: Order & Booking

**Flow Testing:**
```
1. Login sebagai customer
   POST /api/users/login

2. Browse services
   GET /api/services

3. Create order
   POST /api/orders
   (body: { layanan_id, tanggal_pemesanan, ... })

4. Get order detail
   GET /api/orders/{id}

5. Login sebagai seller (di tab baru/incognito)
   POST /api/users/login

6. Accept order (seller)
   PUT /api/orders/{id}/accept

7. Complete order (seller)
   PUT /api/orders/{id}/complete

8. Cancel order (customer)
   PUT /api/orders/{id}/cancel
```

### Module 4: Payment Gateway

**Flow Testing:**
```
1. Create order (dari Module 3)
   POST /api/orders

2. Create payment
   POST /api/payments
   (body: { pesanan_id, metode_pembayaran_id })

3. Simulate payment (mock gateway)
   → Click payment_url dari response
   → Pilih "Success" atau "Failed"

4. Webhook callback (otomatis dari mock gateway)
   POST /api/payments/webhook

5. Verify payment status
   GET /api/payments/{id}

6. Request refund (jika dispute)
   POST /api/payments/{id}/refund

7. Download invoice
   GET /api/payments/{id}/invoice
```

### Module 5: Review & Rating

**Flow Testing:**
```
1. Complete order dulu (dari Module 3)

2. Create review
   POST /api/reviews
   (body: { pesanan_id, rating, komentar })

3. Get service reviews
   GET /api/services/{id}/reviews

4. Login sebagai seller

5. Reply to review
   POST /api/reviews/{id}/reply

6. Update review (customer)
   PUT /api/reviews/{id}

7. Delete review (customer)
   DELETE /api/reviews/{id}
```

### Module 6: Chat & Notification

**Flow Testing:**
```
1. Login sebagai customer

2. Start conversation
   POST /api/chat/conversations
   (body: { seller_id })

3. Send message
   POST /api/chat/messages
   (body: { conversation_id, message })

4. Get conversation list
   GET /api/chat/conversations

5. Get messages
   GET /api/chat/conversations/{id}/messages

6. Mark as read
   PUT /api/chat/messages/{id}/read

7. Get notifications
   GET /api/notifications

8. Mark notification as read
   PUT /api/notifications/{id}/read
```

### Module 7: Admin Dashboard

**Flow Testing:**
```
1. Login sebagai admin
   POST /api/users/login
   (email: admin@skillconnect.com)

2. Get dashboard stats
   GET /api/admin/dashboard

3. Get all users
   GET /api/admin/users

4. Ban user
   PUT /api/admin/users/{id}/ban

5. Get all services (pending approval)
   GET /api/admin/services

6. Approve service
   PUT /api/admin/services/{id}/approve

7. Get all transactions
   GET /api/admin/transactions

8. Handle dispute
   PUT /api/admin/disputes/{id}/resolve
```

### Module 8: Recommendation

**Flow Testing:**
```
1. Get trending services
   GET /api/recommendations/trending

2. Get personalized recommendations
   GET /api/recommendations/personalized
   (requires login)

3. Get similar services
   GET /api/recommendations/similar/{id}

4. Get popular by category
   GET /api/recommendations/category/{kategori_id}

5. Get by location
   GET /api/recommendations/location?lokasi=Jakarta
```

---

## ⚠️ Common Issues & Solutions

### 1. **401 Unauthorized**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Solution:**
- Pastikan sudah login dan copy token
- Click "Authorize" dan paste token dengan format: `Bearer {token}`
- Token harus valid (belum expired)

### 2. **403 Forbidden**
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

**Solution:**
- Endpoint butuh role tertentu (admin/seller/customer)
- Login dengan user yang punya role sesuai
- Contoh: Create service butuh role "seller"

### 3. **400 Bad Request**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [...]
}
```

**Solution:**
- Cek request body schema di Swagger
- Pastikan semua required fields terisi
- Pastikan format data sesuai (email, phone, dll)

### 4. **404 Not Found**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**Solution:**
- Cek ID yang digunakan valid
- Resource mungkin sudah dihapus
- User mungkin tidak punya akses ke resource

### 5. **500 Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

**Solution:**
- Bug di backend (report ke developer)
- Database connection issue
- Cek server logs untuk detail error

### 6. **Token Expired**
```json
{
  "success": false,
  "message": "Token expired"
}
```

**Solution:**
- Login ulang untuk dapatkan token baru
- Token expired setelah 7 hari (default JWT_EXPIRES_IN)

---

## 💡 Tips & Tricks

### 1. **Use Multiple Browser Tabs**
Testing flow yang butuh multiple users (customer & seller):
- Tab 1: Login sebagai customer
- Tab 2: Login sebagai seller
- Test interaction antar users (chat, order, dll)

### 2. **Use Incognito Mode**
Testing dengan different users simultaneously:
- Normal window: User A
- Incognito window: User B
- Masing-masing punya session terpisah

### 3. **Save Test Data**
Simpan test credentials untuk reuse:
```
Customer:
- Email: customer@test.com
- Password: password123
- Token: eyJhbGci...

Seller:
- Email: seller@test.com
- Password: password123
- Token: eyJhbGci...

Admin:
- Email: admin@skillconnect.com
- Password: admin123
- Token: eyJhbGci...
```

### 4. **Copy Response for Next Request**
Banyak flow yang sequential (order → payment → review):
- Copy `id` dari response
- Paste ke request berikutnya
- Contoh: Create order → Copy order_id → Create payment

### 5. **Test Edge Cases**
Jangan cuma test happy path:
- ❌ Invalid email format
- ❌ Weak password
- ❌ Duplicate email
- ❌ Invalid order status
- ❌ Insufficient balance
- ❌ Unauthorized access

### 6. **Check Response Schema**
Swagger menampilkan expected response schema:
- Scroll ke bawah setelah execute
- Section "Responses"
- Match actual response dengan expected schema

### 7. **Use Query Parameters**
Banyak list endpoints support filters:
```
GET /api/services?search=fotografi
GET /api/services?kategori_id=1
GET /api/services?lokasi=Jakarta
GET /api/services?sort=rating_rata_rata&order=desc
GET /api/orders?status=pending
```

### 8. **Test Pagination**
Untuk endpoints dengan pagination:
```
GET /api/services?page=1&limit=10
GET /api/orders?page=2&limit=20
```

### 9. **Download Responses**
Click "Download" button untuk save response as JSON:
- Berguna untuk documentation
- Share dengan team
- Compare responses

### 10. **Use Curl Command**
Swagger generate curl command untuk setiap request:
- Click "Copy as cURL"
- Paste di terminal
- Test dari command line

---

## 🎓 Best Practices

### 1. **Always Test Happy Path First**
Pastikan basic flow jalan:
1. Register → Login → Get Profile
2. Create → Read → Update → Delete
3. Order → Payment → Complete → Review

### 2. **Then Test Error Cases**
Setelah happy path work:
- Invalid inputs
- Unauthorized access
- Edge cases
- Concurrent operations

### 3. **Clean Up Test Data**
Jangan spam database dengan test data:
- Delete test orders after testing
- Use consistent test user emails
- Admin bisa cleanup via admin endpoints

### 4. **Document Issues**
Jika menemukan bug:
- Screenshot response error
- Note steps to reproduce
- Report ke developer via GitHub issues

### 5. **Verify Backend Changes**
Setelah developer push update:
- Test endpoint yang affected
- Verify bug fix work
- Test related endpoints

### 6. **Share Testing Results**
Komunikasi dengan team:
- "Payment flow tested ✅ - working"
- "Order cancel endpoint 🐛 - returning 500"
- Share screenshots/responses

---

## 🔗 Useful Links

- **Swagger UI:** https://api-ppl.vinmedia.my.id/api-docs/#/
- **API Base URL:** https://api-ppl.vinmedia.my.id
- **GitHub Repo:** https://github.com/Lisvindanu/PPL-C-2025
- **Mock Payment Gateway:** https://api-ppl.vinmedia.my.id/mock-payment

---

## 📞 Need Help?

Jika menemukan issue atau butuh bantuan:
1. Cek section **Common Issues** di atas
2. Tanya di grup development team
3. Open GitHub issue di repo
4. Contact backend developer

---

## 🚀 Quick Start Checklist

Untuk mulai testing:

- [ ] Buka https://api-ppl.vinmedia.my.id/api-docs/#/
- [ ] Test health check endpoint
- [ ] Register user baru atau login
- [ ] Copy token dari response
- [ ] Click "Authorize" dan paste token
- [ ] Test protected endpoints
- [ ] Follow testing flow per module
- [ ] Report bugs jika ada

**Happy Testing! 🧪**

---

**Last Updated:** 2025-01-02
**Maintained by:** SkillConnect Backend Team
