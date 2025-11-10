const CreateReview = require('../../application/use-cases/CreateReview');
const GetReviews = require('../../application/use-cases/GetReviews');
const UpdateReview = require('../../application/use-cases/UpdateReview');
const DeleteReview = require('../../application/use-cases/DeleteReview');
const ReportReview = require('../../application/use-cases/ReportReview');

const SequelizeReviewRepository = require('../../infrastructure/repositories/SequelizeReviewRepository');
const OrderRepository = require('../../infrastructure/repositories/OrderRepository');
const ServiceRepository = require('../../infrastructure/repositories/ServiceRepository');
const ModerationService = require('../../infrastructure/services/ModerationService');

const initModels = require('../../infrastructure/models');


class ReviewController {
  constructor(sequelize, notificationService = null) {
    this.sequelize = sequelize;
    this.notificationService = notificationService;
    initModels(this.sequelize);

    // Repository layer
    this.reviewRepository = new SequelizeReviewRepository(sequelize);
    this.orderRepository = new OrderRepository(sequelize);
    this.serviceRepository = new ServiceRepository(sequelize);
    this.moderationService = new ModerationService();

    // Application (use case) layer
    this.createReviewUseCase = new CreateReview(
      this.reviewRepository,
      this.orderRepository,
      this.serviceRepository,
      this.notificationService
    );

    this.getReviewsUseCase = new GetReviews(this.reviewRepository);
    this.updateReviewUseCase = new UpdateReview(
      this.reviewRepository,
      this.moderationService
    );
    this.deleteReviewUseCase = new DeleteReview(
      this.reviewRepository,
      this.serviceRepository
    );
    this.reportReviewUseCase = new ReportReview(
      this.reviewRepository,
      this.moderationService
    );
  }

  /** POST /api/reviews */
  async createReview(req, res) {
    try {
      const userId = req.user?.id || req.body.user_id;
      const result = await this.createReviewUseCase.execute(userId, req.body);

      return res.status(201).json({
        status: 'success',
        message: 'Ulasan berhasil dibuat',
        data: result,
      });
    } catch (error) {
      console.error('[CreateReview Error]:', error);
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  /** GET /api/reviews/service/:layanan_id */
  async getServiceReviews(req, res) {
    try {
      const { layanan_id } = req.params;
      const filters = req.query;
      const reviews = await this.getReviewsUseCase.byService(layanan_id, filters);

      return res.status(200).json({
        status: 'success',
        data: reviews,
      });
    } catch (error) {
      console.error('[GetServiceReviews Error]:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  /** GET /api/reviews/freelancer/:id */
  async getByFreelancer(req, res) {
    try {
      const { id } = req.params;
      const filters = req.query;
      const reviews = await this.getReviewsUseCase.byFreelancer(id, filters);

      return res.status(200).json({
        status: 'success',
        data: reviews,
      });
    } catch (error) {
      console.error('[GetByFreelancer Error]:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  /** GET /api/reviews/latest */
  async getLatestReviews(req, res) {
    try {
      const limit = parseInt(req.query.limit || 5, 10);
      const reviews = await this.getReviewsUseCase.latest(limit);

      return res.status(200).json({
        status: 'success',
        data: reviews,
      });
    } catch (error) {
      console.error('[GetLatestReviews Error]:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  /** PUT /api/reviews/:id */
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.body.user_id;
      const updated = await this.updateReviewUseCase.execute(userId, id, req.body);

      return res.status(200).json({
        status: 'success',
        message: 'Ulasan berhasil diperbarui',
        data: updated,
      });
    } catch (error) {
      console.error('[UpdateReview Error]:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  /** DELETE /api/reviews/:id */
  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const isAdmin = req.user?.role === 'admin' || req.body.isAdmin === true;

      await this.deleteReviewUseCase.execute(isAdmin, id);

      return res.status(200).json({
        status: 'success',
        message: 'Ulasan berhasil dihapus',
      });
    } catch (error) {
      console.error('[DeleteReview Error]:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  /** POST /api/reviews/:id/report */
  async reportReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.body.user_id;
      const { reason } = req.body;

      await this.reportReviewUseCase.execute(userId, id, reason);

      return res.status(200).json({
        status: 'success',
        message: 'Ulasan telah dilaporkan',
      });
    } catch (error) {
      console.error('[ReportReview Error]:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}

module.exports = ReviewController;
