# Payment Gateway Module - Complete Guide

## 📋 Overview

Modul Payment Gateway dengan **Mock Payment System** dan **Escrow** untuk marketplace SkillConnect. Sistem ini mengelola pembayaran, menahan dana (escrow), dan withdrawal freelancer dengan flow yang mirip Fiverr/Upwork.

**Tech Stack:**
- Node.js + Express
- MySQL + Sequelize ORM
- Domain-Driven Design (DDD)
- Mock Payment Gateway (development)

**Key Features:**
- ✅ Mock Payment Gateway (QRIS, VA, E-Wallet, Transfer Bank, Kartu Kredit)
- ✅ Escrow System (hold payment selama 7 hari)
- ✅ Auto-release escrow after approval
- ✅ Withdrawal system untuk freelancer
- ✅ Complete payment flow simulation

---

## 🎯 Software Requirements Specification (SRS)

### Functional Requirements

**FR-1: Payment Creation**
- User dapat membuat pembayaran dengan berbagai metode
- Sistem generate transaction ID unik
- Sistem calculate platform fee (5%) dan gateway fee (1%)
- Sistem create payment URL untuk redirect
- Payment expire dalam 24 jam

**FR-2: Payment Verification**
- Sistem menerima webhook dari payment gateway
- Sistem verify signature webhook
- Sistem update status pembayaran otomatis
- Sistem create escrow setelah payment berhasil

**FR-3: Escrow Management**
- Sistem hold payment di escrow setelah payment berhasil
- Escrow auto-release setelah 7 hari dari approval
- Client dapat release escrow manual (approve work)
- Sistem dapat refund escrow (jika dispute)

**FR-4: Withdrawal/Payout**
- Freelancer dapat withdraw setelah escrow released
- Sistem calculate platform fee (5%) dari withdrawal
- Sistem support transfer bank dan e-wallet
- Admin dapat approve/reject withdrawal (production)
- Mock mode: auto-process withdrawal

**FR-5: Payment Methods Support**
- QRIS (scan QR code)
- Virtual Account (BCA, BNI, Mandiri, BRI, Permata)
- E-Wallet (GoPay, OVO, DANA, LinkAja)
- Transfer Bank (manual)
- Kartu Kredit/Debit

### Non-Functional Requirements

**NFR-1: Security**
- Webhook signature verification
- HTTPS only for production
- No credit card data stored (PCI-DSS compliance)

**NFR-2: Performance**
- Payment creation < 500ms
- Webhook processing < 1s
- Support 100 concurrent payments

**NFR-3: Reliability**
- Transaction idempotency (no duplicate payments)
- Auto-retry failed webhooks
- Audit trail semua transactions

**NFR-4: Scalability**
- Horizontal scaling ready
- Database indexing on transaction_id, status
- Caching payment status

---

## 📊 System Architecture

### DDD Structure

```
payment/
├── domain/                    # Business logic & entities
│   └── entities/
│       ├── Payment.js        # Payment entity dengan validasi
│       ├── Escrow.js         # Escrow entity dengan auto-release logic
│       └── Withdrawal.js     # Withdrawal entity dengan fee calculation
│
├── application/              # Use cases (business operations)
│   └── use-cases/
│       ├── CreatePayment.js        # Create payment + integrate gateway
│       ├── VerifyPayment.js        # Process webhook + create escrow
│       ├── ReleaseEscrow.js        # Release funds to freelancer
│       └── WithdrawFunds.js        # Freelancer withdrawal
│
├── infrastructure/           # External integrations
│   ├── models/
│   │   ├── PaymentModel.js         # Sequelize model pembayaran
│   │   ├── EscrowModel.js          # Sequelize model escrow
│   │   └── WithdrawalModel.js      # Sequelize model pencairan_dana
│   │
│   └── services/
│       ├── MockPaymentGatewayService.js  # Mock gateway
│       ├── EscrowService.js              # Escrow operations
│       └── WithdrawalService.js          # Withdrawal operations
│
└── presentation/             # HTTP layer
    ├── controllers/
    │   └── PaymentController.js    # Request handlers
    └── routes/
        └── paymentRoutes.js        # Endpoint definitions
```

---

## 🔄 Payment Flow Diagrams

### 1. Complete Payment Flow (End-to-End)

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

### 2. Payment Status Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          PAYMENT STATUS FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

    [menunggu]
        │
        ├──> (webhook: settlement) ──> [berhasil] ──> Create Escrow
        │
        ├──> (webhook: deny) ──> [gagal]
        │
        └──> (24 hours) ──> [kadaluarsa]
```

---

### 3. Escrow Status Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ESCROW STATUS FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

                            [held]
                              │
                ┌─────────────┼─────────────┬──────────────┐
                │             │             │              │
                │             │             │              │
         (client approve) (7 days)    (dispute)      (order cancel)
                │             │             │              │
                ▼             ▼             ▼              ▼
          [released]    [released]   [disputed]      [refunded]
                │             │             │
                │             │             │
          (withdrawal)  (auto-release) (admin decision)
                │             │             │
                ▼             ▼             ├──> [partial_released]
          [completed]   [completed]         │
                                            └──> [refunded]
```

---

### 4. Order Status Integration

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ORDER STATUS vs PAYMENT/ESCROW                        │
└─────────────────────────────────────────────────────────────────────────┘

Order Status              Payment Status       Escrow Status
─────────────────────────────────────────────────────────────────────
menunggu_pembayaran  →    menunggu            -
dibayar              →    berhasil            held
dikerjakan           →    berhasil            held
menunggu_review      →    berhasil            held
selesai              →    berhasil            released/completed
dispute              →    berhasil            disputed
dibatalkan           →    gagal/kadaluarsa    -
refunded             →    berhasil            refunded
```

---

## 💰 Fee Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            FEE CALCULATION                               │
└─────────────────────────────────────────────────────────────────────────┘

Example: Order Rp 250,000

CLIENT PAYMENT:
─────────────────
Harga Order:              Rp 250,000
Platform Fee (5%):        Rp  12,500
Gateway Fee (1%):         Rp   2,500
                          ──────────
TOTAL BAYAR:              Rp 265,000
                          ══════════

ESCROW (Held):
─────────────────
Jumlah Ditahan:           Rp 250,000
Platform Fee:             Rp  12,500
                          ──────────
Net to Freelancer:        Rp 237,500

WITHDRAWAL (Freelancer):
─────────────────
Gross Amount:             Rp 250,000
Platform Fee (5%):        Rp  12,500
                          ──────────
NET RECEIVED:             Rp 237,500
                          ══════════
```

---

## 🔌 API Endpoints

### Payment Endpoints

#### 1. Create Payment
```http
POST /api/payments/create
Content-Type: application/json

{
  "pesanan_id": "uuid-order",
  "user_id": "uuid-client",
  "jumlah": 250000,
  "metode_pembayaran": "qris",
  "channel": "QRIS"
}

Response 201:
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "payment_id": "uuid",
    "transaction_id": "PAY-1234567890-ABC123",
    "payment_url": "http://localhost:5001/mock-payment/MOCK-xxx",
    "total_bayar": 265000,
    "status": "menunggu",
    "expires_at": "2025-10-18T15:00:00Z",
    "payment_instructions": {
      "type": "QRIS",
      "title": "Scan QR Code",
      "steps": ["Buka app", "Scan QR", "Bayar"],
      "qr_url": "http://..."
    }
  }
}
```

#### 2. Webhook (Payment Gateway Callback)
```http
POST /api/payments/webhook
Content-Type: application/json

{
  "transaction_id": "PAY-1234567890-ABC123",
  "transaction_status": "settlement",
  "gross_amount": "265000",
  "signature": "sha256-hash"
}

Response 200:
{
  "success": true,
  "transaction_id": "PAY-1234567890-ABC123",
  "status": "berhasil",
  "message": "Webhook processed successfully"
}
```

#### 3. Get Payment Details
```http
GET /api/payments/:id

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "transaction_id": "PAY-xxx",
    "jumlah": 250000,
    "total_bayar": 265000,
    "status": "berhasil",
    "metode_pembayaran": "qris",
    "payment_gateway": "mock",
    "nomor_invoice": "INV/2025/10/ABC123",
    "dibayar_pada": "2025-10-17T10:00:00Z"
  }
}
```

### Escrow Endpoints

#### 4. Release Escrow (Client Approve)
```http
POST /api/payments/escrow/release
Content-Type: application/json

{
  "escrow_id": "uuid",
  "user_id": "uuid-client",
  "reason": "Work approved"
}

Response 200:
{
  "success": true,
  "message": "Escrow released successfully",
  "data": {
    "escrow_id": "uuid",
    "status": "released",
    "jumlah_ditahan": 250000,
    "biaya_platform": 12500,
    "jumlah_bersih": 237500,
    "dirilis_pada": "2025-10-17T10:00:00Z"
  }
}
```

#### 5. Get Escrow Details
```http
GET /api/payments/escrow/:id

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "pembayaran_id": "uuid",
    "pesanan_id": "uuid",
    "jumlah_ditahan": 250000,
    "status": "held",
    "ditahan_pada": "2025-10-17T10:00:00Z",
    "akan_dirilis_pada": "2025-10-24T10:00:00Z"
  }
}
```

### Withdrawal Endpoints

#### 6. Create Withdrawal (Freelancer)
```http
POST /api/payments/withdraw
Content-Type: application/json

{
  "escrow_id": "uuid",
  "freelancer_id": "uuid",
  "metode_pencairan": "transfer_bank",
  "nomor_rekening": "1234567890",
  "nama_pemilik": "John Doe"
}

Response 201:
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
    "dicairkan_pada": "2025-10-17T10:00:00Z"
  }
}
```

#### 7. Get Withdrawal Details
```http
GET /api/payments/withdrawals/:id

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "escrow_id": "uuid",
    "freelancer_id": "uuid",
    "jumlah": 250000,
    "jumlah_bersih": 237500,
    "status": "completed",
    "bukti_transfer": "url"
  }
}
```

### Testing Endpoints (Development Only)

#### 8. Mock Trigger Payment Success
```http
POST /api/payments/mock/trigger-success
Content-Type: application/json

{
  "transaction_id": "PAY-1234567890-ABC123"
}

Response 200:
{
  "success": true,
  "message": "Payment success triggered",
  "data": {
    "transaction_id": "PAY-xxx",
    "status": "berhasil"
  }
}
```

#### 9. Mock Trigger Payment Failure
```http
POST /api/payments/mock/trigger-failure
Content-Type: application/json

{
  "transaction_id": "PAY-1234567890-ABC123",
  "reason": "Insufficient balance"
}

Response 200:
{
  "success": true,
  "message": "Payment failure triggered",
  "data": {
    "transaction_id": "PAY-xxx",
    "status": "gagal",
    "reason": "Insufficient balance"
  }
}
```

---

## 🧪 Testing Guide

### 1. Setup Test Data

```bash
# Create test users, kategori, layanan, pesanan
mysql -u root -ppassword ppl-2025-c <<EOF
INSERT INTO users (id, email, password, role, nama_depan) VALUES
('client-uuid', 'client@test.com', 'hashed', 'client', 'Test Client'),
('freelancer-uuid', 'freelancer@test.com', 'hashed', 'freelancer', 'Test Freelancer');

INSERT INTO kategori (id, nama, slug) VALUES
('kategori-uuid', 'Web Development', 'web-dev');

INSERT INTO layanan (id, freelancer_id, kategori_id, judul, slug, deskripsi, harga, waktu_pengerjaan) VALUES
('layanan-uuid', 'freelancer-uuid', 'kategori-uuid', 'Website Dev', 'website', 'Test', 500000, 7);

INSERT INTO pesanan (id, nomor_pesanan, client_id, freelancer_id, layanan_id, judul, harga, total_bayar, waktu_pengerjaan, status) VALUES
('order-uuid', 'ORD-001', 'client-uuid', 'freelancer-uuid', 'layanan-uuid', 'Test Order', 250000, 250000, 7, 'menunggu_pembayaran');
EOF
```

### 2. Test Payment Flow

```bash
# 1. Create payment
curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "pesanan_id": "order-uuid",
    "user_id": "client-uuid",
    "jumlah": 250000,
    "metode_pembayaran": "qris"
  }' | jq

# Save transaction_id from response

# 2. Trigger payment success (mock)
curl -X POST http://localhost:5001/api/payments/mock/trigger-success \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "PAY-xxx-xxx"
  }' | jq

# 3. Check escrow created
curl http://localhost:5001/api/payments/escrow/{escrow_id} | jq

# 4. Release escrow
curl -X POST http://localhost:5001/api/payments/escrow/release \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "escrow-uuid",
    "user_id": "client-uuid"
  }' | jq

# 5. Withdrawal
curl -X POST http://localhost:5001/api/payments/withdraw \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_id": "escrow-uuid",
    "freelancer_id": "freelancer-uuid",
    "metode_pencairan": "transfer_bank",
    "nomor_rekening": "1234567890",
    "nama_pemilik": "John Doe"
  }' | jq
```

---

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=5001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ppl-2025-c
DB_USER=root
DB_PASSWORD=password

# Mock Payment Gateway
MOCK_AUTO_SUCCESS=true           # Auto-trigger payment success after 3s
MOCK_AUTO_WITHDRAWAL=true        # Auto-process withdrawal
MOCK_PAYMENT_SECRET=mock-secret  # Signature secret
BACKEND_URL=http://localhost:5001
```

---

## 📝 Integration Points

### With Other Modules

**Order Module:**
- Update order status after payment success
- Update order status after escrow release
- Handle order cancellation refunds

**Notification Module:**
- Send notification to freelancer after payment success
- Send notification to client after withdrawal
- Send notification on escrow auto-release

**User Module:**
- Validate user authorization for payments
- Update freelancer balance/earnings
- Track payment history per user

**Admin Module:**
- Approve/reject withdrawals (production)
- View payment analytics
- Handle dispute resolution

---

## 🚀 Deployment Notes

### Production Checklist

- [ ] Replace mock gateway dengan Midtrans/Xendit real
- [ ] Setup webhook URL di payment gateway dashboard
- [ ] Configure signature verification keys
- [ ] Enable HTTPS only
- [ ] Setup CRON job untuk auto-release escrow
- [ ] Setup retry mechanism untuk failed webhooks
- [ ] Enable rate limiting on endpoints
- [ ] Setup monitoring & alerts
- [ ] Database backup strategy
- [ ] Load testing (100+ concurrent payments)

### Security Considerations

- Always verify webhook signatures
- Use HTTPS in production
- Never log sensitive data (card numbers, etc)
- Implement idempotency keys
- Rate limit payment creation
- Audit trail all transactions
- PCI-DSS compliance if storing card data

---

## 📚 References

- [Sequelize Documentation](https://sequelize.org/)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [Midtrans API Docs](https://docs.midtrans.com/)
- [Xendit API Docs](https://developers.xendit.co/)
- [Payment Flow Best Practices](https://stripe.com/docs/payments)

---

**Modul dibuat oleh:** Team Payment Gateway
**Last Updated:** October 2025
**Status:** ✅ Ready for Development Testing
