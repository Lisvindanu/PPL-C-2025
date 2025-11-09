class ReplyToReview {
  constructor(reviewRepository, notificationService = null) {
    this.reviewRepository = reviewRepository;
    this.notificationService = notificationService;
  }

  async execute(reviewId, userId, balasan) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Review tidak ditemukan');

    if (review.penerima_ulasan_id !== userId) {
      throw new Error('Kamu bukan pemilik layanan, tidak bisa membalas');
    }

    if (review.balasan_penyedia) {
      throw new Error('Review ini sudah dibalas sebelumnya');
    }

    if (!balasan || balasan.trim().length < 5) {
      throw new Error('Balasan minimal 5 karakter');
    }

    const updated = await this.reviewRepository.update(reviewId, {
      balasan_penyedia: balasan,
    });

    if (this.notificationService) {
      await this.notificationService.sendReviewReplyNotification(
        review.pemberi_ulasan_id,
        updated
      );
    }

    return updated;
  }
}

module.exports = ReplyToReview;
