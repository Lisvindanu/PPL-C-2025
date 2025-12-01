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

  /**
   * GET /api/recommendations/admin/dashboard
   * Get comprehensive dashboard data for admin
   */
  async getAdminDashboard(req, res) {
    try {
      const period = req.query.period || 'week'; // 'week', 'month', 'year'

      // Mock data sesuai dengan desain
      const dashboardData = {
        period,
        stats: {
          totalRecommendations: 2450,
          totalClicks: 1223,
          totalConversions: 129
        },
        clickTrend: [
          { name: "Senin", value: 0 },
          { name: "Selasa", value: 100 },
          { name: "Rabu", value: 120 },
          { name: "Kamis", value: 350 },
          { name: "Jumat", value: 200 },
          { name: "Sabtu", value: 550 },
          { name: "Minggu", value: 720 }
        ],
        conversionTrend: [
          { name: "Sen", value: 5 },
          { name: "Sel", value: 25 },
          { name: "Rab", value: 50 },
          { name: "Kam", value: 70 },
          { name: "Jum", value: 20 },
          { name: "Sab", value: 40 },
          { name: "Min", value: 60 }
        ],
        topRecommended: [
          { layanan: "Layanan A", rekomendasi: 2100, persentase: "55%" },
          { layanan: "Layanan B", rekomendasi: 1400, persentase: "50,4%" },
          { layanan: "Layanan C", rekomendasi: 1941, persentase: "47,5%" },
          { layanan: "Layanan D", rekomendasi: 897, persentase: "35%" },
          { layanan: "Layanan E", rekomendasi: 722, persentase: "31,2%" },
          { layanan: "Layanan F", rekomendasi: 598, persentase: "16,7%" },
          { layanan: "Layanan G", rekomendasi: 566, persentase: "13,2%" },
          { layanan: "Layanan H", rekomendasi: 548, persentase: "8,6%" },
          { layanan: "Layanan I", rekomendasi: 516, persentase: "6,6%" },
          { layanan: "Layanan J", rekomendasi: 377, persentase: "3,8%" }
        ],
        topClicked: [
          { layanan: "Layanan A", jumlahKlik: 223 },
          { layanan: "Layanan B", jumlahKlik: 211 },
          { layanan: "Layanan C", jumlahKlik: 194 },
          { layanan: "Layanan D", jumlahKlik: 189 },
          { layanan: "Layanan E", jumlahKlik: 182 },
          { layanan: "Layanan F", jumlahKlik: 175 },
          { layanan: "Layanan G", jumlahKlik: 169 },
          { layanan: "Layanan H", jumlahKlik: 162 },
          { layanan: "Layanan I", jumlahKlik: 150 },
          { layanan: "Layanan J", jumlahKlik: 127 }
        ]
      };

      return res.status(200).json({
        success: true,
        message: 'Dashboard data retrieved successfully',
        data: dashboardData
      });
    } catch (error) {
      console.error('RecommendationController.getAdminDashboard Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * GET /api/recommendations/admin/monitoring-dashboard
   * Get monitoring dashboard data with metrics, trends, and tables
   */
  async getMonitoringDashboard(req, res) {
    try {
      const period = req.query.period || 'week';

      // Return mock data for now
      const dashboardData = {
        totalRecommendations: 2450,
        totalFavorites: 1223,
        totalTransactions: 453,
        favoriteTrend: [
          { name: "Sen", value: 275 },
          { name: "Sel", value: 385 },
          { name: "Rab", value: 365 },
          { name: "Kam", value: 450 },
          { name: "Jum", value: 305 },
          { name: "Sab", value: 235 },
          { name: "Min", value: 208 }
        ],
        transactionTrend: [
          { name: "Sen", value: 125 },
          { name: "Sel", value: 155 },
          { name: "Rab", value: 143 },
          { name: "Kam", value: 185 },
          { name: "Jum", value: 110 },
          { name: "Sab", value: 90 },
          { name: "Min", value: 75 }
        ],
        topFavoriteUsers: [
          { username: "Ahmad Rizki", count: 431, service: "UI/UX Design" },
          { username: "SatriaWibawa", count: 211, service: "Web Dev" },
          { username: "DewiKartika", count: 135, service: "UI/UX Design" },
          { username: "BagasSenja", count: 87, service: "UI/UX Design" }
        ],
        topTransactionUsers: [
          { username: "Ahmad Rizki", count: 31, service: "UI/UX Design" },
          { username: "SatriaWibawa", count: 11, service: "Web Dev" },
          { username: "DewiKartika", count: 13, service: "UI/UX Design" },
          { username: "BagasSenja", count: 8, service: "UI/UX Design" }
        ],
        topRecommendedServices: [
          { user: "Ahmad Rizki", recommendations: 2100, percentage: "55%" },
          { user: "SatriaWibawa", recommendations: 1400, percentage: "50.4%" },
          { user: "DewiKartika", recommendations: 1941, percentage: "47.5%" },
          { user: "BagasSenja", recommendations: 897, percentage: "35%" },
          { user: "BogasSenja", recommendations: 722, percentage: "31.2%" },
          { user: "RizkiNirmala", recommendations: 598, percentage: "16.7%" },
          { user: "LaraisCahaya", recommendations: 566, percentage: "13.2%" },
          { user: "BintangKusuma", recommendations: 548, percentage: "8.6%" },
          { user: "RamaPratama", recommendations: 516, percentage: "6.6%" },
          { user: "AnggaSaputra", recommendations: 377, percentage: "3.8%" }
        ]
      };

      return res.status(200).json({
        success: true,
        message: 'Monitoring dashboard data retrieved successfully',
        data: dashboardData
      });
    } catch (error) {
      console.error('RecommendationController.getMonitoringDashboard Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * GET /api/recommendations/admin/model/status
   * Get model status and information
   */
  async getModelStatus(req, res) {
    try {
      // Mock data untuk model status
      const modelData = {
        status: "Aktif",
        version: "v1.1",
        lastUpdate: "2025-10-02T14:30:00Z",
        nextScheduledUpdate: "2025-11-25T11:20:00Z",
        updateLogs: [
          { date: "02/10/2025", version: "v1.1", status: "Sukses" },
          { date: "02/10/2025", version: "v1.1", status: "Sukses" }
        ]
      };

      return res.status(200).json({
        success: true,
        message: 'Model status retrieved successfully',
        data: modelData
      });
    } catch (error) {
      console.error('RecommendationController.getModelStatus Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * POST /api/recommendations/admin/model/update
   * Trigger model update
   */
  async updateModel(req, res) {
    try {
      // Simulate model update process
      // In real scenario, this would trigger ML model retraining

      const updateResult = {
        previousVersion: "v1.1",
        newVersion: "v1.2",
        status: "Sukses",
        updatedAt: new Date(),
        nextScheduledUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };

      return res.status(200).json({
        success: true,
        message: 'Model updated successfully',
        data: updateResult
      });
    } catch (error) {
      console.error('RecommendationController.updateModel Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * GET /api/recommendations/admin/model/evaluation
   * Get model evaluation metrics
   */
  async getModelEvaluation(req, res) {
    try {
      // Mock data untuk evaluasi model
      const evaluationData = {
        metrics: {
          precision: "92.4%",
          recall: "87.6%",
          f1Score: "89.9%",
          accuracy: "91.2%"
        },
        accuracyTrend: [
          { name: "Jan", value: 10 },
          { name: "Feb", value: 30 },
          { name: "Mar", value: 50 },
          { name: "Apr", value: 70 },
          { name: "Mei", value: 20 },
          { name: "Jun", value: 60 }
        ],
        modelComparison: [
          { version: "v1.3", accuracy: "89,1%" },
          { version: "v1.2", accuracy: "89,1%" },
          { version: "v1.1", accuracy: "89,1%" }
        ],
        insights: [
          "Disarankan melakukan tuning threshold dan retraining dengan data interaksi terbaru untuk menyeimbangkan precision dan recall"
        ]
      };

      return res.status(200).json({
        success: true,
        message: 'Model evaluation retrieved successfully',
        data: evaluationData
      });
    } catch (error) {
      console.error('RecommendationController.getModelEvaluation Error:', error);
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