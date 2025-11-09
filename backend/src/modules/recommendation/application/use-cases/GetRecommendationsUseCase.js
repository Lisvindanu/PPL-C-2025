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

            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required'
                };
            }

            // Ambil daftar layanan tersembunyi (hidden)
            const hiddenServiceIds = await this.recommendationService.getHiddenServiceIds?.(
                userId,
                this.recommendationRepository
            ) || [];

            // Ambil interaksi pengguna (fallback jika fungsi tidak ada)
            const userInteractions = this.recommendationRepository.getUserInteractions
                ? await this.recommendationRepository.getUserInteractions(userId)
                : [];

            // Ambil favorit pengguna (fallback jika fungsi tidak ada)
            const userFavorites = this.recommendationRepository.getUserFavorites
                ? await this.recommendationRepository.getUserFavorites(userId)
                : [];

            // Ambil semua layanan yang tersedia
            const allServices = this.recommendationRepository.getAllServices
                ? await this.recommendationRepository.getAllServices()
                : [];

            // Hitung skor untuk setiap layanan
            const scoredServices = allServices.map(service => ({
                ...service,
                score: this.recommendationService.calculateRecommendationScore(
                    service,
                    userInteractions,
                    userFavorites
                )
            }));

            // Filter layanan tersembunyi & yang dikecualikan
            const filteredServices = await this.recommendationService.filterRecommendations(
                scoredServices,
                excludeServiceIds,
                hiddenServiceIds
            );

            // Urutkan & ambil rekomendasi terbaik
            const sortedServices = this.recommendationService.sortByScore(filteredServices);
            const topRecommendations = this.recommendationService.getTopRecommendations(
                sortedServices,
                limit
            );

            return {
                success: true,
                data: topRecommendations,
                metadata: {
                    total: topRecommendations.length,
                    hiddenCount: hiddenServiceIds.length,
                    timestamp: new Date().toISOString(),
                    userId
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
