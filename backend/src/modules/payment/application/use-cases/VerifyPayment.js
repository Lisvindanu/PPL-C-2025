/**
 * Verify Payment Use Case
 * Handle webhook dari payment gateway dan update status pembayaran
 */

const PaymentModel = require('../../infrastructure/models/PaymentModel');
const EscrowService = require('../../infrastructure/services/EscrowService');
const MockPaymentGatewayService = require('../../infrastructure/services/MockPaymentGatewayService');
const MidtransService = require('../../infrastructure/services/MidtransService');

class VerifyPayment {
  constructor() {
    this.escrowService = new EscrowService();
    // Keep both services for different gateways
    this.mockGateway = new MockPaymentGatewayService();
    this.midtransGateway = new MidtransService();
  }

  /**
   * Execute payment verification dari webhook
   * @param {Object} webhookData - Data dari payment gateway webhook
   * @returns {Promise<Object>} Verification result
   */
  async execute(webhookData) {
    const {
      transaction_id,
      transaction_status,
      gross_amount,
      signature
    } = webhookData;

    console.log(`[PAYMENT WEBHOOK] Received webhook for ${transaction_id}`);
    console.log(`[PAYMENT WEBHOOK] Status: ${transaction_status}, Amount: ${gross_amount}`);

    // 1. Get payment record first to determine gateway type
    const payment = await PaymentModel.findOne({
      where: { transaction_id }
    });

    if (!payment) {
      console.error(`[PAYMENT WEBHOOK] Payment not found: ${transaction_id}`);
      throw new Error('Payment not found');
    }

    // 2. Verify signature based on gateway type
    const paymentGateway = payment.payment_gateway === 'midtrans'
      ? this.midtransGateway
      : this.mockGateway;

    const isValidSignature = await paymentGateway.verifyWebhookSignature(webhookData);
    if (!isValidSignature) {
      console.error(`[PAYMENT WEBHOOK] Invalid signature for ${transaction_id}`);
      throw new Error('Invalid webhook signature');
    }

    // 3. Map status dari payment gateway
    const mappedStatus = this.mapPaymentStatus(transaction_status);

    // 4. Update payment status
    payment.status = mappedStatus;
    payment.callback_data = webhookData;
    payment.callback_signature = signature;

    // 5. Handle payment success
    if (mappedStatus === 'berhasil') {
      payment.dibayar_pada = new Date();
      payment.nomor_invoice = this.generateInvoiceNumber(payment.id);

      await payment.save();

      // 6. Create escrow to hold the payment
      await this.createEscrowFromPayment(payment);

      console.log(`[PAYMENT WEBHOOK] Payment successful: ${transaction_id}`);
      console.log(`[PAYMENT WEBHOOK] Invoice: ${payment.nomor_invoice}`);
      console.log(`[PAYMENT WEBHOOK] Escrow created, funds held for 7 days`);

      // Integration points for other modules:
      // - Order module: Update order status to 'dibayar'
      // - Notification module: Send notification to freelancer
      // - Email module: Send invoice email to client

    } else if (mappedStatus === 'gagal') {
      await payment.save();
      console.log(`[PAYMENT WEBHOOK] Payment failed: ${transaction_id}`);

      // Integration points for other modules:
      // - Order module: Update order status to 'dibatalkan'
      // - Notification module: Send notification to client

    } else if (mappedStatus === 'kadaluarsa') {
      await payment.save();
      console.log(`[PAYMENT WEBHOOK] Payment expired: ${transaction_id}`);

      // Integration points for other modules:
      // - Order module: Update order status to 'dibatalkan'
      // - Notification module: Send notification to client
    } else {
      await payment.save();
      console.log(`[PAYMENT WEBHOOK] Payment status updated to: ${mappedStatus}`);
    }

    return {
      success: true,
      transaction_id,
      status: mappedStatus,
      message: 'Webhook processed successfully'
    };
  }

  /**
   * Create escrow dari payment yang berhasil
   * @private
   */
  async createEscrowFromPayment(payment) {
    // Get pesanan_id from payment
    const { pesanan_id, jumlah, biaya_platform, id: pembayaran_id } = payment;

    // Create escrow
    await this.escrowService.createEscrow({
      pembayaran_id,
      pesanan_id,
      jumlah_ditahan: parseFloat(jumlah),
      biaya_platform: parseFloat(biaya_platform)
    });
  }

  /**
   * Map payment gateway status to our status
   * @private
   */
  mapPaymentStatus(gatewayStatus) {
    const statusMap = {
      // Midtrans/Xendit statuses
      'capture': 'berhasil',
      'settlement': 'berhasil',
      'success': 'berhasil',
      'paid': 'berhasil',
      'pending': 'menunggu',
      'deny': 'gagal',
      'cancel': 'gagal',
      'expire': 'kadaluarsa',
      'expired': 'kadaluarsa',
      'failure': 'gagal',
      'failed': 'gagal'
    };

    return statusMap[gatewayStatus.toLowerCase()] || 'gagal';
  }

  /**
   * Generate invoice number
   * @private
   */
  generateInvoiceNumber(paymentId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const uniqueId = paymentId.substring(0, 8).toUpperCase();
    return `INV/${year}/${month}/${uniqueId}`;
  }
}

module.exports = VerifyPayment;
