"use strict";

/**
 * Use case: Search Services (public)
 *
 * Dipakai untuk endpoint:
 *   GET /api/services/search
 *
 * Tanggung jawab:
 * - Normalisasi query dari controller
 * - Menerjemahkan filter & sorting ke repository
 * - Mengembalikan shape yang enak dipakai frontend:
 *   { services: [...], pagination: {...} }
 */
class SearchServices {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(filters = {}) {
    // ==========================
    // 1) Paging
    // ==========================
    const page = Math.max(1, parseInt(filters.page, 10) || 1);
    // Default 12 item per halaman biar nyambung sama UI search page
    const limit = Math.min(100, parseInt(filters.limit, 10) || 12);

    // ==========================
    // 2) Sorting
    // ==========================
    // sortBy yang valid disesuaikan dengan this.SORTABLE di repo:
    // [created_at, harga, rating_rata_rata, total_pesanan, updated_at]
    const sortBy = filters.sortBy || "created_at";

    const rawSortOrder =
      (filters.sortOrder || filters.sortDir || "DESC").toString().toUpperCase();
    const sortOrder = rawSortOrder === "ASC" ? "ASC" : "DESC";

    // ==========================
    // 3) Status (default: aktif)
    // ==========================
    const status = (filters.status || "aktif").toLowerCase();

    // ==========================
    // 4) Range harga (number)
    // ==========================
    const hargaMinRaw =
      filters.harga_min !== undefined && filters.harga_min !== ""
        ? Number(filters.harga_min)
        : null;

    const hargaMaxRaw =
      filters.harga_max !== undefined && filters.harga_max !== ""
        ? Number(filters.harga_max)
        : null;

    const harga_min = Number.isFinite(hargaMinRaw) ? hargaMinRaw : undefined;
    const harga_max = Number.isFinite(hargaMaxRaw) ? hargaMaxRaw : undefined;

    // ==========================
    // 5) Rating minimum
    //    (UI kirim angka threshold, mis: 4.8 / 4.5 / 4.0)
    // ==========================
    const ratingMinRaw =
      filters.rating_min !== undefined && filters.rating_min !== ""
        ? Number(filters.rating_min)
        : null;

    const rating_min = Number.isFinite(ratingMinRaw)
      ? ratingMinRaw
      : undefined;

    // ==========================
    // 6) Keyword (q)
    // ==========================
    const q = (filters.q || "").toString().trim();

    // ==========================
    // 7) Build filters & options
    // ==========================
    const repoFilters = {
      // filter kategori (dropdown di UI sidebar)
      kategori_id: filters.kategori_id,
      // filter status (default aktif)
      status,
      // filter harga (range)
      harga_min,
      harga_max,
      // filter rating min (opsional)
      rating_min,
    };

    const repoOptions = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    // ==========================
    // 8) Call repository
    // ==========================
    const result = await this.serviceRepository.search(
      q,
      repoFilters,
      repoOptions
    );

    // repository.search() sudah mengembalikan:
    // { items: [...], pagination: {...} }
    const services = result.items || [];
    const pagination = result.pagination || {
      page,
      limit,
      total: 0,
      totalPages: 1,
    };

    // ==========================
    // 9) Shape final buat controller
    // ==========================
    return {
      services,
      pagination,
    };
  }
}

module.exports = SearchServices;
