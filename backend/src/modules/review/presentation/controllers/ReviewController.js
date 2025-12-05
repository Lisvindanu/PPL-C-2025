const CreateReview = require('../../application/use-cases/CreateReview');
const GetReviews = require('../../application/use-cases/GetReviews');
const UpdateReview = require('../../application/use-cases/UpdateReview');
const DeleteReview = require('../../application/use-cases/DeleteReview');
const ReportReview = require('../../application/use-cases/ReportReview');
const ReplyToReview = require('../../application/use-cases/ReplyToReview');

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

    // Repositories
    this.reviewRepository = new SequelizeReviewRepository(sequelize);
    this.orderRepository = new OrderRepository(sequelize);
    this.serviceRepository = new ServiceRepository(sequelize);
    this.moderationService = new ModerationService();

    // Use cases
    this.createReviewUseCase = new CreateReview(
      this.reviewRepository,
      this.orderRepository,
      this.service_repository || this.serviceRepository,
      this.notificationService
    );

    this.getReviewsUseCase = new GetReviews(this.reviewRepository);
    this.updateReviewUseCase = new UpdateReview(this.reviewRepository, this.moderationService);
    this.deleteReviewUseCase = new DeleteReview(this.reviewRepository, this.serviceRepository);
    this.reportReviewUseCase = new ReportReview(this.reviewRepository, this.moderationService, this.notificationService);
    this.replyToReviewUseCase = new ReplyToReview(this.reviewRepository, this.notificationService);
  }

  // Helper to map error messages to HTTP status
  _errorStatus(err) {
    const msg = (err && err.message) ? err.message.toLowerCase() : '';
    if (msg.includes('tidak ditemukan') || msg.includes('not found')) return 404;
    if (msg.includes('tidak punya izin') || msg.includes('bukan pembeli') || msg.includes('kamu bukan')) return 403;
    if (msg.includes('minimal') || msg.includes('harus antara') || msg.includes('sudah pernah')) return 400;
    return 500;
  }

  /** POST /api/reviews
   * body: { pesanan_id, rating, judul, komentar, gambar }
   */
  async createReview(req, res) {
    try {
      const userId = req.user?.id;
      const payload = req.body || {};
      const result = await this.createReviewUseCase.execute(userId, payload);

      return res.status(201).json({
        status: 'success',
        message: 'Ulasan berhasil dibuat',
        data: result,
      });
    } catch (error) {
      console.error('[CreateReview Error]:', error);
      const status = this._errorStatus(error);
      return res.status(status).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  /** GET /api/reviews/my */
  async getMyReviews(req, res) {
    try {
      const userId = req.user?.id;
      const filters = req.query || {};
      const reviews = await this.getReviewsUseCase.byUser(userId, filters);

      return res.status(200).json({
        status: 'success',
        data: reviews,
      });
    } catch (error) {
      console.error('[GetMyReviews Error]:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  /** GET /api/reviews/user/:user_id */
  async getUserReviews(req, res) {
    try {
      const { user_id } = req.params;
      const filters = req.query || {};
      const reviews = await this.getReviewsUseCase.byUser(user_id, filters);

      return res.status(200).json({ status: 'success', data: reviews });
    } catch (error) {
      console.error('[GetUserReviews Error]:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  /** GET /api/reviews/service/:layanan_id */
  async getServiceReviews(req, res) {
    try {
      const { layanan_id } = req.params;
      const filters = req.query || {};
      const result = await this.getReviewsUseCase.byService(layanan_id, filters);

      return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      console.error('[GetServiceReviews Error]:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  /** GET /api/reviews/freelancer/:id */
  async getByFreelancer(req, res) {
    try {
      const { id } = req.params;
      const filters = req.query || {};
      const result = await this.getReviewsUseCase.byFreelancer(id, filters);

      return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      console.error('[GetByFreelancer Error]:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  /** GET /api/reviews/latest?limit=5 */
  async getLatestReviews(req, res) {
    try {
      const limit = parseInt(req.query.limit || 5, 10);
      const reviews = await this.getReviewsUseCase.latest(limit);

      return res.status(200).json({ status: 'success', data: reviews });
    } catch (error) {
      console.error('[GetLatestReviews Error]:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  /** PUT /api/reviews/:id
   * body: partial update (e.g. {judul, komentar, rating})
   */
  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const updateData = req.body || {};

      const result = await this.updateReviewUseCase.execute(userId, id, updateData);

      return res.status(200).json({
        status: 'success',
        message: 'Ulasan berhasil diperbarui',
        data: result.data || result,
      });
    } catch (error) {
      console.error('[UpdateReview Error]:', error);
      const status = this._errorStatus(error);
      return res.status(status).json({ status: 'error', message: error.message });
    }
  }

  /** DELETE /api/reviews/:id
   * Admin-only in use-case
   */
  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const isAdmin = req.user?.role === 'admin' || req.body.isAdmin === true;

      await this.deleteReviewUseCase.execute(isAdmin, id);

      return res.status(200).json({ status: 'success', message: 'Ulasan berhasil dihapus' });
    } catch (error) {
      console.error('[DeleteReview Error]:', error);
      const status = this._errorStatus(error);
      return res.status(status).json({ status: 'error', message: error.message });
    }
  }

  /** POST /api/reviews/:id/report
   * body: { reason }
   */
  async reportReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { reason } = req.body || null;

      await this.reportReviewUseCase.execute(userId, id, reason);

      return res.status(200).json({ status: 'success', message: 'Ulasan telah dilaporkan' });
    } catch (error) {
      console.error('[ReportReview Error]:', error);
      const status = this._errorStatus(error);
      return res.status(status).json({ status: 'error', message: error.message });
    }
  }

  /** POST /api/reviews/:id/helpful
   * no body
   */
  async markHelpful(req, res) {
    try {
      const { id } = req.params;
      const updated = await this.reviewRepository.incrementHelpful(id);

      return res.status(200).json({
        status: 'success',
        message: 'Berhasil menandai review sebagai helpful',
        data: updated,
      });
    } catch (error) {
      console.error('[MarkHelpful Error]:', error);
      const status = this._errorStatus(error);
      return res.status(status).json({ status: 'error', message: error.message });
    }
  }

  /** POST /api/reviews/:id/reply
   * body: { reply }
   * only freelancer (penerima_ulasan_id) can reply (checked in use-case)
   */
  async replyToReview(req, res) {
    try {
      const reviewId = req.params.id;
      const sellerId = req.user?.id;
      const { reply } = req.body || {};

      const result = await this.replyToReviewUseCase.execute(reviewId, sellerId, reply);

      return res.status(200).json({
        status: 'success',
        message: result.message || 'Balasan review berhasil dibuat',
        data: result.data || result,
      });
    } catch (error) {
      console.error('[ReplyReview Error]:', error);
      const status = this._errorStatus(error);
      return res.status(status).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = ReviewController;
