class DeleteReview {
  constructor(reviewRepository, adminLogRepository) {
    this.reviewRepository = reviewRepository;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, reviewId, reason, ipAddress, userAgent) {
    await this.reviewRepository.delete(reviewId);
    await this.adminLogRepository.save({
      adminId,
      action: 'delete_review',
      targetType: 'ulasan',
      targetId: reviewId,
      detail: { reason },
      ipAddress,
      userAgent
    });
    return { reviewId, deletedAt: new Date() };
  }
}

module.exports = DeleteReview;