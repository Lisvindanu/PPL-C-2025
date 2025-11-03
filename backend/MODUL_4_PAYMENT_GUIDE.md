# Modul 4: Payment Gateway - API Documentation & Testing Guide

Auto-generated from Swagger/OpenAPI Specification

**Base URL:**
- Development: `http://localhost:5001`
- Production: `https://api-ppl.vinmedia.my.id`

**Swagger Docs:** https://api-ppl.vinmedia.my.id/api-docs/

---

## Module Tags

### Payments
**Modul 4: Payment Gateway - Pembayaran digital**

Handles core payment processing, refunds, retries, analytics, and invoice generation.

### Escrow
**Modul 4: Payment Gateway - Escrow fund management**

Manages escrow funds holding and release to protect transactions.

### Withdrawals
**Modul 4: Payment Gateway - Withdrawal requests**

Handles freelancer withdrawal requests and fund disbursement.

---

## Quick Start Testing (Via Swagger UI)

### Step 1: Login to Get Token
1. Go to **Users → POST /api/users/login**
2. Try it out with:
```json
{
  "email": "admin@skillconnect.com",
  "password": "admin123"
}
```
3. Copy the `token` from response
4. Click **Authorize** button (top right)
5. Enter: `Bearer YOUR_TOKEN_HERE`
6. Click **Authorize**

### Step 2: Get Your User Profile
1. Go to **Users → GET /api/users/profile**
2. Try it out (token auto-attached)
3. Note your `user_id` from response

### Step 3: Create Test Payment
Since you need valid `pesanan_id`, you have two options:

**Option A: Use existing pesanan_id from seed data**
- The database has seeded orders with these statuses:
  - `menunggu_pembayaran` (waiting for payment) - Use this!
  - `dibayar` (already paid)
  - `selesai` (completed)

**Option B: Create a new order first**
- Go to Orders module (Modul 3) when available
- Create a new order
- Use that order ID

### Step 4: Create Payment
1. Go to **Payments → POST /api/payments/create**
2. Try it out with:
```json
{
  "pesanan_id": "USE_REAL_ORDER_UUID_HERE",
  "user_id": "YOUR_USER_ID_FROM_STEP_2",
  "jumlah": 500000,
  "metode_pembayaran": "e_wallet",
  "channel": "gopay"
}
```
3. Save the `payment_id` and `transaction_id` from response

### Step 5: Get Payment Status
1. Go to **Payments → GET /api/payments/{id}**
2. Enter the `payment_id` from Step 4
3. Try it out

---

## Quick Start Testing (Via curl)

### Prerequisites - Get Valid IDs
```bash
# 1. Login first to get token
curl -X POST https://api-ppl.vinmedia.my.id/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@skillconnect.com",
    "password": "admin123"
  }'

# Save the token from response

# 2. Get your user profile
curl https://api-ppl.vinmedia.my.id/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Save your user_id from response
```

### Complete Payment Flow
```bash
# Set your variables
TOKEN="your_token_here"
USER_ID="your_user_id_here"
PESANAN_ID="valid_order_uuid_here"

# 1. Create Payment
curl -X POST https://api-ppl.vinmedia.my.id/api/payments/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"pesanan_id\": \"$PESANAN_ID\",
    \"user_id\": \"$USER_ID\",
    \"jumlah\": 500000,
    \"metode_pembayaran\": \"e_wallet\",
    \"channel\": \"gopay\"
  }"

# Response will include:
# - payment_id
# - transaction_id
# - payment_url (use this to "pay")
# - total_bayar

# 2. Get Payment Status
PAYMENT_ID="payment_id_from_step_1"
curl https://api-ppl.vinmedia.my.id/api/payments/$PAYMENT_ID \
  -H "Authorization: Bearer $TOKEN"

# 3. After payment success, check escrow
# (Escrow ID will be in payment response or query database)
ESCROW_ID="escrow_id_here"
curl https://api-ppl.vinmedia.my.id/api/payments/escrow/$ESCROW_ID \
  -H "Authorization: Bearer $TOKEN"

# 4. Release Escrow (as client after work done)
curl -X POST https://api-ppl.vinmedia.my.id/api/payments/escrow/release \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"escrow_id\": \"$ESCROW_ID\",
    \"jumlah\": 500000,
    \"alasan\": \"Pekerjaan selesai dengan baik\"
  }"

# 5. Withdraw Funds (as freelancer)
curl -X POST https://api-ppl.vinmedia.my.id/api/payments/withdraw \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"escrow_id\": \"$ESCROW_ID\",
    \"jumlah\": 475000,
    \"metode_pencairan\": \"transfer_bank\",
    \"nomor_rekening\": \"1234567890\",
    \"nama_bank\": \"BCA\",
    \"nama_pemilik\": \"John Doe\"
  }"
```

---

## All Endpoints

### 1. POST /api/payments/create
**Tag:** Payments  
**Description:** Create new payment for an order

**Authentication:** Bearer Token Required

**Request Body:**
```json
{
  "pesanan_id": "uuid",
  "user_id": "uuid",
  "jumlah": 500000,
  "metode_pembayaran": "e_wallet",
  "channel": "gopay"
}
```

**Payment Methods:**
- `transfer_bank` - Bank transfer
- `e_wallet` - E-wallet (GoPay, OVO, DANA)
- `kartu_kredit` - Credit/debit card
- `qris` - QRIS
- `virtual_account` - Virtual account (BCA, BNI, Mandiri)

**Response 201:**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment_id": "uuid",
    "transaction_id": "PAY-1762149566653-FM7OVQ",
    "payment_url": "http://localhost:5001/mock-payment/MOCK-xxx",
    "total_bayar": 530000,
    "status": "menunggu",
    "expires_at": "2025-11-04T05:59:26.665Z",
    "payment_instructions": {
      "type": "E-Wallet",
      "title": "gopay Payment",
      "steps": [
        "Buka aplikasi gopay",
        "Cek notifikasi pembayaran",
        "Konfirmasi pembayaran",
        "Jumlah: Rp 530.000"
      ]
    }
  }
}
```

**Common Errors:**
- `400`: Foreign key constraint - Invalid `pesanan_id` or `user_id`
- `401`: Unauthorized - Missing or invalid token

---

### 2. POST /api/payments/webhook
**Tag:** Payments  
**Description:** Payment gateway webhook endpoint

**Note:** This endpoint is called automatically by the payment gateway. Not for manual use.

---

### 3. GET /api/payments/{id}
**Tag:** Payments  
**Description:** Get payment details by payment ID

**Authentication:** Bearer Token Required

**Parameters:**
- `id` (path) - Payment UUID

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "pesanan_id": "uuid",
    "user_id": "uuid",
    "transaction_id": "PAY-xxx",
    "status": "menunggu",
    "jumlah": 500000,
    "total_bayar": 530000,
    "metode_pembayaran": "e_wallet",
    "created_at": "2025-11-03T12:00:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "message": "Payment not found"
}
```

---

### 4. GET /api/payments/order/{orderId}
**Tag:** Payments  
**Description:** Get payment details by order ID

**Authentication:** Bearer Token Required

**Parameters:**
- `orderId` (path) - Order/Pesanan UUID

**Response:** Same as endpoint #3

---

### 5. GET /api/payments/{id}/invoice
**Tag:** Payments  
**Description:** Download invoice PDF

**Authentication:** Bearer Token Required

**Parameters:**
- `id` (path) - Payment UUID

**Response 200:**
- Content-Type: `application/pdf`
- Binary PDF file

**Response 404:**
```json
{
  "success": false,
  "message": "Payment not found"
}
```

---

### 6. POST /api/payments/{id}/send-invoice
**Tag:** Payments  
**Description:** Send invoice via email

**Authentication:** Bearer Token Required

**Parameters:**
- `id` (path) - Payment UUID

**Request Body (Optional):**
```json
{
  "email": "custom@example.com"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Invoice sent successfully to user@example.com"
}
```

---

### 7. GET /api/payments/analytics/summary
**Tag:** Payments  
**Description:** Get payment analytics summary

**Authentication:** Bearer Token Required

**Query Parameters:**
- `start_date` (optional) - Start date (YYYY-MM-DD)
- `end_date` (optional) - End date (YYYY-MM-DD)
- `period` (optional) - Period preset: `7d`, `30d`, `90d`, `365d` (default: `30d`)

**Example:**
```
GET /api/payments/analytics/summary?period=30d
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_transactions": 150,
    "total_revenue": 75000000,
    "total_platform_fee": 3750000,
    "success_rate": 95.5,
    "breakdown_by_method": {
      "e_wallet": 65,
      "virtual_account": 50,
      "qris": 35
    }
  }
}
```

---

### 8. GET /api/payments/analytics/escrow
**Tag:** Payments  
**Description:** Get escrow analytics and statistics

**Authentication:** Bearer Token Required

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_escrow_held": 25000000,
    "total_escrow_released": 50000000,
    "escrow_count": {
      "held": 25,
      "released": 100,
      "disputed": 2
    }
  }
}
```

---

### 9. GET /api/payments/analytics/withdrawals
**Tag:** Payments  
**Description:** Get withdrawal analytics and statistics

**Authentication:** Bearer Token Required

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_withdrawal_amount": 45000000,
    "pending_withdrawals": 5000000,
    "completed_withdrawals": 40000000,
    "withdrawal_count": {
      "pending": 10,
      "processing": 5,
      "completed": 80
    }
  }
}
```

---

### 10. POST /api/payments/{id}/refund
**Tag:** Payments  
**Description:** Request refund for a payment

**Authentication:** Bearer Token Required

**Parameters:**
- `id` (path) - Payment UUID

**Request Body:**
```json
{
  "alasan": "Pesanan dibatalkan oleh freelancer",
  "jumlah_refund": 500000
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Refund request created",
  "data": {
    "refund_id": "uuid",
    "status": "pending",
    "jumlah_refund": 500000
  }
}
```

---

### 11. PUT /api/payments/refund/{id}/process
**Tag:** Payments  
**Description:** Process refund request (Admin only)

**Authentication:** Bearer Token Required (Admin role)

**Parameters:**
- `id` (path) - Refund UUID

**Request Body:**
```json
{
  "action": "approve",
  "catatan_admin": "Refund disetujui sesuai kebijakan"
}
```

**Actions:** `approve` or `reject`

**Response 200:**
```json
{
  "success": true,
  "message": "Refund approved",
  "data": {
    "refund_id": "uuid",
    "status": "disetujui",
    "processed_at": "2025-11-03T15:00:00.000Z"
  }
}
```

---

### 12. GET /api/payments/refunds
**Tag:** Payments  
**Description:** Get all refund requests (Admin only)

**Authentication:** Bearer Token Required (Admin role)

**Query Parameters:**
- `status` (optional) - Filter: `pending`, `disetujui`, `ditolak`
- `limit` (optional) - Results per page (default: 50)
- `offset` (optional) - Pagination offset (default: 0)

**Example:**
```
GET /api/payments/refunds?status=pending&limit=20
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "refund_id": "uuid",
      "payment_id": "uuid",
      "alasan": "Pesanan dibatalkan",
      "jumlah_refund": 500000,
      "status": "pending",
      "created_at": "2025-11-03T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}
```

---

### 13. POST /api/payments/{id}/retry
**Tag:** Payments  
**Description:** Retry a failed or expired payment

**Authentication:** Bearer Token Required

**Parameters:**
- `id` (path) - Payment UUID (failed payment)

**Request Body (Optional):**
```json
{
  "metode_pembayaran": "virtual_account",
  "channel": "bca"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Payment retry successful",
  "data": {
    "new_payment_id": "uuid",
    "payment_url": "http://...",
    "status": "pending",
    "expired_at": "2025-11-04T12:00:00.000Z"
  }
}
```

---

### 14. POST /api/payments/mock/trigger-success
**Tag:** Payments  
**Description:** Mock trigger payment success (Development only)

**Note:** Only available in development environment. Requires valid transaction_id and signature.

**Request Body:**
```json
{
  "transaction_id": "PAY-1762149566653-FM7OVQ"
}
```

---

### 15. POST /api/payments/mock/trigger-failure
**Tag:** Payments  
**Description:** Mock trigger payment failure (Development only)

**Note:** Only available in development environment.

**Request Body:**
```json
{
  "transaction_id": "PAY-1762149566653-FM7OVQ",
  "reason": "Insufficient balance"
}
```

---

### 16. POST /api/payments/escrow/release
**Tag:** Escrow  
**Description:** Release escrow funds to freelancer

**Authentication:** Bearer Token Required (Client/Order owner only)

**Request Body:**
```json
{
  "escrow_id": "uuid",
  "jumlah": 500000,
  "alasan": "Pekerjaan selesai dengan sempurna"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Escrow released successfully",
  "data": {
    "escrow_id": "uuid",
    "status": "released",
    "jumlah_dirilis": 500000,
    "dirilis_pada": "2025-11-03T16:00:00.000Z"
  }
}
```

**Response 403:**
```json
{
  "success": false,
  "message": "You are not authorized to release this escrow"
}
```

---

### 17. GET /api/payments/escrow/{id}
**Tag:** Escrow  
**Description:** Get escrow details by escrow ID

**Authentication:** Bearer Token Required

**Parameters:**
- `id` (path) - Escrow UUID

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "pembayaran_id": "uuid",
    "pesanan_id": "uuid",
    "jumlah_ditahan": 500000,
    "biaya_platform": 25000,
    "status": "held",
    "ditahan_pada": "2025-11-01T10:00:00.000Z",
    "akan_dirilis_pada": "2025-11-08T10:00:00.000Z"
  }
}
```

---

### 18. POST /api/payments/withdraw
**Tag:** Withdrawals  
**Description:** Create withdrawal request (Freelancer only)

**Authentication:** Bearer Token Required (Freelancer role)

**Request Body:**
```json
{
  "escrow_id": "uuid",
  "jumlah": 475000,
  "metode_pencairan": "transfer_bank",
  "nomor_rekening": "1234567890",
  "nama_bank": "BCA",
  "nama_pemilik": "John Doe"
}
```

**Withdrawal Methods:**
- `transfer_bank` - Bank transfer
- `e_wallet` - E-wallet

**Response 201:**
```json
{
  "success": true,
  "message": "Withdrawal request created",
  "data": {
    "id": "uuid",
    "jumlah": 475000,
    "jumlah_bersih": 475000,
    "status": "pending",
    "diajukan_pada": "2025-11-03T17:00:00.000Z"
  }
}
```

---

### 19. GET /api/payments/withdrawals/{id}
**Tag:** Withdrawals  
**Description:** Get withdrawal details by withdrawal ID

**Authentication:** Bearer Token Required

**Parameters:**
- `id` (path) - Withdrawal UUID

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "escrow_id": "uuid",
    "freelancer_id": "uuid",
    "jumlah": 475000,
    "jumlah_bersih": 475000,
    "metode_pencairan": "transfer_bank",
    "nomor_rekening": "1234567890",
    "nama_bank": "BCA",
    "status": "completed",
    "diajukan_pada": "2025-11-03T17:00:00.000Z",
    "selesai_pada": "2025-11-03T18:00:00.000Z"
  }
}
```

---

## Common Errors

### 400 - Bad Request
**Foreign Key Constraint:**
```json
{
  "success": false,
  "message": "Cannot add or update a child row: a foreign key constraint fails..."
}
```
**Cause:** Invalid `pesanan_id` or `user_id`  
**Solution:** Use valid IDs from your user profile and existing orders

**Validation Error:**
```json
{
  "success": false,
  "message": "Jumlah pembayaran tidak valid"
}
```
**Cause:** Missing required fields or invalid data format

---

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```
**Cause:** Missing or invalid authentication token  
**Solution:** 
1. Login via `/api/users/login`
2. Copy token from response
3. Click **Authorize** in Swagger UI
4. Enter: `Bearer YOUR_TOKEN`

---

### 403 - Forbidden
```json
{
  "success": false,
  "message": "You are not authorized to release this escrow"
}
```
**Cause:** User doesn't have permission for this action  
**Solution:** Ensure you're using correct role (client for escrow release, freelancer for withdrawal)

---

### 404 - Not Found
```json
{
  "success": false,
  "message": "Payment not found"
}
```
**Cause:** Invalid payment/escrow/withdrawal ID  
**Solution:** Use valid UUID from previous API responses

---

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "An error occurred while processing payment"
}
```
**Cause:** Server error, database connection issue, or external service failure  
**Solution:** Check server logs or contact administrator

---

## Database Schema Quick Reference

### Table: pembayaran (Payments)
```sql
id (UUID, PK)
pesanan_id (UUID, FK → pesanan.id)
user_id (UUID, FK → users.id)
transaction_id (VARCHAR, UNIQUE)
jumlah (DECIMAL)
total_bayar (DECIMAL)
metode_pembayaran (ENUM)
status (ENUM: pending, processing, berhasil, gagal, kadaluarsa, refunded)
```

### Table: escrow
```sql
id (UUID, PK)
pembayaran_id (UUID, FK → pembayaran.id)
pesanan_id (UUID, FK → pesanan.id)
jumlah_ditahan (DECIMAL)
status (ENUM: held, released, refunded, disputed, partial_released, completed)
```

### Table: pencairan_dana (Withdrawals)
```sql
id (UUID, PK)
escrow_id (UUID, FK → escrow.id)
freelancer_id (UUID, FK → users.id)
jumlah (DECIMAL)
jumlah_bersih (DECIMAL)
status (ENUM: pending, processing, completed, failed, cancelled)
```

---

## Payment Flow Diagram

```
1. CREATE PAYMENT
   Client → POST /api/payments/create
   ↓
   Payment record created (status: menunggu)
   ↓
   Return payment_url to client

2. CLIENT PAYS
   Client → Opens payment_url
   ↓
   Payment gateway processes payment
   ↓
   Gateway → POST /api/payments/webhook
   ↓
   Payment status updated (status: berhasil)
   ↓
   Escrow created (status: held)

3. CLIENT APPROVES WORK
   Client → POST /api/payments/escrow/release
   ↓
   Escrow status updated (status: released)
   ↓
   Freelancer balance updated

4. FREELANCER WITHDRAWS
   Freelancer → POST /api/payments/withdraw
   ↓
   Withdrawal record created (status: pending)
   ↓
   Admin/System processes withdrawal
   ↓
   Funds transferred to freelancer bank
   ↓
   Withdrawal status updated (status: completed)
```

---

## Environment Variables

```env
# Payment Gateway - Midtrans
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false

# Mock Payment (Development)
MOCK_PAYMENT_SECRET=mock-secret-key
MOCK_AUTO_SUCCESS=true
```

---

## Support & Documentation

- **Swagger UI:** https://api-ppl.vinmedia.my.id/api-docs/
- **Production API:** https://api-ppl.vinmedia.my.id
- **GitHub Repository:** https://github.com/Lisvindanu/PPL-C-2025

---

**Last Updated:** 2025-11-03  
**API Version:** v1  
**Module:** Modul 4 - Payment Gateway
