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
      const { pesanan_id, jumlah, metode_pembayaran, channel, order_title, customer_name, customer_email } = req.body;
      const user_id = req.user?.userId || req.user?.id || req.body.user_id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          message: 'User ID is required'
        });
      }

      // TEMPORARY WORKAROUND: Auto-create order if not exists
      // TODO: Remove this when order creation API is fully implemented by the team
      try {
        // Check if order exists
        const [existingOrder] = await PaymentModel.sequelize.query(
          'SELECT id FROM pesanan WHERE id = ? LIMIT 1',
          {
            replacements: [pesanan_id],
            type: Sequelize.QueryTypes.SELECT
          }
        );

        if (!existingOrder) {
          console.log('[PAYMENT] Order not found, creating minimal order for payment...');

          // Create minimal order for payment to work
          const nomor_pesanan = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
          const harga = parseFloat(jumlah) / 1.1; // Reverse calculate (total / 1.1)
          const biaya_platform = parseFloat(jumlah) - harga;
          const waktu_pengerjaan = 7; // Default 7 days
          const tenggat_waktu = new Date();
          tenggat_waktu.setDate(tenggat_waktu.getDate() + waktu_pengerjaan);

          // Get a freelancer_id (temporary: use any freelancer, ideally from service)
          const [anyFreelancer] = await PaymentModel.sequelize.query(
            "SELECT id FROM users WHERE role = 'freelancer' LIMIT 1",
            { type: Sequelize.QueryTypes.SELECT }
          );

          const freelancer_id = anyFreelancer ? anyFreelancer.id : user_id;

          // Get a real layanan_id from database to satisfy foreign key constraint
          const [anyLayanan] = await PaymentModel.sequelize.query(
            "SELECT id FROM layanan LIMIT 1",
            { type: Sequelize.QueryTypes.SELECT }
          );

          if (!anyLayanan) {
            throw new Error('No services found in database. Please create at least one service first.');
          }

          await PaymentModel.sequelize.query(
            `INSERT INTO pesanan (
              id, nomor_pesanan, client_id, freelancer_id, layanan_id,
              judul, deskripsi, harga, biaya_platform, total_bayar,
              waktu_pengerjaan, tenggat_waktu, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            {
              replacements: [
                pesanan_id,
                nomor_pesanan,
                user_id, // client_id
                freelancer_id,
                anyLayanan.id, // Use real layanan_id
                order_title || 'Payment Order',
                `Temporary order created for payment. Customer: ${customer_name || 'N/A'}`,
                harga,
                biaya_platform,
                jumlah,
                waktu_pengerjaan,
                tenggat_waktu,
                'menunggu_pembayaran'
              ]
            }
          );

          console.log('[PAYMENT] Minimal order created:', pesanan_id);
        }
      } catch (dbError) {
        console.error('[PAYMENT] Database error:', dbError);
        throw new Error('Failed to create order: ' + dbError.message);
      }

      // Now create payment
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
   * Check payment status from Midtrans API and update database
   * Note: transactionId can be either transaction_id or payment id (UUID)
   */
  async checkPaymentStatus(req, res) {
    try {
      const { transactionId } = req.params;

      // Try to find payment by transaction_id first, then by id (UUID)
      const { Op } = require('sequelize');
      const payment = await PaymentModel.findOne({
        where: {
          [Op.or]: [
            { transaction_id: transactionId },
            { id: transactionId }
          ]
        }
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Query real-time status from Midtrans API if using midtrans gateway
      if (payment.payment_gateway === 'midtrans') {
        try {
          console.log(`[PAYMENT CONTROLLER] Checking status from Midtrans for: ${transactionId}`);

          const MidtransService = require('../../infrastructure/services/MidtransService');
          const midtransService = new MidtransService();

          const midtransStatus = await midtransService.getPaymentStatus(transactionId);
          console.log(`[PAYMENT CONTROLLER] Midtrans status:`, midtransStatus);

          // Update database if status changed
          if (midtransStatus.status !== payment.status) {
            console.log(`[PAYMENT CONTROLLER] Updating status from ${payment.status} to ${midtransStatus.status}`);

            payment.status = midtransStatus.status;

            // If payment successful, set paid date and generate invoice
            if (midtransStatus.status === 'berhasil') {
              payment.dibayar_pada = new Date();
              if (!payment.nomor_invoice) {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const uniqueId = payment.id.substring(0, 8).toUpperCase();
                payment.nomor_invoice = `INV/${year}/${month}/${uniqueId}`;
              }

              // Create escrow if not exists
              const EscrowService = require('../../infrastructure/services/EscrowService');
              const escrowService = new EscrowService();

              try {
                await escrowService.createEscrow({
                  pembayaran_id: payment.id,
                  pesanan_id: payment.pesanan_id,
                  jumlah_ditahan: parseFloat(payment.jumlah),
                  biaya_platform: parseFloat(payment.biaya_platform)
                });
                console.log(`[PAYMENT CONTROLLER] Escrow created for payment ${payment.id}`);
              } catch (escrowError) {
                // Escrow might already exist
                console.log(`[PAYMENT CONTROLLER] Escrow creation note:`, escrowError.message);
              }

              // Update order status to 'dibayar' when payment is successful
              const SequelizeOrderRepository = require('../../../order/infrastructure/repositories/SequelizeOrderRepository');
              const { sequelize } = require('../../../../shared/database/connection');
              const orderRepository = new SequelizeOrderRepository(sequelize);

              try {
                await orderRepository.updateStatus(payment.pesanan_id, 'dibayar');
                console.log(`[PAYMENT CONTROLLER] Order status updated to 'dibayar' for order: ${payment.pesanan_id}`);
              } catch (orderError) {
                console.error(`[PAYMENT CONTROLLER] Failed to update order status:`, orderError);
                // Continue processing even if order update fails
              }
            }

            await payment.save();
          }
        } catch (midtransError) {
          console.error('[PAYMENT CONTROLLER] Failed to check Midtrans status:', midtransError);
          // Continue with database status if Midtrans API fails
        }
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
      const user_id = req.user?.userId || req.user?.id || req.body.user_id;

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
/**
 * ROLE-BASED ANALYTICS METHODS
 * Add these methods to PaymentController.js
 */

  /**
   * GET /api/payments/analytics/summary
   * Get payment analytics summary (ROLE-BASED)
   * - Admin: sees all data
   * - Freelancer: sees only their earnings
   * - Client: sees only their spending
   */
  async getAnalyticsSummary(req, res) {
    try {
      const { start_date, end_date, period = '30d' } = req.query;
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User ID and role required'
        });
      }

      // Calculate date range
      let startDate, endDate;
      if (start_date && end_date) {
        startDate = new Date(start_date);
        endDate = new Date(end_date);
      } else {
        endDate = new Date();
        startDate = new Date();
        const days = parseInt(period.replace('d', '')) || 30;
        startDate.setDate(startDate.getDate() - days);
      }

      // Build WHERE clause based on role
      let whereClause = {
        created_at: {
          [Sequelize.Op.between]: [startDate, endDate]
        }
      };

      // Role-based filtering
      if (userRole === 'freelancer') {
        // Freelancer sees payments for their orders (where they are the freelancer)
        // Need to join with pesanan table
        const [freelancerPayments] = await PaymentModel.sequelize.query(
          `SELECT
            COUNT(p.id) as total_payments,
            SUM(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN 1 ELSE 0 END) as success_payments,
            SUM(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN p.jumlah ELSE 0 END) as total_revenue,
            SUM(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN p.biaya_platform ELSE 0 END) as total_platform_fee
          FROM pembayaran p
          INNER JOIN pesanan o ON p.pesanan_id = o.id
          WHERE o.freelancer_id = ?
            AND p.created_at >= ? AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)`,
          {
            replacements: [userId, startDate, endDate],
            type: Sequelize.QueryTypes.SELECT
          }
        );

        return res.status(200).json({
          success: true,
          data: {
            summary: {
              total_payments: parseInt(freelancerPayments.total_payments || 0),
              success_payments: parseInt(freelancerPayments.success_payments || 0),
              total_revenue: parseFloat(freelancerPayments.total_revenue || 0),
              total_platform_fee: parseFloat(freelancerPayments.total_platform_fee || 0),
              net_earnings: parseFloat(freelancerPayments.total_revenue || 0) - parseFloat(freelancerPayments.total_platform_fee || 0)
            },
            period: {
              start: startDate.toISOString().split('T')[0],
              end: endDate.toISOString().split('T')[0]
            },
            role: 'freelancer'
          }
        });

      } else if (userRole === 'client') {
        // Client sees payments for their orders (where they are the client)
        const [clientPayments] = await PaymentModel.sequelize.query(
          `SELECT
            COUNT(p.id) as total_payments,
            SUM(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN 1 ELSE 0 END) as success_payments,
            SUM(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN p.total_bayar ELSE 0 END) as total_spent
          FROM pembayaran p
          INNER JOIN pesanan o ON p.pesanan_id = o.id
          WHERE o.client_id = ?
            AND p.created_at >= ? AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)`,
          {
            replacements: [userId, startDate, endDate],
            type: Sequelize.QueryTypes.SELECT
          }
        );

        return res.status(200).json({
          success: true,
          data: {
            summary: {
              total_payments: parseInt(clientPayments.total_payments || 0),
              success_payments: parseInt(clientPayments.success_payments || 0),
              total_spent: parseFloat(clientPayments.total_spent || 0)
            },
            period: {
              start: startDate.toISOString().split('T')[0],
              end: endDate.toISOString().split('T')[0]
            },
            role: 'client'
          }
        });
      }

      // ADMIN: sees all data (existing logic)
      const totalPayments = await PaymentModel.count({ where: whereClause });

      const successPayments = await PaymentModel.count({
        where: {
          ...whereClause,
          status: ['berhasil', 'paid', 'success', 'settlement']
        }
      });

      const revenueResult = await PaymentModel.findAll({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_revenue'],
          [Sequelize.fn('SUM', Sequelize.col('biaya_platform')), 'total_platform_fee'],
          [Sequelize.fn('SUM', Sequelize.col('total_bayar')), 'total_gross']
        ],
        where: {
          ...whereClause,
          status: ['berhasil', 'paid', 'success', 'settlement']
        },
        raw: true
      });

      const totalRevenue = parseFloat(revenueResult[0]?.total_revenue || 0);
      const totalPlatformFee = parseFloat(revenueResult[0]?.total_platform_fee || 0);
      const totalGross = parseFloat(revenueResult[0]?.total_gross || 0);

      const paymentMethods = await PaymentModel.findAll({
        attributes: [
          'metode_pembayaran',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_amount']
        ],
        where: {
          ...whereClause,
          status: ['berhasil', 'paid', 'success', 'settlement']
        },
        group: ['metode_pembayaran'],
        raw: true
      });

      const dailyTransactions = await PaymentModel.findAll({
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('total_bayar')), 'total_amount']
        ],
        where: {
          ...whereClause,
          status: ['berhasil', 'paid', 'success', 'settlement']
        },
        group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
        order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
        raw: true
      });

      const statusBreakdown = await PaymentModel.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: whereClause,
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
            total_platform_fee: totalPlatformFee,
            total_gross: totalGross
          },
          period: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
          },
          payment_methods: paymentMethods,
          daily_transactions: dailyTransactions,
          status_breakdown: statusBreakdown,
          role: 'admin'
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
   * Get escrow analytics (ROLE-BASED)
   */
  async getEscrowAnalytics(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      let whereClause = {};

      // Role-based filtering
      if (userRole === 'freelancer') {
        // Get escrow for freelancer's orders
        const freelancerOrders = await PaymentModel.sequelize.query(
          'SELECT id FROM pesanan WHERE freelancer_id = ?',
          {
            replacements: [userId],
            type: Sequelize.QueryTypes.SELECT
          }
        );
        const orderIds = freelancerOrders.map(o => o.id);
        if (orderIds.length === 0) {
          return res.status(200).json({
            success: true,
            data: {
              active_escrow: { count: 0, total_amount: 0 },
              breakdown_by_status: [],
              role: 'freelancer'
            }
          });
        }
        whereClause.pesanan_id = { [Sequelize.Op.in]: orderIds };
      } else if (userRole === 'client') {
        // Get escrow for client's orders
        const clientOrders = await PaymentModel.sequelize.query(
          'SELECT id FROM pesanan WHERE client_id = ?',
          {
            replacements: [userId],
            type: Sequelize.QueryTypes.SELECT
          }
        );
        const orderIds = clientOrders.map(o => o.id);
        if (orderIds.length === 0) {
          return res.status(200).json({
            success: true,
            data: {
              active_escrow: { count: 0, total_amount: 0 },
              breakdown_by_status: [],
              role: 'client'
            }
          });
        }
        whereClause.pesanan_id = { [Sequelize.Op.in]: orderIds };
      }

      // Get escrow stats with role filter
      const escrowStats = await EscrowModel.findAll({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah_ditahan')), 'total_amount']
        ],
        where: {
          ...whereClause,
          status: 'ditahan'
        },
        raw: true
      });

      const escrowByStatus = await EscrowModel.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah_ditahan')), 'total_amount']
        ],
        where: whereClause,
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
          breakdown_by_status: escrowByStatus,
          role: userRole
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
   * Get withdrawal analytics (ROLE-BASED)
   */
  async getWithdrawalAnalytics(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      let whereClause = {};

      // Only freelancers and admins can see withdrawals
      if (userRole === 'freelancer') {
        whereClause.freelancer_id = userId;
      } else if (userRole === 'client') {
        return res.status(403).json({
          success: false,
          message: 'Clients cannot access withdrawal analytics'
        });
      }

      const withdrawalStats = await WithdrawalModel.findAll({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_amount']
        ],
        where: whereClause,
        raw: true
      });

      const withdrawalByStatus = await WithdrawalModel.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_amount']
        ],
        where: whereClause,
        group: ['status'],
        raw: true
      });

      const pendingWithdrawals = await WithdrawalModel.findAll({
        where: {
          ...whereClause,
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
          pending_withdrawals: userRole === 'admin' ? pendingWithdrawals : [],
          role: userRole
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
   * GET /api/payments/analytics/freelancer-earnings
   * Get freelancer earnings analytics (NEW ENDPOINT)
   */
  async getFreelancerEarnings(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;
      const { start_date, end_date } = req.query;

      // Only freelancers and admins can access
      if (userRole !== 'freelancer' && userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only freelancers can access earnings data'
        });
      }

      // If admin, can view any freelancer's earnings via query param
      const freelancerId = userRole === 'admin' && req.query.freelancer_id
        ? req.query.freelancer_id
        : userId;

      // Date range
      const endDate = end_date ? new Date(end_date) : new Date();
      const startDate = start_date ? new Date(start_date) : new Date(endDate.getFullYear(), 0, 1); // Start of year

      // Get earnings data
      const [earningsData] = await PaymentModel.sequelize.query(
        `SELECT
          COUNT(DISTINCT p.id) as total_orders,
          SUM(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN 1 ELSE 0 END) as completed_orders,
          SUM(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN p.jumlah ELSE 0 END) as total_earned,
          SUM(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN p.biaya_platform ELSE 0 END) as platform_fees,
          AVG(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN p.jumlah ELSE NULL END) as average_order_value
        FROM pembayaran p
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.freelancer_id = ?
          AND p.created_at >= ? AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)`,
        {
          replacements: [freelancerId, startDate, endDate],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Get pending escrow
      const [escrowData] = await PaymentModel.sequelize.query(
        `SELECT
          COUNT(e.id) as pending_count,
          SUM(e.jumlah_ditahan) as pending_amount
        FROM escrow e
        INNER JOIN pesanan o ON e.pesanan_id = o.id
        WHERE o.freelancer_id = ?
          AND e.status = 'ditahan'`,
        {
          replacements: [freelancerId],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Get withdrawn amount
      const [withdrawnData] = await WithdrawalModel.findAll({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_withdrawn']
        ],
        where: {
          freelancer_id: freelancerId,
          status: 'completed'
        },
        raw: true
      });

      const totalEarned = parseFloat(earningsData.total_earned || 0);
      const platformFees = parseFloat(earningsData.platform_fees || 0);
      const pendingEscrow = parseFloat(escrowData.pending_amount || 0);
      const totalWithdrawn = parseFloat(withdrawnData[0]?.total_withdrawn || 0);
      const availableBalance = totalEarned - platformFees - pendingEscrow - totalWithdrawn;

      // Monthly earnings breakdown
      const monthlyEarnings = await PaymentModel.sequelize.query(
        `SELECT
          DATE_FORMAT(p.created_at, '%Y-%m') as month,
          COUNT(p.id) as orders,
          SUM(p.jumlah) as earnings
        FROM pembayaran p
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.freelancer_id = ?
          AND p.status IN ('berhasil', 'paid', 'success', 'settlement')
          AND p.created_at >= ? AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)
        GROUP BY DATE_FORMAT(p.created_at, '%Y-%m')
        ORDER BY month ASC`,
        {
          replacements: [freelancerId, startDate, endDate],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      res.status(200).json({
        success: true,
        data: {
          summary: {
            total_orders: parseInt(earningsData.total_orders || 0),
            completed_orders: parseInt(earningsData.completed_orders || 0),
            total_earned: totalEarned,
            platform_fees: platformFees,
            net_earnings: totalEarned - platformFees,
            average_order_value: parseFloat(earningsData.average_order_value || 0)
          },
          balance: {
            pending_escrow: pendingEscrow,
            available_balance: Math.max(0, availableBalance),
            total_withdrawn: totalWithdrawn
          },
          monthly_earnings: monthlyEarnings,
          period: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
          }
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get freelancer earnings error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/analytics/client-spending
   * Get client spending analytics (NEW ENDPOINT)
   */
  async getClientSpending(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;
      const { start_date, end_date } = req.query;

      // Only clients and admins can access
      if (userRole !== 'client' && userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only clients can access spending data'
        });
      }

      // If admin, can view any client's spending via query param
      const clientId = userRole === 'admin' && req.query.client_id
        ? req.query.client_id
        : userId;

      // Date range
      const endDate = end_date ? new Date(end_date) : new Date();
      const startDate = start_date ? new Date(start_date) : new Date(endDate.getFullYear(), 0, 1);

      // Get spending data
      const [spendingData] = await PaymentModel.sequelize.query(
        `SELECT
          COUNT(DISTINCT p.id) as total_orders,
          SUM(CASE WHEN p.status = 'berhasil' THEN 1 ELSE 0 END) as completed_orders,
          SUM(CASE WHEN o.status = 'dikerjakan' OR o.status = 'menunggu_review' THEN 1 ELSE 0 END) as active_orders,
          SUM(CASE WHEN p.status = 'berhasil' THEN p.total_bayar ELSE 0 END) as total_spent,
          AVG(CASE WHEN p.status = 'berhasil' THEN p.total_bayar ELSE NULL END) as average_order_value
        FROM pembayaran p
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.client_id = ?
          AND p.created_at >= ? AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)`,
        {
          replacements: [clientId, startDate, endDate],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Get refunds
      const [refundData] = await PaymentModel.sequelize.query(
        `SELECT
          COUNT(r.id) as total_refunds,
          SUM(r.jumlah_refund) as total_refunded
        FROM refund r
        INNER JOIN pembayaran p ON r.pembayaran_id = p.id
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.client_id = ?
          AND r.status = 'completed'`,
        {
          replacements: [clientId],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Monthly spending breakdown
      const monthlySpending = await PaymentModel.sequelize.query(
        `SELECT
          DATE_FORMAT(p.created_at, '%Y-%m') as month,
          COUNT(p.id) as orders,
          SUM(p.total_bayar) as spent
        FROM pembayaran p
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.client_id = ?
          AND p.status = 'berhasil'
          AND p.created_at >= ? AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)
        GROUP BY DATE_FORMAT(p.created_at, '%Y-%m')
        ORDER BY month ASC`,
        {
          replacements: [clientId, startDate, endDate],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      res.status(200).json({
        success: true,
        data: {
          summary: {
            total_orders: parseInt(spendingData.total_orders || 0),
            completed_orders: parseInt(spendingData.completed_orders || 0),
            active_orders: parseInt(spendingData.active_orders || 0),
            total_spent: parseFloat(spendingData.total_spent || 0),
            average_order_value: parseFloat(spendingData.average_order_value || 0),
            total_refunds: parseInt(refundData.total_refunds || 0),
            total_refunded: parseFloat(refundData.total_refunded || 0),
            success_rate: spendingData.total_orders > 0 ? Math.round((spendingData.completed_orders / spendingData.total_orders) * 100) : 0
          },
          monthly_spending: monthlySpending,
          period: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
          }
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get client spending error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/balance
   * Get user balance (for freelancers)
   */
  async getUserBalance(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;

      if (userRole !== 'freelancer') {
        return res.status(403).json({
          success: false,
          message: 'Only freelancers have balance'
        });
      }

      // Get total earned
      const [earnedData] = await PaymentModel.sequelize.query(
        `SELECT SUM(p.jumlah) as total, SUM(p.biaya_platform) as fees
        FROM pembayaran p
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.freelancer_id = ? AND p.status IN ('berhasil', 'paid', 'success', 'settlement')`,
        {
          replacements: [userId],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Get pending escrow
      const [escrowData] = await PaymentModel.sequelize.query(
        `SELECT SUM(e.jumlah_ditahan) as amount
        FROM escrow e
        INNER JOIN pesanan o ON e.pesanan_id = o.id
        WHERE o.freelancer_id = ? AND e.status = 'ditahan'`,
        {
          replacements: [userId],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Get withdrawn
      const [withdrawnData] = await WithdrawalModel.findAll({
        attributes: [[Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total']],
        where: { freelancer_id: userId, status: 'completed' },
        raw: true
      });

      const totalEarned = parseFloat(earnedData.total || 0);
      const platformFees = parseFloat(earnedData.fees || 0);
      const pendingEscrow = parseFloat(escrowData.amount || 0);
      const withdrawn = parseFloat(withdrawnData[0]?.total || 0);
      const available = Math.max(0, totalEarned - platformFees - pendingEscrow - withdrawn);

      res.status(200).json({
        success: true,
        data: {
          total_earned: totalEarned,
          platform_fees: platformFees,
          pending_escrow: pendingEscrow,
          total_withdrawn: withdrawn,
          available_balance: available
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get balance error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  /** GET /api/payments/analytics/withdrawals
   * Get withdrawal analytics (ROLE-BASED)
   */
  async getWithdrawalAnalytics(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      let whereClause = {};

      // Only freelancers and admins can see withdrawals
      if (userRole === 'freelancer') {
        whereClause.freelancer_id = userId;
      } else if (userRole === 'client') {
        return res.status(403).json({
          success: false,
          message: 'Clients cannot access withdrawal analytics'
        });
      }

      const withdrawalStats = await WithdrawalModel.findAll({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'total_count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_amount']
        ],
        where: whereClause,
        raw: true
      });

      const withdrawalByStatus = await WithdrawalModel.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_amount']
        ],
        where: whereClause,
        group: ['status'],
        raw: true
      });

      const pendingWithdrawals = await WithdrawalModel.findAll({
        where: {
          ...whereClause,
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
          pending_withdrawals: userRole === 'admin' ? pendingWithdrawals : [],
          role: userRole
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
   * GET /api/payments/analytics/freelancer-earnings
   * Get freelancer earnings analytics (NEW ENDPOINT)
   */
  async getFreelancerEarnings(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;
      const { start_date, end_date } = req.query;

      // Only freelancers and admins can access
      if (userRole !== 'freelancer' && userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only freelancers can access earnings data'
        });
      }

      // If admin, can view any freelancer's earnings via query param
      const freelancerId = userRole === 'admin' && req.query.freelancer_id
        ? req.query.freelancer_id
        : userId;

      // Date range
      const endDate = end_date ? new Date(end_date) : new Date();
      const startDate = start_date ? new Date(start_date) : new Date(endDate.getFullYear(), 0, 1); // Start of year

      // Get earnings data
      const [earningsData] = await PaymentModel.sequelize.query(
        `SELECT
          COUNT(DISTINCT p.id) as total_orders,
          SUM(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN 1 ELSE 0 END) as completed_orders,
          SUM(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN p.jumlah ELSE 0 END) as total_earned,
          SUM(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN p.biaya_platform ELSE 0 END) as platform_fees,
          AVG(CASE WHEN p.status IN ('berhasil', 'paid', 'success', 'settlement') THEN p.jumlah ELSE NULL END) as average_order_value
        FROM pembayaran p
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.freelancer_id = ?
          AND p.created_at >= ? AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)`,
        {
          replacements: [freelancerId, startDate, endDate],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Get pending escrow
      const [escrowData] = await PaymentModel.sequelize.query(
        `SELECT
          COUNT(e.id) as pending_count,
          SUM(e.jumlah_ditahan) as pending_amount
        FROM escrow e
        INNER JOIN pesanan o ON e.pesanan_id = o.id
        WHERE o.freelancer_id = ?
          AND e.status = 'ditahan'`,
        {
          replacements: [freelancerId],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Get withdrawn amount
      const [withdrawnData] = await WithdrawalModel.findAll({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_withdrawn']
        ],
        where: {
          freelancer_id: freelancerId,
          status: 'completed'
        },
        raw: true
      });

      const totalEarned = parseFloat(earningsData.total_earned || 0);
      const platformFees = parseFloat(earningsData.platform_fees || 0);
      const pendingEscrow = parseFloat(escrowData.pending_amount || 0);
      const totalWithdrawn = parseFloat(withdrawnData[0]?.total_withdrawn || 0);
      const availableBalance = totalEarned - platformFees - pendingEscrow - totalWithdrawn;

      // Monthly earnings breakdown
      const monthlyEarnings = await PaymentModel.sequelize.query(
        `SELECT
          DATE_FORMAT(p.created_at, '%Y-%m') as month,
          COUNT(p.id) as orders,
          SUM(p.jumlah) as earnings
        FROM pembayaran p
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.freelancer_id = ?
          AND p.status IN ('berhasil', 'paid', 'success', 'settlement')
          AND p.created_at >= ? AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)
        GROUP BY DATE_FORMAT(p.created_at, '%Y-%m')
        ORDER BY month ASC`,
        {
          replacements: [freelancerId, startDate, endDate],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      res.status(200).json({
        success: true,
        data: {
          summary: {
            total_orders: parseInt(earningsData.total_orders || 0),
            completed_orders: parseInt(earningsData.completed_orders || 0),
            total_earned: totalEarned,
            platform_fees: platformFees,
            net_earnings: totalEarned - platformFees,
            average_order_value: parseFloat(earningsData.average_order_value || 0)
          },
          balance: {
            pending_escrow: pendingEscrow,
            available_balance: Math.max(0, availableBalance),
            total_withdrawn: totalWithdrawn
          },
          monthly_earnings: monthlyEarnings,
          period: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
          }
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get freelancer earnings error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/analytics/client-spending
   * Get client spending analytics (NEW ENDPOINT)
   */
  async getClientSpending(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;
      const { start_date, end_date } = req.query;

      // Only clients and admins can access
      if (userRole !== 'client' && userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only clients can access spending data'
        });
      }

      // If admin, can view any client's spending via query param
      const clientId = userRole === 'admin' && req.query.client_id
        ? req.query.client_id
        : userId;

      // Date range
      const endDate = end_date ? new Date(end_date) : new Date();
      const startDate = start_date ? new Date(start_date) : new Date(endDate.getFullYear(), 0, 1);

      // Get spending data
      const [spendingData] = await PaymentModel.sequelize.query(
        `SELECT
          COUNT(DISTINCT p.id) as total_orders,
          SUM(CASE WHEN p.status = 'berhasil' THEN 1 ELSE 0 END) as completed_orders,
          SUM(CASE WHEN o.status = 'dikerjakan' OR o.status = 'menunggu_review' THEN 1 ELSE 0 END) as active_orders,
          SUM(CASE WHEN p.status = 'berhasil' THEN p.total_bayar ELSE 0 END) as total_spent,
          AVG(CASE WHEN p.status = 'berhasil' THEN p.total_bayar ELSE NULL END) as average_order_value
        FROM pembayaran p
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.client_id = ?
          AND p.created_at >= ? AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)`,
        {
          replacements: [clientId, startDate, endDate],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Get refunds
      const [refundData] = await PaymentModel.sequelize.query(
        `SELECT
          COUNT(r.id) as total_refunds,
          SUM(r.jumlah_refund) as total_refunded
        FROM refund r
        INNER JOIN pembayaran p ON r.pembayaran_id = p.id
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.client_id = ?
          AND r.status = 'completed'`,
        {
          replacements: [clientId],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Monthly spending breakdown
      const monthlySpending = await PaymentModel.sequelize.query(
        `SELECT
          DATE_FORMAT(p.created_at, '%Y-%m') as month,
          COUNT(p.id) as orders,
          SUM(p.total_bayar) as spent
        FROM pembayaran p
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.client_id = ?
          AND p.status = 'berhasil'
          AND p.created_at >= ? AND p.created_at < DATE_ADD(?, INTERVAL 1 DAY)
        GROUP BY DATE_FORMAT(p.created_at, '%Y-%m')
        ORDER BY month ASC`,
        {
          replacements: [clientId, startDate, endDate],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      res.status(200).json({
        success: true,
        data: {
          summary: {
            total_orders: parseInt(spendingData.total_orders || 0),
            completed_orders: parseInt(spendingData.completed_orders || 0),
            active_orders: parseInt(spendingData.active_orders || 0),
            total_spent: parseFloat(spendingData.total_spent || 0),
            average_order_value: parseFloat(spendingData.average_order_value || 0),
            total_refunds: parseInt(refundData.total_refunds || 0),
            total_refunded: parseFloat(refundData.total_refunded || 0),
            success_rate: spendingData.total_orders > 0 ? Math.round((spendingData.completed_orders / spendingData.total_orders) * 100) : 0
          },
          monthly_spending: monthlySpending,
          period: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
          }
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get client spending error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/payments/balance
   * Get user balance (for freelancers)
   */
  async getUserBalance(req, res) {
    try {
      const userId = req.user?.userId || req.user?.id;
      const userRole = req.user?.role;

      if (userRole !== 'freelancer') {
        return res.status(403).json({
          success: false,
          message: 'Only freelancers have balance'
        });
      }

      // Get total earned
      const [earnedData] = await PaymentModel.sequelize.query(
        `SELECT SUM(p.jumlah) as total, SUM(p.biaya_platform) as fees
        FROM pembayaran p
        INNER JOIN pesanan o ON p.pesanan_id = o.id
        WHERE o.freelancer_id = ? AND p.status IN ('berhasil', 'paid', 'success', 'settlement')`,
        {
          replacements: [userId],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Get pending escrow
      const [escrowData] = await PaymentModel.sequelize.query(
        `SELECT SUM(e.jumlah_ditahan) as amount
        FROM escrow e
        INNER JOIN pesanan o ON e.pesanan_id = o.id
        WHERE o.freelancer_id = ? AND e.status = 'ditahan'`,
        {
          replacements: [userId],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Get withdrawn
      const [withdrawnData] = await WithdrawalModel.findAll({
        attributes: [[Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total']],
        where: { freelancer_id: userId, status: 'completed' },
        raw: true
      });

      const totalEarned = parseFloat(earnedData.total || 0);
      const platformFees = parseFloat(earnedData.fees || 0);
      const pendingEscrow = parseFloat(escrowData.amount || 0);
      const withdrawn = parseFloat(withdrawnData[0]?.total || 0);
      const available = Math.max(0, totalEarned - platformFees - pendingEscrow - withdrawn);

      res.status(200).json({
        success: true,
        data: {
          total_earned: totalEarned,
          platform_fees: platformFees,
          pending_escrow: pendingEscrow,
          total_withdrawn: withdrawn,
          available_balance: available
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get balance error:', error);
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
      const user_id = req.user?.userId || req.user?.id || req.body.user_id;

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

  /**
   * POST /api/payments/refund/request
   * Request refund - alternative endpoint with payment_id in body
   */
  async requestRefundAlt(req, res) {
    try {
      const { payment_id, alasan, jumlah_refund } = req.body;
      const user_id = req.user?.userId || req.user?.id;

      if (!payment_id) {
        return res.status(400).json({
          success: false,
          message: 'payment_id is required'
        });
      }

      const result = await this.requestRefundUseCase.execute({
        pembayaran_id: payment_id,
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
   * GET /api/payments/withdrawal/history
   * Get user's withdrawal history
   */
  async getWithdrawalHistory(req, res) {
    try {
      const user_id = req.user?.userId || req.user?.id;
      const { status, limit = 50, offset = 0 } = req.query;

      const where = { user_id };
      if (status) {
        where.status = status;
      }

      const WithdrawalModel = require('../../infrastructure/models/WithdrawalModel');
      const withdrawals = await WithdrawalModel.findAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: withdrawals,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: withdrawals.length
        }
      });

    } catch (error) {
      console.error('[PAYMENT CONTROLLER] Get withdrawal history error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = PaymentController;
