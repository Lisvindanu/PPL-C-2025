/**
 * Interface for Recommendation Repository
 * Defines contract for data access operations related to recommendations
 */
class IRecommendationRepository {
    /**
     * Generate personalized recommendations for a user
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of Recommendation entities
     */
    async generateRecommendations(userId) {
        throw new Error('Method generateRecommendations() must be implemented');
    }

    /**
     * Get personalized recommendations for a user
     * @param {string} userId - User ID
     * @param {number} limit - Number of recommendations to return
     * @returns {Promise<Array>} Array of Recommendation entities
     */
    async getPersonalizedRecommendations(userId, limit = 10) {
        throw new Error('Method getPersonalizedRecommendations() must be implemented');
    }

    /**
     * Get similar services based on a service
     * @param {string} serviceId - Service ID
     * @param {number} limit - Number of similar services to return
     * @returns {Promise<Array>} Array of Recommendation entities
     */
    async getSimilarServices(serviceId, limit = 5) {
        throw new Error('Method getSimilarServices() must be implemented');
    }

    /**
     * Get popular services
     * @param {number} limit - Number of popular services to return
     * @param {string} timeRange - Time range for popularity calculation
     * @param {string} category - Optional category filter
     * @returns {Promise<Array>} Array of Recommendation entities
     */
    async getPopularServices(limit = 10, timeRange = '7d', category = null) {
        throw new Error('Method getPopularServices() must be implemented');
    }

    /**
     * Track user interaction with a service
     * @param {string} userId - User ID
     * @param {string} serviceId - Service ID
     * @param {string} interactionType - Type of interaction
     * @param {number} value - Interaction value
     * @param {Object} metadata - Additional metadata
     * @returns {Promise<Object>} UserInteraction entity
     */
    async trackInteraction(userId, serviceId, interactionType, value = 1, metadata = {}) {
        throw new Error('Method trackInteraction() must be implemented');
    }

    /**
     * Get user interactions history
     * @param {string} userId - User ID
     * @param {string} serviceId - Optional service ID filter
     * @returns {Promise<Array>} Array of UserInteraction entities
     */
    async getUserInteractions(userId, serviceId = null) {
        throw new Error('Method getUserInteractions() must be implemented');
    }

    /**
     * Get service popularity metrics
     * @param {string} serviceId - Service ID
     * @returns {Promise<Object>} Popularity metrics
     */
    async getServicePopularity(serviceId) {
        throw new Error('Method getServicePopularity() must be implemented');
    }

    /**
     * Refresh recommendations for a user
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Array of updated Recommendation entities
     */
    async refreshRecommendations(userId) {
        throw new Error('Method refreshRecommendations() must be implemented');
    }
}

module.exports = IRecommendationRepository;