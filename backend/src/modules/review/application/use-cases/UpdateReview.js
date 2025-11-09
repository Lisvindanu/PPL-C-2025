class UpdateReview {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async execute(userId, reviewId, updateData) {
    const existing = await this.reviewRepository.findById(reviewId);
    if (!existing) throw new Error('Ulasan tidak ditemukan');
    if (existing.pemberi_ulasan_id && existing.pemberi_ulasan_id.toString() !== userId.toString()) {
      throw new Error('Tidak punya izin mengubah ulasan ini');
    }
    const updated = await this.reviewRepository.update(reviewId, updateData);
    return updated;
  }
}

module.exports = UpdateReview;
