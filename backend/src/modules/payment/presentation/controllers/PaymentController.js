/**
 * Payment Controller
 * Handle HTTP requests untuk payment endpoints
 */

const CreatePayment = require('../../application/use-cases/CreatePayment');
const VerifyPayment = require('../../application/use-cases/VerifyPayment');
const ReleaseEscrow = require('../../application/use-cases/ReleaseEscrow');
const WithdrawFunds = require('../../application/use-cases/WithdrawFunds');
const PaymentModel = require('../../infrastructure/models/PaymentModel');
const EscrowModel = require('../../infrastructure/models/EscrowModel');
const WithdrawalModel = require('../../infrastructure/models/WithdrawalModel');
const MockPaymentGatewayService = require('../../infrastructure/services/MockPaymentGatewayService');

class PaymentController {
  constructor() {
    this.createPaymentUseCase = new CreatePayment();
    this.verifyPaymentUseCase = new VerifyPayment();
    this.releaseEscrowUseCase = new ReleaseEscrow();
    this.withdrawFundsUseCase = new WithdrawFunds();
    this.mockGateway = new MockPaymentGatewayService();
  }

  /**
   * POST /api/payments/create
   * Create new payment
   */
  async createPayment(req, res) {
    try {
      const { pesanan_id, jumlah, metode_pembayaran, channel } = req.body;
      const user_id = req.user?.id || req.body.user_id; // From auth middleware or body (testing)

      const result = await this.createPaymentUseCase.execute({
        pesanan_id,
        user_id,
        jumlah,
        metode_pembayaran,
        channel
      });

      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: result
      });
    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Create payment error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/payments/webhook
   * Handle webhook dari payment gateway
   */
  async handleWebhook(req, res) {
    try {
      const webhookData = req.body;

      const result = await this.verifyPaymentUseCase.execute(webhookData);

      res.status(200).json(result);
    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Webhook error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/:id
   * Get payment details
   */
  async getPaymentById(req, res) {
    try {
      const { id } = req.params;

      const payment = await PaymentModel.findByPk(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get payment error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/order/:orderId
   * Get payment by order ID
   */
  async getPaymentByOrderId(req, res) {
    try {
      const { orderId } = req.params;

      const payment = await PaymentModel.findOne({
        where: { pesanan_id: orderId }
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found for this order'
        });
      }

      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get payment by order error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/payments/escrow/release
   * Release escrow (client approve)
   */
  async releaseEscrow(req, res) {
    try {
      const { escrow_id, reason } = req.body;
      const user_id = req.user?.id || req.body.user_id;

      const result = await this.releaseEscrowUseCase.execute({
        escrow_id,
        user_id,
        reason
      });

      res.status(200).json({
        success: true,
        message: 'Escrow released successfully',
        data: result
      });
    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Release escrow error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/escrow/:id
   * Get escrow details
   */
  async getEscrowById(req, res) {
    try {
      const { id } = req.params;

      const escrow = await EscrowModel.findByPk(id);

      if (!escrow) {
        return res.status(404).json({
          success: false,
          message: 'Escrow not found'
        });
      }

      res.status(200).json({
        success: true,
        data: escrow
      });
    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get escrow error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/payments/withdraw
   * Create withdrawal request (freelancer)
   */
  async createWithdrawal(req, res) {
    try {
      const {
        escrow_id,
        metode_pembayaran_id,
        metode_pencairan,
        nomor_rekening,
        nama_pemilik
      } = req.body;
      const freelancer_id = req.user?.id || req.body.freelancer_id;

      const result = await this.withdrawFundsUseCase.execute({
        escrow_id,
        freelancer_id,
        metode_pembayaran_id,
        metode_pencairan,
        nomor_rekening,
        nama_pemilik
      });

      res.status(201).json({
        success: true,
        message: 'Withdrawal request created successfully',
        data: result
      });
    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Create withdrawal error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/withdrawals/:id
   * Get withdrawal details
   */
  async getWithdrawalById(req, res) {
    try {
      const { id } = req.params;

      const withdrawal = await WithdrawalModel.findByPk(id);

      if (!withdrawal) {
        return res.status(404).json({
          success: false,
          message: 'Withdrawal not found'
        });
      }

      res.status(200).json({
        success: true,
        data: withdrawal
      });
    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get withdrawal error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/payments/mock/trigger-success
   * Manual trigger payment success (TESTING ONLY)
   */
  async mockTriggerSuccess(req, res) {
    try {
      const { transaction_id } = req.body;

      const payment = await PaymentModel.findOne({
        where: { transaction_id }
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Trigger success webhook
      const webhookData = await this.mockGateway.triggerPaymentSuccess(
        transaction_id,
        parseFloat(payment.total_bayar)
      );

      // Process webhook
      await this.verifyPaymentUseCase.execute(webhookData);

      res.status(200).json({
        success: true,
        message: 'Payment success triggered',
        data: { transaction_id, status: 'berhasil' }
      });
    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Mock trigger success error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/payments/mock/trigger-failure
   * Manual trigger payment failure (TESTING ONLY)
   */
  async mockTriggerFailure(req, res) {
    try {
      const { transaction_id, reason } = req.body;

      const payment = await PaymentModel.findOne({
        where: { transaction_id }
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Trigger failure webhook
      const webhookData = await this.mockGateway.triggerPaymentFailure(
        transaction_id,
        parseFloat(payment.total_bayar),
        reason
      );

      // Process webhook
      await this.verifyPaymentUseCase.execute(webhookData);

      res.status(200).json({
        success: true,
        message: 'Payment failure triggered',
        data: { transaction_id, status: 'gagal', reason }
      });
    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Mock trigger failure error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = PaymentController;
