/**
 * CreateReview Use Case (Final Version)
 * -------------------------------------
 * Alur:
 * 1. Cek pesanan ada dan sudah selesai
 * 2. Pastikan user adalah pembeli (client)
 * 3. Pastikan belum pernah review
 * 4. Validasi rating
 * 5. Moderasi teks (judul & komentar)
 * 6. Simpan review
 * 7. Update rata-rata rating layanan
 * 8. (Opsional) Kirim notifikasi ke freelancer
 */

const ModerationService = require('../../infrastructure/services/ModerationService');

class CreateReview {
  constructor(reviewRepository, orderRepository, serviceRepository, notificationService = null) {
    this.reviewRepository = reviewRepository;
    this.orderRepository = orderRepository;
    this.serviceRepository = serviceRepository;
    this.notificationService = notificationService;
    this.moderationService = new ModerationService();
  }

  async execute(userId, reviewData) {
    const { pesanan_id, rating, judul, komentar, gambar = [] } = reviewData;

    // --- [1] Validasi pesanan ada ---
    const order = await this.orderRepository.findById(pesanan_id);
    if (!order) throw new Error('Pesanan tidak ditemukan');

    // --- [2] Pastikan status pesanan selesai ---
    if (!['selesai', 'completed'].includes(order.status)) {
      throw new Error('Pesanan belum selesai, tidak bisa memberi ulasan');
    }

    // --- [3] Pastikan user adalah pembeli (client) ---
    if (order.client_id?.toString() !== userId.toString()) {
      throw new Error('Anda bukan pembeli dari pesanan ini');
    }

    // --- [4] Pastikan belum pernah review pesanan ini ---
    const existing = await this.reviewRepository.findByOrderId(pesanan_id);
    if (existing) throw new Error('Pesanan ini sudah pernah diulas');

    // --- [5] Validasi rating ---
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw new Error('Rating harus antara 1 dan 5');
    }

    // --- [6] Moderasi teks ---
    const moderatedTitle = this.moderationService.moderate(judul);
    const moderatedComment = this.moderationService.moderate(komentar);

    // --- [7] Simpan review ---
    const review = await this.reviewRepository.create({
      pesanan_id,
      layanan_id: order.layanan_id,
      pemberi_ulasan_id: userId,
      penerima_ulasan_id: order.freelancer_id,
      rating,
      judul: moderatedTitle,
      komentar: moderatedComment,
      gambar,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // --- [8] Update rating layanan ---
    const { average, count } = await this.reviewRepository.calculateAverageRating(order.layanan_id);
    await this.serviceRepository.updateRating(order.layanan_id, average, count);

    // --- [9] (Opsional) Kirim notifikasi ke freelancer ---
    if (this.notificationService && typeof this.notificationService.sendNewReviewNotification === 'function') {
      await this.notificationService.sendNewReviewNotification(order.freelancer_id, review);
    }

    return review;
  }
}

module.exports = CreateReview;
