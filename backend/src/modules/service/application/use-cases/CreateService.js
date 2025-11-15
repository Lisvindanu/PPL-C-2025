"use strict";

const slugify = require("slugify");

function boom(msg, status = 400) {
  const e = new Error(msg);
  e.statusCode = status;
  return e;
}

/**
 * CreateService
 * - Validasi auth (role freelancer diverifikasi via repo)
 * - Validasi kategori
 * - Buat slug unik
 * - Persist pakai repository (schema DB snake_case)
 */
class CreateService {
  /**
   * @param {{ existsFreelancer:Function, existsKategori:Function, findBySlug:Function, create:Function }} serviceRepository
   */
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  /**
   * @param {Object} payload
   * @param {Object} authUser - dari authMiddleware, minimal { id, role }
   */
  async execute(payload = {}, authUser = {}) {
    const userId = authUser?.id;
    if (!userId) throw boom("Unauthorized", 401);

    // Guard relasi
    const isFreelancer = await this.serviceRepository.existsFreelancer(userId);
    if (!isFreelancer) throw boom("Freelancer tidak valid/aktif", 422);

    const kategoriId = payload.kategori_id || payload.kategoriId;
    const kategoriOk = await this.serviceRepository.existsKategori(kategoriId);
    if (!kategoriOk) throw boom("Kategori tidak ditemukan", 422);

    // Slug unik
    const base =
      slugify(String(payload.judul || ""), { lower: true, strict: true }) ||
      "service";
    let finalSlug = base;
    // cek dan increment jika sudah ada
    for (let i = 0; i < 5; i++) {
      const existed = await this.serviceRepository.findBySlug(finalSlug);
      if (!existed) break;
      finalSlug = `${base}-${i + 1}`;
    }

    // DTO sesuai schema DB (snake_case)
    const dto = {
      kategori_id: kategoriId,
      judul: payload.judul,
      slug: finalSlug,
      deskripsi: payload.deskripsi,
      harga: payload.harga, // string DECIMAL ok; biarkan ke DB
      waktu_pengerjaan:
        payload.waktu_pengerjaan != null
          ? Number(payload.waktu_pengerjaan)
          : Number(payload.waktuPengerjaan),
      batas_revisi:
        payload.batas_revisi != null
          ? Number(payload.batas_revisi)
          : Number(payload.batasRevisi ?? 1),
      thumbnail: payload.thumbnail ?? null,
      gambar: Array.isArray(payload.gambar) ? payload.gambar : [],
      status: "draft",
    };

    // Persist
    const created = await this.serviceRepository.create(userId, dto);
    return created;
  }
}

module.exports = CreateService;
