# Mock Payment Gateway UI

**Tampilan mock payment gateway mirip Midtrans/Xendit untuk development testing.**

---

## 🎯 Features

- ✅ Payment method selection (QRIS, VA, E-Wallet, Credit Card)
- ✅ QR Code display untuk QRIS
- ✅ Virtual Account number display
- ✅ Countdown timer (24 jam expiry)
- ✅ Auto payment simulation (3 detik)
- ✅ Success/Failed screens
- ✅ Auto trigger webhook ke backend
- ✅ Responsive design
- ✅ Pure HTML/CSS/JS (no framework)

---

## 🔗 Access URL

```
http://localhost:5001/mock-payment/?transaction_id=PAY-xxx&order_id=ORD-001&amount=250000&total=265000
```

### URL Parameters:

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `transaction_id` | No | Transaction ID dari backend | `PAY-1234567890-ABC123` |
| `order_id` | No | Order ID | `ORD-001` |
| `amount` | No | Jumlah order (sebelum fee) | `250000` |
| `total` | No | Total payment (after fee) | `265000` |

**Note:** Semua parameters optional, akan auto-generate jika tidak ada.

---

## 💳 Supported Payment Methods

### 1. QRIS
- Scan QR code dengan e-wallet app
- Auto success setelah 3 detik

### 2. Virtual Account
- Display VA number yang bisa di-copy
- Auto success setelah 3 detik
- Format: `8808 1234 5678 9012`

### 3. E-Wallet
- GoPay, OVO, DANA, ShopeePay
- Langsung redirect ke loading → success
- Processing: 2 detik

### 4. Credit Card
- Visa, Mastercard, JCB
- Langsung redirect ke loading → success
- Processing: 2 detik

---

## 🔄 Payment Flow

```
1. User select payment method
   ↓
2. Click "Pay Now"
   ↓
3. Show payment instructions (QR/VA/Loading)
   ↓
4. Auto simulate payment (3 seconds)
   ↓
5. Show loading screen
   ↓
6. Trigger webhook to backend
   ↓
7. Show success/failed screen
   ↓
8. Auto redirect to frontend (3 seconds)
```

---

## 🎨 UI Components

### Header
- Gradient background (purple)
- Title: "Mock Payment Gateway"
- Subtitle: "SkillConnect Development"

### Payment Info Card
- Transaction ID
- Order ID
- Amount
- Total Payment

### Timer
- Countdown dari 24 jam
- Warning style (yellow background)
- Auto expire jika habis

### Payment Method Cards
- Icon + Name + Description
- Radio button selection
- Hover effects
- Selected state (blue border)

### Payment Instructions
- **QRIS:** QR code icon + scanning instruction
- **VA:** VA number + copy button
- **Loading:** Spinner animation
- **Success:** Green checkmark + success message
- **Failed:** Red X + retry button

---

## 🔧 Technical Details

### JavaScript Functions:

```javascript
// Initialize page dengan URL params
init()

// Select payment method
selectMethod(method)

// Process payment (show QR/VA/loading)
processPayment()

// Simulate payment (auto success 80%, fail 20%)
simulatePayment()

// Show success screen + trigger webhook
showSuccess()

// Show failed screen
showFailed()

// Trigger webhook ke backend
triggerWebhook(status)

// Copy VA number to clipboard
copyVA()

// Retry payment
retryPayment()

// Redirect back to frontend
redirectBack()
```

### Webhook Payload:

```json
{
  "transaction_id": "PAY-1234567890-ABC123",
  "transaction_status": "settlement", // or "deny"
  "gross_amount": "265000",
  "signature": "mock-signature-1234567890"
}
```

**Webhook URL:** `http://localhost:5001/api/payments/webhook`

---

## 🧪 Testing Scenarios

### Scenario 1: QRIS Payment Success
```bash
# 1. Open browser
open http://localhost:5001/mock-payment/?transaction_id=PAY-TEST-001&amount=100000&total=106000

# 2. Select "QRIS"
# 3. Click "Pay Now"
# 4. Wait 3 seconds → Success
# 5. Check backend logs for webhook
```

### Scenario 2: Virtual Account Payment
```bash
# 1. Open browser
open http://localhost:5001/mock-payment/?transaction_id=PAY-TEST-002&amount=250000&total=265000

# 2. Select "Virtual Account"
# 3. Click "Pay Now"
# 4. Copy VA number (8808 1234 5678 9012)
# 5. Wait 3 seconds → Success
```

### Scenario 3: E-Wallet Payment
```bash
# 1. Open browser
open http://localhost:5001/mock-payment/?transaction_id=PAY-TEST-003&amount=50000&total=53000

# 2. Select "E-Wallet"
# 3. Click "Pay Now"
# 4. Loading 2 seconds → Success
```

### Scenario 4: Payment Expired
```bash
# Change countdown to 5 seconds (edit HTML)
# Wait 5 seconds → Expired alert → Redirect
```

---

## 🎯 Integration dengan Backend

### 1. Create Payment Endpoint

Backend harus return payment_url yang mengarah ke mock payment:

```javascript
// CreatePayment.js
const paymentUrl = `${process.env.BACKEND_URL}/mock-payment/?transaction_id=${transactionId}&order_id=${orderId}&amount=${amount}&total=${totalAmount}`;
```

### 2. Webhook Endpoint

Backend harus handle webhook dari mock payment:

```javascript
// POST /api/payments/webhook
{
  transaction_id: "PAY-xxx",
  transaction_status: "settlement",
  gross_amount: "265000",
  signature: "mock-signature-xxx"
}
```

### 3. Redirect URL

Setelah payment success/failed, user akan di-redirect ke:

```
http://localhost:3000/orders
```

Edit di line 667 di `index.html` untuk custom redirect URL.

---

## 🎨 Customization

### Change Colors

Edit CSS variables di `<style>` tag:

```css
/* Primary color (purple gradient) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Success color (green) */
background: #28a745;

/* Failed color (red) */
background: #dc3545;
```

### Change Payment Success Rate

Edit di `simulatePayment()` function:

```javascript
// Current: 80% success, 20% fail
if (Math.random() < 0.8) {
  showSuccess();
}

// Change to 100% success:
if (Math.random() < 1.0) {
  showSuccess();
}
```

### Change Auto-redirect Timer

Edit di `showSuccess()` function:

```javascript
// Current: 3 seconds
setTimeout(() => {
  redirectBack();
}, 3000);

// Change to 5 seconds:
setTimeout(() => {
  redirectBack();
}, 5000);
```

---

## 📱 Screenshots

### Payment Selection
```
┌─────────────────────────────────┐
│ 🔒 Mock Payment Gateway         │
│ SkillConnect Development        │
├─────────────────────────────────┤
│ Transaction ID: PAY-xxx         │
│ Order: ORD-001                  │
│ Amount: Rp 250,000              │
│ Total Payment: Rp 265,000       │
│                                 │
│ ⏱️ Expires in: 23:59:59         │
│                                 │
│ Select Payment Method           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📱 QRIS                   ○ │ │
│ │ Scan QR with any e-wallet   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🏦 Virtual Account        ○ │ │
│ │ BCA, BNI, Mandiri, BRI      │ │
│ └─────────────────────────────┘ │
│                                 │
│ [ Pay Now ]                     │
└─────────────────────────────────┘
```

### Success Screen
```
┌─────────────────────────────────┐
│ 🔒 Mock Payment Gateway         │
│ SkillConnect Development        │
├─────────────────────────────────┤
│                                 │
│          ┌───────┐              │
│          │   ✓   │              │
│          └───────┘              │
│                                 │
│    Payment Successful!          │
│                                 │
│ Your payment has been processed │
│ You will be redirected shortly  │
│                                 │
│ [ Back to SkillConnect ]        │
└─────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Issue: Payment URL tidak bisa diakses

**Solution:**
```bash
# Make sure backend server running
cd backend
npm start

# Check if static files served
curl http://localhost:5001/mock-payment/

# Should return HTML content
```

### Issue: Webhook tidak triggered

**Solution:**
```bash
# Check backend URL di .env
BACKEND_URL=http://localhost:5001

# Check console logs di browser
# Open DevTools → Console → Check for errors

# Check backend logs
# Should see webhook POST request
```

### Issue: Redirect tidak jalan

**Solution:**
```html
<!-- Edit redirectBack() function di index.html -->
<script>
function redirectBack() {
  // Change this URL to your frontend
  window.location.href = 'http://localhost:3000/orders';
}
</script>
```

---

## 📝 Notes

- This is **DEVELOPMENT ONLY** mock payment gateway
- Real payment gateway (Midtrans/Xendit) akan replace ini di production
- Webhook signature belum di-verify (mock mode)
- Success rate random 80% untuk testing failed scenarios
- Timer countdown adalah simulasi (tidak real-time sync dengan backend)

---

**Created by:** Backend Team
**Last Updated:** October 20, 2025
**Status:** ✅ Ready for Testing
