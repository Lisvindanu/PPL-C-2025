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
      console.warn(`[PAYMENT WEBHOOK] Payment not found: ${transaction_id} - ignoring webhook`);
      // Return success to stop Midtrans from retrying
      return {
        success: true,
        message: 'Payment not found - webhook ignored',
        ignored: true
      };
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
    payment.callback_data = JSON.stringify(webhookData);
    
    if (mappedStatus === 'berhasil') {
      payment.dibayar_pada = new Date();
    }
    
    await payment.save();

    console.log(`[PAYMENT WEBHOOK] Payment ${transaction_id} updated to status: ${mappedStatus}`);

    // 5. Handle special actions based on status
    if (mappedStatus === 'berhasil') {
      await this.handleSuccessfulPayment(payment);
    }

    return {
      success: true,
      payment_id: payment.id,
      status: mappedStatus,
      message: 'Payment verified successfully'
    };
  }

  /**
   * Handle successful payment - create escrow, update order
   */
  async handleSuccessfulPayment(payment) {
    try {
      // Create escrow entry
      await this.escrowService.createEscrow({
        payment_id: payment.id,
        amount: payment.jumlah,
        pesanan_id: payment.pesanan_id
      });

      console.log(`[PAYMENT WEBHOOK] Escrow created for payment ${payment.id}`);
      
      // Update order status
      const OrderService = require('../../../order/application/services/OrderService');
      const orderService = new OrderService();
      await orderService.updateOrderStatus(payment.pesanan_id, 'dibayar');
      
      console.log(`[PAYMENT WEBHOOK] Order ${payment.pesanan_id} status updated to dibayar`);
      
    } catch (error) {
      console.error('[PAYMENT WEBHOOK] Error handling successful payment:', error);
      // Don't throw - payment was successful even if escrow/order update fails
    }
  }

  /**
   * Map payment gateway status to internal status
   */
  mapPaymentStatus(gatewayStatus) {
    const statusMap = {
      // Midtrans statuses
      'capture': 'berhasil',
      'settlement': 'berhasil',
      'pending': 'menunggu',
      'deny': 'gagal',
      'expire': 'kadaluarsa',
      'cancel': 'dibatalkan',
      'refund': 'dikembalikan',
      'partial_refund': 'dikembalikan',
      
      // Mock gateway statuses
      'paid': 'berhasil',
      'unpaid': 'menunggu',
      'failed': 'gagal'
    };

    return statusMap[gatewayStatus?.toLowerCase()] || 'menunggu';
  }
}

module.exports = VerifyPayment;
