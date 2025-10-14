# Utils Folder

## 📋 Deskripsi
Folder ini berisi **helper functions & utility** yang dipakai oleh banyak modul.

## 📂 Utility yang Biasanya Ada

### `logger.js`
Logger utility untuk logging yang lebih baik dari `console.log`

```javascript
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

class Logger {
  info(message, ...args) {
    console.log(`${colors.blue}[INFO]${colors.reset}`, message, ...args);
  }

  success(message, ...args) {
    console.log(`${colors.green}[SUCCESS]${colors.reset}`, message, ...args);
  }

  error(message, ...args) {
    console.error(`${colors.red}[ERROR]${colors.reset}`, message, ...args);
  }

  warn(message, ...args) {
    console.warn(`${colors.yellow}[WARN]${colors.reset}`, message, ...args);
  }

  debug(message, ...args) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG]`, message, ...args);
    }
  }
}

module.exports = new Logger();
```

**Usage:**
```javascript
const logger = require('../../shared/utils/logger');

logger.info('Server started on port 5000');
logger.success('Payment successful');
logger.error('Database connection failed');
logger.warn('Token will expire soon');
```

---

### `generateId.js`
Generate unique ID (alternative dari UUID)

```javascript
const { v4: uuidv4 } = require('uuid');

const generateId = (prefix = '') => {
  const uuid = uuidv4();
  return prefix ? `${prefix}-${uuid}` : uuid;
};

const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TRX-${timestamp}-${random}`;
};

module.exports = {
  generateId,
  generateOrderId,
  generateTransactionId
};
```

**Usage:**
```javascript
const { generateOrderId, generateTransactionId } = require('../../shared/utils/generateId');

const orderId = generateOrderId(); // ORD-1705756800000-A3B2C1
const transactionId = generateTransactionId(); // TRX-1705756800000-X9Y8Z7
```

---

### `formatCurrency.js`
Format currency Rupiah

```javascript
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatCurrencyShort = (amount) => {
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}jt`;
  } else if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}rb`;
  }
  return `Rp ${amount}`;
};

module.exports = {
  formatCurrency,
  formatCurrencyShort
};
```

**Usage:**
```javascript
const { formatCurrency } = require('../../shared/utils/formatCurrency');

console.log(formatCurrency(250000)); // Rp 250.000
console.log(formatCurrencyShort(1500000)); // Rp 1.5jt
```

---

### `formatDate.js`
Format tanggal

```javascript
const formatDate = (date, format = 'full') => {
  const d = new Date(date);

  const formats = {
    full: d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    short: d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    time: d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    datetime: d.toLocaleString('id-ID'),
    iso: d.toISOString()
  };

  return formats[format] || formats.full;
};

const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days < 7) return `${days} hari yang lalu`;

  return formatDate(date, 'short');
};

module.exports = {
  formatDate,
  getRelativeTime
};
```

**Usage:**
```javascript
const { formatDate, getRelativeTime } = require('../../shared/utils/formatDate');

console.log(formatDate(new Date())); // 20 Januari 2025
console.log(getRelativeTime(new Date(Date.now() - 5 * 60 * 1000))); // 5 menit yang lalu
```

---

### `asyncHandler.js`
Wrapper untuk async route handlers (prevent try-catch di setiap controller)

```javascript
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
```

**Usage:**
```javascript
const asyncHandler = require('../../shared/utils/asyncHandler');

// Tanpa asyncHandler (harus try-catch manual)
router.get('/users', async (req, res) => {
  try {
    const users = await userService.getAll();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dengan asyncHandler (otomatis handle error)
router.get('/users', asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  res.json({ users });
}));
```

---

### `httpResponse.js`
Standardized HTTP response helper

```javascript
class HttpResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'Internal server error', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors })
    });
  }

  static created(res, data, message = 'Resource created') {
    return this.success(res, data, message, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static badRequest(res, message = 'Bad request', errors = null) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }
}

module.exports = HttpResponse;
```

**Usage:**
```javascript
const HttpResponse = require('../../shared/utils/httpResponse');

// Success
return HttpResponse.success(res, { user }, 'User retrieved successfully');

// Created
return HttpResponse.created(res, { userId }, 'User created successfully');

// Error
return HttpResponse.badRequest(res, 'Invalid input', [
  { field: 'email', message: 'Email is required' }
]);

return HttpResponse.notFound(res, 'User not found');
return HttpResponse.unauthorized(res);
```

---

### `validateEnv.js`
Validasi environment variables saat startup

```javascript
const validateEnv = () => {
  const required = [
    'PORT',
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
    'FRONTEND_URL'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('✅ All required environment variables are set');
};

module.exports = validateEnv;
```

**Usage di server.js:**
```javascript
require('dotenv').config();
const validateEnv = require('./shared/utils/validateEnv');

validateEnv(); // Validate sebelum start server

const app = express();
// ... rest of code
```

---

### `pagination.js`
Helper untuk pagination

```javascript
const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage
  };
};

module.exports = {
  getPaginationParams,
  getPaginationMeta
};
```

**Usage:**
```javascript
const { getPaginationParams, getPaginationMeta } = require('../../shared/utils/pagination');

// Di controller
const { page, limit, skip } = getPaginationParams(req.query);

const services = await Service.find().skip(skip).limit(limit);
const total = await Service.countDocuments();

const meta = getPaginationMeta(total, page, limit);

res.json({
  success: true,
  data: services,
  pagination: meta
});
```

---

## ✅ Kapan Pakai Shared Utils?
- Utility yang dipakai di **lebih dari 1 modul**
- Format currency, date, dll
- Logger
- HTTP response helpers
- Validation helpers

## ❌ Jangan Taruh di Sini
- Business logic (taruh di Domain Layer)
- Module-specific utilities (taruh di modul itu sendiri)

## 🎯 Module-Specific Utils

Kalau utility cuma dipakai di 1 modul, taruh di infrastructure modul tersebut:

```
modules/payment/infrastructure/services/
└── calculateFee.js  # Cuma payment yang pakai
```
