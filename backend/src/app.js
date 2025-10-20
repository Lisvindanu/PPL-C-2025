// backend/src/app.js
// ================================
// 📦 Import Dependencies
// ================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// ================================
// 🔐 Import Middleware
// ================================
const authMiddleware = require('./shared/middleware/authMiddleware');
const adminMiddleware = require('./shared/middleware/adminMiddleware');

// ================================
// ⚙️ Konfigurasi Awal
// ================================
const app = express();
const PORT = process.env.PORT || 5000;

// ================================
// 🧩 Middleware Global
// ================================
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ================================
// 🗄️ Database Connection
// ================================
const { sequelize, connectDatabase } = require('./shared/database/connection');

connectDatabase()
  .then(() => {
    console.log('✅ Database authenticated successfully');
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
  });

// ================================
// 🚀 Initialize Dependencies
// ================================
// Auth dependencies
const setupAuthDependencies = require('./modules/admin/config/authDependencies');
const { authController } = setupAuthDependencies(sequelize);

// Admin dependencies
const setupAdminDependencies = require('./modules/admin/config/adminDependencies');
const { adminController, adminLogController } = setupAdminDependencies(sequelize);

// ================================
// 🚏 Import Routes
// ================================
const authRoutes = require('./modules/admin/presentation/routes/authRoutes');
const adminRoutes = require('./modules/admin/presentation/routes/adminRoutes');
const adminLogRoutes = require('./modules/admin/presentation/routes/adminLogRoutes');

// ================================
// 🛣️ Register Routes
// ================================

// Public routes (tidak perlu auth)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    port: PORT,
    env: process.env.NODE_ENV
  });
});

// Auth routes (public - untuk login)
app.use('/api/auth', authRoutes(authController));

// Test DB (untuk development saja)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/test-db', async (req, res) => {
    try {
      const [result] = await sequelize.query('SELECT COUNT(*) as count FROM users');
      res.json({
        status: 'ok',
        message: 'Database connection successful',
        users: result[0]?.count || 0
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });
}

// Protected admin routes (memerlukan auth + admin role)
app.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes(adminController));
app.use('/api/admin/logs', authMiddleware, adminMiddleware, adminLogRoutes(adminLogController));

// ================================
// 404 Handler
// ================================
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ================================
// ⚠️ Error Handler (Global)
// ================================
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ================================
// 🚀 Jalankan Server
// ================================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║     SkillConnect Server Started     ║
╠════════════════════════════════════╣
║  Port: ${PORT}
║  Environment: ${process.env.NODE_ENV}
║  Database: ${process.env.DB_NAME}
║  Auth: ${process.env.NODE_ENV === 'production' ? '✅ Enabled' : '⚠️ Development Mode'}
╚════════════════════════════════════╝
  `);
});

module.exports = app;