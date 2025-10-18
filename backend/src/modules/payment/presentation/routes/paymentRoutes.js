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
 * Payment Routes
 */

// Create payment
router.post(
  '/create',
  paymentController.createPayment.bind(paymentController)
);

// Webhook dari payment gateway
router.post(
  '/webhook',
  paymentController.handleWebhook.bind(paymentController)
);

// Get payment by ID
router.get(
  '/:id',
  paymentController.getPaymentById.bind(paymentController)
);

// Get payment by order ID
router.get(
  '/order/:orderId',
  paymentController.getPaymentByOrderId.bind(paymentController)
);

/**
 * Escrow Routes
 */

// Release escrow (client approve)
router.post(
  '/escrow/release',
  paymentController.releaseEscrow.bind(paymentController)
);

// Get escrow by ID
router.get(
  '/escrow/:id',
  paymentController.getEscrowById.bind(paymentController)
);

/**
 * Withdrawal Routes
 */

// Create withdrawal request (freelancer)
router.post(
  '/withdraw',
  paymentController.createWithdrawal.bind(paymentController)
);

// Get withdrawal by ID
router.get(
  '/withdrawals/:id',
  paymentController.getWithdrawalById.bind(paymentController)
);

/**
 * Mock/Testing Routes (Only for development)
 */
if (process.env.NODE_ENV === 'development') {
  // Trigger payment success manually
  router.post(
    '/mock/trigger-success',
    paymentController.mockTriggerSuccess.bind(paymentController)
  );

  // Trigger payment failure manually
  router.post(
    '/mock/trigger-failure',
    paymentController.mockTriggerFailure.bind(paymentController)
  );
}

module.exports = router;
