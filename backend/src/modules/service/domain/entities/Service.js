/**
 * Service Entity
 * Domain model untuk layanan/jasa
 */

class Service {
  constructor({
    id,
    user_id,
    kategori_id,
    sub_kategori_id,
    judul,
    slug,
    deskripsi,
    harga_minimum,
    harga_maksimum,
    durasi_estimasi,
    satuan_durasi,
    lokasi,
    area_layanan,
    foto_layanan,
    status,
    alasan_ditolak,
    rating_rata_rata,
    jumlah_review,
    total_pesanan,
    is_active,
    created_at,
    updated_at,
    // Relations
    freelancer,
    kategori,
    thumbnail,
    waktu_pengerjaan,
    batas_revisi,
    jumlah_dilihat
  }) {
    this.id = id;
    this.user_id = user_id;
    this.kategori_id = kategori_id;
    this.sub_kategori_id = sub_kategori_id;
    this.judul = judul;
    this.slug = slug;
    this.deskripsi = deskripsi;
    this.harga_minimum = harga_minimum;
    this.harga_maksimum = harga_maksimum;
    this.durasi_estimasi = durasi_estimasi;
    this.satuan_durasi = satuan_durasi; // 'jam', 'hari', 'minggu'
    this.lokasi = lokasi;
    this.area_layanan = area_layanan; // Array of areas
    this.foto_layanan = foto_layanan; // Array of image URLs
    this.status = status; // 'draft', 'pending', 'active', 'rejected', 'inactive'
    this.alasan_ditolak = alasan_ditolak;
    this.rating_rata_rata = rating_rata_rata;
    this.jumlah_review = jumlah_review;
    this.total_pesanan = total_pesanan;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
    // Relations
    this.freelancer = freelancer;
    this.kategori = kategori;
    this.thumbnail = thumbnail;
    this.waktu_pengerjaan = waktu_pengerjaan;
    this.batas_revisi = batas_revisi;
    this.jumlah_dilihat = jumlah_dilihat;
  }

  // Business logic methods
  isDraft() {
    return this.status === 'draft';
  }

  isPending() {
    return this.status === 'pending';
  }

  isActive() {
    return this.status === 'active' && this.is_active;
  }

  canBeOrdered() {
    return this.isActive();
  }

  getRatingStars() {
    return Math.round(this.rating_rata_rata * 2) / 2; // Round to nearest 0.5
  }
}

module.exports = Service;
