import api from '../utils/axiosConfig'

const paymentService = {
  // Get client spending analytics
  async getClientSpending(startDate, endDate) {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)

      const response = await api.get(`/payments/analytics/client-spending?${params}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch client spending',
        errors: error.response?.data?.errors || []
      }
    }
  },

  // Get freelancer earnings analytics
  async getFreelancerEarnings(startDate, endDate) {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)

      const response = await api.get(`/payments/analytics/freelancer-earnings?${params}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch freelancer earnings',
        errors: error.response?.data?.errors || []
      }
    }
  },

  // Get user balance
  async getUserBalance() {
    try {
      const response = await api.get('/payments/balance')
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch balance',
        errors: error.response?.data?.errors || []
      }
    }
  },

  // Release escrow
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

  // Request refund
  async requestRefund({ payment_id, reason, amount }) {
    try {
      const response = await api.post('/payments/refund/request', {
        payment_id,
        alasan: reason,
        jumlah_refund: amount
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

  // Download invoice PDF
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
        message: error.response?.data?.message || 'Failed to download invoice',
        errors: error.response?.data?.errors || []
      }
    }
  },

  // Send invoice via email
  async sendInvoiceEmail(paymentId, email) {
    try {
      const response = await api.post(`/payments/invoice/${paymentId}/send-email`, {
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
