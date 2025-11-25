import api from '../utils/axiosConfig'

export const orderService = {
  // Client: Buat order baru
  async createOrder({ serviceId, paketId, catatanClient }) {
    try {
      const response = await api.post('/orders', {
        layanan_id: serviceId,
        paket_id: paketId || null,
        catatan_client: catatanClient || ''
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

  // Freelancer: List pesanan masuk
  async getIncomingOrders({
    q,
    status,
    created_from,
    created_to,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    page = 1,
    limit = 10
  } = {}) {
    try {
      const params = { sortBy, sortOrder, page, limit }
      if (q) params.q = q
      if (status) params.status = status
      if (created_from) params.created_from = created_from
      if (created_to) params.created_to = created_to

      const response = await api.get('/orders/incoming', { params })
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get incoming orders',
        errors: error.response?.data?.errors || []
      }
    }
  },

  // Get orders list (untuk current user sebagai client/pembeli)
  async getOrders({ page = 1, limit = 10, status = null }) {
    try {
      const params = { page, limit }
      if (status) params.status = status

      const response = await api.get('/orders/my', { params })
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
      const response = await api.patch(`/orders/${orderId}/accept`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to accept order'
      }
    }
  },

  // Freelancer: Start order
  async startOrder(orderId) {
    try {
      const response = await api.patch(`/orders/${orderId}/start`)
      return response.data
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to start order'
      }
    }
  },

  // Freelancer: Complete order
  async completeOrder(orderId, lampiranFreelancer) {
    try {
      const response = await api.patch(`/orders/${orderId}/complete`, {
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
      const response = await api.patch(`/orders/${orderId}/cancel`, { reason })
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
