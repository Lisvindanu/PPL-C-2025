# Payment Gateway Module - Complete Implementation Guide

**Panduan lengkap untuk Backend Team implementasi Payment Gateway dengan Mock System + Escrow + Withdrawal**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Database Setup](#database-setup)
4. [Payment Flow](#payment-flow)
5. [API Endpoints](#api-endpoints)
6. [Code Examples](#code-examples)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Module ini handle:
- ✅ Payment creation (QRIS, VA, E-Wallet, Credit Card)
- ✅ Mock Payment Gateway (simulate real payment)
- ✅ Webhook handling (payment callback)
- ✅ Escrow system (hold payment 7 days)
- ✅ Withdrawal/Payout untuk freelancer
- ✅ Fee calculation (platform 5%, gateway 1-3%)

**Tech Stack:**
- Node.js + Express
- MySQL + Sequelize ORM
- Domain-Driven Design (DDD)
- Mock Payment Gateway

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

Copy dan edit `.env`:

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ppl-2025-c
DB_USER=root
DB_PASSWORD=password

# Mock Payment Gateway
MOCK_AUTO_SUCCESS=true
MOCK_AUTO_WITHDRAWAL=true
MOCK_PAYMENT_SECRET=mock-secret-key-change-in-production
BACKEND_URL=http://localhost:5001
```

### 3. Create Database

```bash
# Login MySQL
mysql -u root -p

# Create database
CREATE DATABASE `ppl-2025-c`;
USE `ppl-2025-c`;
```

### 4. Run Migrations

```bash
# Run all migrations
npx sequelize-cli db:migrate

# Check migration status
npx sequelize-cli db:migrate:status
```

### 5. Start Server

```bash
npm start

# Server running at http://localhost:5001
```

### 6. Test Health Check

```bash
curl http://localhost:5001/health

# Expected:
{
  "status": "healthy",
  "database": "connected",
  "uptime": 123.45
}
```

---

## 💾 Database Setup

### Required Tables

Payment module butuh 3 tabel utama:

1. **pembayaran** - Store payment transactions
2. **escrow** - Hold payment until work completed
3. **pencairan_dana** - Withdrawal/payout records

### Create Migrations

```bash
# 1. Create pembayaran table
npx sequelize-cli migration:generate --name create-pembayaran-table

# 2. Create escrow table
npx sequelize-cli migration:generate --name create-escrow-table

# 3. Create pencairan_dana table
npx sequelize-cli migration:generate --name create-pencairan-dana-table
```

### Migration Files

Lihat schema lengkap di `backend/DATABASE-SCHEMA.md`

**Key columns:**

**pembayaran:**
- `id` (UUID)
- `transaction_id` (unique)
- `pesanan_id` (FK to orders)
- `user_id` (FK to users)
- `jumlah` (order amount)
- `total_bayar` (with fees)
- `status` (menunggu/berhasil/gagal)

**escrow:**
- `id` (UUID)
- `pembayaran_id` (FK)
- `jumlah_ditahan` (amount held)
- `status` (held/released/completed)
- `akan_dirilis_pada` (auto-release date)

**pencairan_dana:**
- `id` (UUID)
- `escrow_id` (FK)
- `freelancer_id` (FK)
- `jumlah_bersih` (net amount)
- `status` (pending/completed/failed)

### Run Migrations

```bash
# Run all pending migrations
npx sequelize-cli db:migrate

# Rollback last migration (jika ada error)
npx sequelize-cli db:migrate:undo

# Rollback all migrations
npx sequelize-cli db:migrate:undo:all
```

---

## 🔄 Payment Flow

### Complete Payment Flow (End-to-End)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE PAYMENT FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

CLIENT                 SYSTEM              MOCK GATEWAY         ESCROW
  │                      │                      │                  │
  │  1. Create Order     │                      │                  │
  ├─────────────────────>│                      │                  │
  │                      │                      │                  │
  │  2. Create Payment   │                      │                  │
  ├─────────────────────>│                      │                  │
  │                      │                      │                  │
  │                      │  3. Request Payment  │                  │
  │                      ├─────────────────────>│                  │
  │                      │                      │                  │
  │                      │  4. Payment URL      │                  │
  │                      │<─────────────────────┤                  │
  │                      │                      │                  │
  │  5. Payment URL      │                      │                  │
  │<─────────────────────┤                      │                  │
  │                      │                      │                  │
  │  6. Pay (QRIS/VA)    │                      │                  │
  ├──────────────────────┴─────────────────────>│                  │
  │                                              │                  │
  │                      7. Webhook (success)    │                  │
  │                      │<─────────────────────┤                  │
  │                      │                      │                  │
  │                      │  8. Create Escrow (hold payment)        │
  │                      ├─────────────────────────────────────────>│
  │                      │                      │                  │
  │                      │  9. Escrow Created   │                  │
  │                      │<─────────────────────────────────────────┤
  │                      │                      │                  │
  │  10. Payment Success │                      │                  │
  │      (Order: dibayar)│                      │                  │
  │<─────────────────────┤                      │                  │
  │                      │                      │                  │

FREELANCER             SYSTEM                                    ESCROW
  │                      │                                          │
  │  11. Work on Order   │                                          │
  │  (status: dikerjakan)│                                          │
  │                      │                                          │
  │  12. Deliver Work    │                                          │
  ├─────────────────────>│                                          │
  │  (status: menunggu   │                                          │
  │   _review)           │                                          │
  │                      │                                          │

CLIENT                 SYSTEM                                    ESCROW
  │                      │                                          │
  │  13. Approve Work    │                                          │
  ├─────────────────────>│                                          │
  │                      │                                          │
  │                      │  14. Release Escrow                      │
  │                      ├─────────────────────────────────────────>│
  │                      │                                          │
  │                      │  15. Escrow Released                     │
  │                      │      (status: released)                  │
  │                      │<─────────────────────────────────────────┤
  │                      │                                          │
  │  16. Order Complete  │                                          │
  │  (status: selesai)   │                                          │
  │<─────────────────────┤                                          │
  │                      │                                          │

FREELANCER             SYSTEM              WITHDRAWAL           ESCROW
  │                      │                      │                  │
  │  17. Request         │                      │                  │
  │      Withdrawal      │                      │                  │
  ├─────────────────────>│                      │                  │
  │                      │                      │                  │
  │                      │  18. Create          │                  │
  │                      │      Withdrawal      │                  │
  │                      ├─────────────────────>│                  │
  │                      │                      │                  │
  │                      │  19. Process         │                  │
  │                      │      Transfer (mock) │                  │
  │                      │<─────────────────────┤                  │
  │                      │                      │                  │
  │                      │  20. Update Escrow                       │
  │                      │      (status:completed)                  │
  │                      ├─────────────────────────────────────────>│
  │                      │                      │                  │
  │  21. Withdrawal      │                      │                  │
  │      Completed       │                      │                  │
  │<─────────────────────┤                      │                  │
  │                      │                      │                  │
```

---

## 🔌 API Endpoints

### 1. Create Payment

**Endpoint:** `POST /api/payments/create`

**Request Body:**
```json
{
  "pesanan_id": "uuid-order",
  "user_id": "uuid-client",
  "jumlah": 250000,
  "metode_pembayaran": "qris",
  "channel": "QRIS"
}
```

**Response:**
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
    "expires_at": "2025-10-21T10:00:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "pesanan_id": "order-123",
    "user_id": "user-456",
    "jumlah": 250000,
    "metode_pembayaran": "qris"
  }'
```

---

### 2. Webhook (Payment Callback)

**Endpoint:** `POST /api/payments/webhook`

**Request Body:**
```json
{
  "transaction_id": "PAY-1234567890-ABC123",
  "transaction_status": "settlement",
  "gross_amount": "265000",
  "signature": "sha256-hash"
}
```

**Response:**
```json
{
  "success": true,
  "transaction_id": "PAY-1234567890-ABC123",
  "status": "berhasil",
  "escrow_created": true,
  "escrow_id": "uuid",
  "message": "Webhook processed successfully"
}
```

**Note:** Webhook ini otomatis dipanggil oleh Mock Payment Gateway setelah user bayar.

---

### 3. Get Payment Details

**Endpoint:** `GET /api/payments/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "transaction_id": "PAY-xxx",
    "pesanan_id": "order-uuid",
    "jumlah": 250000,
    "total_bayar": 265000,
    "status": "berhasil",
    "metode_pembayaran": "qris",
    "dibayar_pada": "2025-10-20T10:00:00Z"
  }
}
```

**cURL:**
```bash
curl http://localhost:5001/api/payments/{payment_id}
```

---

### 4. Release Escrow

**Endpoint:** `POST /api/payments/escrow/release`

**Request Body:**
```json
{
  "escrow_id": "uuid",
  "user_id": "client-uuid",
  "reason": "Work approved"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Escrow released successfully",
  "data": {
    "escrow_id": "uuid",
    "status": "released",
    "jumlah_ditahan": 250000,
    "jumlah_bersih": 237500,
    "dirilis_pada": "2025-10-20T11:00:00Z"
  }
}
```

**cURL:**
```bash
curl -X POST http://localhost:5001/api/payments/escrow/release \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "uuid",
    "user_id": "client-uuid",
    "reason": "Work completed"
  }'
```

---

### 5. Get Escrow Details

**Endpoint:** `GET /api/payments/escrow/:id`

**Response:**
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

**cURL:**
```bash
curl http://localhost:5001/api/payments/escrow/{escrow_id}
```

---

### 6. Create Withdrawal

**Endpoint:** `POST /api/payments/withdraw`

**Request Body:**
```json
{
  "escrow_id": "uuid",
  "freelancer_id": "freelancer-uuid",
  "metode_pencairan": "transfer_bank",
  "nomor_rekening": "1234567890",
  "nama_pemilik": "John Doe",
  "nama_bank": "BCA"
}
```

**Response:**
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

**cURL:**
```bash
curl -X POST http://localhost:5001/api/payments/withdraw \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "uuid",
    "freelancer_id": "freelancer-uuid",
    "metode_pencairan": "transfer_bank",
    "nomor_rekening": "1234567890",
    "nama_pemilik": "John Doe",
    "nama_bank": "BCA"
  }'
```

---

### 7. Mock Trigger Success (Testing Only)

**Endpoint:** `POST /api/payments/mock/trigger-success`

**Request Body:**
```json
{
  "transaction_id": "PAY-1234567890-ABC123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment success triggered",
  "data": {
    "transaction_id": "PAY-xxx",
    "status": "berhasil",
    "escrow_created": true
  }
}
```

---

### 8. Mock Trigger Failure (Testing Only)

**Endpoint:** `POST /api/payments/mock/trigger-failure`

**Request Body:**
```json
{
  "transaction_id": "PAY-1234567890-ABC123",
  "reason": "Insufficient balance"
}
```

---

## 💻 Code Examples

### Example 1: Integrate Payment di Order Flow

```javascript
// File: src/modules/order/application/use-cases/CreateOrder.js

const CreatePayment = require('../../../payment/application/use-cases/CreatePayment');

class CreateOrder {
  async execute(orderData) {
    // 1. Create order
    const order = await OrderModel.create({
      nomor_pesanan: this.generateOrderNumber(),
      client_id: orderData.client_id,
      freelancer_id: orderData.freelancer_id,
      layanan_id: orderData.layanan_id,
      harga: orderData.harga,
      total_bayar: orderData.total_bayar,
      status: 'menunggu_pembayaran'
    });

    // 2. Create payment
    const createPaymentUseCase = new CreatePayment();
    const payment = await createPaymentUseCase.execute({
      pesanan_id: order.id,
      user_id: orderData.client_id,
      jumlah: orderData.total_bayar,
      metode_pembayaran: orderData.metode_pembayaran,
      channel: orderData.channel
    });

    // 3. Return order + payment URL
    return {
      order,
      payment_url: payment.payment_url,
      transaction_id: payment.transaction_id,
      total_bayar: payment.total_bayar,
      expires_at: payment.expires_at
    };
  }
}
```

---

### Example 2: Update Order Status After Payment

```javascript
// File: src/modules/payment/application/use-cases/VerifyPayment.js

async execute(webhookData) {
  const { transaction_id, transaction_status } = webhookData;

  // 1. Verify signature
  const isValid = this.mockGateway.verifyWebhookSignature(webhookData);
  if (!isValid) {
    throw new Error('Invalid webhook signature');
  }

  // 2. Get payment
  const payment = await PaymentModel.findOne({
    where: { transaction_id }
  });

  // 3. Update payment status
  if (transaction_status === 'settlement') {
    await payment.update({
      status: 'berhasil',
      dibayar_pada: new Date()
    });

    // 4. Create escrow
    const escrow = await EscrowModel.create({
      pembayaran_id: payment.id,
      pesanan_id: payment.pesanan_id,
      jumlah_ditahan: payment.jumlah,
      biaya_platform: payment.biaya_platform,
      jumlah_bersih: payment.jumlah - payment.biaya_platform,
      status: 'held',
      ditahan_pada: new Date(),
      akan_dirilis_pada: this.calculateReleaseDate(7) // 7 days
    });

    // 5. Update order status
    await OrderModel.update(
      { status: 'dibayar' },
      { where: { id: payment.pesanan_id } }
    );

    return {
      success: true,
      escrow_created: true,
      escrow_id: escrow.id
    };
  }

  // Handle failed payment
  if (transaction_status === 'deny') {
    await payment.update({ status: 'gagal' });
    await OrderModel.update(
      { status: 'dibatalkan' },
      { where: { id: payment.pesanan_id } }
    );
  }
}
```

---

### Example 3: Auto-release Escrow (CRON Job)

```javascript
// File: src/modules/payment/infrastructure/cron/AutoReleaseEscrow.js

const cron = require('node-cron');
const { Op } = require('sequelize');

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Checking escrows for auto-release...');

  // Find escrows that should be auto-released
  const escrows = await EscrowModel.findAll({
    where: {
      status: 'held',
      akan_dirilis_pada: {
        [Op.lte]: new Date()
      }
    }
  });

  for (const escrow of escrows) {
    try {
      // Auto-release escrow
      await escrow.update({
        status: 'released',
        dirilis_pada: new Date()
      });

      // Update order status
      await OrderModel.update(
        { status: 'selesai' },
        { where: { id: escrow.pesanan_id } }
      );

      console.log(`[CRON] Auto-released escrow ${escrow.id}`);
    } catch (error) {
      console.error(`[CRON] Failed to release escrow ${escrow.id}:`, error);
    }
  }
});
```

---

## 🧪 Testing

### Manual Testing Steps

#### 1. Prepare Test Data

```sql
-- Create test users
INSERT INTO users (id, email, password, role, nama_depan, created_at, updated_at) VALUES
('client-001', 'client@test.com', 'hashed', 'client', 'Test Client', NOW(), NOW()),
('freelancer-001', 'freelancer@test.com', 'hashed', 'freelancer', 'Test Freelancer', NOW(), NOW());

-- Create test order
INSERT INTO pesanan (id, nomor_pesanan, client_id, freelancer_id, harga, total_bayar, status, created_at, updated_at) VALUES
('order-001', 'ORD-001', 'client-001', 'freelancer-001', 250000, 250000, 'menunggu_pembayaran', NOW(), NOW());
```

#### 2. Create Payment

```bash
curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "pesanan_id": "order-001",
    "user_id": "client-001",
    "jumlah": 250000,
    "metode_pembayaran": "qris"
  }' | jq
```

#### 3. Open Payment URL

Copy `payment_url` dari response, buka di browser:
```
http://localhost:5001/mock-payment/MOCK-xxx?transaction_id=PAY-xxx&...
```

#### 4. Simulate Payment

- Pilih payment method (QRIS/VA/E-Wallet/Credit Card)
- Click "Pay Now"
- Wait 3 seconds → Success screen
- Webhook otomatis triggered

#### 5. Verify Payment

```bash
# Check payment status
curl http://localhost:5001/api/payments/{payment_id} | jq

# Check escrow created
curl http://localhost:5001/api/payments/escrow/{escrow_id} | jq
```

#### 6. Release Escrow

```bash
curl -X POST http://localhost:5001/api/payments/escrow/release \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "uuid",
    "user_id": "client-001",
    "reason": "Work completed"
  }' | jq
```

#### 7. Withdrawal

```bash
curl -X POST http://localhost:5001/api/payments/withdraw \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "uuid",
    "freelancer_id": "freelancer-001",
    "metode_pencairan": "transfer_bank",
    "nomor_rekening": "1234567890",
    "nama_pemilik": "Test Freelancer",
    "nama_bank": "BCA"
  }' | jq
```

---

### Automated Testing

```javascript
// File: tests/payment.test.js

const request = require('supertest');
const app = require('../src/server');

describe('Payment Flow', () => {
  let paymentId, escrowId;

  test('Create payment', async () => {
    const response = await request(app)
      .post('/api/payments/create')
      .send({
        pesanan_id: 'order-001',
        user_id: 'client-001',
        jumlah: 250000,
        metode_pembayaran: 'qris'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('payment_id');

    paymentId = response.body.data.payment_id;
  });

  test('Trigger payment success', async () => {
    const response = await request(app)
      .post('/api/payments/mock/trigger-success')
      .send({
        transaction_id: 'PAY-xxx'
      });

    expect(response.status).toBe(200);
    expect(response.body.data.escrow_created).toBe(true);

    escrowId = response.body.data.escrow_id;
  });

  test('Release escrow', async () => {
    const response = await request(app)
      .post('/api/payments/escrow/release')
      .send({
        escrow_id: escrowId,
        user_id: 'client-001'
      });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('released');
  });
});
```

Run tests:
```bash
npm test
```

---

## 🐛 Troubleshooting

### Issue 1: Payment webhook tidak diterima

**Symptom:** Payment status tetap "menunggu" setelah pay di mock gateway

**Solution:**
```bash
# 1. Check backend logs
# Should see: POST /api/payments/webhook 200

# 2. Check browser console (DevTools)
# Should see: [MOCK PAYMENT] Webhook response: { success: true }

# 3. Verify signature
# Check .env MOCK_PAYMENT_SECRET must match HTML generateSignature()
MOCK_PAYMENT_SECRET=mock-secret-key-change-in-production

# 4. Test webhook manually
curl -X POST http://localhost:5001/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "PAY-xxx",
    "transaction_status": "settlement",
    "gross_amount": "265000",
    "signature": "generated-signature"
  }'
```

---

### Issue 2: Escrow tidak dibuat

**Symptom:** Payment berhasil tapi escrow tidak ada

**Solution:**
```bash
# 1. Check payment status
curl http://localhost:5001/api/payments/{payment_id} | jq '.data.status'
# Should be "berhasil"

# 2. Check database
mysql -u root -p ppl-2025-c
SELECT * FROM escrow WHERE pembayaran_id = 'payment-id';

# 3. Check backend logs for errors
# Look for: [ESCROW] Creating escrow for payment xxx

# 4. Manually trigger webhook
curl -X POST http://localhost:5001/api/payments/mock/trigger-success \
  -d '{"transaction_id": "PAY-xxx"}' | jq
```

---

### Issue 3: Withdrawal gagal

**Symptom:** Error saat request withdrawal

**Solution:**
```bash
# 1. Check escrow status
curl http://localhost:5001/api/payments/escrow/{escrow_id} | jq '.data.status'
# Must be "released", not "held"

# 2. Verify freelancer_id
# Freelancer ID di request must match order.freelancer_id

# 3. Check database
SELECT e.*, p.pesanan_id, o.freelancer_id
FROM escrow e
JOIN pembayaran p ON e.pembayaran_id = p.id
JOIN pesanan o ON p.pesanan_id = o.id
WHERE e.id = 'escrow-id';

# 4. Release escrow first if status is "held"
curl -X POST http://localhost:5001/api/payments/escrow/release \
  -d '{"escrow_id": "xxx", "user_id": "client-id"}' | jq
```

---

### Issue 4: Database connection error

**Symptom:** `Error: Unable to connect to the database`

**Solution:**
```bash
# 1. Check MySQL is running
brew services list | grep mysql
# Or for Linux/Windows: systemctl status mysql

# 2. Start MySQL if not running
brew services start mysql

# 3. Test connection
mysql -u root -p
USE `ppl-2025-c`;
SHOW TABLES;

# 4. Verify .env credentials
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ppl-2025-c
DB_USER=root
DB_PASSWORD=password

# 5. Test Sequelize connection
cd backend
node -e "const {sequelize} = require('./src/shared/database/connection'); sequelize.authenticate().then(() => console.log('OK')).catch(e => console.error(e));"
```

---

### Issue 5: Migration error

**Symptom:** `SequelizeDatabaseError: Table 'xxx' already exists`

**Solution:**
```bash
# 1. Check migration status
npx sequelize-cli db:migrate:status

# 2. If table exists but not in migrations table
mysql -u root -p ppl-2025-c
INSERT INTO SequelizeMeta VALUES ('XXXXXX-create-pembayaran-table.js');

# 3. Or rollback and re-run
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate

# 4. Force recreate (DANGER - deletes data!)
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

---

## 💰 Fee Structure Reference

### Platform Fee: 5%
```
Order Rp 100,000 → Platform Fee Rp 5,000
Order Rp 250,000 → Platform Fee Rp 12,500
Order Rp 500,000 → Platform Fee Rp 25,000
Order Rp 1,000,000 → Platform Fee Rp 50,000
```

### Gateway Fee by Method

| Method | Fee Type | Fee Amount |
|--------|----------|------------|
| QRIS | Percentage | 0.7% |
| Virtual Account | Fixed | Rp 4,000 |
| E-Wallet (GoPay, OVO, DANA) | Percentage | 2% |
| Transfer Bank | Fixed | Rp 0 |
| Credit Card | Percentage | 2.9% |

### Example Calculation

**Order: Rp 250,000 dengan QRIS**
```
Harga Order:           Rp 250,000
Platform Fee (5%):     Rp  12,500
Gateway Fee (0.7%):    Rp   1,750
─────────────────────────────────
Total Client Bayar:    Rp 264,250

Escrow Held:           Rp 250,000
Platform Fee (5%):     Rp  12,500
─────────────────────────────────
Net ke Freelancer:     Rp 237,500
```

---

## 📚 Additional Resources

- **Payment Module Complete Guide:** `src/modules/payment/PAYMENT-MODULE-GUIDE.md` ⭐ **READ THIS FIRST**
- **Full API Documentation:** `PAYMENT-API-TESTING.md`
- **Complete Flow Testing:** `PAYMENT-FLOW-TESTING.md`
- **Mock Payment UI Guide:** `public/mock-payment/README.md`
- **Database Schema:** `DATABASE-SCHEMA.md`
- **Database Team Guide:** `PANDUAN-TIM-DATABASE.md`

---

## 🚀 Next Steps

1. ✅ Setup database dan run migrations
2. ✅ Test create payment endpoint
3. ✅ Test mock payment UI
4. ✅ Test webhook flow
5. ✅ Test escrow system
6. ✅ Test withdrawal
7. ⬜ Integrate dengan frontend
8. ⬜ Setup CRON job untuk auto-release
9. ⬜ Add monitoring & logging
10. ⬜ Production ready (replace mock dengan real gateway)

---

## 📞 Support

Butuh bantuan?
- **Backend Lead:** Lisvindanu (223040038)
- **PM:** Lisvindanu
- **WhatsApp Group:** Backend Team

---

**Last Updated:** October 20, 2025
**Version:** 1.0.0
**Status:** ✅ Ready for Integration Testing

---

**Happy Coding! 🚀**
