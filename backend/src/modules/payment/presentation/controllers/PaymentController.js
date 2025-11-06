/**
 * Payment Controller
 * Handle HTTP requests untuk payment endpoints
 */

const CreatePayment = require('../../application/use-cases/CreatePayment');
const VerifyPayment = require('../../application/use-cases/VerifyPayment');
const ReleaseEscrow = require('../../application/use-cases/ReleaseEscrow');
const WithdrawFunds = require('../../application/use-cases/WithdrawFunds');
const RequestRefund = require('../../application/use-cases/RequestRefund');
const ProcessRefund = require('../../application/use-cases/ProcessRefund');
const RetryPayment = require('../../application/use-cases/RetryPayment');
const PaymentModel = require('../../infrastructure/models/PaymentModel');
const EscrowModel = require('../../infrastructure/models/EscrowModel');
const WithdrawalModel = require('../../infrastructure/models/WithdrawalModel');
const MockPaymentGatewayService = require('../../infrastructure/services/MockPaymentGatewayService');
const InvoiceService = require('../../infrastructure/services/InvoiceService');
const EmailService = require('../../infrastructure/services/EmailService');
const { Sequelize } = require('sequelize');

class PaymentController {
  constructor() {
    this.createPaymentUseCase = new CreatePayment();
    this.verifyPaymentUseCase = new VerifyPayment();
    this.releaseEscrowUseCase = new ReleaseEscrow();
    this.withdrawFundsUseCase = new WithdrawFunds();
    this.requestRefundUseCase = new RequestRefund();
    this.processRefundUseCase = new ProcessRefund();
    this.retryPaymentUseCase = new RetryPayment();
    this.mockGateway = new MockPaymentGatewayService();
    this.invoiceService = new InvoiceService();
    this.emailService = new EmailService();
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
   * GET /api/payments/check-status/:transactionId
   * Check payment status and return appropriate redirect URL
   */
  async checkPaymentStatus(req, res) {
    try {
      const { transactionId } = req.params;

      const payment = await PaymentModel.findOne({
        where: { transaction_id: transactionId }
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Determine redirect URL based on status
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      let redirectUrl = '';

      switch (payment.status) {
        case 'berhasil':
        case 'paid':
        case 'success':
        case 'settlement':
          redirectUrl = `${frontendUrl}/payment/success?order_id=${payment.transaction_id}&transaction_id=${payment.external_id || payment.transaction_id}&gross_amount=${payment.jumlah}`;
          break;
        case 'menunggu':
        case 'pending':
          redirectUrl = `${frontendUrl}/payment/pending?order_id=${payment.transaction_id}&transaction_id=${payment.external_id || payment.transaction_id}&gross_amount=${payment.jumlah}`;
          break;
        case 'kadaluarsa':
        case 'expired':
          redirectUrl = `${frontendUrl}/payment/expired?order_id=${payment.transaction_id}&transaction_id=${payment.external_id || payment.transaction_id}&gross_amount=${payment.jumlah}`;
          break;
        case 'gagal':
        case 'failed':
        case 'deny':
        case 'cancel':
        default:
          redirectUrl = `${frontendUrl}/payment/error?order_id=${payment.transaction_id}&transaction_id=${payment.external_id || payment.transaction_id}&gross_amount=${payment.jumlah}&message=${encodeURIComponent(payment.keterangan || 'Payment failed')}`;
          break;
      }

      res.status(200).json({
        success: true,
        data: {
          payment_id: payment.id,
          transaction_id: payment.transaction_id,
          status: payment.status,
          redirect_url: redirectUrl,
          amount: payment.jumlah,
          created_at: payment.created_at
        }
      });
    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Check payment status error:', error);
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

  /**
   * GET /api/payments/:id/invoice
   * Get atau generate invoice PDF
   */
  async getInvoice(req, res) {
    try {
      const { id } = req.params;

      const payment = await PaymentModel.findByPk(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Check if invoice already exists
      let invoicePath;
      if (this.invoiceService.invoiceExists(payment.id, payment.nomor_invoice)) {
        invoicePath = this.invoiceService.getInvoicePath(payment.id, payment.nomor_invoice);
      } else {
        // Generate new invoice
        invoicePath = await this.invoiceService.generateInvoice(payment);
      }

      // Send file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=INV-${payment.nomor_invoice || payment.id}.pdf`);
      res.sendFile(invoicePath);

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get invoice error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/payments/:id/send-invoice
   * Generate dan kirim invoice via email
   */
  async sendInvoice(req, res) {
    try {
      const { id } = req.params;
      const { email } = req.body;

      const payment = await PaymentModel.findByPk(id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Generate invoice if not exists
      let invoicePath;
      if (this.invoiceService.invoiceExists(payment.id, payment.nomor_invoice)) {
        invoicePath = this.invoiceService.getInvoicePath(payment.id, payment.nomor_invoice);
      } else {
        invoicePath = await this.invoiceService.generateInvoice(payment);
      }

      // Send email with invoice
      const targetEmail = email || payment.email || 'customer@example.com';
      await this.emailService.sendPaymentSuccessEmail(targetEmail, payment, invoicePath);

      res.status(200).json({
        success: true,
        message: 'Invoice sent successfully',
        data: { email: targetEmail }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Send invoice error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/analytics/summary
   * Get payment analytics summary
   */
  async getAnalyticsSummary(req, res) {
    try {
      const { start_date, end_date, period = '30d' } = req.query;

      // Calculate date range
      let startDate, endDate;
      if (start_date && end_date) {
        startDate = new Date(start_date);
        endDate = new Date(end_date);
      } else {
        // Default period
        endDate = new Date();
        startDate = new Date();
        const days = parseInt(period.replace('d', '')) || 30;
        startDate.setDate(startDate.getDate() - days);
      }

      // Total payments count
      const totalPayments = await PaymentModel.count({
        where: {
          created_at: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        }
      });

      // Success payments
      const successPayments = await PaymentModel.count({
        where: {
          status: ['paid', 'success', 'settlement'],
          created_at: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        }
      });

      // Total revenue
      const revenueResult = await PaymentModel.findAll({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_revenue'],
          [Sequelize.fn('SUM', Sequelize.col('biaya_platform')), 'total_platform_fee']
        ],
        where: {
          status: ['paid', 'success', 'settlement'],
          created_at: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        },
        raw: true
      });

      const totalRevenue = parseFloat(revenueResult[0]?.total_revenue || 0);
      const totalPlatformFee = parseFloat(revenueResult[0]?.total_platform_fee || 0);

      // Payment methods breakdown
      const paymentMethods = await PaymentModel.findAll({
        attributes: [
          'metode_pembayaran',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_amount']
        ],
        where: {
          status: ['paid', 'success', 'settlement'],
          created_at: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        },
        group: ['metode_pembayaran'],
        raw: true
      });

      // Daily transactions
      const dailyTransactions = await PaymentModel.findAll({
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_amount']
        ],
        where: {
          status: ['paid', 'success', 'settlement'],
          created_at: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        },
        group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
        order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
        raw: true
      });

      // Status breakdown
      const statusBreakdown = await PaymentModel.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: {
          created_at: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        },
        group: ['status'],
        raw: true
      });

      res.status(200).json({
        success: true,
        data: {
          summary: {
            total_payments: totalPayments,
            success_payments: successPayments,
            failed_payments: totalPayments - successPayments,
            success_rate: totalPayments > 0 ? ((successPayments / totalPayments) * 100).toFixed(2) + '%' : '0%',
            total_revenue: totalRevenue,
            total_platform_fee: totalPlatformFee
          },
          period: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
          },
          payment_methods: paymentMethods,
          daily_transactions: dailyTransactions,
          status_breakdown: statusBreakdown
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/analytics/escrow
   * Get escrow analytics
   */
  async getEscrowAnalytics(req, res) {
    try {
      // Total escrow amount
      const escrowStats = await EscrowModel.findAll({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah_ditahan')), 'total_amount']
        ],
        where: {
          status: 'ditahan'
        },
        raw: true
      });

      // Escrow by status
      const escrowByStatus = await EscrowModel.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah_ditahan')), 'total_amount']
        ],
        group: ['status'],
        raw: true
      });

      res.status(200).json({
        success: true,
        data: {
          active_escrow: {
            count: parseInt(escrowStats[0]?.total_count || 0),
            total_amount: parseFloat(escrowStats[0]?.total_amount || 0)
          },
          breakdown_by_status: escrowByStatus
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get escrow analytics error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/analytics/withdrawals
   * Get withdrawal analytics
   */
  async getWithdrawalAnalytics(req, res) {
    try {
      // Total withdrawals
      const withdrawalStats = await WithdrawalModel.findAll({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_amount']
        ],
        raw: true
      });

      // Withdrawals by status
      const withdrawalByStatus = await WithdrawalModel.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_amount']
        ],
        group: ['status'],
        raw: true
      });

      // Pending withdrawals (need admin approval)
      const pendingWithdrawals = await WithdrawalModel.findAll({
        where: {
          status: 'pending'
        },
        limit: 10,
        order: [['created_at', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: {
          summary: {
            total_count: parseInt(withdrawalStats[0]?.total_count || 0),
            total_amount: parseFloat(withdrawalStats[0]?.total_amount || 0)
          },
          breakdown_by_status: withdrawalByStatus,
          pending_withdrawals: pendingWithdrawals
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get withdrawal analytics error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/payments/:id/refund
   * Request refund untuk payment
   */
  async requestRefund(req, res) {
    try {
      const { id } = req.params;
      const { alasan, jumlah_refund } = req.body;
      const user_id = req.user?.id || req.body.user_id;

      const result = await this.requestRefundUseCase.execute({
        pembayaran_id: id,
        user_id,
        alasan,
        jumlah_refund
      });

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.refund
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Request refund error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PUT /api/payments/refund/:id/process
   * Admin approve/reject refund request
   */
  async processRefund(req, res) {
    try {
      const { id } = req.params;
      const { action, catatan_admin } = req.body;
      const admin_id = req.user?.id || req.body.admin_id;

      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Action harus "approve" atau "reject"'
        });
      }

      const result = await this.processRefundUseCase.execute({
        refund_id: id,
        admin_id,
        action,
        catatan_admin
      });

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.refund
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Process refund error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/refunds
   * Get all refund requests (admin)
   */
  async getAllRefunds(req, res) {
    try {
      const { status, limit = 50, offset = 0 } = req.query;

      const RefundModel = PaymentModel.sequelize.models.refund;

      const where = {};
      if (status) {
        where.status = status;
      }

      const refunds = await RefundModel.findAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      const total = await RefundModel.count({ where });

      res.status(200).json({
        success: true,
        data: {
          refunds,
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get refunds error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * POST /api/payments/:id/retry
   * Retry failed payment
   */
  async retryPayment(req, res) {
    try {
      const { id } = req.params;
      const { metode_pembayaran, channel } = req.body;

      const result = await this.retryPaymentUseCase.execute({
        pembayaran_id: id,
        metode_pembayaran,
        channel
      });

      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          old_payment_id: result.old_payment.id,
          new_payment_id: result.new_payment.id,
          payment_url: result.payment_url,
          retry_count: result.retry_count,
          transaction_id: result.new_payment.transaction_id
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Retry payment error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = PaymentController;
