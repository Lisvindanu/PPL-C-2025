/**
 * Use Case: Get Similar Services
 * Business logic untuk mendapatkan layanan yang serupa dengan layanan tertentu
 */
class GetSimilarServicesUseCase {
    constructor(recommendationRepository, recommendationService) {
        this.recommendationRepository = recommendationRepository;
        this.recommendationService = recommendationService;
    }

    /**
     * Execute use case
     * @param {string} serviceId - Service ID to find similar services
     * @param {Object} options - Options (limit, excludeServiceIds)
     * @returns {Promise<Object>} Result with similar services
     */
    async execute(serviceId, options = {}) {
        try {
            const {
                limit = 5,
                excludeServiceIds = []
            } = options;

            // Validate service ID
            if (!serviceId) {
                return {
                    success: false,
                    error: 'Service ID is required'
                };
            }

            // Get similar services
            let similarServices = await this.recommendationRepository
                .getSimilarServices(serviceId, limit * 2);

            // Filter out excluded services (including the original service)
            const excludeList = [...excludeServiceIds, serviceId];
            similarServices = this.recommendationService
                .filterRecommendations(similarServices, excludeList);

            // Sort by similarity score
            similarServices = this.recommendationService
                .sortByScore(similarServices);

            // Get top N similar services
            similarServices = this.recommendationService
                .getTopRecommendations(similarServices, limit);

            return {
                success: true,
                data: similarServices.map(rec => rec.toJSON()),
                metadata: {
                    total: similarServices.length,
                    sourceServiceId: serviceId,
                    timestamp: new Date()
                }
            };
        } catch (error) {
            console.error('GetSimilarServicesUseCase Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = GetSimilarServicesUseCase;