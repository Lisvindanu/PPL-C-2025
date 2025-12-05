# Payment Flow Documentation - PPL SkillConnect

## Table of Contents
1. [Overview](#overview)
2. [Payment Creation Flow](#payment-creation-flow)
3. [Payment Verification Flow](#payment-verification-flow)
4. [Escrow System](#escrow-system)
5. [Order Status Integration](#order-status-integration)
6. [Refund Process](#refund-process)
7. [Withdrawal Process](#withdrawal-process)
8. [Invoice Generation](#invoice-generation)
9. [Payment Analytics](#payment-analytics)
10. [Error Handling](#error-handling)
11. [Database Schema](#database-schema)
12. [API Endpoints](#api-endpoints)

---

## Overview

### System Architecture
```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐      ┌──────────────┐
│   Client    │─────▶│   Backend    │─────▶│ Payment Gateway │─────▶│   Midtrans   │
│  (React)    │◀─────│  (Node.js)   │◀─────│   (Mock/Real)   │◀─────│    (Real)    │
└─────────────┘      └──────────────┘      └─────────────────┘      └──────────────┘
       │                     │                                              │
       │                     ▼                                              │
       │              ┌──────────────┐                                      │
       │              │   Database   │                                      │
       │              │   (MySQL)    │                                      │
       │              └──────────────┘                                      │
       │                     │                                              │
       └─────────────────────┴──────────────────────────────────────────────┘
                        Webhook Callback
```

### Key Components
1. **Frontend (React)** - User interface untuk initiating payments
2. **Backend (Node.js)** - Payment processing & business logic
3. **Payment Gateway** - Mock (development) atau Midtrans (production)
4. **Database (MySQL)** - Persistent storage untuk payment records
5. **Escrow System** - Hold funds untuk 7 hari sebelum release ke freelancer

### Payment States
```
menunggu ──▶ berhasil ──▶ (completed)
   │            │
   ▼            ▼
gagal      kadaluarsa
```

---

## Payment Creation Flow

### 1. User Initiates Payment

**Frontend Flow:**
```javascript
// User clicks "Bayar Sekarang" on order
1. Navigate to /payment/create?orderId=xxx
2. Load order details via orderService.getOrderById(orderId)
3. Display payment summary (harga, biaya platform, total)
4. User selects payment method (e-wallet, bank transfer, etc.)
5. Click "Proses Pembayaran"
```

**Backend Process:**

```
POST /api/payments/create
├── Validate request (orderId, userId, amount)
├── Check order exists & status = 'menunggu_pembayaran'
├── Calculate fees (platform: 5%, payment gateway: 1%)
├── Create payment record in database
│   ├── id: UUID
│   ├── pesanan_id: order.id
│   ├── user_id: client.id
│   ├── transaction_id: unique ID
│   ├── status: 'menunggu'
│   ├── jumlah: order.harga
│   ├── biaya_platform: order.harga * 0.05
│   ├── biaya_payment_gateway: order.harga * 0.01
│   └── total_bayar: jumlah + biaya_platform + biaya_payment_gateway
├── Generate invoice number: INV-2025-XXXXX
├── Create payment with gateway (Mock/Midtrans)
│   ├── Get payment URL & token
│   └── Set expiry (24 hours)
└── Return payment URL to frontend
```

**Database Record Created:**
```sql
INSERT INTO pembayaran (
  id, pesanan_id, user_id, transaction_id,
  jumlah, biaya_platform, biaya_payment_gateway, total_bayar,
  metode_pembayaran, channel, payment_gateway,
  payment_url, status, nomor_invoice,
  kadaluarsa_pada, created_at
) VALUES (
  'uuid', 'order-id', 'user-id', 'trx-12345',
  5500000, 275000, 55000, 5830000,
  'bank_transfer', 'bca', 'midtrans',
  'https://...', 'menunggu', 'INV-2025-00001',
  '2025-12-03 18:00:00', NOW()
);
```

### 2. Payment Gateway Redirect

**Frontend:**
```javascript
// Redirect user to payment URL
window.location.href = paymentData.payment_url;

// User completes payment on gateway page
// Gateway redirects back to frontend callback URL
```

**Callback URLs:**
- Success: `https://ppl.vinmedia.my.id/payment/success?order_id=xxx&transaction_id=xxx`
- Error: `https://ppl.vinmedia.my.id/payment/error?order_id=xxx`

---

## Payment Verification Flow

### 1. Webhook from Payment Gateway

```
POST /api/payments/webhook
├── Receive callback from payment gateway
│   ├── transaction_id
│   ├── order_id
│   ├── gross_amount
│   ├── payment_type
│   ├── transaction_status (capture/settlement/pending/deny/expire/cancel)
│   └── signature_key (untuk validasi)
├── Validate signature (jika production)
├── Find payment by transaction_id
├── Update payment status based on transaction_status
│   ├── settlement/capture → 'berhasil'
│   ├── pending → 'menunggu'
│   ├── deny/cancel → 'gagal'
│   └── expire → 'kadaluarsa'
├── If status = 'berhasil':
│   ├── Update dibayar_pada = NOW()
│   ├── Create escrow entry
│   ├── Update order status to 'dibayar'
│   ├── Send notification to client & freelancer
│   └── (Optional) Generate & send invoice email
└── Return 200 OK to gateway
```

**Escrow Creation:**
```javascript
// When payment succeeds
await createEscrow({
  pembayaran_id: payment.id,
  pesanan_id: payment.pesanan_id,
  jumlah: payment.jumlah,
  freelancer_id: order.freelancer_id,
  status: 'ditahan',
  tanggal_rilis: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 days
});
```

### 2. Frontend Callback Handler

**Success Page Flow:**
```javascript
// /payment/success?order_id=xxx&transaction_id=xxx

1. Get params from URL (order_id, transaction_id, gross_amount)
2. Display success message & payment details
3. Check payment status via API: GET /api/payments/status/:transaction_id
4. If payment_id exists:
   ├── Show "Download Invoice" button
   └── Show "Send to Email" button
5. Show "View Order" button (navigate to /orders/:id)
```

---

## Escrow System

### Purpose
Hold dana client untuk 7 hari setelah pembayaran sebelum release ke freelancer. Ini proteksi untuk client jika ada dispute.

### Escrow States

```
┌──────────────────────────────────────────────────────────────────┐
│                        ESCROW LIFECYCLE                          │
└──────────────────────────────────────────────────────────────────┘

Payment Success
      │
      ▼
┌─────────────┐
│   ditahan   │ ◀── Funds locked, freelancer can't withdraw
└─────────────┘
      │
      │ (Auto after 7 days OR manual "Selesai" by client)
      ▼
┌─────────────┐
│  dirilis    │ ◀── Funds available for freelancer withdrawal
└─────────────┘
      │
      │ (Freelancer requests withdrawal)
      ▼
┌─────────────┐
│   ditarik   │ ◀── Funds transferred to freelancer
└─────────────┘

      ├── (Client requests refund & approved)
      ▼
┌─────────────┐
│   dikembalikan   │ ◀── Funds returned to client
└─────────────┘
```

### Escrow Database Schema
```sql
CREATE TABLE escrow (
  id VARCHAR(36) PRIMARY KEY,
  pembayaran_id VARCHAR(36) NOT NULL,
  pesanan_id VARCHAR(36) NOT NULL,
  freelancer_id VARCHAR(36) NOT NULL,
  jumlah DECIMAL(10,2) NOT NULL,
  status ENUM('ditahan', 'dirilis', 'ditarik', 'dikembalikan'),
  tanggal_rilis DATETIME,
  dirilis_pada DATETIME,
  ditarik_pada DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pembayaran_id) REFERENCES pembayaran(id),
  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
);
```

### Auto-Release Mechanism

**Cron Job (Runs every hour):**
```javascript
// Check escrow yang sudah melewati tanggal_rilis
const escrowsToRelease = await Escrow.findAll({
  where: {
    status: 'ditahan',
    tanggal_rilis: { [Op.lte]: new Date() }
  }
});

for (const escrow of escrowsToRelease) {
  await escrow.update({
    status: 'dirilis',
    dirilis_pada: new Date()
  });

  // Update order status to 'selesai' if not already
  await Order.update(
    { status: 'selesai' },
    { where: { id: escrow.pesanan_id } }
  );

  // Notify freelancer
  await sendNotification(escrow.freelancer_id, {
    type: 'escrow_released',
    message: `Dana Rp ${escrow.jumlah} telah dirilis dan siap ditarik`
  });
}
```

---

## Order Status Integration

### Status Flow with Payment

```
┌────────────────────────────────────────────────────────────────────┐
│                      ORDER STATUS LIFECYCLE                        │
└────────────────────────────────────────────────────────────────────┘

Client creates order
        │
        ▼
┌──────────────────────┐
│ menunggu_pembayaran  │ ◀── Initial status
└──────────────────────┘
        │
        │ Payment webhook: status = 'berhasil'
        ▼
┌──────────────────────┐
│      dibayar         │ ◀── Auto-updated by PaymentController.checkPaymentStatus()
└──────────────────────┘
        │
        │ Freelancer accepts & starts work
        ▼
┌──────────────────────┐
│     dikerjakan       │
└──────────────────────┘
        │
        │ Freelancer submits deliverable
        ▼
┌──────────────────────┐
│  menunggu_review     │
└──────────────────────┘
        │
        ├── Client approves ──▶ selesai ──▶ (escrow released)
        │
        └── Client requests revision ──▶ revisi ──▶ (back to dikerjakan)

Other states:
├── dibatalkan (cancelled before payment)
└── gagal (payment failed)
```

### Auto-Update Implementation

**File:** `PaymentController.js` - `checkPaymentStatus()` method

```javascript
async checkPaymentStatus(req, res) {
  try {
    const { transactionId } = req.params;

    // ... payment status check logic ...

    // NEW: Auto-update order status when payment succeeds
    if (payment.status === 'berhasil' && payment.pesanan_id) {
      const SequelizeOrderRepository = require('../../../order/infrastructure/repositories/SequelizeOrderRepository');
      const { sequelize } = require('../../../../shared/database/connection');
      const orderRepository = new SequelizeOrderRepository(sequelize);

      try {
        await orderRepository.updateStatus(payment.pesanan_id, 'dibayar');
        console.log(`[PAYMENT] Order ${payment.pesanan_id} updated to 'dibayar'`);
      } catch (orderError) {
        console.error('[PAYMENT] Failed to update order status:', orderError);
        // Continue - don't fail payment if order update fails
      }
    }

    // ... rest of response ...
  }
}
```

---

## Refund Process

### Refund Flow

```
Client requests refund
        │
        ▼
┌──────────────────────┐
│  Create refund       │ ◀── POST /api/payments/refund/request
│  request             │     { payment_id, alasan, jumlah_refund }
│  Status: 'menunggu'  │
└──────────────────────┘
        │
        │ Admin reviews
        ▼
┌──────────────────────┐
│  Admin approval      │ ◀── PUT /api/payments/refund/:id/process
│  Decision            │     { action: 'approve'/'reject', admin_notes }
└──────────────────────┘
        │
        ├── Approved ──▶ Process refund ──▶ Status: 'completed'
        │                   ├── Return funds from escrow
        │                   ├── Update escrow status: 'dikembalikan'
        │                   ├── Create transaction record
        │                   └── Notify client & freelancer
        │
        └── Rejected ──▶ Status: 'rejected'
                          └── Notify client with reason
```

### Refund Database Schema
```sql
CREATE TABLE refund (
  id VARCHAR(36) PRIMARY KEY,
  pembayaran_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  alasan TEXT,
  jumlah_refund DECIMAL(10,2) NOT NULL,
  status ENUM('menunggu', 'approved', 'rejected', 'completed'),
  admin_notes TEXT,
  diproses_oleh VARCHAR(36), -- admin user_id
  diproses_pada DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pembayaran_id) REFERENCES pembayaran(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Refund API Endpoints

**1. Create Refund Request**
```
POST /api/payments/refund/request
Authorization: Bearer <token>

Request:
{
  "payment_id": "uuid",
  "alasan": "Pekerjaan tidak sesuai",
  "jumlah_refund": 5500000  // optional, defaults to full payment
}

Response:
{
  "success": true,
  "message": "Refund request submitted successfully",
  "data": {
    "id": "refund-uuid",
    "status": "menunggu",
    "jumlah_refund": 5500000
  }
}
```

**2. Get Refund Requests (Admin)**
```
GET /api/payments/refund/all?status=menunggu
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "refund-uuid",
      "pembayaran_id": "payment-uuid",
      "user": { "nama_depan": "John", "email": "..." },
      "alasan": "...",
      "jumlah_refund": 5500000,
      "status": "menunggu",
      "created_at": "2025-12-02T10:00:00Z"
    }
  ]
}
```

**3. Process Refund (Admin)**
```
PUT /api/payments/refund/:id/process
Authorization: Bearer <admin-token>

Request:
{
  "action": "approve",  // or "reject"
  "admin_notes": "Refund approved after verification"
}

Response:
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "id": "refund-uuid",
    "status": "completed"
  }
}
```

---

## Withdrawal Process

### Freelancer Withdrawal Flow

```
Freelancer balance check
        │
        ▼
┌──────────────────────┐
│ GET /balance         │ ◀── Check available balance (escrow 'dirilis')
└──────────────────────┘
        │
        │ If balance > 0
        ▼
┌──────────────────────┐
│ Create withdrawal    │ ◀── POST /withdrawal/create
│ request              │     { jumlah, metode, account_details }
│ Status: 'menunggu'   │
└──────────────────────┘
        │
        │ Admin processes
        ▼
┌──────────────────────┐
│ Admin approval       │ ◀── PUT /withdrawal/:id/process
│ Transfer to bank     │
│ Status: 'selesai'    │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Update escrow        │ ◀── Mark as 'ditarik'
│ Send notification    │
└──────────────────────┘
```

### Withdrawal Database Schema
```sql
CREATE TABLE withdrawal (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  jumlah DECIMAL(10,2) NOT NULL,
  metode_penarikan VARCHAR(50), -- bank_transfer, e-wallet
  detail_rekening JSON, -- { bank_name, account_number, account_name }
  status ENUM('menunggu', 'diproses', 'selesai', 'dibatalkan'),
  admin_notes TEXT,
  diproses_oleh VARCHAR(36),
  diproses_pada DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Balance Calculation

**GET /api/payments/balance**
```javascript
async getBalance(req, res) {
  const userId = req.user.userId;

  // Get total dari escrow yang berstatus 'dirilis' (belum ditarik)
  const escrows = await Escrow.findAll({
    where: {
      freelancer_id: userId,
      status: 'dirilis'
    }
  });

  const available = escrows.reduce((sum, e) => sum + parseFloat(e.jumlah), 0);

  // Get pending withdrawals
  const pendingWithdrawals = await Withdrawal.findAll({
    where: {
      user_id: userId,
      status: ['menunggu', 'diproses']
    }
  });

  const pending = pendingWithdrawals.reduce((sum, w) => sum + parseFloat(w.jumlah), 0);

  return res.json({
    success: true,
    data: {
      available: available - pending,
      pending: pending,
      total: available
    }
  });
}
```

---

## Invoice Generation

### Invoice Service Architecture

**Components:**
1. **InvoiceService** - PDF generation using PDFKit
2. **EmailService** - Send invoice via email (optional)
3. **Storage** - Local file system at `/invoices/`

### Invoice Generation Trigger Points

```
Payment Success (Webhook)
        │
        ▼
┌──────────────────────┐
│ Generate Invoice     │ ◀── Auto-generate after payment success
│ INV-2025-XXXXX.pdf   │
└──────────────────────┘
        │
        ├── Store at: /invoices/INV-2025-XXXXX.pdf
        ├── Update payment record: invoice_url
        └── (Optional) Send email to client

Client/Freelancer Request
        │
        ▼
┌──────────────────────┐
│ GET /invoice/:id     │ ◀── Download invoice PDF
└──────────────────────┘
        │
        ├── Check if file exists
        ├── If not, generate on-the-fly
        └── Return PDF file

        ▼
┌──────────────────────┐
│ POST /invoice/:id/   │ ◀── Email invoice to address
│      send-email      │
└──────────────────────┘
```

### Invoice Content

**Invoice PDF includes:**
- Company logo & info (SkillConnect)
- Invoice number & date
- Bill To (Client name, email, phone)
- Payment details:
  - Order title & description
  - Base price
  - Platform fee (5%)
  - Payment gateway fee (1%)
  - **Total amount**
- Payment method & status
- Transaction ID
- Payment date
- Footer: Thank you message & contact info

### Invoice API Endpoints

**1. Download Invoice PDF**
```
GET /api/payments/invoice/:payment_id
Authorization: Bearer <token>

Response: PDF file
Content-Type: application/pdf
Content-Disposition: inline; filename=INV-2025-00001.pdf
```

**2. Send Invoice via Email**
```
POST /api/payments/invoice/:payment_id/send-email
Authorization: Bearer <token>

Request:
{
  "email": "client@example.com"
}

Response:
{
  "success": true,
  "message": "Invoice sent successfully to client@example.com"
}
```

### Known Issues ⚠️

**Current Status:** Invoice generation is experiencing timeout issues.

**Problem:** PDFKit hanging during PDF generation, possibly due to:
- Missing order/user data in generation call
- Large data payload
- Missing fonts or assets
- Synchronous operations blocking event loop

**Workaround:** Feature temporarily disabled. Needs investigation.

**Recommended Solutions:**
1. Use async/await properly in PDF generation
2. Switch to alternative library (puppeteer, html-pdf)
3. Use external service (DocRaptor, PDFShift)
4. Generate invoices as background job (Bull/Redis queue)

---

## Payment Analytics

### Available Analytics

**1. Client Spending Analytics**
```
GET /api/payments/analytics/client-spending?from=2025-01-01&to=2025-12-31
Authorization: Bearer <client-token>

Response:
{
  "success": true,
  "data": {
    "summary": {
      "total_spent": 15000000,
      "total_orders": 5,
      "completed_orders": 3,
      "success_rate": 60,
      "average_order_value": 3000000
    },
    "monthly_breakdown": [
      {
        "month": "2025-12",
        "orders": 3,
        "spent": 9000000
      }
    ]
  }
}
```

**2. Freelancer Earnings Analytics**
```
GET /api/payments/analytics/freelancer-earnings?from=2025-01-01&to=2025-12-31
Authorization: Bearer <freelancer-token>

Response:
{
  "success": true,
  "data": {
    "summary": {
      "total_earned": 28500000,
      "total_orders": 10,
      "completed_orders": 8,
      "average_order_value": 2850000,
      "escrow_balance": 5700000,
      "available_balance": 22800000
    },
    "monthly_breakdown": [
      {
        "month": "2025-12",
        "orders": 4,
        "earned": 11400000
      }
    ],
    "top_services": [
      {
        "service_name": "Website Development",
        "orders": 5,
        "revenue": 14250000
      }
    ]
  }
}
```

### Analytics SQL Queries

**Client Spending Query:**
```sql
SELECT
  COUNT(*) as total_orders,
  SUM(CASE WHEN p.status = 'berhasil' THEN 1 ELSE 0 END) as completed_orders,
  SUM(CASE WHEN p.status = 'berhasil' THEN p.total_bayar ELSE 0 END) as total_spent,
  COALESCE(SUM(r.jumlah_refund), 0) as total_refunded
FROM pembayaran p
LEFT JOIN refund r ON r.pembayaran_id = p.id AND r.status = 'completed'
WHERE p.user_id = ?
  AND p.created_at >= ?
  AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY);
```

**Monthly Breakdown Query:**
```sql
SELECT
  DATE_FORMAT(p.created_at, '%Y-%m') as month,
  COUNT(*) as orders,
  SUM(CASE WHEN p.status = 'berhasil' THEN p.total_bayar ELSE 0 END) as spent
FROM pembayaran p
WHERE p.user_id = ?
  AND p.created_at >= ?
  AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)
GROUP BY DATE_FORMAT(p.created_at, '%Y-%m')
ORDER BY month DESC;
```

---

## Error Handling

### Payment Error Scenarios

**1. Order Already Paid**
```
Status: 400 Bad Request
{
  "success": false,
  "message": "Order has already been paid"
}
```

**2. Payment Expired**
```
Status: 410 Gone
{
  "success": false,
  "message": "Payment has expired",
  "data": {
    "expired_at": "2025-12-02T18:00:00Z"
  }
}
```

**3. Insufficient Balance (Withdrawal)**
```
Status: 400 Bad Request
{
  "success": false,
  "message": "Insufficient balance",
  "data": {
    "requested": 10000000,
    "available": 5000000
  }
}
```

**4. Payment Gateway Error**
```
Status: 502 Bad Gateway
{
  "success": false,
  "message": "Payment gateway error",
  "errors": ["Connection timeout"]
}
```

**5. Unauthorized Access**
```
Status: 403 Forbidden
{
  "success": false,
  "message": "You don't have permission to access this payment"
}
```

### Error Logging

All payment errors are logged with context:
```javascript
console.error('[PAYMENT CONTROLLER] Error:', {
  method: 'createPayment',
  userId: req.user?.userId,
  orderId: req.body.orderId,
  error: error.message,
  stack: error.stack
});
```

---

## Database Schema

### Complete Payment Tables

**1. pembayaran (payments)**
```sql
CREATE TABLE pembayaran (
  id VARCHAR(36) PRIMARY KEY,
  pesanan_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  external_id VARCHAR(100),

  -- Amounts
  jumlah DECIMAL(10,2) NOT NULL,
  biaya_platform DECIMAL(10,2) DEFAULT 0,
  biaya_payment_gateway DECIMAL(10,2) DEFAULT 0,
  total_bayar DECIMAL(10,2) NOT NULL,

  -- Payment method
  metode_pembayaran VARCHAR(50),
  channel VARCHAR(50),
  payment_gateway VARCHAR(50) DEFAULT 'mock',
  payment_url TEXT,

  -- Status
  status ENUM('menunggu', 'berhasil', 'gagal', 'kadaluarsa') DEFAULT 'menunggu',

  -- Callback data
  callback_data JSON,
  callback_signature VARCHAR(255),

  -- Invoice
  nomor_invoice VARCHAR(50) UNIQUE,
  invoice_url TEXT,

  -- Timestamps
  dibayar_pada DATETIME,
  kadaluarsa_pada DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

**2. escrow**
```sql
CREATE TABLE escrow (
  id VARCHAR(36) PRIMARY KEY,
  pembayaran_id VARCHAR(36) NOT NULL,
  pesanan_id VARCHAR(36) NOT NULL,
  freelancer_id VARCHAR(36) NOT NULL,

  jumlah DECIMAL(10,2) NOT NULL,
  status ENUM('ditahan', 'dirilis', 'ditarik', 'dikembalikan') DEFAULT 'ditahan',

  tanggal_rilis DATETIME,
  dirilis_pada DATETIME,
  ditarik_pada DATETIME,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (pembayaran_id) REFERENCES pembayaran(id),
  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id),
  INDEX idx_freelancer_status (freelancer_id, status),
  INDEX idx_tanggal_rilis (tanggal_rilis)
);
```

**3. refund**
```sql
CREATE TABLE refund (
  id VARCHAR(36) PRIMARY KEY,
  pembayaran_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,

  alasan TEXT,
  jumlah_refund DECIMAL(10,2) NOT NULL,

  status ENUM('menunggu', 'approved', 'rejected', 'completed') DEFAULT 'menunggu',
  admin_notes TEXT,

  diproses_oleh VARCHAR(36),
  diproses_pada DATETIME,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (pembayaran_id) REFERENCES pembayaran(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (diproses_oleh) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_user_id (user_id)
);
```

**4. withdrawal**
```sql
CREATE TABLE withdrawal (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,

  jumlah DECIMAL(10,2) NOT NULL,
  metode_penarikan VARCHAR(50),
  detail_rekening JSON,

  status ENUM('menunggu', 'diproses', 'selesai', 'dibatalkan') DEFAULT 'menunggu',
  admin_notes TEXT,

  diproses_oleh VARCHAR(36),
  diproses_pada DATETIME,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (diproses_oleh) REFERENCES users(id),
  INDEX idx_user_status (user_id, status),
  INDEX idx_status (status)
);
```

---

## API Endpoints

### Complete Payment API Reference

#### Payment Creation & Verification
```
POST   /api/payments/create              - Create new payment
GET    /api/payments/status/:transactionId  - Check payment status
POST   /api/payments/webhook             - Payment gateway callback
POST   /api/payments/retry/:id           - Retry failed payment
```

#### Escrow Management
```
GET    /api/payments/escrow/:orderId     - Get escrow details
POST   /api/payments/escrow/release/:id  - Release escrow (admin/auto)
```

#### Refund
```
POST   /api/payments/refund/request      - Request refund
GET    /api/payments/refund/all          - List all refunds (admin)
GET    /api/payments/refund/:id          - Get refund details
PUT    /api/payments/refund/:id/process  - Approve/reject refund (admin)
```

#### Withdrawal
```
POST   /api/payments/withdrawal/create   - Create withdrawal request
GET    /api/payments/withdrawal/history  - Get withdrawal history
GET    /api/payments/withdrawal/:id      - Get withdrawal details
PUT    /api/payments/withdrawal/:id/process - Process withdrawal (admin)
```

#### Balance & Analytics
```
GET    /api/payments/balance             - Get user balance
GET    /api/payments/analytics/client-spending    - Client analytics
GET    /api/payments/analytics/freelancer-earnings - Freelancer analytics
```

#### Invoice
```
GET    /api/payments/invoice/:id         - Download invoice PDF
POST   /api/payments/invoice/:id/send-email - Email invoice
```

#### Admin
```
GET    /api/payments/admin/dashboard     - Admin dashboard stats
GET    /api/payments/admin/transactions  - All transactions
GET    /api/payments/admin/pending-refunds - Pending refunds
GET    /api/payments/admin/pending-withdrawals - Pending withdrawals
```

---

## Security Considerations

### 1. Authentication & Authorization
- All endpoints require JWT authentication
- Role-based access control (client, freelancer, admin)
- Validate user ownership of resources

### 2. Payment Gateway Security
- Signature validation for webhooks
- HTTPS only for payment URLs
- IP whitelist for webhook endpoints (production)

### 3. Data Protection
- Encrypt sensitive data (account numbers, etc.)
- PCI DSS compliance for card data (if applicable)
- Secure storage of payment credentials

### 4. Rate Limiting
```javascript
// Apply rate limiting to payment endpoints
const rateLimit = require('express-rate-limit');

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 payment attempts per window
  message: 'Too many payment attempts, please try again later'
});

router.post('/create', paymentLimiter, paymentController.createPayment);
```

### 5. Input Validation
- Validate all monetary amounts
- Sanitize user inputs
- Check business logic constraints

---

## Testing

### Test Scenarios

**1. Happy Path - Successful Payment**
```
1. Create order → status 'menunggu_pembayaran'
2. Create payment → redirect to gateway
3. Complete payment on gateway → webhook callback
4. Payment status → 'berhasil'
5. Order status → 'dibayar'
6. Escrow created → status 'ditahan'
7. Invoice generated
```

**2. Payment Expiry**
```
1. Create payment with expiry 24h
2. Don't complete payment
3. After 24h, webhook → status 'kadaluarsa'
4. Order remains 'menunggu_pembayaran'
```

**3. Refund Flow**
```
1. Complete payment successfully
2. Client requests refund
3. Admin approves refund
4. Escrow status → 'dikembalikan'
5. Funds returned to client
```

**4. Withdrawal Flow**
```
1. Escrow auto-released after 7 days
2. Freelancer checks balance → available
3. Request withdrawal
4. Admin processes → bank transfer
5. Escrow status → 'ditarik'
```

### Test Users

**Admin:**
- Email: admin@skillconnect.com
- Password: Admin@2024!

**Client:**
- Email: client1@example.com
- Password: Client@2024!

**Freelancer:**
- Email: freelancer1@example.com
- Password: Freelancer@2024!

---

## Monitoring & Logging

### Key Metrics to Monitor

1. **Payment Success Rate**
   - Target: > 95%
   - Alert if < 90%

2. **Average Payment Processing Time**
   - Target: < 5 seconds
   - Alert if > 10 seconds

3. **Webhook Response Time**
   - Target: < 2 seconds
   - Alert if > 5 seconds

4. **Failed Payments**
   - Alert on spike in failures

5. **Pending Refunds**
   - Alert if > 24h old

6. **Pending Withdrawals**
   - Alert if > 48h old

### Log Examples

**Payment Created:**
```
[INFO] [PAYMENT] Payment created
  transaction_id: TRX-12345
  user_id: uuid
  order_id: PES-2025-12345
  amount: 5830000
  method: bank_transfer
```

**Payment Success:**
```
[INFO] [PAYMENT] Payment successful
  transaction_id: TRX-12345
  payment_id: uuid
  order_id: PES-2025-12345
  escrow_created: true
  order_updated: true
```

**Payment Failed:**
```
[ERROR] [PAYMENT] Payment failed
  transaction_id: TRX-12345
  error: Gateway timeout
  retry_count: 1
```

---

## Deployment Checklist

### Before Production

- [ ] Switch from Mock Gateway to Real Gateway (Midtrans)
- [ ] Configure webhook URL with payment gateway
- [ ] Set up SSL certificate for webhook endpoint
- [ ] Configure IP whitelist for webhook
- [ ] Set up monitoring & alerting
- [ ] Test all payment flows with real gateway (sandbox mode)
- [ ] Backup database before deployment
- [ ] Configure cron job for escrow auto-release
- [ ] Set up email service for invoice delivery
- [ ] Review security configurations
- [ ] Load test payment endpoints
- [ ] Prepare rollback plan

### Environment Variables
```env
# Payment Gateway
PAYMENT_GATEWAY=midtrans
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_IS_PRODUCTION=false

# Fees
PLATFORM_FEE_PERCENTAGE=5
PAYMENT_GATEWAY_FEE_PERCENTAGE=1

# Escrow
ESCROW_HOLD_DAYS=7

# URLs
FRONTEND_URL=https://ppl.vinmedia.my.id
BACKEND_URL=https://api.ppl.vinmedia.my.id
PAYMENT_SUCCESS_URL=${FRONTEND_URL}/payment/success
PAYMENT_ERROR_URL=${FRONTEND_URL}/payment/error
WEBHOOK_URL=${BACKEND_URL}/api/payments/webhook

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@skillconnect.id
SMTP_PASS=your-app-password
```

---

## FAQs

**Q: Berapa lama dana ditahan di escrow?**
A: 7 hari sejak pembayaran berhasil. Setelah itu auto-release ke freelancer.

**Q: Bisakah client refund setelah escrow dirilis?**
A: Tidak. Refund hanya bisa dilakukan selama status escrow masih 'ditahan'.

**Q: Berapa fee yang dikenakan?**
A: Platform fee 5% + Payment gateway fee 1% dari harga order.

**Q: Apa yang terjadi jika payment expired?**
A: Order status tetap 'menunggu_pembayaran', client bisa create payment baru.

**Q: Bagaimana cara freelancer menarik dana?**
A: Cek balance di dashboard → Request withdrawal → Admin process → Dana masuk rekening.

**Q: Apakah invoice dikirim otomatis?**
A: Ya, setelah payment berhasil. Client juga bisa download dari order detail page.

---

## Change Log

### Version 1.0 - December 2, 2025
- Initial payment system implementation
- Payment analytics with SQL optimization
- Order status auto-update integration
- JWT token regeneration on role switch
- Escrow system with auto-release
- Refund & withdrawal workflows
- Invoice generation (with known timeout issue)
- Comprehensive error handling

---

## Contact & Support

**Development Team:**
- Email: dev@skillconnect.id
- Slack: #payment-module

**Issues & Bugs:**
- GitHub: https://github.com/Lisvindanu/PPL-C-2025/issues
- Label: `payment`

**Documentation:**
- Full Docs: `/docs/payment/`
- API Specs: `/docs/api/payments`

---

**Last Updated:** December 2, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready (except invoice generation)

