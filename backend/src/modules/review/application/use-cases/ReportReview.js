class ReportReview {
  constructor(reviewRepository, moderationService = null, notificationService = null) {
    this.reviewRepository = reviewRepository;
    this.moderationService = moderationService;
    this.notificationService = notificationService;
  }

  async execute(userId, reviewId, reason = null) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Ulasan tidak ditemukan');

    if (review.is_reported) {
      throw new Error('Ulasan sudah pernah dilaporkan');
    }

    await this.reviewRepository.update(reviewId, { is_reported: true });

    if (this.moderationService?.handleReport) {
      await this.moderationService.handleReport(reviewId, reason);
    }

    if (this.notificationService?.notifyAdmin) {
      await this.notificationService.notifyAdmin({
        type: 'review_reported',
        reviewId,
        userId,
        reason
      });
    }

    return {
      success: true,
      message: 'Ulasan telah dilaporkan untuk ditinjau oleh admin.'
    };
  }
}

module.exports = ReportReview;
