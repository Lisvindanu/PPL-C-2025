require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const { connectDatabase } = require('./shared/database/connection');

// Function to get fresh swagger spec (avoid require cache)
function getSwaggerSpec() {
  // Delete require cache to always get fresh spec
  delete require.cache[require.resolve('./config/swagger')];
  return require('./config/swagger');
}

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
// Security headers dengan konfigurasi untuk Swagger UI
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https://validator.swagger.io"],
      fontSrc: ["'self'", "data:"],
    },
  },
}));

// CORS configuration - allow multiple origins
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Serve static files (mock payment gateway)
app.use('/mock-payment', express.static('public/mock-payment'));

// ==================== API DOCUMENTATION ====================
/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: API root endpoint
 *     description: Check if API is running
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SkillConnect API is running
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check endpoint
 *     description: Check API and database health status
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 database:
 *                   type: string
 *                   example: connected
 *                 uptime:
 *                   type: number
 *                   example: 3600.5
 *       500:
 *         description: System is unhealthy
 */

// Swagger UI with no-cache headers to prevent Cloudflare caching
app.use('/api-docs', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}, swaggerUi.serve);

// Setup swagger with fresh spec on each request
app.get('/api-docs', (req, res, next) => {
  const freshSpec = getSwaggerSpec();
  swaggerUi.setup(freshSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SkillConnect API Documentation',
  })(req, res, next);
});

// Swagger JSON endpoint with no-cache headers
app.get('/api-docs.json', (req, res) => {
  const freshSpec = getSwaggerSpec();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(freshSpec);
});

// ==================== ROUTES ====================
// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'SkillConnect API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: '/api-docs'
  });
});

app.get('/health', async (req, res) => {
  const { sequelize } = require('./shared/database/connection');
  try {
    await sequelize.authenticate();
    res.json({
      status: 'healthy',
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// ==================== MODULE ROUTES ====================
// Import routes
const userRoutes = require('./modules/user/presentation/routes/userRoutes');

// Register routes
app.use('/api/users', userRoutes);

// TODO: Tambahkan routes modul lain di sini
// const serviceRoutes = require('./modules/service/presentation/routes/serviceRoutes');
// app.use('/api/services', serviceRoutes);

// const orderRoutes = require('./modules/order/presentation/routes/orderRoutes');
// app.use('/api/orders', orderRoutes);

const paymentRoutes = require('./modules/payment/presentation/routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

// const reviewRoutes = require('./modules/review/presentation/routes/reviewRoutes');
// app.use('/api/reviews', reviewRoutes);

// const chatRoutes = require('./modules/chat/presentation/routes/chatRoutes');
// app.use('/api/chat', chatRoutes);

// Import sequelize for dependencies
const { sequelize } = require('./shared/database/connection');

// Auth routes (public - untuk login)
const setupAuthDependencies = require('./modules/admin/config/authDependencies');
const { authController } = setupAuthDependencies(sequelize);
const authRoutes = require('./modules/admin/presentation/routes/authRoutes');
app.use('/api/auth', authRoutes(authController));

// Admin routes
const authMiddleware = require('./shared/middleware/authMiddleware');
const adminMiddleware = require('./shared/middleware/adminMiddleware');

// Initialize admin dependencies
const setupAdminDependencies = require('./modules/admin/config/adminDependencies');
const { adminController, adminLogController } = setupAdminDependencies(sequelize);

const adminRoutes = require('./modules/admin/presentation/routes/adminRoutes');
app.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes(adminController));

const adminLogRoutes = require('./modules/admin/presentation/routes/adminLogRoutes');
app.use('/api/admin', authMiddleware, adminMiddleware, adminLogRoutes(adminLogController));

// Kategori routes (public)
const KategoriController = require('./modules/kategori/presentation/controllers/KategoriController');
const kategoriController = new KategoriController(sequelize);
const kategoriRoutes = require('./modules/kategori/presentation/routes/kategoriRoutes');
app.use('/api/kategori', kategoriRoutes(kategoriController));

// const recommendationRoutes = require('./modules/recommendation/presentation/routes/recommendationRoutes');
// app.use('/api/recommendations', recommendationRoutes);

// ==================== ERROR HANDLING ====================
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== START SERVER ====================
connectDatabase().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
      console.log('HTTP server closed');
      const { disconnectDatabase } = require('./shared/database/connection');
      await disconnectDatabase();
      process.exit(0);
    });
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app; // Export untuk testing