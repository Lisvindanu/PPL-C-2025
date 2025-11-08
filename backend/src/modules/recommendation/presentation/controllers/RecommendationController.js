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
      const userId = req.user?.userId || req.body.userId;

      const dto = new TrackInteractionDTO({
        userId,
        serviceId: req.body.serviceId,
        interactionType: req.body.interactionType,
        value: req.body.value || 1,
        metadata: req.body.metadata || {}
      });

      const result = await this.trackInteractionUseCase.execute(
        dto.userId,
        dto.serviceId,
        dto.interactionType,
        dto.value,
        dto.metadata
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      console.error('RecommendationController.trackInteraction Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
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
}

module.exports = RecommendationController;