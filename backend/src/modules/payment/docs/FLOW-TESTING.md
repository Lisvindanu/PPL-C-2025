# Complete Payment Flow Testing Guide

**Test full payment flow dari create payment sampai withdrawal** 🚀

---

## 📋 Prerequisites

✅ Backend server running (`cd backend && npm start`)
✅ Database MySQL running
✅ Migrations executed (`npx sequelize-cli db:migrate`)
✅ Test data ready (users, orders)

---

## 🔄 Complete Payment Flow

```
1. CLIENT: Create Order
   ↓
2. CLIENT: Create Payment
   ↓
3. CLIENT: Open Payment URL (Mock Gateway)
   ↓
4. CLIENT: Select Payment Method & Pay
   ↓
5. SYSTEM: Webhook Received (Payment Success)
   ↓
6. SYSTEM: Create Escrow (Hold Payment)
   ↓
7. FREELANCER: Deliver Work
   ↓
8. CLIENT: Approve Work
   ↓
9. SYSTEM: Release Escrow
   ↓
10. FREELANCER: Request Withdrawal
   ↓
11. SYSTEM: Process Withdrawal
   ↓
12. FREELANCER: Receive Money ✅
```

---

## 🧪 Step-by-Step Testing

### Step 1: Prepare Test Data

```bash
# Create test users
mysql -u root -p ppl-2025-c <<EOF
INSERT INTO users (id, email, password, role, nama_depan, created_at, updated_at) VALUES
('client-test-001', 'client@test.com', 'hashed_password', 'client', 'Test Client', NOW(), NOW()),
('freelancer-test-001', 'freelancer@test.com', 'hashed_password', 'freelancer', 'Test Freelancer', NOW(), NOW());

INSERT INTO kategori (id, nama, slug, created_at, updated_at) VALUES
('kategori-001', 'Web Development', 'web-dev', NOW(), NOW());

INSERT INTO layanan (id, freelancer_id, kategori_id, judul, slug, deskripsi, harga, waktu_pengerjaan, status, created_at, updated_at) VALUES
('layanan-001', 'freelancer-test-001', 'kategori-001', 'Website Landing Page', 'website-landing', 'Buat landing page responsive', 500000, 7, 'aktif', NOW(), NOW());

INSERT INTO pesanan (id, nomor_pesanan, client_id, freelancer_id, layanan_id, judul, harga, total_bayar, waktu_pengerjaan, status, created_at, updated_at) VALUES
('order-test-001', 'ORD-TEST-001', 'client-test-001', 'freelancer-test-001', 'layanan-001', 'Website Landing Page', 500000, 500000, 7, 'menunggu_pembayaran', NOW(), NOW());
EOF
```

---

### Step 2: Create Payment

```bash
curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "pesanan_id": "order-test-001",
    "user_id": "client-test-001",
    "jumlah": 500000,
    "metode_pembayaran": "qris",
    "channel": "QRIS"
  }' | jq
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment_id": "uuid-payment-xxx",
    "transaction_id": "PAY-1729499000000-ABC123",
    "payment_url": "http://localhost:5001/mock-payment/MOCK-1729499000000-ABCD1234",
    "total_bayar": 530000,
    "status": "menunggu",
    "expires_at": "2025-10-21T10:00:00Z",
    "payment_instructions": {
      "type": "QRIS",
      "title": "Scan QR Code",
      "steps": [
        "Buka aplikasi e-wallet/mobile banking",
        "Pilih menu Scan QR",
        "Scan QR code di bawah",
        "Konfirmasi pembayaran"
      ],
      "qr_url": "http://localhost:5001/mock-qr/1729499000000.png"
    }
  }
}
```

**💾 Save these values:**
- `payment_id`: untuk check payment nanti
- `transaction_id`: untuk webhook testing
- `payment_url`: untuk simulasi pembayaran

---

### Step 3: Open Payment URL (Simulate Client Payment)

```bash
# Copy payment_url dari response Step 2
# Open di browser:
open "http://localhost:5001/mock-payment/MOCK-1729499000000-ABCD1234?transaction_id=PAY-1729499000000-ABC123&order_id=order-test-001&amount=500000&total=530000"
```

**UI Flow:**
1. Browser akan buka mock payment gateway
2. Pilih payment method (QRIS / VA / E-Wallet / Credit Card)
3. Click "Pay Now"
4. Wait 3 seconds (auto payment simulation)
5. Success screen muncul
6. Webhook otomatis triggered ke backend

**Console logs to watch:**
```
[MOCK PAYMENT] Sending webhook: {...}
[MOCK PAYMENT] Webhook response: { success: true, ... }
[MOCK PAYMENT] ✅ Escrow created: uuid-escrow-xxx
```

---

### Step 4: Verify Payment Status

```bash
# Check payment by ID
curl http://localhost:5001/api/payments/{payment_id} | jq

# Expected response:
{
  "success": true,
  "data": {
    "id": "uuid-payment-xxx",
    "transaction_id": "PAY-1729499000000-ABC123",
    "pesanan_id": "order-test-001",
    "user_id": "client-test-001",
    "jumlah": 500000,
    "biaya_platform": 25000,
    "biaya_payment_gateway": 5000,
    "total_bayar": 530000,
    "metode_pembayaran": "qris",
    "status": "berhasil",  // ✅ Changed from "menunggu"
    "dibayar_pada": "2025-10-20T10:05:00Z",
    "created_at": "2025-10-20T10:00:00Z"
  }
}
```

---

### Step 5: Check Escrow Created

```bash
# Get escrow by payment
curl http://localhost:5001/api/payments/escrow/{escrow_id} | jq

# Expected response:
{
  "success": true,
  "data": {
    "id": "uuid-escrow-xxx",
    "pembayaran_id": "uuid-payment-xxx",
    "pesanan_id": "order-test-001",
    "jumlah_ditahan": 500000,
    "biaya_platform": 25000,
    "jumlah_bersih": 475000,
    "status": "held",  // ✅ Payment di-hold
    "ditahan_pada": "2025-10-20T10:05:00Z",
    "akan_dirilis_pada": "2025-10-27T10:05:00Z"  // 7 days later
  }
}
```

**💰 Fee Calculation:**
```
Order Amount:         Rp 500,000
Platform Fee (5%):    Rp  25,000
Gateway Fee (1%):     Rp   5,000
──────────────────────────────────
Total Client Pays:    Rp 530,000

Escrow Held:          Rp 500,000
Platform Fee (5%):    Rp  25,000
──────────────────────────────────
Net to Freelancer:    Rp 475,000
```

---

### Step 6: Client Approve Work (Release Escrow)

```bash
curl -X POST http://localhost:5001/api/payments/escrow/release \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "uuid-escrow-xxx",
    "user_id": "client-test-001",
    "reason": "Work completed successfully"
  }' | jq
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Escrow released successfully",
  "data": {
    "escrow_id": "uuid-escrow-xxx",
    "status": "released",  // ✅ Changed from "held"
    "jumlah_ditahan": 500000,
    "biaya_platform": 25000,
    "jumlah_bersih": 475000,
    "dirilis_pada": "2025-10-20T11:00:00Z"
  }
}
```

---

### Step 7: Freelancer Withdrawal

```bash
curl -X POST http://localhost:5001/api/payments/withdraw \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "uuid-escrow-xxx",
    "freelancer_id": "freelancer-test-001",
    "metode_pencairan": "transfer_bank",
    "nomor_rekening": "1234567890",
    "nama_pemilik": "Test Freelancer",
    "nama_bank": "BCA"
  }' | jq
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Withdrawal request created successfully",
  "data": {
    "withdrawal_id": "uuid-withdrawal-xxx",
    "status": "completed",  // ✅ Auto-processed (mock)
    "jumlah": 500000,
    "biaya_platform": 25000,
    "jumlah_bersih": 475000,  // ✅ Freelancer receives this
    "metode_pencairan": "transfer_bank",
    "nomor_rekening": "1234567890",
    "nama_bank": "BCA",
    "bukti_transfer": "https://mock-bank.com/transfer/xxx.pdf",
    "dicairkan_pada": "2025-10-20T11:05:00Z"
  }
}
```

**✅ DONE! Freelancer received Rp 475,000**

---

## 🎯 Testing Different Scenarios

### Scenario A: QRIS Payment

```bash
# Create payment with QRIS
curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "pesanan_id": "order-test-001",
    "user_id": "client-test-001",
    "jumlah": 100000,
    "metode_pembayaran": "qris",
    "channel": "QRIS"
  }' | jq

# Fee: 0.7% = Rp 700
# Total: Rp 100,000 + Rp 5,000 (platform) + Rp 700 (gateway) = Rp 105,700
```

### Scenario B: Virtual Account BCA

```bash
curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "pesanan_id": "order-test-002",
    "user_id": "client-test-001",
    "jumlah": 250000,
    "metode_pembayaran": "virtual_account",
    "channel": "BCA"
  }' | jq

# Fee: Rp 4,000 (fixed)
# Total: Rp 250,000 + Rp 12,500 (platform) + Rp 4,000 (gateway) = Rp 266,500
```

### Scenario C: E-Wallet GoPay

```bash
curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "pesanan_id": "order-test-003",
    "user_id": "client-test-001",
    "jumlah": 500000,
    "metode_pembayaran": "e_wallet",
    "channel": "GOPAY"
  }' | jq

# Fee: 2% = Rp 10,000
# Total: Rp 500,000 + Rp 25,000 (platform) + Rp 10,000 (gateway) = Rp 535,000
```

### Scenario D: Credit Card

```bash
curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "pesanan_id": "order-test-004",
    "user_id": "client-test-001",
    "jumlah": 1000000,
    "metode_pembayaran": "kartu_kredit",
    "channel": "CREDIT_CARD"
  }' | jq

# Fee: 2.9% = Rp 29,000
# Total: Rp 1,000,000 + Rp 50,000 (platform) + Rp 29,000 (gateway) = Rp 1,079,000
```

---

## 🧪 Manual Testing Webhooks

### Trigger Success Manually

```bash
curl -X POST http://localhost:5001/api/payments/mock/trigger-success \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "PAY-1729499000000-ABC123"
  }' | jq
```

### Trigger Failure Manually

```bash
curl -X POST http://localhost:5001/api/payments/mock/trigger-failure \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "PAY-1729499000000-ABC123",
    "reason": "Insufficient balance"
  }' | jq
```

---

## 📊 Database Verification

### Check All Tables

```sql
-- Check pembayaran table
SELECT id, transaction_id, status, total_bayar, dibayar_pada
FROM pembayaran
ORDER BY created_at DESC
LIMIT 5;

-- Check escrow table
SELECT id, pembayaran_id, status, jumlah_ditahan, jumlah_bersih, dirilis_pada
FROM escrow
ORDER BY created_at DESC
LIMIT 5;

-- Check pencairan_dana (withdrawal) table
SELECT id, escrow_id, status, jumlah_bersih, dicairkan_pada
FROM pencairan_dana
ORDER BY created_at DESC
LIMIT 5;

-- Check order status
SELECT id, nomor_pesanan, status, total_bayar
FROM pesanan
WHERE id = 'order-test-001';
```

---

## ✅ Checklist Complete Flow

- [ ] Backend server running
- [ ] Test data created (users, orders)
- [ ] Create payment via API
- [ ] Open payment URL in browser
- [ ] Select payment method
- [ ] Payment simulated (3 seconds)
- [ ] Webhook received by backend
- [ ] Payment status changed to "berhasil"
- [ ] Escrow created with status "held"
- [ ] Escrow released by client
- [ ] Withdrawal requested by freelancer
- [ ] Withdrawal processed successfully
- [ ] Freelancer received money (status: "completed")

---

## 🐛 Troubleshooting

### Issue: Webhook not received

**Check:**
```bash
# 1. Check backend logs
# Should see: POST /api/payments/webhook 200

# 2. Check browser console
# Should see: [MOCK PAYMENT] Webhook response: { success: true }

# 3. Check signature
# .env MOCK_PAYMENT_SECRET must match HTML generateSignature()
```

### Issue: Escrow not created

**Check:**
```bash
# 1. Check payment status
curl http://localhost:5001/api/payments/{payment_id} | jq '.data.status'

# Should be "berhasil"

# 2. Check database
SELECT * FROM escrow WHERE pembayaran_id = 'payment-id';
```

### Issue: Withdrawal failed

**Check:**
```bash
# 1. Check escrow status
curl http://localhost:5001/api/payments/escrow/{escrow_id} | jq '.data.status'

# Should be "released" not "held"

# 2. Check freelancer_id matches
# Freelancer ID di withdrawal request harus sama dengan order freelancer_id
```

---

## 📝 Notes

- Mock payment auto-success rate: 80% (configurable)
- Escrow auto-release: 7 days (configurable)
- Withdrawal auto-processed in development (manual approval in production)
- All signatures must match between frontend and backend
- Payment URL expires after 24 hours

---

**Happy Testing! 🚀**

---

**Last Updated:** October 20, 2025
**Status:** ✅ Ready for Full Integration Testing
