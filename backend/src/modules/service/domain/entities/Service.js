"use strict";

const { v4: uuidv4 } = require("uuid");

function sanitizeString(str, { max = 1000 } = {}) {
  if (typeof str !== "string") return "";
  const s = str.replace(/<[^>]+>/g, "").trim();
  return s.length > max ? s.slice(0, max) : s;
}

function assert(condition, message, status = 400) {
  if (!condition) {
    const err = new Error(message);
    err.status = status;
    throw err;
  }
}

/**
 * Domain Entity: Service (Layanan)
 */
class Service {
  constructor(props = {}) {
    const {
      id = uuidv4(),
      freelancerId,
      kategoriId,
      subKategoriId = null,
      // catatan: user_id alias -> freelancerId (kompatibel kode PM)
      judul,
      slug,
      deskripsi,
      harga,
      waktuPengerjaan, // in days
      batasRevisi,
      isActive = true,
      status = "draft", // 'draft' | 'aktif' | 'nonaktif'
      ratingRataRata = 0,
      jumlahRating = 0,
      totalPesanan = 0,
      jumlahDilihat = 0,
      createdAt = new Date(),
      updatedAt = new Date(),
      // extras (not persisted fields)
      freelancer = null,
      kategori = null,
      gambar = [],
    } = props;

    // VALIDATION (high level)
    assert(freelancerId, "freelancerId wajib", 422);
    assert(kategoriId, "kategoriId wajib", 422);

    const judulClean = sanitizeString(judul, { max: 160 });
    assert(
      judulClean && judulClean.length >= 10,
      "Judul minimal 10 karakter",
      422
    );

    const deskClean = sanitizeString(deskripsi, { max: 4000 });
    assert(
      deskClean && deskClean.length >= 50,
      "Deskripsi minimal 50 karakter",
      422
    );

    assert(
      typeof harga === "number" || typeof harga === "bigint",
      "Harga wajib angka",
      422
    );
    assert(Number(harga) >= 0, "Harga tidak boleh negatif", 422);

    assert(
      Number.isInteger(Number(waktuPengerjaan)) && Number(waktuPengerjaan) > 0,
      "waktuPengerjaan wajib integer > 0 (hari)",
      422
    );
    assert(
      Number.isInteger(Number(batasRevisi)) && Number(batasRevisi) >= 0,
      "batasRevisi wajib integer >= 0",
      422
    );

    const allowedStatus = new Set(["draft", "aktif", "nonaktif"]);
    assert(allowedStatus.has(status), "Status tidak valid", 422);

    // ASSIGN
    this.id = id;
    this.freelancerId = freelancerId;
    this.kategoriId = kategoriId;
    this.subKategoriId = subKategoriId;
    this.judul = judulClean;
    this.slug = sanitizeString(slug || "", { max: 200 }).toLowerCase();
    this.deskripsi = deskClean;
    this.harga = Number(harga);
    this.waktuPengerjaan = Number(waktuPengerjaan);
    this.batasRevisi = Number(batasRevisi);
    this.isActive = Boolean(isActive);
    this.status = status;
    this.ratingRataRata = Number(ratingRataRata) || 0;
    this.jumlahRating = Number(jumlahRating) || 0;
    this.totalPesanan = Number(totalPesanan) || 0;
    this.jumlahDilihat = Number(jumlahDilihat) || 0;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    // Expanded (read-only view helpers)
    this.freelancer = freelancer;
    this.kategori = kategori;
    this.gambar = Array.isArray(gambar) ? gambar : [];
  }

  // BUSINESS LOGIC
  isActivePublic() {
    return this.isActive === true && this.status === "aktif";
  }

  canBeOrdered() {
    return this.isActivePublic() && this.harga > 0;
  }

  changeStatus(nextStatus) {
    const allowed = new Set(["draft", "aktif", "nonaktif"]);
    assert(allowed.has(nextStatus), "Status tidak valid", 422);
    this.status = nextStatus;
    this.updatedAt = new Date();
  }

  deactivate() {
    this.isActive = false;
    if (this.status === "aktif") this.status = "nonaktif";
    this.updatedAt = new Date();
  }

  updateRating(newRating) {
    const r = Number(newRating);
    assert(r >= 0 && r <= 5, "Rating harus 0..5", 422);
    const total = this.ratingRataRata * this.jumlahRating + r;
    const cnt = this.jumlahRating + 1;
    this.ratingRataRata = Number((total / cnt).toFixed(2));
    this.jumlahRating = cnt;
    this.updatedAt = new Date();
  }

  incrementOrderCount() {
    this.totalPesanan += 1;
    this.updatedAt = new Date();
  }

  static fromPersistence(row = {}) {
    return new Service({
      id: row.id,
      freelancerId: row.freelancer_id || row.freelancerId || row.user_id,
      kategoriId: row.kategori_id || row.kategoriId,
      subKategoriId: row.sub_kategori_id || row.subKategoriId,
      judul: row.judul,
      slug: row.slug,
      deskripsi: row.deskripsi,
      harga: Number(row.harga),
      waktuPengerjaan: row.waktu_pengerjaan || row.waktuPengerjaan,
      batasRevisi: row.batas_revisi || row.batasRevisi,
      isActive: row.is_active,
      status: row.status,
      ratingRataRata: row.rating_rata_rata || row.ratingRataRata,
      jumlahRating: row.jumlah_rating || row.jumlahRating,
      totalPesanan: row.total_pesanan || row.totalPesanan,
      jumlahDilihat: row.jumlah_dilihat || row.jumlahDilihat,
      createdAt: row.created_at || row.createdAt,
      updatedAt: row.updated_at || row.updatedAt,
      freelancer: row.freelancer || null,
      kategori: row.kategori || null,
      gambar: row.gambar || row.foto_layanan || [],
    });
  }

  toPersistence() {
    return {
      id: this.id,
      freelancer_id: this.freelancerId,
      kategori_id: this.kategoriId,
      sub_kategori_id: this.subKategoriId,
      judul: this.judul,
      slug: this.slug,
      deskripsi: this.deskripsi,
      harga: this.harga,
      waktu_pengerjaan: this.waktuPengerjaan,
      batas_revisi: this.batasRevisi,
      is_active: this.isActive,
      status: this.status,
      rating_rata_rata: this.ratingRataRata,
      jumlah_rating: this.jumlahRating,
      total_pesanan: this.totalPesanan,
      jumlah_dilihat: this.jumlahDilihat,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  // =========
  // ALIASES untuk kompatibilitas kode PM (formatter & guards)
  // =========
  get created_at() {
    return this.createdAt;
  }
  get updated_at() {
    return this.updatedAt;
  }
  get harga_minimum() {
    return this.harga;
  }
  get jumlah_review() {
    return this.jumlahRating;
  }
  get user_id() {
    return this.freelancerId;
  }
  isActive() {
    return this.isActivePublic();
  }
  get thumbnail() {
    if (Array.isArray(this.gambar)) {
      const th = this.gambar.find((g) => g.is_thumbnail) || this.gambar[0];
      return th ? th.url || null : null;
    }
    return null;
  }
  get foto_layanan() {
    if (!Array.isArray(this.gambar)) return [];
    return this.gambar.map((g) => g.url).filter(Boolean);
  }
}

module.exports = Service;
