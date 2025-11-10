class DeleteReview {
  constructor(reviewRepository, serviceRepository = null) {
    this.reviewRepository = reviewRepository;
    this.serviceRepository = serviceRepository;
  }

  async execute(isAdmin, reviewId) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Ulasan tidak ditemukan');

    if (!isAdmin) throw new Error('Hanya admin yang boleh menghapus ulasan');

    const deleted = await this.reviewRepository.delete(reviewId);
    if (!deleted) throw new Error('Gagal menghapus ulasan');

    // Jalankan recalculateRating hanya jika fungsi itu ada
    if (this.serviceRepository?.recalculateRating && review.layanan_id) {
      await this.serviceRepository.recalculateRating(review.layanan_id);
    }

    return {
      success: true,
      message: 'Ulasan berhasil dihapus'
    };
  }
}

module.exports = DeleteReview;
