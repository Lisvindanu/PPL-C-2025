/**
 * Review Entity
 * Domain model untuk review dan rating
 */

class Review {
  constructor({
    id,
    pesanan_id,
    layanan_id,
    user_id,
    penyedia_id,
    rating,
    komentar,
    foto_review,
    balasan_penyedia,
    is_verified_purchase,
    helpful_count,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.pesanan_id = pesanan_id;
    this.layanan_id = layanan_id;
    this.user_id = user_id; // Reviewer
    this.penyedia_id = penyedia_id; // Service provider
    this.rating = rating; // 1-5 stars
    this.komentar = komentar;
    this.foto_review = foto_review; // Array of image URLs
    this.balasan_penyedia = balasan_penyedia;
    this.is_verified_purchase = is_verified_purchase;
    this.helpful_count = helpful_count;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Business logic
  isPositive() {
    return this.rating >= 4;
  }

  isNeutral() {
    return this.rating === 3;
  }

  isNegative() {
    return this.rating <= 2;
  }

  hasReply() {
    return !!this.balasan_penyedia;
  }

  isVerified() {
    return this.is_verified_purchase;
  }
}

module.exports = Review;
