/**
 * Use Case: Manage Favorites
 * Business logic untuk mengelola favorit user (add, remove, get)
 */
class ManageFavoritesUseCase {
    constructor(favoriteRepository, recommendationRepository) {
        this.favoriteRepository = favoriteRepository;
        this.recommendationRepository = recommendationRepository;
    }

    /**
     * Add service to favorites
     * @param {string} userId - User ID
     * @param {string} serviceId - Service ID
     * @param {string} notes - Optional notes
     * @returns {Promise<Object>} Result with favorite data
     */
    async addFavorite(userId, serviceId, notes = '') {
        try {
            // Validate inputs
            if (!userId || !serviceId) {
                return {
                    success: false,
                    error: 'User ID and Service ID are required'
                };
            }

            // Check if already favorited
            const isFavorite = await this.favoriteRepository.isFavorite(userId, serviceId);

            if (isFavorite) {
                return {
                    success: false,
                    error: 'Service already in favorites'
                };
            }

            // Add to favorites
            const favorite = await this.favoriteRepository.addFavorite(userId, serviceId, notes);

            // Track interaction - ini akan mempengaruhi rekomendasi
            await this.recommendationRepository.trackInteraction(
                userId,
                serviceId,
                'like',
                5,
                { action: 'add_favorite', notes }
            );

            return {
                success: true,
                data: favorite.toJSON(),
                message: 'Service added to favorites successfully'
            };
        } catch (error) {
            console.error('ManageFavoritesUseCase.addFavorite Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Remove service from favorites
     * @param {string} userId - User ID
     * @param {string} serviceId - Service ID
     * @returns {Promise<Object>} Result
     */
    async removeFavorite(userId, serviceId) {
        try {
            // Validate inputs
            if (!userId || !serviceId) {
                return {
                    success: false,
                    error: 'User ID and Service ID are required'
                };
            }

            const removed = await this.favoriteRepository.removeFavorite(userId, serviceId);

            if (!removed) {
                return {
                    success: false,
                    error: 'Favorite not found'
                };
            }

            // Track negative interaction
            await this.recommendationRepository.trackInteraction(
                userId,
                serviceId,
                'unlike',
                -3,
                { action: 'remove_favorite' }
            );

            return {
                success: true,
                message: 'Service removed from favorites successfully'
            };
        } catch (error) {
            console.error('ManageFavoritesUseCase.removeFavorite Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get all favorites for user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Result with favorites
     */
    async getFavorites(userId) {
        try {
            // Validate input
            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required'
                };
            }

            const favorites = await this.favoriteRepository.getFavorites(userId);

            return {
                success: true,
                data: favorites.map(fav => fav.toJSON()),
                metadata: {
                    total: favorites.length,
                    userId,
                    timestamp: new Date()
                }
            };
        } catch (error) {
            console.error('ManageFavoritesUseCase.getFavorites Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = ManageFavoritesUseCase;