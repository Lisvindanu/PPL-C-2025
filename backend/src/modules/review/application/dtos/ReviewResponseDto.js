class ReviewResponseDto {
  constructor(review) {
    this.id = review.id;
    this.pesanan_id = review.pesanan_id;
    this.layanan_id = review.layanan_id;
    this.pemberi_ulasan_id = review.pemberi_ulasan_id;
    this.penerima_ulasan_id = review.penerima_ulasan_id;
    this.rating = review.rating;
    this.judul = review.judul;
    this.komentar = review.komentar;
    this.created_at = review.created_at;
    this.updated_at = review.updated_at;
  }
}

module.exports = ReviewResponseDto;
