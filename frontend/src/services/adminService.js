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

  // Get order category trends
  async getOrderCategoryTrends(filters = {}) {
    try {
      const response = await api.get('/admin/analytics/orders/categories/trends', { params: filters })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order category trends',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Get order category trends by time
  async getOrderCategoryTrendsByTime(filters = {}) {
    try {
      const response = await api.get('/admin/analytics/orders/categories/trends/by-time', { params: filters })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order category trends by time',
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

  // Get user details
  async getUserDetails(id) {
    try {
      const response = await api.get(`/admin/users/${id}`)
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user details',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Get services list
  async getServices(filters = {}) {
    try {
      const response = await api.get('/admin/services', { params: filters })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch services',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  },

  // Get service details
  async getServiceDetails(id) {
    try {
      const response = await api.get(`/admin/services/${id}`)
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch service details',
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

  // Unblock service
  async unblockService(id, reason) {
    try {
      const response = await api.put(`/admin/services/${id}/unblock`, { reason })
      return response.data
    } catch (error) {
      const status = error.response?.status;
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to unblock service',
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
      const { format = 'csv', reportType = 'users' } = reportData;
      
      // For all formats (CSV, Excel, PDF), use blob response
      const response = await api.post('/admin/reports/export', reportData, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Determine file extension and name
      let extension;
      let reportName;
      if (format === 'csv') {
        extension = 'csv';
        reportName = reportType === 'users' ? 'laporan_pengguna' : 'laporan_layanan';
      } else if (format === 'excel') {
        extension = 'xlsx';
        reportName = reportType === 'users' ? 'laporan_pengguna' : 'laporan_layanan';
      } else if (format === 'pdf') {
        extension = 'pdf';
        reportName = reportType === 'users' ? 'laporan_pengguna' : 'laporan_layanan';
      } else {
        extension = 'csv';
        reportName = 'laporan';
      }
      
      link.setAttribute('download', `${reportName}_${Date.now()}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Laporan berhasil diekspor' };
    } catch (error) {
      const status = error.response?.status;
      // Handle blob error response
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const errorData = JSON.parse(text);
          return {
            success: false,
            message: errorData.error || errorData.message || 'Failed to export report',
            errors: errorData.errors || [],
            status
          };
        } catch {
          return {
            success: false,
            message: 'Failed to export report',
            status
          };
        }
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to export report',
        errors: error.response?.data?.errors || [],
        status
      }
    }
  }
}
