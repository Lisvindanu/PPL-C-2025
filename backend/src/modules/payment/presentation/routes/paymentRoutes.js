/**
 * Payment Routes
 * Define all payment-related endpoints
 */

const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

// Initialize controller
const paymentController = new PaymentController();

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     tags: [Payments]
 *     summary: Create new payment
 *     description: Create a new payment for an order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentRequest'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/create',
  authMiddleware,
  paymentController.createPayment.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: Payment gateway webhook
 *     description: Handle webhook notifications from payment gateway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/webhook',
  paymentController.handleWebhook.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/check-status/{transactionId}:
 *   get:
 *     tags: [Payments]
 *     summary: Check payment status and get redirect URL
 *     description: Check payment status by transaction ID and return appropriate redirect URL for frontend
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Payment status checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment_id:
 *                       type: string
 *                       format: uuid
 *                     transaction_id:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [berhasil, menunggu, kadaluarsa, gagal]
 *                     redirect_url:
 *                       type: string
 *                       description: Frontend URL to redirect based on payment status
 *                     amount:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/check-status/:transactionId',
  paymentController.checkPaymentStatus.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment by ID
 *     description: Retrieve payment details by payment ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/:id',
  authMiddleware,
  paymentController.getPaymentById.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/order/{orderId}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment by order ID
 *     description: Retrieve payment details by order ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Payment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/order/:orderId',
  authMiddleware,
  paymentController.getPaymentByOrderId.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/escrow/release:
 *   post:
 *     tags: [Escrow]
 *     summary: Release escrow funds
 *     description: Release escrow funds to freelancer (client approval)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReleaseEscrowRequest'
 *     responses:
 *       200:
 *         description: Escrow released successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/escrow/release',
  authMiddleware,
  paymentController.releaseEscrow.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/escrow/{id}:
 *   get:
 *     tags: [Escrow]
 *     summary: Get escrow by ID
 *     description: Retrieve escrow details by escrow ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Escrow ID
 *     responses:
 *       200:
 *         description: Escrow found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Escrow'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/escrow/:id',
  authMiddleware,
  paymentController.getEscrowById.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/withdraw:
 *   post:
 *     tags: [Withdrawals]
 *     summary: Create withdrawal request
 *     description: Freelancer request to withdraw funds from balance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWithdrawalRequest'
 *     responses:
 *       201:
 *         description: Withdrawal request created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Withdrawal'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/withdraw',
  authMiddleware,
  paymentController.createWithdrawal.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/withdrawals/{id}:
 *   get:
 *     tags: [Withdrawals]
 *     summary: Get withdrawal by ID
 *     description: Retrieve withdrawal details by withdrawal ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Withdrawal ID
 *     responses:
 *       200:
 *         description: Withdrawal found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Withdrawal'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/withdrawals/:id',
  authMiddleware,
  paymentController.getWithdrawalById.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/{id}/invoice:
 *   get:
 *     tags: [Payments]
 *     summary: Get invoice PDF
 *     description: Generate atau retrieve invoice PDF untuk payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Invoice PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/:id/invoice',
  authMiddleware,
  paymentController.getInvoice.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/{id}/send-invoice:
 *   post:
 *     tags: [Payments]
 *     summary: Send invoice via email
 *     description: Generate invoice dan kirim via email
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email tujuan (optional, default dari payment data)
 *     responses:
 *       200:
 *         description: Invoice sent successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  '/:id/send-invoice',
  authMiddleware,
  paymentController.sendInvoice.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/analytics/summary:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment analytics summary
 *     description: Retrieve payment statistics dan analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, 365d]
 *           default: 30d
 *         description: Period preset (if start_date/end_date not provided)
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/analytics/summary',
  authMiddleware,
  paymentController.getAnalyticsSummary.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/analytics/escrow:
 *   get:
 *     tags: [Payments]
 *     summary: Get escrow analytics
 *     description: Retrieve escrow statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Escrow analytics data
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/analytics/escrow',
  authMiddleware,
  paymentController.getEscrowAnalytics.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/analytics/withdrawals:
 *   get:
 *     tags: [Payments]
 *     summary: Get withdrawal analytics
 *     description: Retrieve withdrawal statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Withdrawal analytics data
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  '/analytics/withdrawals',
  authMiddleware,
  paymentController.getWithdrawalAnalytics.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/{id}/refund:
 *   post:
 *     tags: [Payments]
 *     summary: Request refund
 *     description: User request refund untuk payment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alasan:
 *                 type: string
 *                 description: Alasan refund
 *               jumlah_refund:
 *                 type: number
 *                 description: Jumlah yang ingin direfund (optional, default = jumlah pembayaran)
 *     responses:
 *       201:
 *         description: Refund request berhasil dibuat
 *       400:
 *         description: Validation error
 *       404:
 *         description: Payment not found
 */
router.post(
  '/:id/refund',
  authMiddleware,
  paymentController.requestRefund.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/refund/{id}/process:
 *   put:
 *     tags: [Payments]
 *     summary: Process refund request (Admin)
 *     description: Admin approve atau reject refund request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Refund ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *               catatan_admin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund processed
 *       400:
 *         description: Invalid request
 */
router.put(
  '/refund/:id/process',
  authMiddleware,
  paymentController.processRefund.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/refunds:
 *   get:
 *     tags: [Payments]
 *     summary: Get all refund requests (Admin)
 *     description: Retrieve semua refund requests dengan filter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, disetujui, ditolak]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Refund list
 */
router.get(
  '/refunds',
  authMiddleware,
  paymentController.getAllRefunds.bind(paymentController)
);

/**
 * @swagger
 * /api/payments/{id}/retry:
 *   post:
 *     tags: [Payments]
 *     summary: Retry failed payment
 *     description: Retry pembayaran yang gagal atau expired
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID yang gagal
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metode_pembayaran:
 *                 type: string
 *                 description: Metode pembayaran baru (optional)
 *               channel:
 *                 type: string
 *                 description: Channel pembayaran (optional)
 *     responses:
 *       201:
 *         description: Payment retry berhasil
 *       400:
 *         description: Cannot retry or max retries reached
 */
router.post(
  '/:id/retry',
  authMiddleware,
  paymentController.retryPayment.bind(paymentController)
);

/**
 * Mock/Testing Routes (Only for development)
 */
if (process.env.NODE_ENV === 'development') {
  /**
   * @swagger
   * /api/payments/mock/trigger-success:
   *   post:
   *     tags: [Payments]
   *     summary: Mock trigger payment success
   *     description: Manually trigger payment success (development only)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               paymentId:
   *                 type: string
   *                 format: uuid
   *                 example: "550e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Payment success triggered
   */
  router.post(
    '/mock/trigger-success',
    paymentController.mockTriggerSuccess.bind(paymentController)
  );

  /**
   * @swagger
   * /api/payments/mock/trigger-failure:
   *   post:
   *     tags: [Payments]
   *     summary: Mock trigger payment failure
   *     description: Manually trigger payment failure (development only)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               paymentId:
   *                 type: string
   *                 format: uuid
   *                 example: "550e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Payment failure triggered
   */
  router.post(
    '/mock/trigger-failure',
    paymentController.mockTriggerFailure.bind(paymentController)
  );
}

module.exports = router;
