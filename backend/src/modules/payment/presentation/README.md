# Presentation Layer - Payment Module

## 📌 Apa itu Presentation Layer?

**Presentation Layer** adalah layer yang berhadapan langsung dengan **user/client**. Layer ini handle HTTP requests dan responses.

Layer ini **memanggil Use Cases** dari Application Layer.

## 📂 Struktur Folder

```
presentation/
├── controllers/
│   ├── PaymentController.js           # Controller untuk payment endpoints
│   └── WebhookController.js           # Controller untuk webhook
├── routes/
│   └── paymentRoutes.js               # Definisi routes
├── middlewares/
│   ├── authMiddleware.js              # Middleware autentikasi
│   └── validateRequest.js             # Middleware validasi request
└── validators/
    └── paymentValidators.js           # Schema validasi dengan Joi/Yup
```

## 🎮 Controllers

**Controller** bertugas:
1. Extract data dari request
2. Validasi input
3. Panggil Use Case
4. Format response

### Contoh: `PaymentController.js`

```javascript
const CreatePayment = require('../../application/use-cases/CreatePayment');
const GetPaymentHistory = require('../../application/use-cases/GetPaymentHistory');
const CreatePaymentDto = require('../../application/dtos/CreatePaymentDto');

class PaymentController {
  constructor(dependencies) {
    this.createPayment = dependencies.createPayment;
    this.getPaymentHistory = dependencies.getPaymentHistory;
  }

  /**
   * POST /api/payments/create
   * Membuat transaksi pembayaran baru
   */
  async create(req, res) {
    try {
      // 1. Extract data dari request
      const dto = new CreatePaymentDto({
        orderId: req.body.orderId,
        userId: req.user.id, // Dari JWT token
        amount: req.body.amount,
        method: req.body.method
      });

      // 2. Validasi DTO
      dto.validate();

      // 3. Execute use case
      const result = await this.createPayment.execute(dto);

      // 4. Return response
      return res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/history
   * Ambil riwayat pembayaran user
   */
  async getHistory(req, res) {
    try {
      const userId = req.user.id;
      const filters = {
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await this.getPaymentHistory.execute(userId, filters);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/:id
   * Get payment detail by ID
   */
  async getById(req, res) {
    try {
      const paymentId = req.params.id;
      const payment = await this.paymentRepository.findById(paymentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: PaymentResponseDto.fromEntity(payment)
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = PaymentController;
```

### Contoh: `WebhookController.js`

```javascript
const VerifyPayment = require('../../application/use-cases/VerifyPayment');

class WebhookController {
  constructor(dependencies) {
    this.verifyPayment = dependencies.verifyPayment;
  }

  /**
   * POST /api/payments/webhook
   * Receive notification dari payment gateway
   */
  async handleWebhook(req, res) {
    try {
      // 1. Extract webhook data
      const webhookData = req.body;

      // 2. Execute use case untuk verify payment
      await this.verifyPayment.execute(webhookData);

      // 3. Return response (penting: payment gateway butuh response 200)
      return res.status(200).json({
        success: true,
        message: 'Webhook received'
      });
    } catch (error) {
      console.error('Webhook error:', error);

      // Tetap return 200 agar payment gateway tidak retry
      return res.status(200).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = WebhookController;
```

## 🛣️ Routes

**Routes** mendefinisikan endpoint dan middleware.

### Contoh: `paymentRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateCreatePayment } = require('../validators/paymentValidators');

// Import controllers (akan di-inject saat setup)
module.exports = (paymentController, webhookController) => {
  /**
   * @route   POST /api/payments/create
   * @desc    Create new payment
   * @access  Private (butuh auth)
   */
  router.post(
    '/create',
    authMiddleware,
    validateCreatePayment,
    (req, res) => paymentController.create(req, res)
  );

  /**
   * @route   GET /api/payments/history
   * @desc    Get payment history
   * @access  Private
   */
  router.get(
    '/history',
    authMiddleware,
    (req, res) => paymentController.getHistory(req, res)
  );

  /**
   * @route   GET /api/payments/:id
   * @desc    Get payment by ID
   * @access  Private
   */
  router.get(
    '/:id',
    authMiddleware,
    (req, res) => paymentController.getById(req, res)
  );

  /**
   * @route   POST /api/payments/webhook
   * @desc    Receive webhook dari payment gateway
   * @access  Public (tapi butuh signature validation)
   */
  router.post(
    '/webhook',
    (req, res) => webhookController.handleWebhook(req, res)
  );

  /**
   * @route   GET /api/payments/earnings
   * @desc    Get freelancer earnings
   * @access  Private (freelancer only)
   */
  router.get(
    '/earnings',
    authMiddleware,
    (req, res) => paymentController.getEarnings(req, res)
  );

  /**
   * @route   POST /api/payments/export
   * @desc    Export transaction report
   * @access  Private (admin only)
   */
  router.post(
    '/export',
    authMiddleware,
    (req, res) => paymentController.exportReport(req, res)
  );

  return router;
};
```

## 🛡️ Middleware

### Auth Middleware

```javascript
// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // 1. Get token dari header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user ke request
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = authMiddleware;
```

## ✅ Validators

### Contoh: `paymentValidators.js`

```javascript
const Joi = require('joi');

const createPaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  amount: Joi.number().min(1000).required(),
  method: Joi.string()
    .valid('bank_transfer', 'e_wallet', 'credit_card', 'qris')
    .required()
});

const validateCreatePayment = (req, res, next) => {
  const { error } = createPaymentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateCreatePayment
};
```

## 🔗 Dependency Injection Setup

```javascript
// Contoh di app.js atau server.js
const express = require('express');
const app = express();

// Infrastructure
const MongoPaymentRepository = require('./infrastructure/repositories/MongoPaymentRepository');
const MidtransGateway = require('./infrastructure/payment-gateways/MidtransGateway');

// Application
const CreatePayment = require('./application/use-cases/CreatePayment');
const VerifyPayment = require('./application/use-cases/VerifyPayment');
const GetPaymentHistory = require('./application/use-cases/GetPaymentHistory');

// Presentation
const PaymentController = require('./presentation/controllers/PaymentController');
const WebhookController = require('./presentation/controllers/WebhookController');
const paymentRoutes = require('./presentation/routes/paymentRoutes');

// Setup dependencies
const paymentRepository = new MongoPaymentRepository();
const paymentGateway = new MidtransGateway();

const createPayment = new CreatePayment(paymentRepository, paymentGateway);
const verifyPayment = new VerifyPayment(paymentRepository, paymentGateway);
const getPaymentHistory = new GetPaymentHistory(paymentRepository);

const paymentController = new PaymentController({
  createPayment,
  getPaymentHistory
});

const webhookController = new WebhookController({
  verifyPayment
});

// Register routes
app.use('/api/payments', paymentRoutes(paymentController, webhookController));
```

## 📊 Response Format Standard

### Success Response
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "paymentId": "uuid",
    "transactionId": "TRX-12345",
    "paymentUrl": "https://payment.gateway.com/xxx"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Order tidak ditemukan",
  "errors": []
}
```

## ✅ Prinsip Presentation Layer

1. **Thin Controllers** - Controller hanya handle HTTP, logic ada di Use Case
2. **Validation** - Validasi input sebelum masuk Use Case
3. **Error Handling** - Catch error dan return proper HTTP status code
4. **Response Format** - Konsisten untuk semua endpoint
5. **Middleware** - Reusable logic (auth, validation, logging)

## 🚀 Testing Controller

```javascript
const request = require('supertest');
const app = require('../app');

describe('Payment API', () => {
  it('should create payment', async () => {
    const response = await request(app)
      .post('/api/payments/create')
      .set('Authorization', 'Bearer <token>')
      .send({
        orderId: '123',
        amount: 100000,
        method: 'bank_transfer'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

## 📝 Summary Flow

```
HTTP Request
     ↓
  Route
     ↓
Middleware (Auth, Validation)
     ↓
Controller (Extract data)
     ↓
Use Case (Business Logic)
     ↓
Controller (Format response)
     ↓
HTTP Response
```

Backend dengan DDD pattern udah siap! 🚀
