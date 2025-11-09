class Recommendation {
    constructor({
        id,
        userId,
        serviceId,
        score,
        reason,
        source, // 'clicks', 'likes', 'orders', 'similar', 'popular'
        metadata = {},
        createdAt = new Date(),
        updatedAt = new Date()
    }) {
        this.id = id;
        this.userId = userId;
        this.serviceId = serviceId;
        this.score = score;
        this.reason = reason;
        this.source = source;
        this.metadata = metadata;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Business logic methods
    isValid() {
        return this.score > 0 && this.score <= 100;
    }

    getDisplayReason() {
        const reasons = {
            clicks: 'Berdasarkan layanan yang sering Anda lihat',
            likes: 'Berdasarkan layanan favorit Anda',
            orders: 'Berdasarkan riwayat pesanan Anda',
            similar: 'Layanan serupa yang mungkin Anda suka',
            popular: 'Layanan populer saat ini'
        };
        return reasons[this.source] || this.reason;
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            serviceId: this.serviceId,
            score: this.score,
            reason: this.getDisplayReason(),
            source: this.source,
            metadata: this.metadata,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Recommendation;