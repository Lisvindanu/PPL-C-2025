/**
 * Create Review Use Case
 *
 * User bisa review setelah order completed.
 * Satu order cuma bisa di-review sekali, jangan sampe spam review.
 *
 * Steps:
 * 1. Validasi order exist dan completed
 * 2. Validasi user adalah buyer dari order ini
 * 3. Validasi belum pernah review (cek tabel review)
 * 4. Validasi rating 1-5 bintang
 * 5. Create review
 * 6. Update average rating di tabel layanan
 * 7. Kirim notifikasi ke penyedia
 */

class CreateReview {
  constructor(reviewRepository, orderRepository, serviceRepository, notificationService = null) {
    this.reviewRepository = reviewRepository;
    this.orderRepository = orderRepository;
    this.serviceRepository = serviceRepository;
    this.notificationService = notificationService;
  }

  async execute(userId, reviewData) {
    // reviewData: { pesanan_id, rating, komentar, foto_review }

    // TODO: Validasi order exist dan completed
    // const order = await this.orderRepository.findById(reviewData.pesanan_id);
    // if (!order) {
    //   throw new Error('Order not found');
    // }
    // if (!order.isCompleted()) {
    //   throw new Error('Order belum completed, sabar napa');
    // }

    // TODO: Validasi ownership
    // if (order.user_id !== userId) {
    //   throw new Error('Lu bukan buyer order ini, jangan asal review');
    // }

    // TODO: Validasi belum pernah review
    // const existingReview = await this.reviewRepository.findByOrderId(reviewData.pesanan_id);
    // if (existingReview) {
    //   throw new Error('Lu udah review order ini, jangan spam');
    // }

    // TODO: Validasi rating
    // if (reviewData.rating < 1 || reviewData.rating > 5) {
    //   throw new Error('Rating harus antara 1-5 bintang, belajar matematika dulu sana');
    // }

    // TODO: Create review
    // const review = await this.reviewRepository.create({
    //   pesanan_id: reviewData.pesanan_id,
    //   layanan_id: order.layanan_id,
    //   user_id: userId,
    //   penyedia_id: order.penyedia_id,
    //   rating: reviewData.rating,
    //   komentar: reviewData.komentar,
    //   foto_review: reviewData.foto_review || [],
    //   is_verified_purchase: true, // Karena dari order yang bener
    //   helpful_count: 0
    // });

    // TODO: Update average rating di service
    // const { newAverage, reviewCount } = await this.reviewRepository.calculateAverageRating(order.layanan_id);
    // await this.serviceRepository.updateRating(order.layanan_id, newAverage, reviewCount);

    // TODO: Update order - tandai sudah di-review
    // await this.orderRepository.update(reviewData.pesanan_id, {
    //   rating: reviewData.rating,
    //   review: reviewData.komentar
    // });

    // TODO: Kirim notifikasi ke penyedia
    // if (this.notificationService) {
    //   await this.notificationService.sendNewReviewNotification(order.penyedia_id, review);
    // }

    // return review;

    throw new Error('Not implemented yet - Kerjain, sistem review penting buat marketplace');
  }
}

module.exports = CreateReview;
