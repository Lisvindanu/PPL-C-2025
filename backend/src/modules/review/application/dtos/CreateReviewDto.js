class CreateReviewDto {
  constructor({ pesanan_id, layanan_id, pemberi_ulasan_id, penerima_ulasan_id, rating, judul, komentar }) {
    this.pesanan_id = pesanan_id;
    this.layanan_id = layanan_id;
    this.pemberi_ulasan_id = pemberi_ulasan_id;
    this.penerima_ulasan_id = penerima_ulasan_id;
    this.rating = rating;
    this.judul = judul;
    this.komentar = komentar;
  }
}

module.exports = CreateReviewDto;
