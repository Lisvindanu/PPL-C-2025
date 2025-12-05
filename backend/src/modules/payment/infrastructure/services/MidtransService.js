/**
 * Midtrans Payment Gateway Service
 * Real payment gateway integration using Midtrans Core API for custom UI
 *
 * Features:
 * - Core API Payment (Custom UI for each payment method)
 * - QRIS with QR code generation
 * - Virtual Account with VA number
 * - E-Wallet with deeplink
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
    // Initialize Core API client for custom UI
    this.coreApi = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    // Initialize Snap API client (fallback)
    this.snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    this.merchantId = process.env.MIDTRANS_MERCHANT_ID;
    this.clientKey = process.env.MIDTRANS_CLIENT_KEY;
  }

  /**
   * Create payment transaction using Core API Charge
   * @param {Object} params - Payment parameters
   * @returns {Promise<Object>} Payment response with payment instructions
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
      console.log(`[MIDTRANS] Creating ${payment_method} payment via Core API`);

      // Prepare base transaction parameter
      const parameter = {
        payment_type: this.mapPaymentType(payment_method),
        transaction_details: {
          order_id: transaction_id,
          gross_amount: Math.round(gross_amount)
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
        }]
      };

      // Add payment method specific parameters
      this.addPaymentMethodParams(parameter, payment_method, channel);

      // Charge via Core API
      const chargeResponse = await this.coreApi.charge(parameter);

      console.log('[MIDTRANS] Charge response:', JSON.stringify(chargeResponse, null, 2));

      // Extract payment instructions based on payment method
      const paymentInstructions = this.extractPaymentInstructions(chargeResponse, payment_method);

      return {
        transaction_id,
        external_id: chargeResponse.transaction_id,
        payment_url: null, // No redirect URL for custom UI
        token: null,
        status: 'pending',
        payment_method,
        channel,
        payment_instructions: paymentInstructions,
        created_at: new Date().toISOString(),
        expires_at: this.getExpiryTime(),
        raw_response: chargeResponse
      };
    } catch (error) {
      console.error('[MIDTRANS] Create transaction error:', error);
      throw new Error(`Failed to create Midtrans transaction: ${error.message}`);
    }
  }

  /**
   * Map our payment method to Midtrans payment_type
   */
  mapPaymentType(payment_method) {
    const typeMap = {
      'qris': 'qris',
      'virtual_account': 'bank_transfer',
      'e_wallet': 'gopay', // or shopeepay
      'transfer_bank': 'bank_transfer',
      'kartu_kredit': 'credit_card'
    };

    return typeMap[payment_method] || 'qris';
  }

  /**
   * Add payment method specific parameters
   */
  addPaymentMethodParams(parameter, payment_method, channel) {
    switch (payment_method) {
      case 'qris':
        parameter.qris = {
          acquirer: 'gopay' // QRIS acquirer
        };
        break;

      case 'virtual_account':
      case 'transfer_bank':
        // Determine bank
        const bank = this.mapBankChannel(channel);
        parameter.bank_transfer = {
          bank: bank
        };
        break;

      case 'e_wallet':
        if (channel === 'GoPay') {
          parameter.payment_type = 'gopay';
          parameter.gopay = {
            enable_callback: true,
            callback_url: `${process.env.FRONTEND_URL}/payment/processing`
          };
        } else if (channel === 'ShopeePay') {
          parameter.payment_type = 'shopeepay';
          parameter.shopeepay = {
            callback_url: `${process.env.FRONTEND_URL}/payment/processing`
          };
        }
        break;

      case 'kartu_kredit':
        parameter.payment_type = 'credit_card';
        parameter.credit_card = {
          secure: true,
          bank: channel || 'bni',
          installment_term: 0
        };
        break;
    }
  }

  /**
   * Map channel to Midtrans bank code
   */
  mapBankChannel(channel) {
    const bankMap = {
      'BCA': 'bca',
      'BNI': 'bni',
      'BRI': 'bri',
      'Mandiri': 'mandiri',
      'Permata': 'permata'
    };

    return bankMap[channel] || 'bca';
  }

  /**
   * Extract payment instructions from charge response
   */
  extractPaymentInstructions(response, payment_method) {
    const instructions = {
      type: payment_method,
      status: response.transaction_status,
      transaction_id: response.transaction_id,
      order_id: response.order_id,
      gross_amount: response.gross_amount,
      currency: response.currency || 'IDR'
    };

    switch (payment_method) {
      case 'qris':
        instructions.qr_string = response.actions?.find(a => a.name === 'generate-qr-code')?.url || '';
        instructions.acquirer = response.acquirer || 'gopay';
        instructions.actions = response.actions || []; // Pass actions array to frontend
        break;

      case 'virtual_account':
      case 'transfer_bank':
        // VA number from va_numbers array
        if (response.va_numbers && response.va_numbers.length > 0) {
          instructions.va_number = response.va_numbers[0].va_number;
          instructions.bank = response.va_numbers[0].bank;
        } else if (response.permata_va_number) {
          instructions.va_number = response.permata_va_number;
          instructions.bank = 'permata';
        } else if (response.bill_key) {
          // Mandiri bill payment
          instructions.bill_key = response.bill_key;
          instructions.biller_code = response.biller_code;
          instructions.bank = 'mandiri';
        }
        break;

      case 'e_wallet':
        // GoPay/ShopeePay deeplink
        if (response.actions && response.actions.length > 0) {
          const deeplink = response.actions.find(a => a.name === 'deeplink-redirect');
          const qr = response.actions.find(a => a.name === 'generate-qr-code');

          instructions.deeplink_url = deeplink?.url || '';
          instructions.qr_string = qr?.url || '';
          instructions.actions = response.actions; // Pass actions array to frontend
        }
        break;

      case 'kartu_kredit':
        instructions.redirect_url = response.redirect_url || '';
        break;
    }

    instructions.expiry_time = response.expiry_time || this.getExpiryTime();

    return instructions;
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
        settlement_time: statusResponse.settlement_time,
        expiry_time: statusResponse.expiry_time,
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
      // Get detailed status
      const statusResponse = await this.coreApi.transaction.status(notificationJson.order_id);

      return {
        transaction_id: statusResponse.order_id,
        external_id: statusResponse.transaction_id,
        transaction_status: this.mapTransactionStatus(statusResponse.transaction_status),
        payment_type: statusResponse.payment_type,
        gross_amount: statusResponse.gross_amount,
        transaction_time: statusResponse.transaction_time,
        settlement_time: statusResponse.settlement_time,
        fraud_status: statusResponse.fraud_status,
        status_code: statusResponse.status_code,
        signature_key: notificationJson.signature_key,
        raw_notification: statusResponse
      };
    } catch (error) {
      console.error('[MIDTRANS] Process notification error:', error);
      throw new Error(`Failed to process notification: ${error.message}`);
    }
  }
}

module.exports = MidtransService;
