const RecommendationService = require('../../domain/services/RecommendationService');
const RecommendationRepositoryImpl = require('../../infrastructure/repositories/RecommendationRepositoryImpl');
const GetRecommendationsUseCase = require('../../application/use-cases/GetRecommendationsUseCase');
const GetSimilarServicesUseCase = require('../../application/use-cases/GetSimilarServicesUseCase');
const GetPopularServicesUseCase = require('../../application/use-cases/GetPopularServicesUseCase');
const TrackInteractionUseCase = require('../../application/use-cases/TrackInteractionUseCase');

const {
  GetRecommendationsDTO,
  GetSimilarServicesDTO,
  GetPopularServicesDTO,
  TrackInteractionDTO
} = require('../../application/dtos/RecommendationDTOs');

/**
 * Controller untuk menangani request terkait Recommendations
 * Compatible dengan pattern instantiasi di server.js
 */
class RecommendationController {
  constructor(sequelize) {
    // Initialize dependencies
    console.log('[RecommendationController] Initializing with sequelize:', !!sequelize);
    this.sequelize = sequelize;
    this.recommendationRepository = new RecommendationRepositoryImpl(sequelize);
    this.recommendationService = new RecommendationService();

    // Initialize use cases
    this.getRecommendationsUseCase = new GetRecommendationsUseCase(
      this.recommendationRepository,
      this.recommendationService
    );

    this.getSimilarServicesUseCase = new GetSimilarServicesUseCase(
      this.recommendationRepository,
      this.recommendationService
    );

    this.getPopularServicesUseCase = new GetPopularServicesUseCase(
      this.recommendationRepository,
      this.recommendationService
    );

    this.trackInteractionUseCase = new TrackInteractionUseCase(
      this.recommendationRepository
    );
  }

  /**
   * GET /api/recommendations
   * Get personalized recommendations for user
   */
  async getRecommendations(req, res) {
    try {
      const userId = req.user?.userId || req.query.userId;

      const dto = new GetRecommendationsDTO({
        userId,
        limit: parseInt(req.query.limit) || 10,
        refresh: req.query.refresh === 'true',
        excludeServiceIds: req.query.exclude ? req.query.exclude.split(',') : []
      });

      const result = await this.getRecommendationsUseCase.execute(dto.userId, {
        limit: dto.limit,
        refresh: dto.refresh,
        excludeServiceIds: dto.excludeServiceIds
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Recommendations retrieved successfully',
        data: result.data,
        metadata: result.metadata
      });
    } catch (error) {
      console.error('RecommendationController.getRecommendations Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * GET /api/recommendations/similar/:serviceId
   * Get similar services
   */
  async getSimilarServices(req, res) {
    try {
      const { serviceId } = req.params;

      const dto = new GetSimilarServicesDTO({
        serviceId,
        limit: parseInt(req.query.limit) || 5,
        excludeServiceIds: req.query.exclude ? req.query.exclude.split(',') : []
      });

      const result = await this.getSimilarServicesUseCase.execute(dto.serviceId, {
        limit: dto.limit,
        excludeServiceIds: dto.excludeServiceIds
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Similar services retrieved successfully',
        data: result.data,
        metadata: result.metadata
      });
    } catch (error) {
      console.error('RecommendationController.getSimilarServices Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * GET /api/recommendations/popular
   * Get popular services
   */
  async getPopularServices(req, res) {
    try {
      const dto = new GetPopularServicesDTO({
        limit: parseInt(req.query.limit) || 10,
        timeRange: req.query.timeRange || '7d',
        category: req.query.category || null,
        excludeServiceIds: req.query.exclude ? req.query.exclude.split(',') : []
      });

      const result = await this.getPopularServicesUseCase.execute({
        limit: dto.limit,
        timeRange: dto.timeRange,
        category: dto.category,
        excludeServiceIds: dto.excludeServiceIds
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Popular services retrieved successfully',
        data: result.data,
        metadata: result.metadata
      });
    } catch (error) {
      console.error('RecommendationController.getPopularServices Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * POST /api/recommendations/track
   * Track user interaction
   */
  async trackInteraction(req, res) {
    try {
      let { userId, activityType, serviceId, keyword } = req.body;

      // VALIDASI: Jika serviceId adalah 'string' atau bukan UUID, set ke null
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (!serviceId || serviceId === 'string' || !uuidRegex.test(serviceId)) {
        serviceId = null;
      }

      await this.trackInteractionUseCase.execute({
        userId,
        activityType,
        serviceId,
        keyword
      });

      res.status(200).json({
        success: true,
        message: 'Interaction tracked successfully'
      });
    } catch (error) {
      console.error('TrackInteractionController Error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/recommendations/interactions
   * Get user interaction history
   */
  async getInteractionHistory(req, res) {
    try {
      const userId = req.user?.userId || req.query.userId;
      const serviceId = req.query.serviceId || null;
      const limit = parseInt(req.query.limit) || 50;

      const result = await this.trackInteractionUseCase.getInteractionHistory(
        userId,
        serviceId,
        limit
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Interaction history retrieved successfully',
        data: result.data,
        metadata: result.metadata
      });
    } catch (error) {
      console.error('RecommendationController.getInteractionHistory Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
 * POST /api/recommendations/hide/:serviceId
 * Hide service from recommendations permanently
 */
  async hideService(req, res) {
    try {
      const userId = req.user?.userId;
      const { serviceId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // 🔍 Cek apakah layanan dengan ID tersebut ada
      const [service] = await this.sequelize.query(
        `SELECT id FROM layanan WHERE id = :serviceId LIMIT 1`,
        {
          replacements: { serviceId },
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      // 💾 Simpan interaksi "hide" ke tabel aktivitas_user
      await this.sequelize.query(
        `
      INSERT INTO aktivitas_user (user_id, layanan_id, tipe_aktivitas, created_at)
      VALUES (:userId, :serviceId, 'hide', NOW(), NOW())
      `,
        {
          replacements: { userId, serviceId },
          type: this.sequelize.QueryTypes.INSERT
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Service hidden from recommendations',
        data: {
          userId,
          serviceId,
          hiddenAt: new Date()
        }
      });
    } catch (error) {
      console.error('RecommendationController.hideService Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/recommendations/hide/:serviceId
   * Unhide service (remove from hidden list)
   */
  async unhideService(req, res) {
    try {
      const userId = req.user?.userId;
      const { serviceId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Delete hide interaction
      await this.sequelize.query(`
        DELETE FROM aktivitas_user 
        WHERE user_id = :userId 
        AND layanan_id = :serviceId 
        AND tipe_aktivitas = 'hide'
      `, {
        replacements: { userId, serviceId },
        type: this.sequelize.QueryTypes.DELETE
      });

      return res.status(200).json({
        success: true,
        message: 'Service unhidden successfully',
        data: {
          userId,
          serviceId
        }
      });
    } catch (error) {
      console.error('RecommendationController.unhideService Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * GET /api/recommendations/admin/stats
   * Get recommendation statistics (ADMIN ONLY)
   */
  async getAdminStats(req, res) {
    try {
      const timeRange = req.query.timeRange || '7d';
      const startDate = this._getStartDate(timeRange);

      // 1. CTR (Click-Through Rate)
      const ctrStats = await this.sequelize.query(`
        SELECT 
          COUNT(CASE WHEN tipe_aktivitas = 'lihat_layanan' THEN 1 END) as views,
          COUNT(CASE WHEN tipe_aktivitas IN ('tambah_favorit', 'buat_pesanan') THEN 1 END) as conversions,
          ROUND(
            (COUNT(CASE WHEN tipe_aktivitas IN ('tambah_favorit', 'buat_pesanan') THEN 1 END)::numeric / 
            NULLIF(COUNT(CASE WHEN tipe_aktivitas = 'lihat_layanan' THEN 1 END), 0) * 100), 2
          ) as ctr_percentage
        FROM aktivitas_user
        WHERE created_at >= :startDate
      `, {
        replacements: { startDate },
        type: this.sequelize.QueryTypes.SELECT
      });

      // 2. Most Recommended Services
      const topServices = await this.sequelize.query(`
        SELECT 
          l.id,
          l.nama_layanan,
          l.kategori,
          COUNT(DISTINCT au.user_id) as unique_views,
          COUNT(*) as total_interactions,
          COUNT(CASE WHEN au.tipe_aktivitas = 'tambah_favorit' THEN 1 END) as favorites,
          COUNT(CASE WHEN au.tipe_aktivitas = 'buat_pesanan' THEN 1 END) as orders
        FROM layanan l
        LEFT JOIN aktivitas_user au ON l.id = au.layanan_id
        WHERE au.created_at >= :startDate
        GROUP BY l.id, l.nama_layanan, l.kategori
        ORDER BY total_interactions DESC
        LIMIT 10
      `, {
        replacements: { startDate },
        type: this.sequelize.QueryTypes.SELECT
      });

      // 3. User Engagement Stats
      const engagementStats = await this.sequelize.query(`
        SELECT 
          COUNT(DISTINCT user_id) as active_users,
          COUNT(*) as total_interactions,
          ROUND(AVG(interactions_per_user), 2) as avg_interactions_per_user
        FROM (
          SELECT 
            user_id,
            COUNT(*) as interactions_per_user
          FROM aktivitas_user
          WHERE created_at >= :startDate
          GROUP BY user_id
        ) subquery
      `, {
        replacements: { startDate },
        type: this.sequelize.QueryTypes.SELECT
      });

      // 4. Conversion Rate by Activity Type
      const conversionByType = await this.sequelize.query(`
        SELECT 
          tipe_aktivitas,
          COUNT(*) as count,
          ROUND((COUNT(*)::numeric / SUM(COUNT(*)) OVER ()) * 100, 2) as percentage
        FROM aktivitas_user
        WHERE created_at >= :startDate
        GROUP BY tipe_aktivitas
        ORDER BY count DESC
      `, {
        replacements: { startDate },
        type: this.sequelize.QueryTypes.SELECT
      });

      return res.status(200).json({
        success: true,
        message: 'Admin statistics retrieved successfully',
        data: {
          timeRange,
          period: {
            start: startDate,
            end: new Date()
          },
          ctr: ctrStats[0],
          topServices,
          engagement: engagementStats[0],
          conversionByType
        }
      });
    } catch (error) {
      console.error('RecommendationController.getAdminStats Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * GET /api/recommendations/admin/performance
   * Get recommendation performance metrics
   */
  async getRecommendationPerformance(req, res) {
    try {
      const timeRange = req.query.timeRange || '7d';
      const startDate = this._getStartDate(timeRange);

      const performance = await this.sequelize.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(DISTINCT user_id) as active_users,
          COUNT(*) as total_interactions,
          COUNT(CASE WHEN tipe_aktivitas = 'lihat_layanan' THEN 1 END) as views,
          COUNT(CASE WHEN tipe_aktivitas = 'tambah_favorit' THEN 1 END) as favorites,
          COUNT(CASE WHEN tipe_aktivitas = 'buat_pesanan' THEN 1 END) as orders,
          ROUND(
            (COUNT(CASE WHEN tipe_aktivitas = 'buat_pesanan' THEN 1 END)::numeric / 
            NULLIF(COUNT(CASE WHEN tipe_aktivitas = 'lihat_layanan' THEN 1 END), 0) * 100), 2
          ) as conversion_rate
        FROM aktivitas_user
        WHERE created_at >= :startDate
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `, {
        replacements: { startDate },
        type: this.sequelize.QueryTypes.SELECT
      });

      return res.status(200).json({
        success: true,
        message: 'Performance metrics retrieved successfully',
        data: {
          timeRange,
          metrics: performance
        }
      });
    } catch (error) {
      console.error('RecommendationController.getRecommendationPerformance Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Helper method
  _getStartDate(timeRange) {
    const now = new Date();
    switch (timeRange) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'all':
        return new Date('2020-01-01');
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  }
}

module.exports = RecommendationController;