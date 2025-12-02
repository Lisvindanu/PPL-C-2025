import api from '../utils/axiosConfig'

export const paymentService = {
  // ==================== CORE PAYMENT ====================

  /**
   * Create new payment
   * @param {Object} paymentData - Payment creation data
   */
  async createPayment(paymentData) {
    try {
      const response = await api.post('/payments/create', paymentData)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create payment',
        errors: error.response?.data?.errors || []
      }
    }
  },

  /**
   * Get payment detail by ID
   * @param {string} paymentId - Payment ID
   */
  async getPaymentById(paymentId) {
    try {
      const response = await api.get(`/payments/${paymentId}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get payment'
      }
    }
  },

  /**
   * Check payment status
   * @param {string} transactionId - Transaction ID
   */
  async checkPaymentStatus(transactionId) {
    try {
      const response = await api.get(`/payments/check-status/${transactionId}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check payment status'
      }
    }
  },

  /**
   * Retry failed payment
   * @param {string} paymentId - Payment ID to retry
   */
  async retryPayment(paymentId) {
    try {
      const response = await api.post(`/payments/retry/${paymentId}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to retry payment'
      }
    }
  },

  // ==================== ESCROW ====================

  /**
   * Get escrow detail
   * @param {string} escrowId - Escrow ID
   */
  async getEscrowById(escrowId) {
    try {
      const response = await api.get(`/payments/escrow/${escrowId}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get escrow'
      }
    }
  },

  /**
   * Release escrow to freelancer
   * @param {string} escrowId - Escrow ID
   */
  async releaseEscrow(escrowId) {
    try {
      const response = await api.post(`/payments/escrow/${escrowId}/release`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to release escrow'
      }
    }
  },

  // ==================== WITHDRAWAL ====================

  /**
   * Create withdrawal request
   * @param {Object} withdrawalData - { jumlah, bank_name, bank_account_number, bank_account_name, catatan }
   */
  async createWithdrawal(withdrawalData) {
    try {
      const response = await api.post('/payments/withdrawal/create', withdrawalData)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create withdrawal',
        errors: error.response?.data?.errors || []
      }
    }
  },

  /**
   * Get withdrawal detail
   * @param {string} withdrawalId - Withdrawal ID
   */
  async getWithdrawalById(withdrawalId) {
    try {
      const response = await api.get(`/payments/withdrawal/${withdrawalId}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get withdrawal'
      }
    }
  },

  /**
   * Get user's withdrawal history
   * @param {Object} params - { page, limit, status }
   */
  async getWithdrawalHistory(params = {}) {
    try {
      const response = await api.get('/payments/withdrawal/history', { params })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get withdrawal history'
      }
    }
  },

  // ==================== INVOICE ====================

  /**
   * Get invoice PDF
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Blob>} PDF file
   */
  async getInvoicePDF(paymentId) {
    try {
      const response = await api.get(`/payments/invoice/${paymentId}`, {
        responseType: 'blob'
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to download invoice'
      }
    }
  },

  /**
   * Send invoice to email
   * @param {string} paymentId - Payment ID
   * @param {string} email - Recipient email
   */
  async sendInvoiceEmail(paymentId, email) {
    try {
      const response = await api.post(`/payments/invoice/${paymentId}/send-email`, { email })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send invoice'
      }
    }
  },

  // ==================== REFUND ====================

  /**
   * Request refund
   * @param {Object} refundData - { payment_id, reason, amount }
   */
  async requestRefund(refundData) {
    try {
      const response = await api.post('/payments/refund/request', refundData)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to request refund',
        errors: error.response?.data?.errors || []
      }
    }
  },

  /**
   * Process refund (Admin only)
   * @param {string} refundId - Refund ID
   * @param {Object} data - { status, admin_notes }
   */
  async processRefund(refundId, data) {
    try {
      const response = await api.post(`/payments/refund/${refundId}/process`, data)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process refund'
      }
    }
  },

  /**
   * Get all refund requests (Admin only)
   * @param {Object} params - { page, limit, status }
   */
  async getAllRefunds(params = {}) {
    try {
      const response = await api.get('/payments/refund/all', { params })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get refunds'
      }
    }
  },

  // ==================== ANALYTICS ====================

  /**
   * Get payment analytics summary (Admin)
   * @param {Object} params - { start_date, end_date, period }
   */
  async getAnalyticsSummary(params = {}) {
    try {
      const response = await api.get('/payments/analytics/summary', { params })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get analytics'
      }
    }
  },

  /**
   * Get escrow analytics (Admin)
   */
  async getEscrowAnalytics() {
    try {
      const response = await api.get('/payments/analytics/escrow')
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get escrow analytics'
      }
    }
  },

  /**
   * Get withdrawal analytics (Admin)
   */
  async getWithdrawalAnalytics() {
    try {
      const response = await api.get('/payments/analytics/withdrawals')
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get withdrawal analytics'
      }
    }
  },

  /**
   * Get freelancer earnings (Freelancer)
   * @param {Object} params - { start_date, end_date }
   */
  async getFreelancerEarnings(params = {}) {
    try {
      const response = await api.get('/payments/analytics/freelancer-earnings', { params })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get earnings'
      }
    }
  },

  /**
   * Get client spending (Client)
   * @param {Object} params - { start_date, end_date }
   */
  async getClientSpending(params = {}) {
    try {
      const response = await api.get('/payments/analytics/client-spending', { params })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get spending'
      }
    }
  },

  /**
   * Get user balance (Freelancer)
   */
  async getUserBalance() {
    try {
      const response = await api.get('/payments/balance')
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get balance'
      }
    }
  }
}

export default paymentService
