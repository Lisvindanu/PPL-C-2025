"use strict";

/**
 * Update Service Use Case (OWNER only)
 * - Owner: user.id === service.freelancer_id
 */

function boom(msg, status = 400) {
  const e = new Error(msg);
  e.status = status;
  return e;
}

function toSlug(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .substring(0, 190);
}

class UpdateService {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  /**
   * @param {string} id
   * @param {object} payload
   * @param {{id?: string, role?: string}} authUser
   */
  async execute(id, payload = {}, authUser = {}) {
    if (!authUser?.id) throw boom("Unauthorized", 401);

    // Ambil data existing
    const current = await this.serviceRepository.findById(id);
    if (!current) throw boom("Service not found", 404);

    // Cek owner
    if (String(current.freelancer_id) !== String(authUser.id)) {
      throw boom("Forbidden", 403);
    }

    const patch = {};

    // Validasi & mapping field yang boleh diupdate
    if (payload.judul != null) {
      const j = String(payload.judul).trim();
      if (j.length < 5 || j.length > 255)
        throw boom("judul minimal 5, maksimal 255");
      patch.judul = j;
      // regenerate slug dari judul
      const base = toSlug(j);
      let finalSlug =
        base || toSlug(current.slug || j) || `service-${id.slice(0, 6)}`;
      // Cek bentrok slug sederhana (pakai repository.search/findById raw)
      if (finalSlug !== current.slug) {
        // coba 5 variasi
        for (let i = 0; i < 5; i++) {
          const found = await this.serviceRepository.search(
            finalSlug,
            {},
            { limit: 5, page: 1 }
          );
          const bentrok = (found?.items || []).some(
            (it) => it.slug === finalSlug && it.id !== id
          );
          if (!bentrok) break;
          finalSlug = `${base}-${i + 1}`;
        }
      }
      patch.slug = finalSlug;
    }

    if (payload.deskripsi != null) {
      const d = String(payload.deskripsi).trim();
      if (d.length < 30) throw boom("deskripsi minimal 30 karakter");
      patch.deskripsi = d;
    }

    if (payload.kategori_id != null) {
      const k = String(payload.kategori_id);
      if (!k) throw boom("kategori_id wajib");
      patch.kategori_id = k;
    }

    if (payload.harga != null) {
      const h = Number(payload.harga);
      if (!Number.isFinite(h) || h <= 0) throw boom("harga harus > 0");
      patch.harga = h;
    }

    if (payload.waktu_pengerjaan != null) {
      const w = Number(payload.waktu_pengerjaan);
      if (!Number.isInteger(w) || w < 1)
        throw boom("waktu_pengerjaan harus ≥ 1 (hari)");
      patch.waktu_pengerjaan = w;
    }

    if (payload.batas_revisi != null) {
      const r = Number(payload.batas_revisi);
      if (!Number.isInteger(r) || r < 0) throw boom("batas_revisi harus ≥ 0");
      patch.batas_revisi = r;
    }

    if (payload.thumbnail !== undefined) {
      patch.thumbnail = payload.thumbnail || null;
    }

    if (payload.gambar !== undefined) {
      const arr = Array.isArray(payload.gambar)
        ? payload.gambar
        : payload.gambar
          ? [payload.gambar]
          : [];
      patch.gambar = arr;
    }

    delete patch.status;

    const updated = await this.serviceRepository.update(id, patch);
    return updated;
  }
}

module.exports = UpdateService;
