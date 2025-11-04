/**
 * Midtrans Payment Gateway Service
 * Real payment gateway integration using Midtrans Snap
 *
 * Features:
 * - Snap Payment (All payment methods in one)
 * - Webhook notification handling
 * - Transaction status checking
 * - Signature verification
 *
 * Note: Untuk escrow, kita gunakan sistem internal.
 * Midtrans tidak support escrow secara native, jadi flow-nya:
 * 1. Customer bayar via Midtrans
 * 2. Dana masuk ke merchant account
 * 3. Kita hold dana di sistem internal (escrow table)
 * 4. Release ke freelancer setelah order selesai
 */

const midtransClient = require('midtrans-client');
const crypto = require('crypto');

class MidtransService {
  constructor() {
    // Initialize Snap API client
    this.snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    // Initialize Core API client (untuk check status)
    this.coreApi = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    this.merchantId = process.env.MIDTRANS_MERCHANT_ID;
  }

  /**
   * Create payment transaction using Snap
   * @param {Object} params - Payment parameters
   * @returns {Promise<Object>} Payment response with redirect_url
   */
  async createTransaction({
    transaction_id,
    gross_amount,
    customer_details,
    item_details,
    payment_method = null,
    channel = null
  }) {
    try {
      // Prepare transaction parameter
      const parameter = {
        transaction_details: {
          order_id: transaction_id,
          gross_amount: Math.round(gross_amount) // Must be integer
        },
        customer_details: {
          first_name: customer_details.first_name || customer_details.nama_depan || 'Customer',
          last_name: customer_details.last_name || customer_details.nama_belakang || '',
          email: customer_details.email,
          phone: customer_details.phone || customer_details.nomor_telepon || ''
        },
        item_details: item_details || [{
          id: 'ORDER-1',
          price: Math.round(gross_amount),
          quantity: 1,
          name: 'SkillConnect Service Payment'
        }],
        callbacks: {
          finish: `${process.env.FRONTEND_URL}/payment/success`,
          error: `${process.env.FRONTEND_URL}/payment/error`,
          pending: `${process.env.FRONTEND_URL}/payment/pending`
        }
      };

      // Optional: Enable specific payment methods
      if (payment_method) {
        parameter.enabled_payments = this.getEnabledPayments(payment_method, channel);
      }

      // Create transaction via Snap
      const transaction = await this.snap.createTransaction(parameter);

      return {
        transaction_id,
        external_id: transaction.token,
        payment_url: transaction.redirect_url,
        token: transaction.token,
        status: 'pending',
        payment_method,
        channel,
        created_at: new Date().toISOString(),
        expires_at: this.getExpiryTime()
      };
    } catch (error) {
      console.error('[MIDTRANS] Create transaction error:', error);
      throw new Error(`Failed to create Midtrans transaction: ${error.message}`);
    }
  }

  /**
   * Verify webhook notification from Midtrans
   */
  async verifyWebhookSignature(notification) {
    try {
      const {
        order_id,
        status_code,
        gross_amount,
        signature_key
      } = notification;

      const serverKey = process.env.MIDTRANS_SERVER_KEY;
      const input = `${order_id}${status_code}${gross_amount}${serverKey}`;
      const hash = crypto.createHash('sha512').update(input).digest('hex');

      return hash === signature_key;
    } catch (error) {
      console.error('[MIDTRANS] Signature verification error:', error);
      return false;
    }
  }

  /**
   * Get payment status from Midtrans
   */
  async getPaymentStatus(transaction_id) {
    try {
      const statusResponse = await this.coreApi.transaction.status(transaction_id);

      return {
        transaction_id: statusResponse.order_id,
        status: this.mapTransactionStatus(statusResponse.transaction_status),
        fraud_status: statusResponse.fraud_status,
        payment_type: statusResponse.payment_type,
        gross_amount: statusResponse.gross_amount,
        transaction_time: statusResponse.transaction_time,
        raw_response: statusResponse
      };
    } catch (error) {
      console.error('[MIDTRANS] Get status error:', error);
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }

  /**
   * Cancel/Expire transaction
   */
  async cancelTransaction(transaction_id) {
    try {
      const response = await this.coreApi.transaction.cancel(transaction_id);

      return {
        transaction_id,
        status: 'cancelled',
        message: 'Transaction cancelled successfully',
        raw_response: response
      };
    } catch (error) {
      console.error('[MIDTRANS] Cancel transaction error:', error);
      throw new Error(`Failed to cancel transaction: ${error.message}`);
    }
  }

  /**
   * Map Midtrans transaction status to our internal status
   */
  mapTransactionStatus(midtransStatus) {
    const statusMap = {
      'capture': 'berhasil',
      'settlement': 'berhasil',
      'pending': 'menunggu',
      'deny': 'gagal',
      'cancel': 'gagal',
      'expire': 'kadaluarsa',
      'refund': 'refund',
      'partial_refund': 'refund'
    };

    return statusMap[midtransStatus] || 'gagal';
  }

  /**
   * Get enabled payment methods based on user selection
   */
  getEnabledPayments(payment_method, channel) {
    const paymentMap = {
      'qris': ['qris'],
      'virtual_account': this.getVirtualAccountChannels(channel),
      'e_wallet': this.getEWalletChannels(channel),
      'transfer_bank': ['permata_va', 'bca_va', 'bni_va', 'bri_va', 'other_va'],
      'kartu_kredit': ['credit_card']
    };

    return paymentMap[payment_method] || [];
  }

  /**
   * Get virtual account channels
   */
  getVirtualAccountChannels(channel) {
    if (channel) {
      const channelMap = {
        'BCA': ['bca_va'],
        'BNI': ['bni_va'],
        'BRI': ['bri_va'],
        'Mandiri': ['echannel'],
        'Permata': ['permata_va']
      };
      return channelMap[channel] || ['bca_va'];
    }

    return ['bca_va', 'bni_va', 'bri_va', 'permata_va', 'other_va'];
  }

  /**
   * Get e-wallet channels
   */
  getEWalletChannels(channel) {
    if (channel) {
      const channelMap = {
        'GoPay': ['gopay'],
        'ShopeePay': ['shopeepay'],
        'QRIS': ['qris']
      };
      return channelMap[channel] || ['gopay'];
    }

    return ['gopay', 'shopeepay', 'qris'];
  }

  /**
   * Get expiry time (24 hours from now)
   */
  getExpiryTime() {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    return expiry.toISOString();
  }

  /**
   * Process notification from Midtrans webhook
   */
  async processNotification(notificationJson) {
    try {
      const statusResponse = await this.snap.transaction.notification(notificationJson);

      return {
        transaction_id: statusResponse.order_id,
        external_id: statusResponse.transaction_id,
        transaction_status: this.mapTransactionStatus(statusResponse.transaction_status),
        payment_type: statusResponse.payment_type,
        gross_amount: statusResponse.gross_amount,
        transaction_time: statusResponse.transaction_time,
        fraud_status: statusResponse.fraud_status,
        status_code: statusResponse.status_code,
        signature_key: statusResponse.signature_key,
        raw_notification: statusResponse
      };
    } catch (error) {
      console.error('[MIDTRANS] Process notification error:', error);
      throw new Error(`Failed to process notification: ${error.message}`);
    }
  }
}

module.exports = MidtransService;
