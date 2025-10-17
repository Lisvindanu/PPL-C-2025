require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDatabase } = require('./shared/database/connection');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// ==================== ROUTES ====================
// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'SkillConnect API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
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

// Module Routes
const paymentRoutes = require('./modules/payment/presentation/routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

// TODO: Import other module routes
// const userRoutes = require('./modules/user/presentation/routes/userRoutes');
// app.use('/api/users', userRoutes);

// const serviceRoutes = require('./modules/service/presentation/routes/serviceRoutes');
// app.use('/api/services', serviceRoutes);

// const orderRoutes = require('./modules/order/presentation/routes/orderRoutes');
// app.use('/api/orders', orderRoutes);

// const reviewRoutes = require('./modules/review/presentation/routes/reviewRoutes');
// app.use('/api/reviews', reviewRoutes);

// const chatRoutes = require('./modules/chat/presentation/routes/chatRoutes');
// app.use('/api/chat', chatRoutes);

// const adminRoutes = require('./modules/admin/presentation/routes/adminRoutes');
// app.use('/api/admin', adminRoutes);

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
