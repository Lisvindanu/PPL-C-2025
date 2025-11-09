class DeleteReview {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async execute(adminFlag, reviewId) {
    if (!adminFlag) throw new Error('Hanya admin yang boleh menghapus review');
    const ok = await this.reviewRepository.delete(reviewId);
    if (!ok) throw new Error('Ulasan tidak ditemukan atau gagal dihapus');
    return true;
  }
}

module.exports = DeleteReview;
