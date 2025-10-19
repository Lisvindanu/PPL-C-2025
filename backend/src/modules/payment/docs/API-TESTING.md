# Payment Gateway API - Testing Guide

**Module:** Payment Gateway (Mock)
**Backend URL:** `http://localhost:5001`
**Status:** ✅ Ready to Test

---

## 📋 Prerequisites

1. ✅ Backend server running (`npm start` di folder `backend/`)
2. ✅ Database MySQL running
3. ✅ Migrations sudah dijalankan (`npx sequelize-cli db:migrate`)
4. ✅ Test data sudah ada (users, kategori, layanan, pesanan)

---

## 🔌 Available Endpoints

### 1. Payment Endpoints
- `POST /api/payments/create` - Create payment
- `POST /api/payments/webhook` - Webhook callback
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments/order/:orderId` - Get payment by order

### 2. Escrow Endpoints
- `POST /api/payments/escrow/release` - Release escrow
- `GET /api/payments/escrow/:id` - Get escrow details

### 3. Withdrawal Endpoints
- `POST /api/payments/withdraw` - Create withdrawal
- `GET /api/payments/withdrawals/:id` - Get withdrawal details

### 4. Mock/Testing Endpoints (Development Only)
- `POST /api/payments/mock/trigger-success` - Trigger payment success
- `POST /api/payments/mock/trigger-failure` - Trigger payment failure

---

## 🧪 Testing Flow

### Step 1: Create Payment

```bash
curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "pesanan_id": "your-order-uuid",
    "user_id": "your-user-uuid",
    "jumlah": 250000,
    "metode_pembayaran": "qris",
    "channel": "QRIS"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment_id": "uuid",
    "transaction_id": "PAY-1234567890-ABC123",
    "payment_url": "http://localhost:5001/mock-payment/MOCK-xxx",
    "total_bayar": 265000,
    "status": "menunggu",
    "expires_at": "2025-10-21T10:00:00Z",
    "payment_instructions": {
      "type": "QRIS",
      "title": "Scan QR Code untuk Pembayaran",
      "steps": [
        "Buka aplikasi e-wallet atau m-banking",
        "Pilih menu QRIS/Scan QR",
        "Scan QR code di bawah",
        "Konfirmasi pembayaran Rp 265.000"
      ]
    }
  }
}
```

**Save `transaction_id` dari response!**

---

### Step 2: Trigger Payment Success (Mock)

```bash
curl -X POST http://localhost:5001/api/payments/mock/trigger-success \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "PAY-1234567890-ABC123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment success triggered",
  "data": {
    "transaction_id": "PAY-1234567890-ABC123",
    "status": "berhasil",
    "escrow_created": true,
    "escrow_id": "uuid"
  }
}
```

**Save `escrow_id` dari response!**

---

### Step 3: Check Payment Details

```bash
curl http://localhost:5001/api/payments/{payment_id}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "transaction_id": "PAY-1234567890-ABC123",
    "pesanan_id": "order-uuid",
    "user_id": "user-uuid",
    "jumlah": 250000,
    "biaya_platform": 12500,
    "biaya_payment_gateway": 2500,
    "total_bayar": 265000,
    "metode_pembayaran": "qris",
    "status": "berhasil",
    "dibayar_pada": "2025-10-20T10:00:00Z",
    "created_at": "2025-10-20T09:55:00Z"
  }
}
```

---

### Step 4: Check Escrow Details

```bash
curl http://localhost:5001/api/payments/escrow/{escrow_id}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "pembayaran_id": "payment-uuid",
    "pesanan_id": "order-uuid",
    "jumlah_ditahan": 250000,
    "biaya_platform": 12500,
    "jumlah_bersih": 237500,
    "status": "held",
    "ditahan_pada": "2025-10-20T10:00:00Z",
    "akan_dirilis_pada": "2025-10-27T10:00:00Z"
  }
}
```

---

### Step 5: Release Escrow (Client Approve)

```bash
curl -X POST http://localhost:5001/api/payments/escrow/release \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "your-escrow-uuid",
    "user_id": "client-uuid",
    "reason": "Work completed and approved"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Escrow released successfully",
  "data": {
    "escrow_id": "uuid",
    "status": "released",
    "jumlah_ditahan": 250000,
    "biaya_platform": 12500,
    "jumlah_bersih": 237500,
    "dirilis_pada": "2025-10-20T11:00:00Z"
  }
}
```

---

### Step 6: Withdrawal (Freelancer)

```bash
curl -X POST http://localhost:5001/api/payments/withdraw \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "your-escrow-uuid",
    "freelancer_id": "freelancer-uuid",
    "metode_pencairan": "transfer_bank",
    "nomor_rekening": "1234567890",
    "nama_pemilik": "John Doe",
    "nama_bank": "BCA"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Withdrawal request created successfully",
  "data": {
    "withdrawal_id": "uuid",
    "status": "completed",
    "jumlah": 250000,
    "biaya_platform": 12500,
    "jumlah_bersih": 237500,
    "metode_pencairan": "transfer_bank",
    "bukti_transfer": "https://mock-bank.com/transfer/xxx.pdf",
    "dicairkan_pada": "2025-10-20T11:05:00Z"
  }
}
```

---

## 💰 Fee Calculation Example

**Order Amount:** Rp 250,000

### Client Payment:
```
Harga Order:              Rp 250,000
Platform Fee (5%):        Rp  12,500
Gateway Fee (1%):         Rp   2,500
─────────────────────────────────────
TOTAL BAYAR:              Rp 265,000
```

### Escrow Held:
```
Jumlah Ditahan:           Rp 250,000
Platform Fee:             Rp  12,500
─────────────────────────────────────
Net to Freelancer:        Rp 237,500
```

### Freelancer Receives:
```
Gross Amount:             Rp 250,000
Platform Fee (5%):        Rp  12,500
─────────────────────────────────────
NET RECEIVED:             Rp 237,500
```

---

## 🔄 Status Flow

### Payment Status:
```
menunggu → berhasil (after webhook)
menunggu → gagal (if payment fails)
menunggu → kadaluarsa (after 24 hours)
```

### Escrow Status:
```
held → released (after client approve OR 7 days)
released → completed (after withdrawal)
held → disputed (if dispute opened)
held → refunded (if order cancelled)
```

---

## 🎯 Supported Payment Methods

### QRIS
- **Code:** `qris`
- **Channel:** `QRIS`
- **Fee:** 0.7%
- **Min:** Rp 1,000
- **Max:** Rp 10,000,000

### Virtual Account
- **Code:** `virtual_account`
- **Channels:** `BCA`, `BNI`, `MANDIRI`, `BRI`, `PERMATA`
- **Fee:** Rp 4,000 (fixed)
- **Min:** Rp 10,000
- **Max:** Rp 50,000,000

### E-Wallet
- **Code:** `e_wallet`
- **Channels:** `GOPAY`, `OVO`, `DANA`, `SHOPEEPAY`
- **Fee:** 2%
- **Min:** Rp 10,000
- **Max:** Rp 10,000,000

### Transfer Bank
- **Code:** `transfer_bank`
- **Channel:** `MANUAL`
- **Fee:** Rp 0
- **Min:** Rp 10,000
- **Max:** Rp 100,000,000

### Kartu Kredit
- **Code:** `kartu_kredit`
- **Channel:** `CREDIT_CARD`
- **Fee:** 2.9%
- **Min:** Rp 10,000
- **Max:** Rp 100,000,000

---

## ⚠️ Error Handling

### Common Errors:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error: jumlah is required"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Payment not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Database connection failed"
}
```

---

## 🧪 Testing with Postman

### Import Collection

1. Buka Postman
2. Import → Raw Text
3. Copy-paste JSON collection (available in `postman/payment-collection.json`)
4. Set environment variables:
   - `BASE_URL`: `http://localhost:5001`
   - `USER_ID`: UUID user kamu
   - `ORDER_ID`: UUID order kamu

---

## 📝 Notes

### Mock Gateway Behavior:
- **Auto Success:** Payment otomatis berhasil setelah 3 detik (jika `MOCK_AUTO_SUCCESS=true`)
- **Auto Withdrawal:** Withdrawal langsung processed (jika `MOCK_AUTO_WITHDRAWAL=true`)
- **Webhook Signature:** Menggunakan `MOCK_PAYMENT_SECRET` untuk signature

### Environment Variables Required:
```env
MOCK_AUTO_SUCCESS=true
MOCK_AUTO_WITHDRAWAL=true
MOCK_PAYMENT_SECRET=mock-secret-key-change-in-production
BACKEND_URL=http://localhost:5001
```

### Production Ready Checklist:
- [ ] Replace mock gateway dengan Midtrans/Xendit real
- [ ] Setup webhook URL di payment gateway dashboard
- [ ] Configure signature verification keys
- [ ] Enable HTTPS only
- [ ] Setup CRON job untuk auto-release escrow
- [ ] Enable rate limiting
- [ ] Setup monitoring & alerts

---

## 🚀 Quick Start

```bash
# 1. Start MySQL
brew services start mysql

# 2. Start backend server
cd backend
npm start

# 3. Test health check
curl http://localhost:5001/health

# 4. Run test payment flow
# (Follow Step 1-6 above)
```

---

**Last Updated:** October 20, 2025
**Tested By:** Backend Team
**Status:** ✅ Ready for Integration Testing
