# Midtrans Integration Guide

## Overview
Integrasi Midtrans Payment Gateway untuk SkillConnect menggunakan **Midtrans Snap** yang mendukung berbagai metode pembayaran dalam satu interface.

---

## Credentials (Sandbox)

```env
MIDTRANS_SERVER_KEY=SB-Mid-server-5FHTcUDCpZq1g8TIgjgbas-4
MIDTRANS_CLIENT_KEY=SB-Mid-client-sySq1i7cCIQnCtxH
MIDTRANS_MERCHANT_ID=G799521996
MIDTRANS_IS_PRODUCTION=false
PAYMENT_GATEWAY=midtrans
```

---

## Supported Payment Methods

Midtrans Snap mendukung semua payment methods yang ada di sistem:

1. **QRIS** - Scan QR untuk semua e-wallet
2. **Virtual Account** - BCA, BNI, BRI, Mandiri, Permata
3. **E-Wallet** - GoPay, ShopeePay
4. **Kartu Kredit/Debit** - Visa, MasterCard, JCB
5. **Transfer Bank** - Via Virtual Account

---

## Payment Flow

### 1. Client Request Payment
```javascript
POST /api/payments/create
{
  "pesanan_id": "order-123",
  "user_id": "user-456",
  "jumlah": 250000,
  "metode_pembayaran": "qris",
  "customer_email": "customer@example.com",
  "customer_name": "John Doe",
  "order_title": "Website Development"
}
```

### 2. System Creates Transaction
- Calculate fees (platform 5%, gateway 1%)
- Generate transaction ID: `PAY-{timestamp}-{random}`
- Call Midtrans Snap API
- Return payment URL

### 3. Customer Pays
- Redirect customer to `payment_url`
- Customer chooses payment method di Snap interface
- Customer completes payment

### 4. Midtrans Sends Notification
```
POST /api/payments/webhook
{
  "order_id": "PAY-1234567890-ABC123",
  "transaction_status": "settlement",
  "gross_amount": "262500",
  "signature_key": "...",
  ...
}
```

### 5. System Verifies & Updates
- Verify signature
- Update payment status
- Create escrow (hold funds)
- Send notification to user

---

## Escrow System

**Important**: Midtrans tidak support escrow secara native. Kita implement escrow di sistem internal:

1. **Payment Success** → Dana masuk ke merchant account Midtrans
2. **Create Escrow** → System hold dana di database (tabel `escrow`)
3. **Order Completed** → Freelancer request withdrawal
4. **Release Funds** → Admin approve, dana transfer ke freelancer

### Escrow Flow
```
Customer Payment (Midtrans)
    ↓
Merchant Account
    ↓
System Creates Escrow (7 days hold)
    ↓
Order Completed
    ↓
Freelancer Request Withdrawal
    ↓
Admin Approve
    ↓
Transfer to Freelancer (Manual/API)
```

---

## Testing with Sandbox

### Test Credit Card
```
Card Number: 4811 1111 1111 1114
CVV: 123
Exp: 01/25
OTP: 112233
```

### Test Virtual Account
- Pilih bank (BCA/BNI/BRI/Mandiri)
- Copy VA number
- Simulate payment di [Midtrans Simulator](https://simulator.sandbox.midtrans.com)

### Test E-Wallet
- GoPay akan redirect ke halaman simulasi
- Click "Pay" untuk simulate success

---

## Webhook Configuration

### Midtrans Dashboard Setup
1. Login ke [Midtrans Dashboard](https://dashboard.sandbox.midtrans.com)
2. Settings → Configuration → Notification URL
3. Set: `https://your-backend-url.com/api/payments/webhook`
4. Enable: HTTP notification

### Signature Verification
```javascript
// Automatically handled by MidtransService
const hash = SHA512(order_id + status_code + gross_amount + server_key)
// Compare with signature_key from webhook
```

---

## Environment Variable

```env
# Switch between mock and midtrans
PAYMENT_GATEWAY=midtrans  # Use 'mock' for local testing

# Midtrans credentials
MIDTRANS_SERVER_KEY=SB-Mid-server-5FHTcUDCpZq1g8TIgjgbas-4
MIDTRANS_CLIENT_KEY=SB-Mid-client-sySq1i7cCIQnCtxH
MIDTRANS_MERCHANT_ID=G799521996
MIDTRANS_IS_PRODUCTION=false

# Frontend callback URLs
FRONTEND_URL=http://localhost:3000
```

---

## API Endpoints

### Create Payment
```bash
curl -X POST http://localhost:5001/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pesanan_id": "order-123",
    "user_id": "user-456",
    "jumlah": 250000,
    "metode_pembayaran": "qris",
    "customer_email": "customer@example.com",
    "customer_name": "John Doe"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "payment_id": "uuid-123",
    "transaction_id": "PAY-1234567890-ABC123",
    "payment_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/...",
    "total_bayar": 262500,
    "status": "menunggu",
    "expires_at": "2025-01-21T10:00:00Z"
  }
}
```

### Webhook Handler
```bash
# This is called by Midtrans, not by client
POST http://localhost:5001/api/payments/webhook
```

### Check Payment Status
```bash
curl -X GET http://localhost:5001/api/payments/{transaction_id}/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Frontend Integration

### Redirect to Payment
```javascript
// After create payment API call
const response = await createPayment(paymentData);
window.location.href = response.data.payment_url;
```

### Handle Callback
```javascript
// pages/payment/success.tsx
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('order_id');
  const statusCode = urlParams.get('status_code');
  
  if (statusCode === '200') {
    // Payment success
    checkPaymentStatus(orderId);
  }
}, []);
```

---

## Troubleshooting

### Payment URL tidak terbuat
- Check MIDTRANS_SERVER_KEY valid
- Check internet connection
- Check Midtrans sandbox status

### Webhook tidak diterima
- Check webhook URL accessible dari internet (use ngrok for local)
- Check Midtrans dashboard notification settings
- Check firewall settings

### Signature verification failed
- Check MIDTRANS_SERVER_KEY sama dengan dashboard
- Check webhook data format

---

## Production Checklist

- [ ] Update credentials to production keys
- [ ] Set `MIDTRANS_IS_PRODUCTION=true`
- [ ] Set `PAYMENT_GATEWAY=midtrans`
- [ ] Configure production webhook URL
- [ ] Test all payment methods
- [ ] Setup monitoring & logging
- [ ] Configure proper error handling
- [ ] Setup email notifications
- [ ] Test escrow & withdrawal flow

---

## Additional Resources

- [Midtrans Docs](https://docs.midtrans.com)
- [Snap API](https://snap-docs.midtrans.com)
- [Sandbox Dashboard](https://dashboard.sandbox.midtrans.com)
- [Simulator](https://simulator.sandbox.midtrans.com)
