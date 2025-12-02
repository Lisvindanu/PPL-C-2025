import api from '../utils/axiosConfig'

// Payment & Escrow related API calls
// NOTE: Endpoints are based on current backend conventions.
// Adjust the URLs/payloads here if your backend uses different routes.
const paymentService = {
  // Release escrow funds to freelancer
  async releaseEscrow(escrowId) {
    try {
      const response = await api.post(`/payments/escrow/${escrowId}/release`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to release escrow',
        errors: error.response?.data?.errors || []
      }
    }
  },

  // Client requests a refund
  async requestRefund({ payment_id, reason, amount }) {
    try {
      const response = await api.post('/payments/refund', {
        payment_id,
        reason,
        amount
      })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to request refund',
        errors: error.response?.data?.errors || []
      }
    }
  },

  // Download invoice PDF for a specific payment
  async getInvoicePDF(paymentId) {
    try {
      const response = await api.get(`/payments/${paymentId}/invoice`, {
        responseType: 'blob'
      })
      // Keep the shape consistent with other services
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to download invoice',
        errors: error.response?.data?.errors || []
      }
    }
  },

  // Send invoice to an email address
  async sendInvoiceEmail(paymentId, email) {
    try {
      const response = await api.post(`/payments/${paymentId}/send-invoice-email`, {
        email
      })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send invoice email',
        errors: error.response?.data?.errors || []
      }
    }
  }
}

export default paymentService
