/**
 * Domain Service: RecommendationService
 * Contains business logic for recommendation algorithms
 */
class RecommendationService {
    constructor(recommendationRepository) {
        this.recommendationRepository = recommendationRepository;
    }

    /**
     * Calculate recommendation score based on multiple factors
     */
    calculateRecommendationScore(service, userInteractions, userFavorites) {
        let score = 0;

        // Base score from service popularity
        score += this.calculatePopularityScore(service);

        // Score from user interactions
        score += this.calculateInteractionScore(service.id, userInteractions);

        // Score from favorites (similar services)
        score += this.calculateSimilarityScore(service, userFavorites);

        // Score from ratings
        score += this.calculateRatingScore(service);

        return score;
    }

    /**
     * Calculate popularity score
     */
    calculatePopularityScore(service) {
        const clickWeight = 0.3;
        const orderWeight = 0.5;
        const likeWeight = 0.2;

        return (
            (service.totalClicks || 0) * clickWeight +
            (service.totalOrders || 0) * orderWeight +
            (service.totalLikes || 0) * likeWeight
        );
    }

    /**
     * Calculate interaction score
     */
    calculateInteractionScore(serviceId, userInteractions) {
        const interaction = userInteractions.find(i => i.serviceId === serviceId);
        if (!interaction) return 0;

        return interaction.calculateScore();
    }

    /**
     * Calculate similarity score based on category and tags
     */
    calculateSimilarityScore(service, userFavorites) {
        let similarityScore = 0;

        userFavorites.forEach(favorite => {
            if (favorite.categoryId === service.categoryId) {
                similarityScore += 5;
            }

            const commonTags = this.findCommonTags(
                favorite.tags || [],
                service.tags || []
            );
            similarityScore += commonTags.length * 2;
        });

        return similarityScore;
    }

    /**
     * Calculate rating score
     */
    calculateRatingScore(service) {
        const avgRating = service.averageRating || 0;
        const totalRatings = service.totalRatings || 0;

        const minRatingsForWeight = 5;
        const globalAverage = 4.0;

        const weightedRating =
            (totalRatings * avgRating + minRatingsForWeight * globalAverage) /
            (totalRatings + minRatingsForWeight);

        return weightedRating * 2;
    }

    /**
     * Find common tags between two arrays
     */
    findCommonTags(tags1, tags2) {
        return tags1.filter(tag => tags2.includes(tag));
    }

    /**
     * Filter hidden services
     */
    filterHiddenServices(services, hiddenServiceIds) {
        return services.filter(service => !hiddenServiceIds.includes(service.id));
    }

    /**
     * Sort services by score
     */
    sortByScore(services) {
        return services.sort((a, b) => b.score - a.score);
    }

    /**
     * Get top N recommendations
     */
    getTopRecommendations(services, limit = 10) {
        return services.slice(0, limit);
    }

    /**
   * Filter recommendations by excluded AND hidden service IDs
   */
    async filterRecommendations(recommendations, excludeServiceIds = [], hiddenServiceIds = []) {
        const allExcluded = [...new Set([...excludeServiceIds, ...hiddenServiceIds])];

        if (!allExcluded || allExcluded.length === 0) {
            return recommendations;
        }

        return recommendations.filter(rec => !allExcluded.includes(rec.serviceId));
    }

    /**
   * Get hidden service IDs for user
   */
    async getHiddenServiceIds(userId, repository) {
        try {
            const hiddenInteractions = await repository.getUserInteractions(userId, 'hide');
            return hiddenInteractions.map(interaction => interaction.serviceId);
        } catch (error) {
            console.error('Error getting hidden services:', error);
            return [];
        }
    }

    /**
     * Diversify recommendations by source/category
     */
    diversifyRecommendations(recommendations) {
        // Simple diversification: alternate between different sources
        const bySource = {};
        recommendations.forEach(rec => {
            const source = rec.source || 'popular';
            if (!bySource[source]) {
                bySource[source] = [];
            }
            bySource[source].push(rec);
        });

        const diversified = [];
        const sources = Object.keys(bySource);
        let index = 0;

        while (diversified.length < recommendations.length) {
            for (const source of sources) {
                if (bySource[source][index]) {
                    diversified.push(bySource[source][index]);
                }
                if (diversified.length >= recommendations.length) break;
            }
            index++;
        }

        return diversified;
    }

    /**
     * Content-based filtering
     */
    contentBasedFiltering(targetService, allServices) {
        return allServices
            .filter(service => service.id !== targetService.id)
            .map(service => {
                let similarity = 0;

                if (service.categoryId === targetService.categoryId) {
                    similarity += 10;
                }

                const commonTags = this.findCommonTags(
                    targetService.tags || [],
                    service.tags || []
                );
                similarity += commonTags.length * 3;

                const priceDiff = Math.abs(
                    (service.price || 0) - (targetService.price || 0)
                );
                if (priceDiff < targetService.price * 0.3) {
                    similarity += 5;
                }

                return {
                    ...service,
                    similarity
                };
            })
            .filter(service => service.similarity > 0)
            .sort((a, b) => b.similarity - a.similarity);
    }

    /**
     * Collaborative filtering (simplified)
     */
    collaborativeFiltering(userId, userInteractions, allInteractions) {
        const userServiceIds = userInteractions.map(i => i.serviceId);

        const similarUsers = this.findSimilarUsers(
            userId,
            userServiceIds,
            allInteractions
        );

        const recommendedServiceIds = [];
        similarUsers.forEach(similarUserId => {
            const theirInteractions = allInteractions.filter(
                i => i.userId === similarUserId
            );
            theirInteractions.forEach(interaction => {
                if (!userServiceIds.includes(interaction.serviceId)) {
                    recommendedServiceIds.push(interaction.serviceId);
                }
            });
        });

        return [...new Set(recommendedServiceIds)];
    }

    /**
     * Find users with similar interaction patterns
     */
    findSimilarUsers(userId, userServiceIds, allInteractions) {
        const userMap = new Map();

        allInteractions.forEach(interaction => {
            if (interaction.userId === userId) return;

            if (!userMap.has(interaction.userId)) {
                userMap.set(interaction.userId, []);
            }
            userMap.get(interaction.userId).push(interaction.serviceId);
        });

        const similarities = [];
        userMap.forEach((serviceIds, otherUserId) => {
            const commonServices = userServiceIds.filter(id =>
                serviceIds.includes(id)
            );
            const similarity = commonServices.length;

            if (similarity > 0) {
                similarities.push({ userId: otherUserId, similarity });
            }
        });

        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5)
            .map(s => s.userId);
    }
}

module.exports = RecommendationService;