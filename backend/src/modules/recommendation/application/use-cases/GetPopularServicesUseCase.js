/**
 * Use Case: Get Popular Services
 * Business logic untuk mendapatkan layanan yang populer berdasarkan metrik
 */
class GetPopularServicesUseCase {
    constructor(recommendationRepository, recommendationService) {
        this.recommendationRepository = recommendationRepository;
        this.recommendationService = recommendationService;
    }

    /**
     * Execute use case
     * @param {Object} options - Options (limit, timeRange, category, excludeServiceIds)
     * @returns {Promise<Object>} Result with popular services
     */
    async execute(options = {}) {
        try {
            const {
                limit = 10,
                timeRange = '7d', // 24h, 7d, 30d, all
                category = null,
                excludeServiceIds = []
            } = options;

            // Validate time range
            const validTimeRanges = ['24h', '7d', '30d', 'all'];
            if (!validTimeRanges.includes(timeRange)) {
                return {
                    success: false,
                    error: `Invalid time range. Must be one of: ${validTimeRanges.join(', ')}`
                };
            }

            // Get popular services
            let popularServices = await this.recommendationRepository
                .getPopularServices(limit * 2, timeRange, category);

            // Filter out excluded services
            if (excludeServiceIds.length > 0) {
                popularServices = this.recommendationService
                    .filterRecommendations(popularServices, excludeServiceIds);
            }

            // Sort by popularity score
            popularServices = this.recommendationService
                .sortByScore(popularServices);

            // Get top N popular services
            popularServices = this.recommendationService
                .getTopRecommendations(popularServices, limit);

            return {
                success: true,
                data: popularServices.map(rec => rec.toJSON()),
                metadata: {
                    total: popularServices.length,
                    timeRange,
                    category,
                    timestamp: new Date()
                }
            };
        } catch (error) {
            console.error('GetPopularServicesUseCase Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = GetPopularServicesUseCase;