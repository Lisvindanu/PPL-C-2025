import api from '../utils/axiosConfig';

export const favoriteService = {
  /**
   * Get all favorites for current user
   * @returns {Promise} - Response with favorites list
   */
  async getFavorites() {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch favorites',
        errors: error.response?.data?.errors || []
      };
    }
  },

  /**
   * Add service to favorites
   * @param {string} serviceId - Service ID to add
   * @returns {Promise} - Response with success status
   */
  async addFavorite(serviceId) {
    try {
      const response = await api.post('/favorites', { layanan_id: serviceId });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add favorite',
        errors: error.response?.data?.errors || []
      };
    }
  },

  /**
   * Remove service from favorites
   * @param {string} serviceId - Service ID to remove
   * @returns {Promise} - Response with success status
   */
  async removeFavorite(serviceId) {
    try {
      const response = await api.delete(`/favorites/${serviceId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove favorite',
        errors: error.response?.data?.errors || []
      };
    }
  },

  /**
   * Toggle favorite status
   * @param {string} serviceId - Service ID to toggle
   * @param {boolean} isFavorite - New favorite status (true = add, false = remove)
   * @returns {Promise} - Response with success status
   */
  async toggleFavorite(serviceId, isFavorite) {
    if (isFavorite) {
      return this.addFavorite(serviceId);
    } else {
      return this.removeFavorite(serviceId);
    }
  },

  /**
   * Check if service is favorited
   * @param {string} serviceId - Service ID to check
   * @returns {Promise} - Response with favorite status
   */
  async isFavorite(serviceId) {
    try {
      const response = await api.get(`/favorites/check/${serviceId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check favorite status',
        data: { isFavorite: false }
      };
    }
  }
};
