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

  /**
   * @swagger
   * /api/admin/dashboard:
   *   get:
   *     tags: [Admin]
   *     summary: Get dashboard statistics
   *     description: Retrieve overall system statistics for admin dashboard
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dashboard stats retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/DashboardStats'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/dashboard', (req, res) => adminController.getDashboard(req, res));

  /**
   * @swagger
   * /api/admin/users:
   *   get:
   *     tags: [Admin]
   *     summary: Get all users
   *     description: Retrieve list of all users with optional filters
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Items per page
   *       - in: query
   *         name: role
   *         schema:
   *           type: string
   *           enum: [client, freelancer, admin]
   *         description: Filter by user role
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [active, blocked]
   *         description: Filter by user status
   *     responses:
   *       200:
   *         description: Users list retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/User'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/users', (req, res) => adminController.getUsers(req, res));

  /**
   * @swagger
   * /api/admin/users/{id}:
   *   get:
   *     tags: [Admin]
   *     summary: Get user details
   *     description: Retrieve detailed information about a specific user including block log if blocked
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: User details retrieved successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/users/:id', (req, res) => adminController.getUserDetails(req, res));

  /**
   * @swagger
   * /api/admin/users/{id}/block:
   *   put:
   *     tags: [Admin]
   *     summary: Block user
   *     description: Block a user account
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: User ID
   *     responses:
   *       200:
   *         description: User blocked successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.put('/users/:id/block', (req, res) => adminController.blockUser(req, res));

  /**
   * @swagger
   * /api/admin/users/{id}/unblock:
   *   put:
   *     tags: [Admin]
   *     summary: Unblock user
   *     description: Unblock a user account
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: User ID
   *     responses:
   *       200:
   *         description: User unblocked successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.put('/users/:id/unblock', (req, res) => adminController.unblockUser(req, res));

  /**
   * @swagger
   * /api/admin/analytics/users:
   *   get:
   *     tags: [Admin]
   *     summary: Get user analytics
   *     description: Retrieve user growth and activity analytics
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date for analytics
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: End date for analytics
   *     responses:
   *       200:
   *         description: User analytics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/UserAnalytics'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/analytics/users', (req, res) => adminController.getUserAnalytics(req, res));

  /**
   * @swagger
   * /api/admin/analytics/users/status:
   *   get:
   *     tags: [Admin]
   *     summary: Get user status distribution
   *     description: Get distribution of users by status
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User status distribution retrieved
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/analytics/users/status', (req, res) => adminController.getUserStatusDistribution(req, res));

  /**
   * @swagger
   * /api/admin/analytics/orders/trends:
   *   get:
   *     tags: [Admin]
   *     summary: Get order trends
   *     description: Retrieve order trends over time
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Order trends retrieved successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/analytics/orders/trends', (req, res) => adminController.getOrderTrends(req, res));
  router.get('/analytics/orders/categories/trends', (req, res) => adminController.getOrderCategoryTrends(req, res));
  router.get('/analytics/orders/categories/trends/by-time', (req, res) => adminController.getOrderCategoryTrendsByTime(req, res));

  /**
   * @swagger
   * /api/admin/analytics/revenue:
   *   get:
   *     tags: [Admin]
   *     summary: Get revenue analytics
   *     description: Retrieve revenue analytics and trends
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Revenue analytics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/RevenueAnalytics'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/analytics/revenue', (req, res) => adminController.getRevenueAnalytics(req, res));

  /**
   * @swagger
   * /api/admin/analytics/orders:
   *   get:
   *     tags: [Admin]
   *     summary: Get order analytics
   *     description: Retrieve order statistics and analytics
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Order analytics retrieved successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/analytics/orders', (req, res) => adminController.getOrderAnalytics(req, res));

  /**
   * @swagger
   * /api/admin/transactions:
   *   get:
   *     tags: [Admin]
   *     summary: Get all transactions
   *     description: Retrieve list of all transactions/orders with client and freelancer info
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [menunggu_pembayaran, dibayar, dikerjakan, selesai, dibatalkan]
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Transactions list retrieved successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/transactions', (req, res) => adminController.getTransactions(req, res));

  /**
   * @swagger
   * /api/admin/services:
   *   get:
   *     tags: [Admin]
   *     summary: Get all services
   *     description: Retrieve list of all services
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Services list retrieved successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/services', (req, res) => adminController.getServices(req, res));

  /**
   * @swagger
   * /api/admin/services/{id}:
   *   get:
   *     tags: [Admin]
   *     summary: Get service details
   *     description: Retrieve detailed information about a specific service including block log if blocked
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Service ID
   *     responses:
   *       200:
   *         description: Service details retrieved successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/services/:id', (req, res) => adminController.getServiceDetails(req, res));

  /**
   * @swagger
   * /api/admin/services/{id}/block:
   *   put:
   *     tags: [Admin]
   *     summary: Block service
   *     description: Block a service from being displayed
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Service ID
   *     responses:
   *       200:
   *         description: Service blocked successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.put('/services/:id/block', (req, res) => adminController.blockService(req, res));

  /**
   * @swagger
   * /api/admin/services/{id}/unblock:
   *   put:
   *     tags: [Admin]
   *     summary: Unblock service
   *     description: Unblock a previously blocked service
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Service ID
   *     responses:
   *       200:
   *         description: Service unblocked successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.put('/services/:id/unblock', (req, res) => adminController.unblockService(req, res));

  /**
   * @swagger
   * /api/admin/reviews/{id}:
   *   delete:
   *     tags: [Admin]
   *     summary: Delete review
   *     description: Delete inappropriate or spam reviews
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Review ID
   *     responses:
   *       200:
   *         description: Review deleted successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.delete('/reviews/:id', (req, res) => adminController.deleteReview(req, res));

  /**
   * @swagger
   * /api/admin/reports/export:
   *   post:
   *     tags: [Admin]
   *     summary: Export report
   *     description: Export data reports in various formats (CSV, Excel, PDF)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ExportReportRequest'
   *     responses:
   *       200:
   *         description: Report exported successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 downloadUrl:
   *                   type: string
   *                   example: '/downloads/report_users_1234567890.csv'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.post('/reports/export', (req, res) => adminController.exportReport(req, res));

  /**
   * @swagger
   * /api/admin/fraud-alerts:
   *   get:
   *     tags: [Admin]
   *     summary: Get fraud alerts
   *     description: Retrieve potential fraud activities and alerts
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Fraud alerts retrieved successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/fraud-alerts', (req, res) => adminController.checkFraud(req, res));

  

  /**
   * @swagger
   * /api/admin/logs:
   *   get:
   *     tags: [Admin]
   *     summary: Get activity logs
   *     description: Retrieve all admin activity logs
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *     responses:
   *       200:
   *         description: Activity logs retrieved successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
router.get('/log', adminController.getLogDetail.bind(adminController));

  /**
   * @swagger
   * /api/admin/logs/{id}:
   *   get:
   *     tags: [Admin]
   *     summary: Get activity log detail
   *     description: Retrieve specific activity log details
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Log ID
   *     responses:
   *       200:
   *         description: Activity log detail retrieved
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
router.get('/logs/admin/:adminId', adminController.getLogsByAdminId.bind(adminController));
  /**
   * @swagger
   * /api/admin/logs/admin/{adminId}:
   *   get:
   *     tags: [Admin]
   *     summary: Get activity logs by admin
   *     description: Retrieve activity logs for specific admin user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: adminId
   *         required: true
   *         schema:
   *           type: integer
   *         description: Admin user ID
   *     responses:
   *       200:
   *         description: Admin activity logs retrieved
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
router.get('/logs', adminController.getAllLogs.bind(adminController));

  /**
   * @swagger
   * /api/admin/notifications:
   *   get:
   *     tags: [Admin]
   *     summary: Get all notifications for admin
   *     description: Retrieve all fraud alert notifications for admin
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *     responses:
   *       200:
   *         description: Notifications retrieved successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/notifications', adminController.getNotifications.bind(adminController));

  /**
   * @swagger
   * /api/admin/notifications/{id}/read:
   *   put:
   *     tags: [Admin]
   *     summary: Mark notification as read
   *     description: Mark a notification as read
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Notification ID
   *     responses:
   *       200:
   *         description: Notification marked as read
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.put('/notifications/:id/read', adminController.markNotificationRead.bind(adminController));

  /**
   * @swagger
   * /api/admin/fraud-alerts/{type}/{id}:
   *   get:
   *     tags: [Admin]
   *     summary: Get fraud alert detail
   *     description: Retrieve detailed information about a specific fraud alert
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: type
   *         required: true
   *         schema:
   *           type: string
   *           enum: [failedPayment, multipleFailures, anomaly]
   *         description: Type of fraud alert
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Alert ID
   *     responses:
   *       200:
   *         description: Fraud alert detail retrieved
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/fraud-alerts/:type/:id', adminController.getFraudAlertDetail.bind(adminController));

  return router;
};