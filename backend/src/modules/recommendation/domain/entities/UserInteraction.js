/**
 * Entity: UserInteraction
 * Represents user interaction with services (clicks, views, orders)
 */
class UserInteraction {
    constructor({
        id,
        userId,
        serviceId,
        interactionType, // 'click', 'view', 'order', 'like'
        interactionCount = 1,
        lastInteractionAt,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.userId = userId;
        this.serviceId = serviceId;
        this.interactionType = interactionType;
        this.interactionCount = interactionCount;
        this.lastInteractionAt = lastInteractionAt || new Date();
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    // Increment interaction count
    incrementCount() {
        this.interactionCount += 1;
        this.lastInteractionAt = new Date();
        this.updatedAt = new Date();
    }

    // Check if interaction is recent (within last 30 days)
    isRecent() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return this.lastInteractionAt >= thirtyDaysAgo;
    }

    // Calculate interaction score based on type and recency
    calculateScore() {
        const typeWeights = {
            order: 10,
            like: 5,
            click: 2,
            view: 1
        };

        const baseScore = typeWeights[this.interactionType] || 1;
        const countMultiplier = Math.min(this.interactionCount, 10);

        // Reduce score for older interactions
        const daysSinceInteraction = Math.floor(
            (new Date() - this.lastInteractionAt) / (1000 * 60 * 60 * 24)
        );
        const recencyMultiplier = Math.max(0.1, 1 - (daysSinceInteraction / 90));

        return baseScore * countMultiplier * recencyMultiplier;
    }

    // Validate interaction type
    static isValidInteractionType(type) {
        return ['click', 'view', 'order', 'like'].includes(type);
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            serviceId: this.serviceId,
            interactionType: this.interactionType,
            interactionCount: this.interactionCount,
            lastInteractionAt: this.lastInteractionAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = UserInteraction;