# Utils - Helper Functions

## 📌 Apa itu Utils?

**Utils** adalah koleksi **pure functions** yang bersifat **reusable** dan **stateless**. Utils membantu mengurangi code duplication dengan menyediakan helper functions untuk operasi umum seperti formatting, validation, dan manipulation.

## 📂 Struktur Folder

```
utils/
├── dateUtils.js          # Date formatting & manipulation
├── currencyUtils.js      # Currency formatting
├── validationUtils.js    # Form validation helpers
├── stringUtils.js        # String manipulation
├── arrayUtils.js         # Array helpers
├── fileUtils.js          # File upload/download helpers
└── constants.js          # App constants
```

## 🧱 Contoh Implementasi

### dateUtils.js
```javascript
/**
 * Format date to readable string
 * @param {Date|string} date
 * @param {string} format - 'short' | 'long' | 'time'
 * @returns {string}
 */
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);

  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    time: { hour: '2-digit', minute: '2-digit' },
  };

  return new Intl.DateTimeFormat('id-ID', options[format]).format(d);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(date);
};

/**
 * Calculate days between two dates
 */
export const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
};

/**
 * Add days to date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
```

**Usage:**
```javascript
import { formatDate, getRelativeTime } from '../utils/dateUtils';

<p>{formatDate(order.createdAt, 'long')}</p>
// Output: "Senin, 20 Januari 2025"

<span>{getRelativeTime(message.createdAt)}</span>
// Output: "2 hours ago"
```

---

### currencyUtils.js
```javascript
/**
 * Format number to Indonesian Rupiah
 */
export const formatCurrency = (amount, options = {}) => {
  const {
    currency = 'IDR',
    showSymbol = true,
    minimumFractionDigits = 0,
  } = options;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits,
  }).format(amount);
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (currencyString) => {
  return parseFloat(currencyString.replace(/[^0-9.-]+/g, ''));
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(2);
};

/**
 * Calculate discount
 */
export const calculateDiscount = (originalPrice, discountPercent) => {
  const discount = (originalPrice * discountPercent) / 100;
  return {
    discount,
    finalPrice: originalPrice - discount,
  };
};
```

**Usage:**
```javascript
import { formatCurrency, calculateDiscount } from '../utils/currencyUtils';

<p className="text-2xl font-bold">
  {formatCurrency(250000)}
</p>
// Output: "Rp 250.000"

const { finalPrice, discount } = calculateDiscount(300000, 10);
// finalPrice: 270000, discount: 30000
```

---

### validationUtils.js
```javascript
/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate password strength
 * Rules: min 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export const isValidPassword = (password) => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return {
    isValid: minLength && hasUppercase && hasLowercase && hasNumber,
    errors: {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
    },
  };
};

/**
 * Validate phone number (Indonesian format)
 */
export const isValidPhoneNumber = (phone) => {
  const regex = /^(\+62|62|0)[0-9]{9,12}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate file size
 */
export const isValidFileSize = (file, maxSizeMB = 5) => {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
  return file.size <= maxSize;
};

/**
 * Validate file type
 */
export const isValidFileType = (file, allowedTypes = []) => {
  return allowedTypes.includes(file.type);
};

/**
 * Generic form validator
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = values[field];

    if (rule.required && !value) {
      errors[field] = `${field} is required`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }

    if (rule.email && !isValidEmail(value)) {
      errors[field] = 'Invalid email format';
    }

    if (rule.custom && !rule.custom(value)) {
      errors[field] = rule.message;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

**Usage:**
```javascript
import { isValidEmail, isValidPassword } from '../utils/validationUtils';

const handleSubmit = () => {
  if (!isValidEmail(email)) {
    setError('Invalid email format');
    return;
  }

  const { isValid, errors } = isValidPassword(password);
  if (!isValid) {
    setPasswordErrors(errors);
    return;
  }
};
```

---

### stringUtils.js
```javascript
/**
 * Truncate string with ellipsis
 */
export const truncate = (str, maxLength) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert to title case
 */
export const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generate slug from string
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Remove HTML tags
 */
export const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
```

**Usage:**
```javascript
import { truncate, getInitials } from '../utils/stringUtils';

<p>{truncate(service.description, 100)}</p>
// "This is a long description that will be truncated..."

<div className="avatar">
  {user.avatar ? (
    <img src={user.avatar} alt={user.name} />
  ) : (
    <span>{getInitials(user.name)}</span>
  )}
</div>
// Shows "JD" for "John Doe"
```

---

### arrayUtils.js
```javascript
/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Sort array by key
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });
};

/**
 * Remove duplicates
 */
export const unique = (array) => {
  return [...new Set(array)];
};

/**
 * Chunk array into smaller arrays
 */
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Shuffle array
 */
export const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
```

---

### fileUtils.js
```javascript
/**
 * Convert file to base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Download file from URL
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};
```

---

### constants.js
```javascript
// Order statuses
export const ORDER_STATUS = {
  PENDING: 'menunggu',
  ACCEPTED: 'diterima',
  REJECTED: 'ditolak',
  IN_PROGRESS: 'dikerjakan',
  DELIVERED: 'dikirim',
  COMPLETED: 'selesai',
  CANCELLED: 'dibatalkan',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'menunggu',
  SUCCESS: 'berhasil',
  FAILED: 'gagal',
  EXPIRED: 'kadaluarsa',
};

// User roles
export const USER_ROLES = {
  CLIENT: 'client',
  FREELANCER: 'freelancer',
  ADMIN: 'admin',
};

// Payment methods
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'transfer_bank',
  E_WALLET: 'e_wallet',
  CREDIT_CARD: 'kartu_kredit',
  QRIS: 'qris',
  VIRTUAL_ACCOUNT: 'virtual_account',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    PROFILE: '/users/profile',
  },
  SERVICES: {
    LIST: '/services',
    DETAIL: '/services/:id',
    CREATE: '/services',
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: '/orders/:id',
  },
};

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};
```

---

## ✅ Utils Best Practices

1. **Pure Functions** - No side effects, same input = same output
2. **Single Responsibility** - Each function does one thing
3. **Descriptive Names** - Function name explains what it does
4. **Type Safety** - Use JSDoc or TypeScript for type hints
5. **Unit Testable** - Easy to test in isolation

## 📦 Export Pattern

`utils/index.js`:
```javascript
export * from './dateUtils';
export * from './currencyUtils';
export * from './validationUtils';
export * from './stringUtils';
export * from './arrayUtils';
export * from './fileUtils';
export * from './constants';
```

**Usage:**
```javascript
import {
  formatDate,
  formatCurrency,
  isValidEmail,
  truncate,
  ORDER_STATUS,
} from '../utils';

<p>{formatDate(order.createdAt)}</p>
<p>{formatCurrency(order.amount)}</p>
<Badge variant={order.status === ORDER_STATUS.COMPLETED ? 'success' : 'warning'}>
  {order.status}
</Badge>
```

## 🎯 Common Utility Patterns

### Error Handler
```javascript
export const handleError = (error) => {
  if (error.response) {
    // API error
    return error.response.data.message;
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection';
  } else {
    // Other errors
    return error.message || 'An unexpected error occurred';
  }
};
```

### Local Storage Wrapper
```javascript
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
};
```

## 🚀 Testing Utils

Utils are easy to test because they're pure functions:

```javascript
import { formatCurrency, isValidEmail } from '../utils';

test('formatCurrency formats number correctly', () => {
  expect(formatCurrency(250000)).toBe('Rp 250.000');
});

test('isValidEmail validates email correctly', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
  expect(isValidEmail('invalid-email')).toBe(false);
});
```
