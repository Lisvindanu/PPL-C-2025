# Config Folder

## 📋 Deskripsi
Folder ini berisi **konfigurasi global** yang dipakai oleh semua modul.

## 📂 File yang Biasanya Ada

### `database.js`
Konfigurasi koneksi database MySQL

**Note**: Koneksi database sudah ada di `shared/database/connection.js`. File ini optional untuk konfigurasi tambahan.

```javascript
// Optional: Database config constants
module.exports = {
  dialect: 'mysql',
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    min: parseInt(process.env.DB_POOL_MIN) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE) || 10000
  },
  logging: process.env.NODE_ENV === 'development'
};
```

### `env.js`
Validasi environment variables

```javascript
const requiredEnvVars = [
  'PORT',
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET',
  'MIDTRANS_SERVER_KEY'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

module.exports = {
  port: process.env.PORT,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT || 'mysql'
  },
  jwtSecret: process.env.JWT_SECRET,
  midtransServerKey: process.env.MIDTRANS_SERVER_KEY
};
```

### `cors.js`
Konfigurasi CORS

```javascript
module.exports = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

## ✅ Kapan Pakai Config?
- Konfigurasi yang **sama untuk semua modul**
- Environment variables
- Database connection
- Third-party service setup (Midtrans, SendGrid, AWS S3)

## ❌ Jangan Taruh di Sini
- Business logic
- Utility functions (taruh di `shared/utils/`)
- Middleware (taruh di `shared/middleware/`)
