class Favorite {
    constructor({ id, userId, serviceId, notes, addedAt, createdAt }) {
        this.id = id;
        this.userId = userId;
        this.serviceId = serviceId;
        this.notes = notes || '';
        this.addedAt = addedAt || createdAt || new Date();
        this.createdAt = createdAt || new Date();
    }

    // Convert to JSON
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            serviceId: this.serviceId,
            notes: this.notes,
            addedAt: this.addedAt,
            createdAt: this.createdAt
        };
    }

    // Validasi
    static validate(data) {
        if (!data.userId) throw new Error('User ID is required');
        if (!data.serviceId) throw new Error('Service ID is required');
        return true;
    }

    // Factory method
    static create(userId, serviceId, notes = '') {
        const data = { userId, serviceId, notes };
        this.validate(data);
        return new Favorite(data);
    }
}

module.exports = Favorite;