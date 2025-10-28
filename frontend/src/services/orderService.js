import api from '../utils/axiosConfig'

export const orderService = {
  // Client: Buat order baru
  async createOrder({ serviceId, paketId, deskripsi, catatanClient, lampiranClient }) {
    try {
      const response = await api.post('/orders', {
        serviceId,
        paketId,
        deskripsi,
        catatanClient,
        lampiranClient
      })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create order',
        errors: error.response?.data?.errors || []
      }
    }
  },

  // Get orders list (untuk current user)
  async getOrders({ page = 1, limit = 10, status = null }) {
    try {
      const params = { page, limit }
      if (status) params.status = status
      
      const response = await api.get('/orders', { params })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get orders'
      }
    }
  },

  // Get order detail by ID
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get order detail'
      }
    }
  },

  // Freelancer: Accept order
  async acceptOrder(orderId) {
    try {
      const response = await api.put(`/orders/${orderId}/accept`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to accept order'
      }
    }
  },

  // Freelancer: Reject order
  async rejectOrder(orderId, reason) {
    try {
      const response = await api.put(`/orders/${orderId}/reject`, { reason })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reject order'
      }
    }
  },

  // Freelancer: Complete order
  async completeOrder(orderId, lampiranFreelancer) {
    try {
      const response = await api.put(`/orders/${orderId}/complete`, {
        lampiranFreelancer
      })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to complete order'
      }
    }
  },

  // Client: Cancel order
  async cancelOrder(orderId, reason) {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`, { reason })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel order'
      }
    }
  },

  // Get orders for specific freelancer
  async getFreelancerOrders(freelancerId, { page = 1, limit = 10 }) {
    try {
      const response = await api.get(`/orders/freelancer/${freelancerId}`, {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get freelancer orders'
      }
    }
  }
}
