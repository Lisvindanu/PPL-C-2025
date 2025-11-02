/**
 * Order Entity
 * Domain model untuk pesanan
 */

class Order {
  constructor({
    id,
    nomor_pesanan,
    user_id,
    layanan_id,
    penyedia_id,
    judul_pesanan,
    deskripsi_pesanan,
    harga_disepakati,
    tanggal_mulai,
    tanggal_selesai,
    durasi_estimasi,
    lokasi_pengerjaan,
    catatan_pembeli,
    status,
    alasan_pembatalan,
    dibatalkan_oleh,
    rating,
    review,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.nomor_pesanan = nomor_pesanan;
    this.user_id = user_id; // Pembeli
    this.layanan_id = layanan_id;
    this.penyedia_id = penyedia_id; // Penjual/Provider
    this.judul_pesanan = judul_pesanan;
    this.deskripsi_pesanan = deskripsi_pesanan;
    this.harga_disepakati = harga_disepakati;
    this.tanggal_mulai = tanggal_mulai;
    this.tanggal_selesai = tanggal_selesai;
    this.durasi_estimasi = durasi_estimasi;
    this.lokasi_pengerjaan = lokasi_pengerjaan;
    this.catatan_pembeli = catatan_pembeli;
    this.status = status; // 'pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed'
    this.alasan_pembatalan = alasan_pembatalan;
    this.dibatalkan_oleh = dibatalkan_oleh; // 'buyer', 'seller', 'admin'
    this.rating = rating;
    this.review = review;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Business logic
  isPending() {
    return this.status === 'pending';
  }

  isAccepted() {
    return this.status === 'accepted';
  }

  isInProgress() {
    return this.status === 'in_progress';
  }

  isCompleted() {
    return this.status === 'completed';
  }

  isCancelled() {
    return this.status === 'cancelled';
  }

  canBeCancelled() {
    return ['pending', 'accepted'].includes(this.status);
  }

  canBeCompleted() {
    return this.status === 'in_progress';
  }

  canBeReviewed() {
    return this.status === 'completed' && !this.rating;
  }
}

module.exports = Order;
