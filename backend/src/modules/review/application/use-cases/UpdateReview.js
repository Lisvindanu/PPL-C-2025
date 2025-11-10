class UpdateReview {
  constructor(reviewRepository, moderationService = null) {
    this.reviewRepository = reviewRepository;
    this.moderationService = moderationService;
  }

  /**
   * Update review milik user
   * @param {string} userId - ID pengguna yang mengupdate
   * @param {string} reviewId - ID review
   * @param {object} updateData - Data ulasan baru
   */
  async execute(userId, reviewId, updateData) {
    const existing = await this.reviewRepository.findById(reviewId);
    if (!existing) throw new Error('Ulasan tidak ditemukan');

    if (existing.pemberi_ulasan_id && existing.pemberi_ulasan_id.toString() !== userId.toString()) {
      throw new Error('Tidak punya izin untuk mengubah ulasan ini');
    }

    const updated = await this.reviewRepository.update(reviewId, updateData);

    // Moderation check (misal untuk deteksi kata kasar)
    if (this.moderationService && typeof this.moderationService.checkContent === 'function') {
      await this.moderationService.checkContent(updated);
    }

    return {
      success: true,
      message: 'Ulasan berhasil diperbarui',
      data: updated,
    };
  }
}

module.exports = UpdateReview;
