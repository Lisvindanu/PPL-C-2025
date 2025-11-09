class ReportReview {
  constructor(reviewRepository, moderationService = null) {
    this.reviewRepository = reviewRepository;
    this.moderationService = moderationService;
  }

  async execute(userId, reviewId, reason = null) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Ulasan tidak ditemukan');
    await this.reviewRepository.update(reviewId, { is_reported: true });
    if (this.moderationService && typeof this.moderationService.handleReport === 'function') {
      await this.moderationService.handleReport(reviewId, reason);
    }
    return true;
  }
}

module.exports = ReportReview;
