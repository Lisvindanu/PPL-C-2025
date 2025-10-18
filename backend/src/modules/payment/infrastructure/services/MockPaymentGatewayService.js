/**
 * Mock Payment Gateway Service
 * Simulasi payment gateway untuk development/testing
 * Mendukung: QRIS, Virtual Account, E-Wallet, Transfer Bank, Kartu Kredit
 */

const crypto = require('crypto');

class MockPaymentGatewayService {
  constructor() {
    this.baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    this.pendingPayments = new Map(); // Store untuk simulasi pending payments
  }

  /**
   * Create payment transaction
   * @param {Object} params - Payment parameters
   * @returns {Promise<Object>} Payment response dengan payment_url
   */
  async createTransaction({
    transaction_id,
    gross_amount,
    customer_details,
    payment_method,
    channel
  }) {
    // Generate external ID (simulasi token dari payment gateway)
    const external_id = this.generateExternalId();

    // Generate payment URL (mock payment page)
    const payment_url = `${this.baseUrl}/mock-payment/${external_id}`;

    // Simulate payment gateway response
    const response = {
      transaction_id,
      external_id,
      payment_url,
      gross_amount,
      status: 'pending',
      payment_method,
      channel,
      created_at: new Date().toISOString(),
      expires_at: this.getExpiryTime(),
      // Mock payment instructions berdasarkan metode
      instructions: this.getPaymentInstructions(payment_method, channel, gross_amount)
    };

    // Store pending payment untuk simulasi callback nanti
    this.pendingPayments.set(external_id, {
      transaction_id,
      gross_amount,
      status: 'pending',
      created_at: new Date()
    });

    // Simulate webhook callback after 3 seconds (auto-success untuk testing)
    if (process.env.MOCK_AUTO_SUCCESS === 'true') {
      setTimeout(() => {
        this.simulateSuccessCallback(transaction_id, external_id, gross_amount);
      }, 3000);
    }

    return response;
  }

  /**
   * Verify payment webhook
   * @param {Object} webhookData - Webhook data from payment gateway
   * @returns {Boolean} Signature valid atau tidak
   */
  verifyWebhookSignature(webhookData) {
    // Mock signature verification
    // Dalam production, ini akan verify signature dari payment gateway
    const { transaction_id, status, gross_amount, signature } = webhookData;

    if (!signature) return false;

    const expectedSignature = this.generateSignature(transaction_id, status, gross_amount);
    return signature === expectedSignature;
  }

  /**
   * Get payment status
   * @param {String} transaction_id - Transaction ID
   * @returns {Promise<Object>} Payment status
   */
  async getPaymentStatus(transaction_id) {
    // Simulate API call to payment gateway
    return {
      transaction_id,
      status: 'pending', // Mock: could be 'pending', 'settlement', 'failed', 'expired'
      gross_amount: 0,
      payment_type: 'mock',
      transaction_time: new Date().toISOString()
    };
  }

  /**
   * Cancel/Expire payment
   * @param {String} transaction_id - Transaction ID
   * @returns {Promise<Object>} Cancel response
   */
  async cancelTransaction(transaction_id) {
    return {
      transaction_id,
      status: 'cancelled',
      message: 'Transaction cancelled successfully'
    };
  }

  /**
   * Generate external ID (simulasi token dari gateway)
   * @private
   */
  generateExternalId() {
    return `MOCK-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }

  /**
   * Generate signature untuk webhook verification
   * @private
   */
  generateSignature(transaction_id, status, gross_amount) {
    const secret = process.env.MOCK_PAYMENT_SECRET || 'mock-secret-key';
    const payload = `${transaction_id}:${status}:${gross_amount}:${secret}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  /**
   * Get expiry time (24 hours from now)
   * @private
   */
  getExpiryTime() {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    return expiry.toISOString();
  }

  /**
   * Get payment instructions berdasarkan metode
   * @private
   */
  getPaymentInstructions(payment_method, channel, amount) {
    const instructions = {
      qris: {
        type: 'QRIS',
        title: 'Scan QR Code',
        steps: [
          'Buka aplikasi e-wallet/mobile banking',
          'Pilih menu Scan QR',
          'Scan QR code di bawah',
          'Konfirmasi pembayaran'
        ],
        qr_string: `mock-qris-${Date.now()}`,
        qr_url: `${this.baseUrl}/mock-qr/${Date.now()}.png`
      },
      virtual_account: {
        type: 'Virtual Account',
        title: `Transfer ke VA ${channel || 'Bank'}`,
        va_number: this.generateVANumber(channel),
        bank: channel || 'BCA',
        amount,
        steps: [
          `Transfer ke nomor VA: ${this.generateVANumber(channel)}`,
          `Bank: ${channel || 'BCA'}`,
          `Jumlah: Rp ${Number(amount).toLocaleString('id-ID')}`,
          'Pembayaran otomatis terverifikasi'
        ]
      },
      e_wallet: {
        type: 'E-Wallet',
        title: `${channel || 'GoPay'} Payment`,
        steps: [
          `Buka aplikasi ${channel || 'GoPay'}`,
          'Cek notifikasi pembayaran',
          'Konfirmasi pembayaran',
          `Jumlah: Rp ${Number(amount).toLocaleString('id-ID')}`
        ],
        deeplink: `gojek://gopay/merchanttransfer?amount=${amount}&orderid=MOCK`
      },
      transfer_bank: {
        type: 'Transfer Bank',
        title: 'Transfer Manual',
        bank_account: {
          bank: 'Bank Mandiri',
          account_number: '1370013370133',
          account_name: 'SkillConnect Indonesia'
        },
        amount,
        steps: [
          'Transfer ke rekening di atas',
          `Jumlah: Rp ${Number(amount).toLocaleString('id-ID')}`,
          'Upload bukti transfer',
          'Tunggu verifikasi admin (max 1x24 jam)'
        ]
      },
      kartu_kredit: {
        type: 'Kartu Kredit',
        title: 'Pembayaran Kartu Kredit/Debit',
        steps: [
          'Masukkan nomor kartu',
          'Masukkan tanggal kadaluarsa',
          'Masukkan CVV',
          'Klik Bayar'
        ]
      }
    };

    return instructions[payment_method] || instructions.transfer_bank;
  }

  /**
   * Generate Virtual Account number
   * @private
   */
  generateVANumber(bank) {
    const prefix = {
      'BCA': '7013',
      'BNI': '8013',
      'BRI': '26213',
      'Mandiri': '70012',
      'Permata': '85013'
    };

    const bankPrefix = prefix[bank] || '7013';
    const suffix = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    return bankPrefix + suffix;
  }

  /**
   * Simulate successful payment callback (untuk testing)
   * @private
   */
  async simulateSuccessCallback(transaction_id, external_id, gross_amount) {
    try {
      const webhookUrl = `${this.baseUrl}/api/payments/webhook`;

      const webhookData = {
        transaction_id,
        external_id,
        transaction_status: 'settlement',
        status_code: '200',
        gross_amount: gross_amount.toString(),
        payment_type: 'mock',
        transaction_time: new Date().toISOString(),
        signature: this.generateSignature(transaction_id, 'settlement', gross_amount)
      };

      console.log(`[MOCK GATEWAY] Simulating success callback for ${transaction_id}`);

      // Dalam production, ini akan kirim HTTP POST ke webhook URL
      // Untuk mock, kita bisa skip atau implement jika perlu

      return webhookData;
    } catch (error) {
      console.error('[MOCK GATEWAY] Failed to send callback:', error);
    }
  }

  /**
   * Manual trigger payment success (untuk testing via API)
   */
  async triggerPaymentSuccess(transaction_id, gross_amount) {
    const external_id = `MOCK-MANUAL-${Date.now()}`;
    return this.simulateSuccessCallback(transaction_id, external_id, gross_amount);
  }

  /**
   * Manual trigger payment failure (untuk testing via API)
   */
  async triggerPaymentFailure(transaction_id, gross_amount, reason = 'Payment declined') {
    const webhookData = {
      transaction_id,
      transaction_status: 'deny',
      status_code: '400',
      gross_amount: gross_amount.toString(),
      payment_type: 'mock',
      transaction_time: new Date().toISOString(),
      failure_reason: reason,
      signature: this.generateSignature(transaction_id, 'deny', gross_amount)
    };

    console.log(`[MOCK GATEWAY] Simulating failure callback for ${transaction_id}`);
    return webhookData;
  }
}

module.exports = MockPaymentGatewayService;
