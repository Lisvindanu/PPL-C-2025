const express = require('express');
const router = express.Router();

// ================================
// Middleware untuk Authentication & Authorization
// ================================
const authMiddleware = require('../../../../shared/middleware/authMiddleware');
const adminMiddleware = require('../../../../shared/middleware/adminMiddleware');

module.exports = (adminController) => {
  // Apply middleware ke semua admin routes
  router.use(authMiddleware);   // Validasi token
  router.use(adminMiddleware);  // Validasi role = admin

  // ================================
  // Dashboard & Overview
  // ================================
  router.get('/dashboard', (req, res) => adminController.getDashboard(req, res));

  // ================================
  // User Management
  // ================================
  router.get('/users', (req, res) => adminController.getUsers(req, res));
router.put('/users/:id/block', (req, res) => adminController.blockUser(req, res));
router.put('/users/:id/unblock', (req, res) => adminController.unblockUser(req, res));

  // ================================
  // Analytics
  // ================================
  router.get('/analytics/users', (req, res) => adminController.getUserAnalytics(req, res));
  router.get('/analytics/users/status', (req, res) => adminController.getUserStatusDistribution(req, res));
  router.get('/analytics/orders/trends', (req, res) => adminController.getOrderTrends(req, res));
  router.get('/analytics/revenue', (req, res) => adminController.getRevenueAnalytics(req, res));
  router.get('/analytics/orders', (req, res) => adminController.getOrderAnalytics(req, res));

  // ================================
  // Service Management
  // ================================
  router.put('/services/:id/block', (req, res) => adminController.blockService(req, res));
  router.put('/services/:id/unblock', (req, res) => adminController.unblockService(req, res));
  router.get('/services', (req, res) => adminController.getServices(req, res));

  // ================================
  // Review Management
  // ================================
  router.delete('/reviews/:id', (req, res) => adminController.deleteReview(req, res));

  // ================================
  // Report & Export
  // ================================
  router.post('/reports/export', (req, res) => adminController.exportReport(req, res));

  // ================================
  // Fraud Detection
  // ================================
  router.get('/fraud-alerts', (req, res) => adminController.checkFraud(req, res));

  // ================================
  // Activity Logs
  // ================================
  router.get('/logs', (req, res) => adminController.getActivityLogs(req, res));
  router.get('/logs/:id', (req, res) => adminController.getActivityLogDetail(req, res));
  router.get('/logs/admin/:adminId', (req, res) => adminController.getActivityLogsByAdmin(req, res));

  return router;
};