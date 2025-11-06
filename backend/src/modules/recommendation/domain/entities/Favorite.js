class Favorite {
    constructor({ id, userId, serviceId, createdAt }) {
        this.id = id;
        this.userId = userId;
        this.serviceId = serviceId;
        this.createdAt = createdAt || new Date();
    }

    // Validasi
    static validate(data) {
        if (!data.userId) throw new Error('User ID is required');
        if (!data.serviceId) throw new Error('Service ID is required');
        return true;
    }

    // Factory method
    static create(userId, serviceId) {
        const data = { userId, serviceId };
        this.validate(data);
        return new Favorite(data);
    }
}

module.exports = Favorite;