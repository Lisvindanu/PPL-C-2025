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

## Quick Start Testing

### Prerequisites
```bash
# 1. Database must have data in tables: users, pesanan
# 2. Server running on port 5001
pm2 list | grep ppl-backend-5001
```

### Get Valid IDs from Database
```bash
# Get valid user_id
mysql -u root -ppassword PPL_2025_C -e "SELECT id, email FROM users LIMIT 3;"

# Get valid pesanan_id
mysql -u root -ppassword PPL_2025_C -e "SELECT id, status FROM pesanan LIMIT 3;"
```

### Complete Payment Flow Test
```bash
# 1. Create Payment
curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "pesanan_id": "a9cb20f8-6f95-40ac-b3e0-ccb2688eff06",
    "user_id": "7cbb04ce-dda3-42ef-a20f-d2337f538140",
    "jumlah": 500000,
    "metode_pembayaran": "e_wallet",
    "channel": "gopay"
  }'

# Response:
# {
#   "success": true,
#   "data": {
#     "payment_id": "uuid",
#     "transaction_id": "PAY-XXX",
#     "payment_url": "http://...",
#     "total_bayar": 530000,
#     "status": "menunggu"
#   }
# }

# 2. Get Payment Status
curl http://localhost:5001/api/payments/{payment_id}

# 3. Check if Escrow Created (after payment success)
curl http://localhost:5001/api/payments/escrow/{escrow_id}

# 4. Release Escrow (as client)
curl -X POST http://localhost:5001/api/payments/escrow/release \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "uuid",
    "jumlah": 500000,
    "alasan": "Pekerjaan selesai"
  }'

# 5. Withdraw Funds (as freelancer)
curl -X POST http://localhost:5001/api/payments/withdraw \
  -H "Authorization: Bearer {freelancer_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "uuid",
    "jumlah": 475000,
    "metode_pencairan": "transfer_bank",
    "nomor_rekening": "1234567890",
    "nama_bank": "BCA",
    "nama_pemilik": "John Doe"
  }'
```

---

## All Endpoints

### 1. POST /api/payments/create
**Tag:** Payments

**Description:** Create new payment for an order

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
    "transaction_id": "PAY-XXX",
    "payment_url": "http://...",
    "total_bayar": 530000,
    "status": "menunggu",
    "expires_at": "2025-11-04T05:59:26.665Z"
  }
}
```

---

### 2. POST /api/payments/webhook
**Tag:** Payments

**Description:** Payment gateway webhook endpoint - receives payment status notifications

**Note:** This endpoint is called by the payment gateway, not by clients directly.

---

### 3. GET /api/payments/{id}
**Tag:** Payments

**Description:** Get payment details by payment ID

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "transaction_id": "PAY-XXX",
    "status": "berhasil",
    "jumlah": 500000,
    "total_bayar": 530000
  }
}
```

---

### 4. GET /api/payments/order/{orderId}
**Tag:** Payments

**Description:** Get payment details by order ID

---

### 5. GET /api/payments/{id}/invoice
**Tag:** Payments

**Description:** Get invoice PDF file

**Response:** Binary PDF file

---

### 6. POST /api/payments/{id}/send-invoice
**Tag:** Payments

**Description:** Send invoice via email

**Request Body (Optional):**
```json
{
  "email": "custom@example.com"
}
```

---

### 7. GET /api/payments/analytics/summary
**Tag:** Payments

**Description:** Get payment analytics summary

**Query Parameters:**
- `start_date` - Start date (YYYY-MM-DD)
- `end_date` - End date (YYYY-MM-DD)
- `period` - Period preset (7d, 30d, 90d, 365d) default: 30d

**Example:**
```bash
curl "http://localhost:5001/api/payments/analytics/summary?period=30d"
```

---

### 8. GET /api/payments/analytics/escrow
**Tag:** Payments

**Description:** Get escrow analytics and statistics

---

### 9. GET /api/payments/analytics/withdrawals
**Tag:** Payments

**Description:** Get withdrawal analytics and statistics

---

### 10. POST /api/payments/{id}/refund
**Tag:** Payments

**Description:** Request refund for a payment

**Request Body:**
```json
{
  "alasan": "Pesanan dibatalkan",
  "jumlah_refund": 500000
}
```

---

### 11. PUT /api/payments/refund/{id}/process
**Tag:** Payments

**Description:** Process refund request (Admin only)

**Request Body:**
```json
{
  "action": "approve",
  "catatan_admin": "Refund approved"
}
```

**Actions:** `approve` or `reject`

---

### 12. GET /api/payments/refunds
**Tag:** Payments

**Description:** Get all refund requests (Admin only)

**Query Parameters:**
- `status` - Filter by status (pending, disetujui, ditolak)
- `limit` - Limit results (default: 50)
- `offset` - Offset for pagination (default: 0)

---

### 13. POST /api/payments/{id}/retry
**Tag:** Payments

**Description:** Retry a failed or expired payment

**Request Body (Optional):**
```json
{
  "metode_pembayaran": "virtual_account",
  "channel": "bca"
}
```

---

### 14. POST /api/payments/mock/trigger-success
**Tag:** Payments

**Description:** Mock trigger payment success (Development only)

**Request Body:**
```json
{
  "transaction_id": "PAY-XXX"
}
```

**Note:** Requires valid signature. Use automatic payment flow instead.

---

### 15. POST /api/payments/mock/trigger-failure
**Tag:** Payments

**Description:** Mock trigger payment failure (Development only)

**Request Body:**
```json
{
  "transaction_id": "PAY-XXX",
  "reason": "Payment declined"
}
```

---

### 16. POST /api/payments/escrow/release
**Tag:** Escrow

**Description:** Release escrow funds to freelancer (Client approval required)

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "escrow_id": "uuid",
  "jumlah": 500000,
  "alasan": "Pekerjaan selesai dengan baik"
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
    "jumlah_dirilis": 500000
  }
}
```

---

### 17. GET /api/payments/escrow/{id}
**Tag:** Escrow

**Description:** Get escrow details by escrow ID

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "pembayaran_id": "uuid",
    "pesanan_id": "uuid",
    "jumlah_ditahan": 500000,
    "status": "held",
    "ditahan_pada": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### 18. POST /api/payments/withdraw
**Tag:** Withdrawals

**Description:** Create withdrawal request (Freelancer only)

**Headers:**
```
Authorization: Bearer {token}
```

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

**Response 201:**
```json
{
  "success": true,
  "message": "Withdrawal request created",
  "data": {
    "id": "uuid",
    "jumlah": 475000,
    "jumlah_bersih": 475000,
    "status": "pending"
  }
}
```

---

### 19. GET /api/payments/withdrawals/{id}
**Tag:** Withdrawals

**Description:** Get withdrawal details by withdrawal ID

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "freelancer_id": "uuid",
    "jumlah": 475000,
    "status": "completed",
    "metode_pencairan": "transfer_bank"
  }
}
```

---

## Common Errors

### Foreign Key Constraint Error
```json
{
  "success": false,
  "message": "Cannot add or update a child row: a foreign key constraint fails..."
}
```

**Solution:** Make sure `pesanan_id` and `user_id` exist in the database.

```bash
# Check valid IDs
mysql -u root -ppassword PPL_2025_C -e "SELECT id FROM users LIMIT 5;"
mysql -u root -ppassword PPL_2025_C -e "SELECT id FROM pesanan LIMIT 5;"
```

### Payment Not Found
```json
{
  "success": false,
  "message": "Payment not found"
}
```

**Solution:** Use valid payment_id from create payment response.

### Invalid Webhook Signature
```json
{
  "success": false,
  "message": "Invalid webhook signature"
}
```

**Solution:** Don't call webhook endpoint directly. Use mock trigger or let payment gateway call it.

---

## Database Schema Quick Reference

### Table: pembayaran (Payments)
- `id` (UUID, PK)
- `pesanan_id` (UUID, FK → pesanan)
- `user_id` (UUID, FK → users)
- `transaction_id` (VARCHAR, UNIQUE)
- `jumlah` (DECIMAL)
- `total_bayar` (DECIMAL)
- `metode_pembayaran` (ENUM)
- `status` (ENUM: pending, processing, berhasil, gagal, kadaluarsa, refunded)

### Table: escrow
- `id` (UUID, PK)
- `pembayaran_id` (UUID, FK → pembayaran)
- `pesanan_id` (UUID, FK → pesanan)
- `jumlah_ditahan` (DECIMAL)
- `status` (ENUM: held, released, refunded, disputed)

### Table: pencairan_dana (Withdrawals)
- `id` (UUID, PK)
- `escrow_id` (UUID, FK → escrow)
- `freelancer_id` (UUID, FK → users)
- `jumlah` (DECIMAL)
- `jumlah_bersih` (DECIMAL)
- `status` (ENUM: pending, processing, completed, failed, cancelled)

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

**Generated:** 2025-01-03  
**API Version:** v1  
**Swagger Docs:** https://api-ppl.vinmedia.my.id/api-docs/
