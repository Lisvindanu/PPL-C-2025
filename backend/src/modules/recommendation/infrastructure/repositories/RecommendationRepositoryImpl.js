const { Op } = require('sequelize');
const IRecommendationRepository = require('../../domain/repositories/IRecommendationRepository');
const Recommendation = require('../../domain/entities/Recommendation');
const UserInteraction = require('../../domain/entities/UserInteraction');

/**
 * Implementation of IRecommendationRepository using Sequelize
 * Menggunakan tabel 'aktivitas_user' untuk tracking interactions
 */
class RecommendationRepositoryImpl extends IRecommendationRepository {
    constructor(sequelize) {
        super();
        console.log('[RecommendationRepositoryImpl] Initializing with sequelize:', !!sequelize);
        this.sequelize = sequelize;
        this.UserInteractionModel = require('../models/UserInteraction');
        this.RecommendationModel = require('../models/Recommendation');
        console.log('[RecommendationRepositoryImpl] After init, this.sequelize:', !!this.sequelize);

        // Bind methods to preserve 'this' context
        this.getPersonalizedRecommendations = this.getPersonalizedRecommendations.bind(this);
        this.getSimilarServices = this.getSimilarServices.bind(this);
        this.getPopularServices = this.getPopularServices.bind(this);
        this.trackInteraction = this.trackInteraction.bind(this);
        this.getUserInteractions = this.getUserInteractions.bind(this);
    }

    async getPersonalizedRecommendations(userId, limit = 10) {
        try {
            // Get user interactions untuk personalisasi
            const interactions = await this.getUserInteractions(userId);

            // Get layanan populer berdasarkan aktivitas
            const popularLayanan = await this.sequelize.query(`
        SELECT
          l.id as layanan_id,
          l.judul as nama_layanan,
          l.kategori_id,
          COUNT(DISTINCT CASE WHEN au.tipe_aktivitas = 'lihat_layanan' THEN au.id END) as views,
          COUNT(DISTINCT CASE WHEN au.tipe_aktivitas = 'tambah_favorit' THEN au.id END) as favorites,
          COUNT(DISTINCT CASE WHEN au.tipe_aktivitas = 'buat_pesanan' THEN au.id END) as orders,
          COALESCE(AVG(u.rating), 0) as avg_rating
        FROM layanan l
        LEFT JOIN aktivitas_user au ON l.id = au.layanan_id
        LEFT JOIN ulasan u ON l.id = u.layanan_id
        GROUP BY l.id, l.judul, l.kategori_id
        ORDER BY orders DESC, favorites DESC, views DESC
        LIMIT :limit
      `, {
                replacements: { limit: limit * 2 },
                type: this.sequelize.QueryTypes.SELECT
            });

            // Calculate scores untuk setiap layanan
            const recommendations = popularLayanan.map(layanan => {
                // User interaction score
                const userInteractionScore = interactions
                    .filter(int => int.serviceId === layanan.layanan_id)
                    .reduce((sum, int) => sum + this._getActivityWeight(int.interactionType), 0);

                // Popularity score
                const popularityScore = (
                    (layanan.views || 0) * 0.2 +
                    (layanan.favorites || 0) * 0.3 +
                    (layanan.orders || 0) * 0.4 +
                    (layanan.avg_rating || 0) * 2
                );

                const totalScore = userInteractionScore * 0.6 + popularityScore * 0.4;

                return new Recommendation({
                    id: `rec-${Date.now()}-${layanan.layanan_id}`,
                    userId,
                    serviceId: layanan.layanan_id,
                    score: Math.round(totalScore),
                    reason: this._determineReason(interactions, layanan.layanan_id),
                    source: this._determineSource(interactions, layanan.layanan_id),
                    metadata: {
                        serviceName: layanan.nama_layanan,
                        views: layanan.views || 0,
                        favorites: layanan.favorites || 0,
                        orders: layanan.orders || 0,
                        rating: layanan.avg_rating || 0
                    }
                });
            });

            // Sort by score dan return top N
            return recommendations
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
        } catch (error) {
            console.error('RecommendationRepository.getPersonalizedRecommendations Error:', error);
            throw new Error('Failed to get personalized recommendations: ' + error.message);
        }
    }

    async getSimilarServices(serviceId, limit = 5) {
        try {
            // Get target service
            const targetService = await this.sequelize.query(`
        SELECT id, judul as nama_layanan, kategori_id
        FROM layanan
        WHERE id = :serviceId
      `, {
                replacements: { serviceId },
                type: this.sequelize.QueryTypes.SELECT
            });

            if (!targetService.length) return [];

            const target = targetService[0];

            // Get similar services berdasarkan kategori
            const similarServices = await this.sequelize.query(`
        SELECT
          l.id as layanan_id,
          l.judul as nama_layanan,
          l.kategori_id,
          COUNT(DISTINCT au.id) as activity_count,
          CASE
            WHEN l.kategori_id = :kategoriId THEN 90
            ELSE 50
          END as similarity_score
        FROM layanan l
        LEFT JOIN aktivitas_user au ON l.id = au.layanan_id
        WHERE l.id != :serviceId AND l.status = 'aktif'
        GROUP BY l.id, l.judul, l.kategori_id
        ORDER BY similarity_score DESC, activity_count DESC
        LIMIT :limit
      `, {
                replacements: {
                    serviceId,
                    kategoriId: target.kategori_id,
                    limit
                },
                type: this.sequelize.QueryTypes.SELECT
            });

            return similarServices.map(service => new Recommendation({
                id: `sim-${Date.now()}-${service.layanan_id}`,
                userId: null,
                serviceId: service.layanan_id,
                score: service.similarity_score,
                reason: `Similar to ${target.nama_layanan}`,
                source: 'similar',
                metadata: {
                    serviceName: service.nama_layanan,
                    similarity: service.similarity_score >= 70 ? 'high' : 'medium'
                }
            }));
        } catch (error) {
            console.error('RecommendationRepository.getSimilarServices Error:', error);
            throw new Error('Failed to get similar services: ' + error.message);
        }
    }

    async getPopularServices(limit = 10, timeRange = '7d', category = null) {
        try {
            const daysMap = {
                '24h': 1,
                '7d': 7,
                '30d': 30,
                'all': 36500
            };

            const days = daysMap[timeRange] || 7;
            const dateFrom = new Date();
            dateFrom.setDate(dateFrom.getDate() - days);

            let categoryFilter = '';
            if (category) {
                categoryFilter = 'AND l.kategori_id = :category';
            }

            const popularServices = await this.sequelize.query(`
        SELECT
          l.id as layanan_id,
          l.judul as nama_layanan,
          l.kategori_id,
          COUNT(DISTINCT CASE WHEN au.tipe_aktivitas = 'lihat_layanan' THEN au.id END) as views,
          COUNT(DISTINCT CASE WHEN au.tipe_aktivitas = 'tambah_favorit' THEN au.id END) as favorites,
          COUNT(DISTINCT CASE WHEN au.tipe_aktivitas = 'buat_pesanan' THEN au.id END) as orders,
          COALESCE(AVG(u.rating), 0) as avg_rating
        FROM layanan l
        LEFT JOIN aktivitas_user au ON l.id = au.layanan_id AND au.created_at >= :dateFrom
        LEFT JOIN ulasan u ON l.id = u.layanan_id
        WHERE l.status = 'aktif' ${categoryFilter}
        GROUP BY l.id, l.judul, l.kategori_id
        ORDER BY orders DESC, favorites DESC, views DESC
        LIMIT :limit
      `, {
                replacements: { dateFrom, category, limit },
                type: this.sequelize.QueryTypes.SELECT
            });

            return popularServices.map(service => {
                const popularityScore = (
                    (service.views || 0) * 0.25 +
                    (service.favorites || 0) * 0.25 +
                    (service.orders || 0) * 0.35 +
                    (service.avg_rating || 0) * 3
                );

                return new Recommendation({
                    id: `pop-${Date.now()}-${service.layanan_id}`,
                    userId: null,
                    serviceId: service.layanan_id,
                    score: Math.round(popularityScore),
                    reason: 'Popular service',
                    source: 'popular',
                    metadata: {
                        serviceName: service.nama_layanan,
                        views: service.views || 0,
                        favorites: service.favorites || 0,
                        orders: service.orders || 0,
                        rating: service.avg_rating || 0,
                        timeRange
                    }
                });
            });
        } catch (error) {
            console.error('RecommendationRepository.getPopularServices Error:', error);
            throw new Error('Failed to get popular services: ' + error.message);
        }
    }

    async trackInteraction(userId, serviceId, interactionType, value = 1, metadata = {}) {
        try {
            // Map interaction types ke tipe_aktivitas
            const activityTypeMap = {
                'view': 'lihat_layanan',
                'click': 'lihat_layanan',
                'like': 'tambah_favorit',
                'unlike': 'tambah_favorit', // Will be handled differently
                'order': 'buat_pesanan',
                'rating': 'lihat_layanan',
                'hide': 'lihat_layanan',
                'search': 'cari'
            };

            const tipeAktivitas = activityTypeMap[interactionType] || 'lihat_layanan';

            // For 'unlike', we don't add new activity (just for compatibility)
            if (interactionType === 'unlike') {
                return new UserInteraction({
                    id: `skip-${Date.now()}`,
                    userId,
                    serviceId,
                    interactionType: 'unlike',
                    value,
                    metadata,
                    createdAt: new Date()
                });
            }

            const interactionData = await this.UserInteractionModel.create({
                user_id: userId,
                tipe_aktivitas: tipeAktivitas,
                layanan_id: serviceId,
                kata_kunci: metadata.kata_kunci || null,
                created_at: new Date()
            });

            return new UserInteraction({
                id: interactionData.id,
                userId: interactionData.user_id,
                serviceId: interactionData.layanan_id,
                interactionType: interactionType, // Keep original type
                value,
                metadata: {
                    tipe_aktivitas: interactionData.tipe_aktivitas,
                    kata_kunci: interactionData.kata_kunci,
                    ...metadata
                },
                createdAt: interactionData.created_at
            });
        } catch (error) {
            console.error('RecommendationRepository.trackInteraction Error:', error);
            throw new Error('Failed to track interaction: ' + error.message);
        }
    }

    async getUserInteractions(userId, serviceId = null) {
        try {
            const where = { user_id: userId };
            if (serviceId) {
                where.layanan_id = serviceId;
            }

            const interactions = await this.UserInteractionModel.findAll({
                where,
                order: [['created_at', 'DESC']],
                limit: 100
            });

            return interactions.map(int => new UserInteraction({
                id: int.id,
                userId: int.user_id,
                serviceId: int.layanan_id,
                interactionType: this._mapActivityToInteractionType(int.tipe_aktivitas),
                value: 1,
                metadata: {
                    tipe_aktivitas: int.tipe_aktivitas,
                    kata_kunci: int.kata_kunci
                },
                createdAt: int.created_at
            }));
        } catch (error) {
            console.error('RecommendationRepository.getUserInteractions Error:', error);
            throw new Error('Failed to get user interactions: ' + error.message);
        }
    }

    async getServicePopularity(serviceId) {
        try {
            const stats = await this.sequelize.query(`
        SELECT 
          COUNT(DISTINCT CASE WHEN tipe_aktivitas = 'lihat_layanan' THEN id END) as views,
          COUNT(DISTINCT CASE WHEN tipe_aktivitas = 'tambah_favorit' THEN id END) as favorites,
          COUNT(DISTINCT CASE WHEN tipe_aktivitas = 'buat_pesanan' THEN id END) as orders
        FROM aktivitas_user
        WHERE layanan_id = :serviceId
      `, {
                replacements: { serviceId },
                type: this.sequelize.QueryTypes.SELECT
            });

            return stats[0] || { views: 0, favorites: 0, orders: 0 };
        } catch (error) {
            console.error('RecommendationRepository.getServicePopularity Error:', error);
            throw new Error('Failed to get service popularity: ' + error.message);
        }
    }

    async refreshRecommendations(userId) {
        return this.getPersonalizedRecommendations(userId, 20);
    }

    async generateRecommendations(userId) {
        return this.refreshRecommendations(userId);
    }

    // Helper methods
    _getActivityWeight(tipeAktivitas) {
        const weights = {
            'lihat_layanan': 1,
            'cari': 2,
            'tambah_favorit': 5,
            'buat_pesanan': 10
        };
        return weights[tipeAktivitas] || 1;
    }

    _mapActivityToInteractionType(tipeAktivitas) {
        const map = {
            'lihat_layanan': 'view',
            'cari': 'search',
            'tambah_favorit': 'like',
            'buat_pesanan': 'order'
        };
        return map[tipeAktivitas] || 'view';
    }

    _determineReason(interactions, serviceId) {
        const serviceInteractions = interactions.filter(int => int.serviceId === serviceId);

        if (serviceInteractions.length === 0) return 'Popular service';

        const hasOrder = serviceInteractions.some(int => int.interactionType === 'order');
        if (hasOrder) return 'Based on your previous orders';

        const hasLike = serviceInteractions.some(int => int.interactionType === 'like');
        if (hasLike) return 'Based on your favorites';

        return 'Based on your browsing history';
    }

    _determineSource(interactions, serviceId) {
        const serviceInteractions = interactions.filter(int => int.serviceId === serviceId);

        if (serviceInteractions.length === 0) return 'popular';

        const hasOrder = serviceInteractions.some(int => int.interactionType === 'order');
        if (hasOrder) return 'orders';

        const hasLike = serviceInteractions.some(int => int.interactionType === 'like');
        if (hasLike) return 'likes';

        return 'clicks';
    }

    /**
   * Get active users in last N days
   */
    async getActiveUsers(days = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            const [results] = await this.sequelize.query(`
        SELECT DISTINCT user_id as id
        FROM aktivitas_user
        WHERE created_at >= :cutoffDate
        ORDER BY user_id
      `, {
                replacements: { cutoffDate: cutoffDate.toISOString() }
            });

            return results;
        } catch (error) {
            console.error('Error getting active users:', error);
            return [];
        }
    }

    /**
     * Delete old interactions
     */
    async deleteOldInteractions(cutoffDate) {
        try {
            const [results] = await this.sequelize.query(`
        DELETE FROM aktivitas_user
        WHERE created_at < :cutoffDate
        AND tipe_aktivitas NOT IN ('hide', 'tambah_favorit')
      `, {
                replacements: { cutoffDate: cutoffDate.toISOString() }
            });

            return results.rowCount || 0;
        } catch (error) {
            console.error('Error deleting old interactions:', error);
            return 0;
        }
    }
}

module.exports = RecommendationRepositoryImpl;