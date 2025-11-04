/**
 * Recommendation Repository Interface
 *
 * Contract untuk recommendation queries.
 * Repository ini fokus pada analytics dan pattern matching.
 */

class RecommendationRepository {
  /**
   * Get trending services
   * @param {Object} options - { days, limit, minRating }
   */
  async getTrendingServices(options = {}) {
    throw new Error('Method getTrendingServices() must be implemented');
  }

  /**
   * Get popular services dalam kategori tertentu
   */
  async getPopularInCategory(kategoriId, options = {}) {
    throw new Error('Method getPopularInCategory() must be implemented');
  }

  /**
   * Get user browsing history
   * Requires view tracking feature
   */
  async getUserBrowsingHistory(userId, options = {}) {
    throw new Error('Method getUserBrowsingHistory() must be implemented');
  }

  /**
   * Get collaborative filtering data
   * "Users who ordered X also ordered Y"
   */
  async getCollaborativeData(serviceId, options = {}) {
    throw new Error('Method getCollaborativeData() must be implemented');
  }

  /**
   * Get services by location
   */
  async getServicesByLocation(location, options = {}) {
    throw new Error('Method getServicesByLocation() must be implemented');
  }
}

module.exports = RecommendationRepository;
