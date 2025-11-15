class ReplyToReview {
  constructor(reviewRepository, notificationService = null) {
    this.reviewRepository = reviewRepository;
    this.notificationService = notificationService;
  }

  /**
   * Balas ulasan dari pengguna
   * @param {string} reviewId - ID ulasan
   * @param {string} userId - ID user yang membalas (freelancer)
   * @param {string} balasan - Teks balasan
   */
  async execute(reviewId, userId, balasan) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Ulasan tidak ditemukan');

    // Pastikan user adalah penerima ulasan (freelancer)
    if (review.penerima_ulasan_id !== userId) {
      throw new Error('Kamu bukan pemilik layanan, tidak bisa membalas ulasan ini');
    }

    // Pastikan belum ada balasan sebelumnya
    if (review.balasan) {
      throw new Error('Ulasan ini sudah memiliki balasan');
    }

    // Validasi isi balasan
    if (!balasan || balasan.trim().length < 5) {
      throw new Error('Balasan minimal 5 karakter');
    }

    // Update review dengan balasan dan tanggal
    const updated = await this.reviewRepository.update(reviewId, {
      balasan,
      dibalas_pada: new Date(),
    });

    // Kirim notifikasi ke pemberi ulasan (opsional)
    if (this.notificationService && typeof this.notificationService.sendReviewReplyNotification === 'function') {
      await this.notificationService.sendReviewReplyNotification(
        review.pemberi_ulasan_id,
        updated
      );
    }

    return {
      success: true,
      message: 'Balasan ulasan berhasil dikirim',
      data: updated,
    };
  }
}

module.exports = ReplyToReview;
