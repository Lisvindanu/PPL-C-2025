/**
 * Use Case: Get Favorite Counts
 * Get favorite counts for multiple services
 */
class GetFavoriteCounts {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  /**
   * Execute the use case
   * @param {Array<string>} layananIds - Array of service IDs
   * @returns {Promise<Object>} - Map of service_id => count
   */
  async execute(layananIds) {
    if (!layananIds || !Array.isArray(layananIds) || layananIds.length === 0) {
      throw new Error('layananIds must be a non-empty array');
    }

    const counts = await this.favoriteRepository.countByLayananIds(layananIds);
    return counts;
  }
}

module.exports = GetFavoriteCounts;
