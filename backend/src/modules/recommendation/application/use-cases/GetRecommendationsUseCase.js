/**
 * Use Case: Get Personalized Recommendations
 * Business logic untuk mendapatkan rekomendasi yang dipersonalisasi untuk user
 */
class GetRecommendationsUseCase {
    constructor(recommendationRepository, recommendationService) {
        this.recommendationRepository = recommendationRepository;
        this.recommendationService = recommendationService;
    }

    /**
     * Execute use case
     * @param {string} userId - User ID
     * @param {Object} options - Options (limit, refresh, excludeServiceIds)
     * @returns {Promise<Object>} Result with recommendations
     */
    async execute(userId, options = {}) {
        try {
            const {
                limit = 10,
                refresh = false,
                excludeServiceIds = []
            } = options;

            // Validate user ID
            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required'
                };
            }

            // Refresh recommendations if requested
            if (refresh) {
                await this.recommendationRepository.refreshRecommendations(userId);
            }

            // Get personalized recommendations
            let recommendations = await this.recommendationRepository
                .getPersonalizedRecommendations(userId, limit * 2); // Get more for filtering

            // Filter out excluded services
            if (excludeServiceIds.length > 0) {
                recommendations = this.recommendationService
                    .filterRecommendations(recommendations, excludeServiceIds);
            }

            // Sort by score
            recommendations = this.recommendationService
                .sortByScore(recommendations);

            // Diversify recommendations to avoid too similar services
            recommendations = this.recommendationService
                .diversifyRecommendations(recommendations);

            // Get top N recommendations
            recommendations = this.recommendationService
                .getTopRecommendations(recommendations, limit);

            return {
                success: true,
                data: recommendations.map(rec => rec.toJSON()),
                metadata: {
                    total: recommendations.length,
                    timestamp: new Date(),
                    userId,
                    refresh
                }
            };
        } catch (error) {
            console.error('GetRecommendationsUseCase Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = GetRecommendationsUseCase;