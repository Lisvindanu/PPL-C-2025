import api from '../utils/axiosConfig'

export const adminService = {
  // Get dashboard stats
  async getDashboard({ timeRange = 'today' } = {}) {
    try {
      const response = await api.get('/admin/dashboard', { 
        params: { timeRange } 
      })
      return response.data
    } catch (error) {
      // Check jika error 404
      const status = error.response?.status;
      let message = error.response?.data?.message || 'Failed to fetch dashboard data';
      
      if (status === 404) {
        message = 'Endpoint not found';
      }
      
      return {
        success: false,
        message,
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Get revenue analytics
  async getRevenueAnalytics(filters = {}) {
    try {
      const response = await api.get('/admin/analytics/revenue', { params: filters })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch revenue analytics',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Get user analytics
  async getUserAnalytics(filters = {}) {
    try {
      const response = await api.get('/admin/analytics/users', { params: filters })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user analytics',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Get user status distribution for pie chart
  async getUserStatusDistribution(filters = {}) {
    try {
      const response = await api.get('/admin/analytics/users/status', { params: filters })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user status distribution',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Get order trends for line chart
  async getOrderTrends(filters = {}) {
    try {
      const response = await api.get('/admin/analytics/orders/trends', { params: filters })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order trends',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Get order analytics
  async getOrderAnalytics(filters = {}) {
    try {
      const response = await api.get('/admin/analytics/orders', { params: filters })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order analytics',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Get users list
  async getUsers(filters = {}) {
    try {
      const response = await api.get('/admin/users', { params: filters })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Block user
  async blockUser(id, reason) {
    try {
      const response = await api.put(`/admin/users/${id}/block`, { reason })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to block user',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Unblock user
  async unblockUser(id) {
    try {
      const response = await api.put(`/admin/users/${id}/unblock`)
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to unblock user',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Block service
  async blockService(id, reason) {
    try {
      const response = await api.put(`/admin/services/${id}/block`, { reason })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to block service',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Get fraud alerts
  async getFraudAlerts(filters = {}) {
    try {
      const response = await api.get('/admin/fraud-alerts', { params: filters })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch fraud alerts',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Export report
  async exportReport(reportData) {
    try {
      const response = await api.post('/admin/reports/export', reportData, {
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `admin_report_${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Report exported successfully' }
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to export report',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  }
}
