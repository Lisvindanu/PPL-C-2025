/**
 * Use Case: Track Interaction
 * Business logic untuk tracking interaksi user dengan layanan
 */
class TrackInteractionUseCase {
    constructor(recommendationRepository) {
        this.recommendationRepository = recommendationRepository;
    }

    /**
     * Execute use case - Track user interaction
     * @param {string} userId - User ID
     * @param {string} serviceId - Service ID
     * @param {string} interactionType - Type of interaction
     * @param {number} value - Interaction value
     * @param {Object} metadata - Additional metadata
     * @returns {Promise<Object>} Result with interaction data
     */
    async execute(userId, serviceId, interactionType, value = 1, metadata = {}) {
        try {
            // Validate inputs
            if (!userId || !serviceId || !interactionType) {
                return {
                    success: false,
                    error: 'User ID, Service ID, and Interaction Type are required'
                };
            }

            // Validate interaction type
            const validTypes = ['view', 'click', 'like', 'unlike', 'order', 'rating', 'hide'];

            if (!validTypes.includes(interactionType)) {
                return {
                    success: false,
                    error: `Invalid interaction type. Must be one of: ${validTypes.join(', ')}`
                };
            }

            // Track the interaction
            const interaction = await this.recommendationRepository.trackInteraction(
                userId,
                serviceId,
                interactionType,
                value,
                {
                    ...metadata,
                    timestamp: new Date(),
                    source: 'api'
                }
            );

            // For significant interactions, refresh recommendations asynchronously
            // Tidak menunggu hasil refresh agar response tetap cepat
            if (['like', 'order', 'rating'].includes(interactionType)) {
                this.recommendationRepository.refreshRecommendations(userId)
                    .catch(err => console.error('Background refresh failed:', err));
            }

            return {
                success: true,
                data: interaction.toJSON(),
                message: 'Interaction tracked successfully'
            };
        } catch (error) {
            console.error('TrackInteractionUseCase Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get interaction history for user
     * @param {string} userId - User ID
     * @param {string} serviceId - Optional service ID filter
     * @param {number} limit - Limit results
     * @returns {Promise<Object>} Result with interaction history
     */
    async getInteractionHistory(userId, serviceId = null, limit = 50) {
        try {
            // Validate input
            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required'
                };
            }

            const interactions = await this.recommendationRepository
                .getUserInteractions(userId, serviceId);

            return {
                success: true,
                data: interactions.slice(0, limit).map(int => int.toJSON()),
                metadata: {
                    total: interactions.length,
                    displayed: Math.min(interactions.length, limit),
                    userId,
                    serviceId,
                    timestamp: new Date()
                }
            };
        } catch (error) {
            console.error('TrackInteractionUseCase.getInteractionHistory Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = TrackInteractionUseCase;