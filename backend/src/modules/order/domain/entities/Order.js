/**
 * Order Entity
 * Domain model untuk pesanan
 */

class Order {
  constructor({
    id,
    nomor_pesanan,
    client_id,
    freelancer_id,
    layanan_id,
    paket_id,
    judul,
    deskripsi,
    catatan_client,
    harga,
    biaya_platform,
    total_bayar,
    waktu_pengerjaan,
    tenggat_waktu,
    dikirim_pada,
    selesai_pada,
    status,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.nomor_pesanan = nomor_pesanan;
    this.client_id = client_id; // Pembeli
    this.freelancer_id = freelancer_id; // Freelancer/Provider
    this.layanan_id = layanan_id;
    this.paket_id = paket_id;
    this.judul = judul;
    this.deskripsi = deskripsi;
    this.catatan_client = catatan_client;
    this.harga = harga;
    this.biaya_platform = biaya_platform;
    this.total_bayar = total_bayar;
    this.waktu_pengerjaan = waktu_pengerjaan;
    this.tenggat_waktu = tenggat_waktu;
    this.dikirim_pada = dikirim_pada;
    this.selesai_pada = selesai_pada;
    this.status = status; // 'menunggu_pembayaran', 'dibayar', 'dikerjakan', 'menunggu_review', 'revisi', 'selesai', 'dispute', 'dibatalkan', 'refunded'
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Business logic
  isWaitingPayment() {
    return this.status === 'menunggu_pembayaran';
  }

  isPaid() {
    return this.status === 'dibayar';
  }

  isInProgress() {
    return this.status === 'dikerjakan';
  }

  isWaitingReview() {
    return this.status === 'menunggu_review';
  }

  isRevision() {
    return this.status === 'revisi';
  }

  isCompleted() {
    return this.status === 'selesai';
  }

  isDispute() {
    return this.status === 'dispute';
  }

  isCancelled() {
    return this.status === 'dibatalkan';
  }

  isRefunded() {
    return this.status === 'refunded';
  }

  canBeCancelled() {
    return ['menunggu_pembayaran', 'dibayar'].includes(this.status);
  }

  canBeCompleted() {
    return this.status === 'dikerjakan';
  }

  canBeReviewed() {
    return this.status === 'selesai';
  }

  canBeAccepted() {
    return this.status === 'dibayar';
  }
}

module.exports = Order;
