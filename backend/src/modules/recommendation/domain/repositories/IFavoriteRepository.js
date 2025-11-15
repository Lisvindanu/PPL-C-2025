/**
 * Interface for Favorite Repository
 * Defines contract for data access operations related to favorites
 */
class IFavoriteRepository {
    /**
     * Add a service to user's favorites
     * @param {string} userId - User ID
     * @param {string} serviceId - Service ID
     * @param {string} notes - Optional notes about the favorite
     * @returns {Promise<Object>} Favorite entity
     */
    async addFavorite(userId, serviceId, notes = '') {
        throw new Error('Method addFavorite() must be implemented');
    }

    /**
     * Remove a service from user's favorites
     * @param {string} userId - User ID
     * @param {string} serviceId - Service ID
     * @returns {Promise<boolean>} True if removed, false if not found
     */
    async removeFavorite(userId, serviceId) {
        throw new Error('Method removeFavorite() must be implemented');
    }

    /**
     * Get all favorites for a user
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of Favorite entities
     */
    async getFavorites(userId) {
        throw new Error('Method getFavorites() must be implemented');
    }

    /**
     * Check if a service is in user's favorites
     * @param {string} userId - User ID
     * @param {string} serviceId - Service ID
     * @returns {Promise<boolean>} True if favorited, false otherwise
     */
    async isFavorite(userId, serviceId) {
        throw new Error('Method isFavorite() must be implemented');
    }

    /**
     * Get the number of users who favorited a service
     * @param {string} serviceId - Service ID
     * @returns {Promise<number>} Number of favorites
     */
    async getFavoriteCount(serviceId) {
        throw new Error('Method getFavoriteCount() must be implemented');
    }
}

module.exports = IFavoriteRepository;