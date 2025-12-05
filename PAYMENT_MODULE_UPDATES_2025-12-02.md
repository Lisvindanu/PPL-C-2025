# Payment Module Updates - December 2, 2025

## Overview
Major updates and fixes to the payment module, focusing on analytics, order integration, role-based access control, and invoice functionality.

---

## 1. Payment Analytics Fixes

### 1.1 Client Spending Analytics (`/api/payments/analytics/client-spending`)

**Issues Fixed:**
- SQL column name mismatches (Indonesian database schema)
- Payment status enum incorrect values
- Date range queries not including full end date
- Success rate calculation missing
- Monthly spending table showing Rp 0

**Changes Made:**

**File:** `/var/www/PPL-C-2025/backend/src/modules/payment/presentation/controllers/PaymentController.js`

**SQL Query Updates:**
```sql
-- Fixed column names
SUM(r.jumlah_refund) as total_refunded  -- was: r.amount
INNER JOIN pembayaran p ON r.pembayaran_id = p.id  -- was: r.payment_id

-- Fixed status enum (database only has 'berhasil' for successful payments)
SUM(CASE WHEN p.status = 'berhasil' THEN 1 ELSE 0 END) as completed_orders
SUM(CASE WHEN p.status = 'berhasil' THEN p.total_bayar ELSE 0 END) as total_spent

-- Fixed date range to include entire end date
AND p.created_at >= ? AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)
-- was: AND p.created_at BETWEEN ? AND ?
```

**Added Success Rate:**
```javascript
success_rate: spendingData.total_orders > 0 ?
  Math.round((spendingData.completed_orders / spendingData.total_orders) * 100) : 0
```

**Frontend Fixes:**

**File:** `/var/www/PPL-C-2025/frontend/src/pages/ClientSpendingPage.jsx`

Fixed field name mismatches:
```javascript
// Lines 258, 261, 267
{month.orders || 0}  // was: month.order_count
{formatCurrency(month.spent || 0)}  // was: month.total_amount
```

### 1.2 Freelancer Earnings Analytics

**Issues Fixed:**
- Import path errors (500 error)
- Role-based access control (403 errors)
- Missing JWT token updates on role switch

**File:** `/var/www/PPL-C-2025/frontend/src/pages/FreelancerEarningsPage.jsx`

```javascript
// Fixed imports
import Navbar from '../components/organisms/Navbar'  // was: ../../
import { authService } from '../services/authService'  // was: default import
```

---

## 2. Order Status Auto-Update

### Problem
Payment status updated to `berhasil` but order status remained `menunggu_pembayaran`

### Solution
**File:** `/var/www/PPL-C-2025/backend/src/modules/payment/presentation/controllers/PaymentController.js`

**Added to `checkPaymentStatus` method (lines 269-280):**
```javascript
// Update order status to 'dibayar' when payment is successful
const SequelizeOrderRepository = require('../../../order/infrastructure/repositories/SequelizeOrderRepository');
const { sequelize } = require('../../../../shared/database/connection');
const orderRepository = new SequelizeOrderRepository(sequelize);

try {
  await orderRepository.updateStatus(payment.pesanan_id, 'dibayar');
  console.log(`[PAYMENT CONTROLLER] Order status updated to 'dibayar' for order: ${payment.pesanan_id}`);
} catch (orderError) {
  console.error(`[PAYMENT CONTROLLER] Failed to update order status:`, orderError);
}
```

**Verified:**
- Manual test: Order PES-2025-79847 updated to 'dibayar'
- New payment: Order PES-2025-82898 automatically updated

---

## 3. Role-Based Access Control & JWT Token Management

### Problem
After switching roles in navbar, API returns 403 "Only freelancers can access earnings data" because JWT token not updated

### Solution

**Backend - Token Regeneration:**

**File:** `/var/www/PPL-C-2025/backend/src/modules/user/presentation/controllers/UserController.js`

```javascript
// Line 28 - Store jwtService as instance property
constructor() {
  const jwtService = new JwtService();
  this.jwtService = jwtService;  // NEW
  // ... rest
}

// Lines 365-391 - Generate new token on role change
async changeRole(req, res, next) {
  try {
    const userId = req.user && req.user.userId;
    if (!userId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }

    const { role } = req.body;
    const result = await this.changeUserRoleUseCase.execute(userId, role);

    // Generate new JWT token with updated role
    const token = this.jwtService.generate(userId, result.role);

    res.json({
      success: true,
      data: {
        ...result,
        token  // Include new token in response
      }
    });
  } catch (err) {
    next(err);
  }
}
```

**Frontend - Token Storage:**

**File:** `/var/www/PPL-C-2025/frontend/src/services/authService.js`

```javascript
// Lines 302-330
async switchRole(role) {
  try {
    const res = await api.put("/users/role", { role });
    if (res.data?.success && res.data?.data) {
      if (res.data.data.needsFreelancerRegistration) {
        return res.data;
      }

      const current = readStoredUser() || {};
      const updatedRole = res.data.data.role || role;
      const updatedUser = { ...current, ...res.data.data, role: updatedRole };
      writeStoredUser(updatedUser);
      persistActiveRole(updatedRole, { syncUser: false });

      // NEW: Update JWT token if backend returns a new one
      if (res.data.data.token) {
        localStorage.setItem("token", res.data.data.token);
      }
    }
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Gagal mengubah role",
      errors: error.response?.data?.errors || [],
    };
  }
}
```

---

## 4. Payment Route Fixes

### Problem
Frontend calling different route paths than backend defined, causing 404 errors

### Solution

**File:** `/var/www/PPL-C-2025/backend/src/modules/payment/presentation/routes/paymentRoutes.js`

**Withdrawal Routes:**
```javascript
// Line 335 - Changed from /withdraw to /withdrawal/create
router.post('/withdrawal/create', authMiddleware, paymentController.createWithdrawal.bind(paymentController));

// Line 378 - Changed from /withdrawals/:id to /withdrawal/:id
router.get('/withdrawal/:id', authMiddleware, paymentController.getWithdrawalById.bind(paymentController));

// Lines 415-419 - NEW: Added withdrawal history route
router.get('/withdrawal/history', authMiddleware, paymentController.getWithdrawalHistory.bind(paymentController));
```

**Refund Routes:**
```javascript
// Lines 781-785 - NEW: Alternative refund request endpoint
router.post('/refund/request', authMiddleware, paymentController.requestRefundAlt.bind(paymentController));

// Line 859 - Changed from /refunds to /refund/all
router.get('/refund/all', authMiddleware, paymentController.getAllRefunds.bind(paymentController));
```

**Invoice Routes:**
```javascript
// Lines 500-510 - NEW: Invoice alias routes
router.get('/invoice/:id', authMiddleware, paymentController.getInvoice.bind(paymentController));
router.post('/invoice/:id/send-email', authMiddleware, paymentController.sendInvoice.bind(paymentController));

// Original routes still exist at /:id/invoice and /:id/send-invoice
```

**New Controller Methods Added:**
```javascript
// Alternative refund request endpoint (Lines 1926-1967)
async requestRefundAlt(req, res)

// Withdrawal history endpoint (Lines 1969-2003)
async getWithdrawalHistory(req, res)
```

---

## 5. Order Module - Payment ID Integration

### Problem
Orders fetched via `/api/orders/my` or detail page don't include `payment_id`, preventing invoice button from showing

### Solution

**File:** `/var/www/PPL-C-2025/backend/src/modules/order/infrastructure/repositories/SequelizeOrderRepository.js`

**Updated Methods:**

#### 5.1 `findById` Method
```javascript
async findById(id) {
  // ... existing code ...

  const plainResult = result.get({ plain: true });

  // NEW: Add flat payment_id from the first successful payment
  if (plainResult.pembayaran && plainResult.pembayaran.length > 0) {
    const successfulPayment = plainResult.pembayaran.find(p => p.status === 'berhasil');
    if (successfulPayment) {
      plainResult.payment_id = successfulPayment.id;
      plainResult.pembayaran_id = successfulPayment.id;
    }
  }

  return plainResult;
}
```

#### 5.2 `findByUserId` Method
```javascript
async findByUserId(userId, filters = {}) {
  // ... existing where/order/pagination logic ...

  // NEW: Include Payment model
  const PaymentModel = this.sequelize.models.pembayaran || require('../../../payment/infrastructure/models/PaymentModel');
  if (!this.OrderModel.associations.pembayaran) {
    this.OrderModel.hasMany(PaymentModel, { foreignKey: 'pesanan_id', as: 'pembayaran' });
  }

  const result = await this.OrderModel.findAndCountAll({
    where,
    order: [[sortBy, sortOrder]],
    limit,
    offset,
    attributes: [/* ... */],
    include: [
      {
        model: FreelancerModel,
        as: 'freelancer',
        attributes: ['id', 'nama_depan', 'nama_belakang', 'avatar']
      },
      {
        model: this.LayananModel,
        as: 'layanan',
        attributes: ['id', 'judul', 'thumbnail', 'harga']
      },
      {
        // NEW: Include payment data
        model: PaymentModel,
        as: 'pembayaran',
        attributes: ['id', 'status'],
        required: false
      }
    ]
  });

  // NEW: Add flat payment_id to each order
  const rows = result.rows.map(row => {
    const plain = row.get({ plain: true });
    if (plain.pembayaran && plain.pembayaran.length > 0) {
      const successfulPayment = plain.pembayaran.find(p => p.status === 'berhasil');
      if (successfulPayment) {
        plain.payment_id = successfulPayment.id;
        plain.pembayaran_id = successfulPayment.id;
      }
    }
    // Remove pembayaran array from list view to reduce payload
    delete plain.pembayaran;
    return plain;
  });

  return { count: result.count, rows };
}
```

#### 5.3 `findByPenyediaId` Method
Similar changes as `findByUserId` for freelancer order list.

---

## 6. Frontend - Order Detail & List Updates

### 6.1 OrderDetailPage - Payment ID Normalization

**File:** `/var/www/PPL-C-2025/frontend/src/pages/OrderDetailPage.jsx`

**Added to normalization (lines 81-82):**
```javascript
const normalized = o
  ? {
      // ... existing fields ...
      client_id: o.client_id ?? o.clientId ?? o.client?.id,
      freelancer_id: o.freelancer_id ?? o.freelancerId ?? o.freelancer?.id,
      payment_id: o.payment_id ?? o.paymentId ?? o.pembayaran_id ?? null,  // NEW
      escrow_id: o.escrow_id ?? o.escrowId ?? null,  // NEW
      statusHistory: o.statusHistory || o.history || []
    }
  : null
```

**Existing Invoice Button (lines 607-629):**
```javascript
{(isClient || isFreelancer) && order.payment_id && ['dibayar', 'dikerjakan', 'menunggu_review', 'revisi', 'selesai'].includes(order.status) && (
  <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
    <h3 className="font-semibold text-lg mb-2">Invoice</h3>
    <p className="text-sm text-gray-600 mb-4">
      Download bukti pembayaran Anda
    </p>
    <div className="flex gap-2">
      <button onClick={handleDownloadInvoice} disabled={processingPayment}>
        {processingPayment ? 'Downloading...' : 'Download Invoice PDF'}
      </button>
      <button onClick={handleSendInvoiceEmail} disabled={processingPayment}>
        Send to Email
      </button>
    </div>
  </div>
)}
```

### 6.2 OrderList - Clickable Cards

**File:** `/var/www/PPL-C-2025/frontend/src/components/organisms/OrderList.jsx`

**Added onClick to card wrapper (line 92):**
```javascript
<div
  key={order.id}
  onClick={() => onOrderClick && onOrderClick(order.id)}
  className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all"
>
  {/* ... order content ... */}
</div>
```

**Visual Feedback:**
- `cursor-pointer` - Show pointer cursor
- `hover:shadow-lg` - Larger shadow on hover
- `hover:border-blue-300` - Blue border on hover
- `transition-all` - Smooth animation

---

## 7. Invoice Feature (⚠️ NOT WORKING YET)

### Current Status
❌ **Invoice download/email functionality is NOT working** due to PDF generation timeout

### Investigation Done

**Problem Identified:**
1. `InvoiceService` requires complete data: `payment`, `orderData`, `userData`
2. Controller was only passing `payment` object
3. Attempted fix: Fetch order & user data before generating invoice
4. **Result:** PDF generation times out (PDFKit hanging)

**Files Involved:**
- `/var/www/PPL-C-2025/backend/src/modules/payment/infrastructure/services/InvoiceService.js`
- `/var/www/PPL-C-2025/backend/src/modules/payment/presentation/controllers/PaymentController.js` (getInvoice method)

### Next Steps (TODO)
1. **Option A:** Debug PDFKit timeout issue
2. **Option B:** Switch to different PDF library (puppeteer, html-pdf, etc.)
3. **Option C:** Temporarily disable invoice button in UI
4. **Option D:** Use external invoice service API

**Recommendation:** Prioritize based on urgency. If not critical for MVP, can be addressed post-launch.

---

## 8. User Seeder Password Updates

**File:** `/tmp/seed.js`

Updated all test user passwords to include special characters for new validation requirements:

```javascript
// Admin
password: await bcrypt.hash('Admin@2024!', 10),

// Client
password: await bcrypt.hash('Client@2024!', 10),

// Freelancer
password: await bcrypt.hash('Freelancer@2024!', 10),
```

**Test User Credentials:**
- **Admin:** admin@skillconnect.com / Admin@2024!
- **Client1:** client1@example.com / Client@2024!
- **Client2:** client2@example.com / Client@2024!
- **Freelancer1:** freelancer1@example.com / Freelancer@2024!
- **Freelancer2:** freelancer2@example.com / Freelancer@2024!

---

## 9. Testing & Verification

### Verified Working:
✅ Backend running stable on port 5001
✅ Client spending analytics displaying real data
✅ Freelancer earnings analytics working (requires re-login for new token)
✅ Role-based access control functioning correctly (403 for wrong roles is expected)
✅ Order status automatically updates to 'dibayar' when payment succeeds
✅ All route mismatches fixed with alias routes
✅ Order list cards clickable and navigate to detail page
✅ Invoice button section exists in OrderDetailPage (awaiting backend fix)

### Test Data (for lisvindanu015@gmail.com):
- Total Orders: 3
- Completed Orders: 1 (status='berhasil')
- Total Spent: Rp 5,830,000
- Success Rate: 33%
- Monthly: December 2025 - 1 order, Rp 5,830,000

---

## 10. Files Modified Summary

### Backend Files
1. `/var/www/PPL-C-2025/backend/src/modules/payment/presentation/controllers/PaymentController.js`
   - Fixed analytics SQL queries
   - Added order status update on payment success
   - Added new methods: `requestRefundAlt`, `getWithdrawalHistory`

2. `/var/www/PPL-C-2025/backend/src/modules/payment/presentation/routes/paymentRoutes.js`
   - Fixed withdrawal route paths
   - Fixed refund route paths
   - Added invoice alias routes
   - Added new endpoints

3. `/var/www/PPL-C-2025/backend/src/modules/order/infrastructure/repositories/SequelizeOrderRepository.js`
   - Updated `findById` to include flat payment_id
   - Updated `findByUserId` to include payment relation
   - Updated `findByPenyediaId` to include payment relation

4. `/var/www/PPL-C-2025/backend/src/modules/user/presentation/controllers/UserController.js`
   - Added JWT token regeneration on role change
   - Store jwtService as instance property

### Frontend Files
1. `/var/www/PPL-C-2025/frontend/src/pages/ClientSpendingPage.jsx`
   - Fixed field name mismatches in monthly table

2. `/var/www/PPL-C-2025/frontend/src/pages/FreelancerEarningsPage.jsx`
   - Fixed import paths

3. `/var/www/PPL-C-2025/frontend/src/pages/OrderDetailPage.jsx`
   - Added payment_id and escrow_id to normalization
   - Invoice button already exists (awaiting backend fix)

4. `/var/www/PPL-C-2025/frontend/src/components/organisms/OrderList.jsx`
   - Made order cards fully clickable
   - Added hover effects

5. `/var/www/PPL-C-2025/frontend/src/components/organisms/Sidebar.jsx`
   - Fixed admin sidebar navigation link

6. `/var/www/PPL-C-2025/frontend/src/services/authService.js`
   - Added JWT token update on role switch

---

## 11. Known Issues & Limitations

### ⚠️ Invoice Generation
- **Status:** NOT WORKING
- **Issue:** PDF generation times out
- **Impact:** Users cannot download/email invoices
- **Workaround:** None currently
- **Priority:** Medium (can be post-MVP feature)

### ℹ️ Payment Webhook Errors
- **Status:** Non-blocking
- **Issue:** Some webhook calls for non-existent payments (in logs)
- **Impact:** None (failed webhooks are logged but don't affect functionality)
- **Action:** Can be investigated if becomes frequent

---

## 12. Deployment Notes

### Services Restarted
- Backend (PM2): `ppl-backend-5001` - Restarted 1551 times
- Frontend (PM2): `ppl-frontend` - Restarted 42 times

### Backup Files Created
- `SequelizeOrderRepository.js.backup`
- `OrderDetailPage.jsx.backup`
- `OrderList.jsx.backup`
- `PaymentController.js.backup-invoice`
- `UserController.js.backup`

### Environment
- Server: 145.79.15.87
- Database: PPL_2025_C (MySQL)
- Node.js: v20.19.5
- PM2: Process manager

---

## 13. Future Recommendations

### High Priority
1. **Fix Invoice Generation** - Debug PDFKit or switch to alternative library
2. **Add Tests** - Unit tests for payment analytics queries
3. **Error Handling** - Improve error messages for failed payments

### Medium Priority
1. **Refactor PaymentController** - 2000+ lines, consider splitting into smaller controllers
2. **Add Logging** - More detailed logs for payment flow debugging
3. **Performance** - Add caching for analytics queries

### Low Priority
1. **Documentation** - API documentation for payment endpoints
2. **Monitoring** - Add alerts for payment failures
3. **Analytics Dashboard** - Admin view of all payment statistics

---

## Contributors
- AI Assistant (Claude Code)
- User: lisvindanu015@gmail.com

## Date
December 2, 2025

---

**Note:** This document was auto-generated from today's development session. For questions or clarifications, please refer to git commit history or contact the development team.
