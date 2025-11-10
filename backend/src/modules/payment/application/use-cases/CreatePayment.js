/**
 * Create Payment Use Case
 * Handle payment creation dan integrasi dengan mock payment gateway
 */

const Payment = require('../../domain/entities/Payment');
const PaymentModel = require('../../infrastructure/models/PaymentModel');
const MockPaymentGatewayService = require('../../infrastructure/services/MockPaymentGatewayService');
const MidtransService = require('../../infrastructure/services/MidtransService');
const { v4: uuidv4 } = require('uuid');

class CreatePayment {
  constructor() {
    // Switch antara Mock dan Midtrans berdasarkan environment
    const useRealGateway = process.env.PAYMENT_GATEWAY === 'midtrans' ||
                          process.env.NODE_ENV === 'production';

    this.paymentGateway = useRealGateway
      ? new MidtransService()
      : new MockPaymentGatewayService();

    this.gatewayType = useRealGateway ? 'midtrans' : 'mock';

    console.log(`[PAYMENT] Using ${this.gatewayType} payment gateway`);
  }

  /**
   * Execute payment creation
   * @param {Object} dto - Payment data transfer object
   * @returns {Promise<Object>} Payment response dengan payment_url
   */
  async execute(dto) {
    const {
      pesanan_id,
      user_id,
      jumlah,
      metode_pembayaran,
      channel
    } = dto;

    // 1. Validate input
    this.validateInput(dto);

    // 2. Generate transaction ID
    const transaction_id = this.generateTransactionId();

    // 3. Calculate fees
    const biaya_platform = jumlah * 0.05; // 5% platform fee
    const biaya_payment_gateway = jumlah * 0.01; // 1% gateway fee
    const total_bayar = parseFloat(jumlah) + biaya_platform + biaya_payment_gateway;

    // 4. Create payment entity
    const payment = new Payment({
      id: uuidv4(),
      pesanan_id,
      user_id,
      transaction_id,
      jumlah: parseFloat(jumlah),
      biaya_platform,
      biaya_payment_gateway,
      total_bayar,
      metode_pembayaran,
      channel: channel || metode_pembayaran,
      payment_gateway: this.gatewayType,
      status: 'menunggu'
    });

    // Set expiry time (24 hours)
    payment.setExpiryTime(24);

    // Validate payment
    payment.validate();

    // 5. Create transaction via Payment Gateway (Mock or Midtrans)
    const gatewayResponse = await this.paymentGateway.createTransaction({
      transaction_id,
      gross_amount: total_bayar,
      customer_details: {
        user_id,
        email: dto.customer_email || 'customer@example.com',
        first_name: dto.customer_name || 'Customer',
        phone: dto.customer_phone || ''
      },
      payment_method: metode_pembayaran,
      channel: channel || metode_pembayaran,
      item_details: dto.item_details || [{
        id: pesanan_id,
        price: total_bayar,
        quantity: 1,
        name: dto.order_title || 'SkillConnect Service'
      }]
    });

    payment.payment_url = gatewayResponse.payment_url;
    payment.external_id = gatewayResponse.external_id;

    // 6. Save payment to database
    const paymentRecord = await PaymentModel.create({
      id: payment.id,
      pesanan_id: payment.pesanan_id,
      user_id: payment.user_id,
      transaction_id: payment.transaction_id,
      external_id: payment.external_id,
      jumlah: payment.jumlah,
      biaya_platform: payment.biaya_platform,
      biaya_payment_gateway: payment.biaya_payment_gateway,
      total_bayar: payment.total_bayar,
      metode_pembayaran: payment.metode_pembayaran,
      channel: payment.channel,
      payment_gateway: payment.payment_gateway,
      payment_url: payment.payment_url,
      status: payment.status,
      kadaluarsa_pada: payment.kadaluarsa_pada
    });

    console.log(`[PAYMENT] Created payment ${payment.id} for order ${pesanan_id}`);
    console.log(`[PAYMENT] Transaction ID: ${transaction_id}`);
    console.log(`[PAYMENT] Amount: Rp ${jumlah}, Total: Rp ${total_bayar}`);
    console.log(`[PAYMENT] Method: ${metode_pembayaran}, Channel: ${channel || metode_pembayaran}`);

    return {
      payment_id: paymentRecord.id,
      transaction_id: paymentRecord.transaction_id,
      payment_url: paymentRecord.payment_url,
      total_bayar: parseFloat(paymentRecord.total_bayar),
      status: paymentRecord.status,
      expires_at: paymentRecord.kadaluarsa_pada,
      payment_instructions: gatewayResponse.payment_instructions
    };
  }

  /**
   * Validate input
   * @private
   */
  validateInput(dto) {
    const errors = [];

    if (!dto.pesanan_id) errors.push('pesanan_id is required');
    if (!dto.user_id) errors.push('user_id is required');
    if (!dto.jumlah || dto.jumlah <= 0) errors.push('jumlah must be greater than 0');
    if (!dto.metode_pembayaran) errors.push('metode_pembayaran is required');

    const validMethods = ['transfer_bank', 'e_wallet', 'kartu_kredit', 'qris', 'virtual_account'];
    if (!validMethods.includes(dto.metode_pembayaran)) {
      errors.push(`metode_pembayaran must be one of: ${validMethods.join(', ')}`);
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  /**
   * Generate unique transaction ID
   * @private
   */
  generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY-${timestamp}-${random}`;
  }
}

module.exports = CreatePayment;
