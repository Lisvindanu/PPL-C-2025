/**
 * Retry Payment Use Case
 * Retry failed payment dengan transaction_id yang sama atau buat baru
 */

const PaymentModel = require('../../infrastructure/models/PaymentModel');
const MockPaymentGatewayService = require('../../infrastructure/services/MockPaymentGatewayService');
const { v4: uuidv4 } = require('uuid');

class RetryPayment {
  constructor() {
    this.mockGateway = new MockPaymentGatewayService();
  }

  async execute({ pembayaran_id, metode_pembayaran, channel }) {
    try {
      // Get failed payment
      const payment = await PaymentModel.findByPk(pembayaran_id);

      if (!payment) {
        throw new Error('Payment tidak ditemukan');
      }

      // Validasi status - hanya bisa retry jika failed atau expired
      if (!['failed', 'gagal', 'expired', 'kadaluarsa'].includes(payment.status)) {
        throw new Error('Payment hanya bisa di-retry jika statusnya failed atau expired');
      }

      // Check retry count
      const retryCount = payment.retry_count || 0;
      const maxRetries = 3;

      if (retryCount >= maxRetries) {
        throw new Error(`Maximum retry limit (${maxRetries}) tercapai. Silakan buat pembayaran baru.`);
      }

      // Create new payment attempt with same order
      const newTransactionId = `PAY-${Date.now()}-${uuidv4().substring(0, 8)}`;

      // Generate new payment URL
      const paymentUrl = await this.mockGateway.createPayment({
        transaction_id: newTransactionId,
        amount: parseFloat(payment.total_bayar || payment.jumlah),
        payment_method: metode_pembayaran || payment.metode_pembayaran,
        channel: channel || payment.channel || 'web'
      });

      // Update old payment
      await payment.update({
        status: 'superseded', // Mark as replaced by new payment
        updated_at: new Date()
      });

      // Create new payment record
      const newPayment = await PaymentModel.create({
        id: uuidv4(),
        pesanan_id: payment.pesanan_id,
        transaction_id: newTransactionId,
        external_id: `EXT-${newTransactionId}`,
        jumlah: payment.jumlah,
        biaya_platform: payment.biaya_platform,
        biaya_payment_gateway: payment.biaya_payment_gateway,
        total_bayar: payment.total_bayar,
        metode_pembayaran: metode_pembayaran || payment.metode_pembayaran,
        channel: channel || payment.channel || 'web',
        payment_gateway: 'mock',
        payment_url: paymentUrl,
        status: 'pending',
        nomor_invoice: payment.nomor_invoice, // Keep same invoice number
        retry_count: retryCount + 1,
        original_payment_id: pembayaran_id,
        callback_data: null,
        created_at: new Date(),
        updated_at: new Date()
      });

      return {
        old_payment: payment,
        new_payment: newPayment,
        payment_url: paymentUrl,
        retry_count: retryCount + 1,
        message: `Payment retry berhasil dibuat (attempt ${retryCount + 1}/${maxRetries})`
      };

    } catch (error) {
      console.error('[RETRY PAYMENT] Error:', error);
      throw error;
    }
  }
}

module.exports = RetryPayment;
