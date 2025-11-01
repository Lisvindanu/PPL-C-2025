/**
 * Payment Routes
 * Define all payment-related endpoints
 */

const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

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
 *           type: integer
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
 *           type: integer
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
 *           type: integer
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
 *           type: integer
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
  paymentController.getWithdrawalById.bind(paymentController)
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
   *                 type: integer
   *                 example: 1
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
   *                 type: integer
   *                 example: 1
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
