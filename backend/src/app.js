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
const allowedOrigins = [
  'http://localhost:3000',
  'https://ppl.vinmedia.my.id',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ================================
// 🗄️ Database Connection
// ================================
const { sequelize, connectDatabase } = require('./shared/database/connection');

connectDatabase()
  .then(() => console.log('✅ Database authenticated successfully'))
  .catch((err) => console.error('❌ Database connection error:', err.message));

// ================================
// 🚀 Initialize Dependencies
// ================================
const setupAdminDependencies = require('./modules/admin/config/adminDependencies');
const { adminController, adminLogController } = setupAdminDependencies(sequelize);

// ================================
// 🚏 Import Routes
// ================================
const userRoutes = require('./modules/user/presentation/routes/userRoutes');
const adminRoutes = require('./modules/admin/presentation/routes/adminRoutes');
const adminLogRoutes = require('./modules/admin/presentation/routes/adminLogRoutes');
const kategoriRoutes = require('./modules/service/presentation/routes/kategoriRoutes');
const subKategoriRoutes = require('./modules/service/presentation/routes/subKategoriRoutes');

// ================================
// 🚀 Initialize Service Module Controllers (Kategori & Sub-Kategori)
// ================================
const KategoriController = require('./modules/service/presentation/controllers/KategoriController');
const kategoriController = new KategoriController(sequelize);

const SubKategoriController = require('./modules/service/presentation/controllers/SubKategoriController');
const subKategoriController = new SubKategoriController(sequelize);

// ================================
// 🛣️ Register Routes
// ================================

// User routes (public & private)
app.use('/api/users', userRoutes);

// Service Module - Kategori & Sub-Kategori routes (public)
app.use('/api/kategori', kategoriRoutes(kategoriController));
app.use('/api/sub-kategori', subKategoriRoutes(subKategoriController));

// Protected admin routes (memerlukan auth + admin role)
app.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes(adminController));
app.use('/api/admin/logs', authMiddleware, adminMiddleware, adminLogRoutes(adminLogController));

// Test DB (untuk development)
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
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
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
╚════════════════════════════════════╝
  `);
});

module.exports = app;
