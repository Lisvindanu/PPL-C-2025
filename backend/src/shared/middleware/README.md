# Middleware Folder

## 📋 Deskripsi
Folder ini berisi **middleware global** yang dipakai oleh banyak modul.

## 📂 Middleware yang Biasanya Ada

### `authMiddleware.js`
Middleware untuk autentikasi JWT

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;
```

**Usage di Routes:**
```javascript
const authMiddleware = require('../../shared/middleware/authMiddleware');

router.get('/profile', authMiddleware, userController.getProfile);
```

---

### `errorHandler.js`
Global error handler middleware

```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
};

module.exports = errorHandler;
```

**Usage di server.js:**
```javascript
const errorHandler = require('./shared/middleware/errorHandler');

// ... routes

app.use(errorHandler); // Harus di akhir setelah semua routes
```

---

### `rateLimiter.js`
Rate limiting untuk prevent spam/abuse

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = limiter;
```

**Usage:**
```javascript
const rateLimiter = require('../../shared/middleware/rateLimiter');

app.use('/api/', rateLimiter);
```

---

### `roleMiddleware.js`
Middleware untuk cek role user (admin, freelancer, client)

```javascript
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
```

**Usage:**
```javascript
const roleMiddleware = require('../../shared/middleware/roleMiddleware');
const authMiddleware = require('../../shared/middleware/authMiddleware');

// Only admin can access
router.get('/admin/users',
  authMiddleware,
  roleMiddleware('admin'),
  adminController.getUsers
);

// Freelancer or admin
router.post('/services',
  authMiddleware,
  roleMiddleware('freelancer', 'admin'),
  serviceController.create
);
```

---

### `validateRequest.js`
Middleware untuk validasi request body dengan Joi

```javascript
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false // Return all errors
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    next();
  };
};

module.exports = validateRequest;
```

**Usage:**
```javascript
const validateRequest = require('../../shared/middleware/validateRequest');
const Joi = require('joi');

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required()
});

router.post('/register',
  validateRequest(createUserSchema),
  userController.register
);
```

---

### `logger.js`
Middleware untuk logging requests

```javascript
const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = logger;
```

---

## ✅ Kapan Pakai Shared Middleware?
- Middleware yang dipakai di **lebih dari 1 modul**
- Authentication, authorization
- Error handling global
- Rate limiting
- Logging
- Request validation

## ❌ Jangan Taruh di Sini
- Middleware yang **cuma dipakai 1 modul** (taruh di `presentation/middlewares/` modul tersebut)
- Business logic (sudah ada di use cases)

## 🎯 Module-Specific Middleware

Kalau middleware cuma dipakai di 1 modul, taruh di modul itu:

```
modules/payment/presentation/middlewares/
└── validatePaymentMethod.js  # Cuma payment yang pakai
```

**Example:**
```javascript
// modules/payment/presentation/middlewares/validatePaymentMethod.js
const validatePaymentMethod = (req, res, next) => {
  const validMethods = ['bank_transfer', 'e_wallet', 'credit_card', 'qris'];

  if (!validMethods.includes(req.body.method)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment method'
    });
  }

  next();
};

module.exports = validatePaymentMethod;
```
