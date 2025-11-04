/**
 * Reply To Review Use Case (Seller Only)
 *
 * Penyedia bisa balas review dari customer.
 * Bagus buat customer service dan professional image.
 *
 * Steps:
 * 1. Validasi review exist
 * 2. Validasi yang reply adalah penyedia dari review tersebut
 * 3. Validasi belum pernah reply (satu review cuma bisa dibalas sekali)
 * 4. Update balasan_penyedia
 * 5. Kirim notifikasi ke reviewer
 */

class ReplyToReview {
  constructor(reviewRepository, notificationService = null) {
    this.reviewRepository = reviewRepository;
    this.notificationService = notificationService;
  }

  async execute(reviewId, userId, balasan) {
    // TODO: Validasi review exist
    // const review = await this.reviewRepository.findById(reviewId);
    // if (!review) {
    //   throw new Error('Review not found');
    // }

    // TODO: Validasi ownership - harus penyedia
    // if (review.penyedia_id !== userId) {
    //   throw new Error('Lu bukan penyedia, jangan sok balas review orang');
    // }

    // TODO: Validasi belum pernah reply
    // if (review.balasan_penyedia) {
    //   throw new Error('Udah pernah bales, ga bisa edit balasan');
    // }

    // TODO: Validasi balasan ga kosong
    // if (!balasan || balasan.trim().length < 10) {
    //   throw new Error('Balasan minimal 10 karakter, jangan asal aja');
    // }

    // TODO: Update balasan
    // const updatedReview = await this.reviewRepository.update(reviewId, {
    //   balasan_penyedia: balasan
    // });

    // TODO: Kirim notifikasi ke reviewer
    // if (this.notificationService) {
    //   await this.notificationService.sendReviewReplyNotification(review.user_id, updatedReview);
    // }

    // return updatedReview;

    throw new Error('Not implemented yet - Kerjain, penting buat customer service');
  }
}

module.exports = ReplyToReview;
