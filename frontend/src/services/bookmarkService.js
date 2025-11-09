import api from '../utils/axiosConfig';

export const bookmarkService = {
  /**
   * Get all bookmarks for current user
   */
  async getBookmarks() {
    try {
      const res = await api.get('/bookmarks');
      // Unified response
      if (res.data?.success) {
        // Support both shapes: {data: [...]} or {data: {favorites:[...]}}
        const rows = Array.isArray(res.data.data)
          ? res.data.data
          : (res.data.data?.favorites || []);
        return { success: true, data: rows };
      }
      return { success: false, message: res.data?.message || 'Failed to fetch bookmarks', data: [] };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch bookmarks',
        data: []
      };
    }
  },

  /**
   * Add service to bookmarks
   */
  async addBookmark(serviceId) {
    try {
      const res = await api.post('/bookmarks', { layanan_id: serviceId });
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add bookmark',
        errors: error.response?.data?.errors || []
      };
    }
  },

  /**
   * Remove service from bookmarks
   */
  async removeBookmark(serviceId) {
    try {
      const res = await api.delete(`/bookmarks/${serviceId}`);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove bookmark',
        errors: error.response?.data?.errors || []
      };
    }
  },

  /**
   * Check bookmark status
   */
  async isBookmarked(serviceId) {
    try {
      const res = await api.get(`/bookmarks/check/${serviceId}`);
      if (res.data?.success) {
        // Support both {data:{isBookmarked}} and {data:{isFavorite}}
        const d = res.data.data || {};
        return { success: true, data: { isBookmarked: !!(d.isBookmarked ?? d.isFavorite) } };
      }
      return { success: false, data: { isBookmarked: false } };
    } catch (error) {
      return { success: false, data: { isBookmarked: false } };
    }
  },

  async toggleBookmark(serviceId, toSaved) {
    return toSaved ? this.addBookmark(serviceId) : this.removeBookmark(serviceId);
  }
};