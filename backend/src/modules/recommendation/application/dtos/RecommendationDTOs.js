/**
 * Data Transfer Objects untuk Recommendation Module
 * DTOs digunakan untuk validasi dan transformasi data antara layers
 */

class GetRecommendationsDTO {
    constructor({ userId, limit = 10, refresh = false, excludeServiceIds = [] }) {
        this.userId = userId;
        this.limit = Math.min(Math.max(1, limit), 50); // Limit between 1-50
        this.refresh = Boolean(refresh);
        this.excludeServiceIds = Array.isArray(excludeServiceIds) ? excludeServiceIds : [];
    }

    validate() {
        const errors = [];

        if (!this.userId) {
            errors.push('User ID is required');
        }

        if (this.limit < 1 || this.limit > 50) {
            errors.push('Limit must be between 1 and 50');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

class GetSimilarServicesDTO {
    constructor({ serviceId, limit = 5, excludeServiceIds = [] }) {
        this.serviceId = serviceId;
        this.limit = Math.min(Math.max(1, limit), 20); // Limit between 1-20
        this.excludeServiceIds = Array.isArray(excludeServiceIds) ? excludeServiceIds : [];
    }

    validate() {
        const errors = [];

        if (!this.serviceId) {
            errors.push('Service ID is required');
        }

        if (this.limit < 1 || this.limit > 20) {
            errors.push('Limit must be between 1 and 20');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

class GetPopularServicesDTO {
    constructor({
        limit = 10,
        timeRange = '7d',
        category = null,
        excludeServiceIds = []
    }) {
        this.limit = Math.min(Math.max(1, limit), 50); // Limit between 1-50
        this.timeRange = ['24h', '7d', '30d', 'all'].includes(timeRange) ? timeRange : '7d';
        this.category = category;
        this.excludeServiceIds = Array.isArray(excludeServiceIds) ? excludeServiceIds : [];
    }

    validate() {
        const errors = [];

        if (this.limit < 1 || this.limit > 50) {
            errors.push('Limit must be between 1 and 50');
        }

        const validTimeRanges = ['24h', '7d', '30d', 'all'];
        if (!validTimeRanges.includes(this.timeRange)) {
            errors.push(`Time range must be one of: ${validTimeRanges.join(', ')}`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

class AddFavoriteDTO {
    constructor({ userId, serviceId, notes = '' }) {
        this.userId = userId;
        this.serviceId = serviceId;
        this.notes = notes || '';
    }

    validate() {
        const errors = [];

        if (!this.userId) {
            errors.push('User ID is required');
        }

        if (!this.serviceId) {
            errors.push('Service ID is required');
        }

        if (this.notes.length > 500) {
            errors.push('Notes must not exceed 500 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

class RemoveFavoriteDTO {
    constructor({ userId, serviceId }) {
        this.userId = userId;
        this.serviceId = serviceId;
    }

    validate() {
        const errors = [];

        if (!this.userId) {
            errors.push('User ID is required');
        }

        if (!this.serviceId) {
            errors.push('Service ID is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

class TrackInteractionDTO {
    constructor({
        userId,
        serviceId,
        interactionType,
        value = 1,
        metadata = {}
    }) {
        this.userId = userId;
        this.serviceId = serviceId;
        this.interactionType = interactionType;
        this.value = value;
        this.metadata = metadata || {};
    }

    validate() {
        const errors = [];

        if (!this.userId) {
            errors.push('User ID is required');
        }

        if (!this.serviceId) {
            errors.push('Service ID is required');
        }

        if (!this.interactionType) {
            errors.push('Interaction type is required');
        }

        const validTypes = ['view', 'click', 'like', 'unlike', 'order', 'rating', 'hide'];
        if (!validTypes.includes(this.interactionType)) {
            errors.push(`Interaction type must be one of: ${validTypes.join(', ')}`);
        }

        if (typeof this.value !== 'number') {
            errors.push('Value must be a number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

class GetFavoritesDTO {
    constructor({ userId }) {
        this.userId = userId;
    }

    validate() {
        const errors = [];

        if (!this.userId) {
            errors.push('User ID is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = {
    GetRecommendationsDTO,
    GetSimilarServicesDTO,
    GetPopularServicesDTO,
    AddFavoriteDTO,
    RemoveFavoriteDTO,
    TrackInteractionDTO,
    GetFavoritesDTO
};