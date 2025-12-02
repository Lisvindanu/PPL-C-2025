# Status Modul Payment - Tabel Fitur

## Backend vs Frontend

| **BACKEND** | Status | **FRONTEND** | Status |
|-------------|--------|--------------|--------|
| Payment Gateway Integration | ✅ | Payment Success Page | ✅ |
| Webhook Callback Handler | ✅ | Order Detail dengan Invoice Button | ✅ |
| Auto-update Order Status | ✅ | Order List Clickable | ✅ |
| Payment History Endpoint | ✅ | Analytics Dashboard Display | ✅ |
| Client Spending Analytics | ✅ | Role Switching UI | ✅ |
| Freelancer Earnings Analytics | ✅ | JWT Token Auto-save | ✅ |
| Payment Balance Endpoint | ✅ | Payment Balance Display | ✅ |
| JWT Token Regeneration | ✅ | Invoice Download Button | ⚠️ |
| Withdrawal Routes | ✅ | Invoice Email Button | ⚠️ |
| Refund Routes | ✅ | - | - |
| **Invoice PDF Generation** | ❌ | - | - |
| **Invoice Email Send** | ❌ | - | - |

---

## User Story vs Implementation

| **User Story** | **Fitur** | Backend | Frontend | Status |
|----------------|-----------|---------|----------|--------|
| Pembayaran digital secara aman | Payment Gateway | ✅ | ✅ | ✅ |
| Verifikasi status otomatis | Auto-update Status | ✅ | ✅ | ✅ |
| Lihat riwayat pembayaran | Payment History | ✅ | ✅ | ✅ |
| Freelancer lihat penghasilan | Earnings Analytics | ✅ | ✅ | ✅ |
| Admin unduh laporan | Download Report | ⚠️ | ⚠️ | ⚠️ |
| Kirim invoice otomatis | Invoice Generation | ❌ | ⚠️ | ❌ |

---

## Feature Completion

| **Kategori** | **Total** | **Selesai** | **Broken** | **Persentase** |
|--------------|-----------|-------------|------------|----------------|
| Backend Core | 10 | 8 | 2 | 80% |
| Frontend Core | 8 | 6 | 2 | 75% |
| User Stories | 6 | 4 | 2 | 67% |
| **TOTAL** | **24** | **18** | **6** | **75%** |

---

## Yang Sudah vs Yang Belum

<table>
<tr>
<td width="50%" valign="top">

### ✅ SUDAH SELESAI

**Backend:**
- Payment gateway integration
- Webhook callback
- Auto-update order status
- Payment history API
- Analytics (client & freelancer)
- Balance checking
- JWT token refresh
- Withdrawal routes
- Refund routes
- Route standardization

**Frontend:**
- Payment success page
- Order detail page
- Invoice buttons (UI ready)
- Clickable order cards
- Analytics display
- Role switching
- Token management
- Order navigation

</td>
<td width="50%" valign="top">

### ❌ BELUM SELESAI

**Backend:**
- Invoice PDF generation ❌
- Invoice email send ❌
- Admin report download ⚠️

**Frontend:**
- Invoice download (blocked by BE) ⚠️
- Invoice email (blocked by BE) ⚠️
- Admin report UI ⚠️

**Testing:**
- End-to-end payment flow ⚠️
- Invoice functionality ❌
- Admin features ⚠️

**Code Quality:**
- Cleanup backup files ⚠️
- Refactor PaymentController ⚠️
- Add unit tests ⚠️

</td>
</tr>
</table>

---

## Priority Matrix

| Priority | Backend | Frontend | Blocker |
|----------|---------|----------|---------|
| **HIGH** | Fix Invoice PDF | Test Invoice Buttons | YES |
| **MEDIUM** | Admin Report API | Admin Report UI | NO |
| **LOW** | Refactor Controller | Add Loading States | NO |

---

## Timeline Estimate

| Task | Complexity | Estimated Time | Blocker |
|------|------------|----------------|---------|
| Debug Invoice PDFKit | High | 2-4 hours | YES |
| Alternative PDF Library | Medium | 1-2 hours | YES |
| Admin Report Download | Medium | 1-2 hours | NO |
| End-to-end Testing | Low | 30 mins | NO |
| Code Cleanup | Low | 30 mins | NO |

---

# 📋 DAFTAR ENDPOINT BACKEND

## 1. Payment Core Endpoints

| Method | Endpoint | Auth | Status | Deskripsi |
|--------|----------|------|--------|-----------|
| POST | `/api/payments/create` | ✅ | ✅ | Buat payment baru untuk order |
| GET | `/api/payments/:id` | ✅ | ✅ | Get payment by ID |
| GET | `/api/payments/order/:orderId` | ✅ | ✅ | Get payment by order ID |
| POST | `/api/payments/webhook` | ❌ | ✅ | Webhook dari payment gateway |
| GET | `/api/payments/check-status/:transactionId` | ❌ | ✅ | Check payment status & redirect URL |
| POST | `/api/payments/:id/retry` | ✅ | ✅ | Retry payment yang gagal |

**Request Example - Create Payment:**
```json
POST /api/payments/create
{
  "pesanan_id": "order-uuid",
  "metode_pembayaran": "bank_transfer",
  "channel": "bca"
}
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "payment-uuid",
    "nomor_invoice": "INV-2025-001",
    "payment_url": "https://app.midtrans.com/snap/v3/...",
    "status": "menunggu",
    "jumlah": 5000000
  }
}
```

---

## 2. Invoice Endpoints ⚠️

| Method | Endpoint | Auth | Status | Deskripsi |
|--------|----------|------|--------|-----------|
| GET | `/api/payments/:id/invoice` | ✅ | ❌ | Download invoice PDF (TIMEOUT) |
| POST | `/api/payments/:id/send-invoice` | ✅ | ❌ | Send invoice via email (TIMEOUT) |
| GET | `/api/payments/invoice/:id` | ✅ | ❌ | Alias - Download invoice (TIMEOUT) |
| POST | `/api/payments/invoice/:id/send-email` | ✅ | ❌ | Alias - Send invoice (TIMEOUT) |

**Known Issue:**
- ❌ PDFKit hanging saat generate PDF
- ❌ Timeout setelah 3 detik
- ❌ Blocker HIGH priority

---

## 3. Escrow Endpoints

| Method | Endpoint | Auth | Status | Deskripsi |
|--------|----------|------|--------|-----------|
| POST | `/api/payments/escrow/release` | ✅ | ✅ | Client release escrow ke freelancer |
| GET | `/api/payments/escrow/:id` | ✅ | ✅ | Get escrow details by ID |

**Request Example - Release Escrow:**
```json
POST /api/payments/escrow/release
{
  "escrow_id": "escrow-uuid",
  "pesanan_id": "order-uuid"
}
```

**Escrow Flow:**
1. Payment berhasil → Escrow created (status: `ditahan`)
2. Order selesai → Client approve atau auto-release 7 hari
3. Escrow released (status: `dirilis`) → Masuk ke freelancer balance
4. Freelancer withdraw → Status jadi `ditarik`

---

## 4. Withdrawal Endpoints

| Method | Endpoint | Auth | Status | Deskripsi |
|--------|----------|------|--------|-----------|
| POST | `/api/payments/withdrawal/create` | ✅ | ✅ | Freelancer request withdrawal |
| GET | `/api/payments/withdrawal/:id` | ✅ | ✅ | Get withdrawal by ID |
| GET | `/api/payments/withdrawal/history` | ✅ | ✅ | Get withdrawal history (dengan filter) |

**Request Example - Create Withdrawal:**
```json
POST /api/payments/withdrawal/create
{
  "jumlah": 3000000,
  "bank": "BCA",
  "nomor_rekening": "1234567890",
  "nama_pemilik": "Rina Developer"
}
```

**Query Params - History:**
```
GET /api/payments/withdrawal/history?status=pending&limit=50&offset=0
```

---

## 5. Refund Endpoints

| Method | Endpoint | Auth | Status | Deskripsi |
|--------|----------|------|--------|-----------|
| POST | `/api/payments/:id/refund` | ✅ | ✅ | Request refund untuk payment |
| POST | `/api/payments/refund/request` | ✅ | ✅ | Request refund (alias - payment_id di body) |
| PUT | `/api/payments/refund/:id/process` | ✅ | ✅ | Admin approve/reject refund |
| GET | `/api/payments/refund/all` | ✅ | ✅ | Admin get all refund requests |

**Request Example - Request Refund:**
```json
POST /api/payments/:id/refund
{
  "alasan": "Freelancer tidak menyelesaikan pekerjaan",
  "jumlah_refund": 5000000  // optional
}
```

**Request Example - Process Refund (Admin):**
```json
PUT /api/payments/refund/:id/process
{
  "action": "approve",  // or "reject"
  "catatan_admin": "Refund disetujui sesuai kebijakan"
}
```

---

## 6. Analytics Endpoints

| Method | Endpoint | Auth | Status | Role | Deskripsi |
|--------|----------|------|--------|------|-----------|
| GET | `/api/payments/analytics/summary` | ✅ | ✅ | All | Analytics summary dengan period |
| GET | `/api/payments/analytics/freelancer-earnings` | ✅ | ✅ | Freelancer | Freelancer earnings data |
| GET | `/api/payments/analytics/client-spending` | ✅ | ✅ | Client | Client spending data |
| GET | `/api/payments/analytics/escrow` | ✅ | ✅ | All | Escrow statistics |
| GET | `/api/payments/analytics/withdrawals` | ✅ | ✅ | Freelancer | Withdrawal statistics |
| GET | `/api/payments/balance` | ✅ | ✅ | Freelancer | Get freelancer balance |

**Query Params:**
```
GET /api/payments/analytics/freelancer-earnings?start_date=2025-01-01&end_date=2025-12-31
GET /api/payments/analytics/summary?period=30d
```

**Response Example - Freelancer Earnings:**
```json
{
  "success": true,
  "data": {
    "total_earnings": 15000000,
    "completed_orders": 12,
    "avg_order_value": 1250000,
    "pending_escrow": 3000000,
    "withdrawn_amount": 10000000,
    "available_balance": 2000000,
    "total_refunded": 500000
  }
}
```

**Response Example - Balance:**
```json
{
  "success": true,
  "data": {
    "available_balance": 2000000,
    "pending_escrow": 3000000,
    "total_withdrawn": 10000000,
    "total_earnings": 15000000
  }
}
```

---

## 7. Development/Mock Endpoints (DEV Only)

| Method | Endpoint | Auth | Status | Deskripsi |
|--------|----------|------|--------|-----------|
| POST | `/api/payments/mock/trigger-success` | ❌ | ✅ | Manually trigger payment success |
| POST | `/api/payments/mock/trigger-failure` | ❌ | ✅ | Manually trigger payment failure |

**Note:** Hanya tersedia di `NODE_ENV=development`

---

## 📊 Endpoint Status Summary

| Kategori | Total Endpoints | Berfungsi | Broken | Persentase |
|----------|----------------|-----------|--------|------------|
| Payment Core | 6 | 6 | 0 | 100% ✅ |
| Invoice | 4 | 0 | 4 | 0% ❌ |
| Escrow | 2 | 2 | 0 | 100% ✅ |
| Withdrawal | 3 | 3 | 0 | 100% ✅ |
| Refund | 4 | 4 | 0 | 100% ✅ |
| Analytics | 6 | 6 | 0 | 100% ✅ |
| Mock (Dev) | 2 | 2 | 0 | 100% ✅ |
| **TOTAL** | **27** | **23** | **4** | **85%** |

---

## 🔐 Authentication & Authorization

### Auth Middleware
- Semua endpoint (kecuali webhook & mock) memerlukan **JWT token** di header:
```
Authorization: Bearer <token>
```

### Role-Based Access:
| Endpoint | Client | Freelancer | Admin |
|----------|--------|------------|-------|
| Create Payment | ✅ | ❌ | ✅ |
| Release Escrow | ✅ | ❌ | ✅ |
| Request Withdrawal | ❌ | ✅ | ❌ |
| Process Refund | ❌ | ❌ | ✅ |
| Freelancer Earnings | ❌ | ✅ (own) | ✅ (all) |
| Client Spending | ✅ (own) | ❌ | ✅ (all) |
| Get Balance | ❌ | ✅ | ❌ |

---

## 🚨 Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Token tidak valid atau telah expired"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke endpoint ini"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Payment tidak ditemukan"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server"
}
```

---

## 🔄 Payment Flow Diagram

```
1. Client buat order
   ↓
2. POST /api/payments/create
   ↓
3. Redirect ke payment_url (Midtrans/Xendit)
   ↓
4. User bayar
   ↓
5. Payment Gateway → POST /api/payments/webhook
   ↓
6. Status berubah → Auto-update order status
   ↓
7. Escrow created (status: ditahan)
   ↓
8. Order selesai → POST /api/payments/escrow/release
   ↓
9. Escrow released → Masuk freelancer balance
   ↓
10. POST /api/payments/withdrawal/create
   ↓
11. Admin approve → Status: selesai
```

---

## 📌 Known Issues & Blockers

### ❌ HIGH PRIORITY - BLOCKER
1. **Invoice PDF Generation Timeout**
   - Endpoint: `GET /api/payments/:id/invoice`
   - Error: PDFKit hang, timeout after 3s
   - Impact: User tidak bisa download bukti pembayaran
   - Solution: Debug PDFKit atau ganti library (puppeteer/jsPDF)

2. **Invoice Email Send Timeout**
   - Endpoint: `POST /api/payments/:id/send-invoice`
   - Error: Same issue dengan invoice PDF
   - Impact: User tidak bisa terima invoice via email

### ⚠️ MEDIUM PRIORITY
1. **Admin Report Download**
   - Perlu endpoint untuk export CSV/Excel
   - Format belum ditentukan

### ✅ LOW PRIORITY
1. **Code Cleanup** - Backup files belum dihapus
2. **Refactor** - PaymentController terlalu besar (2000+ lines)
3. **Unit Tests** - Belum ada test coverage

---

## 🧪 Testing Guide

### Test Accounts:
```
Client:
- Email: client@test.com
- Password: password123

Freelancer (Rina Developer):
- Email: freelancer2@example.com
- Password: Freelancer@2024!

Admin:
- Email: admin@test.com
- Password: password123
```

### Test Scenarios:
1. ✅ Create payment → Check status → Webhook → Auto-update order
2. ✅ Analytics endpoints dengan date range
3. ✅ Escrow release flow
4. ✅ Withdrawal request & history
5. ✅ Refund request & approval
6. ❌ Invoice download (akan timeout)
7. ❌ Invoice email (akan timeout)

---

**Legend:**
- ✅ = Selesai & berfungsi
- ⚠️ = Ada tapi perlu verifikasi/perbaikan
- ❌ = Broken/belum berfungsi
- 🔒 = Requires authentication
- 👑 = Admin only
