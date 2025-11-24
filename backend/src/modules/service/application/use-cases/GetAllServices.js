"use strict";

/**
 * Get All Services Use Case (FINAL)
 * - Default publik: status 'aktif'
 * - Normalisasi angka & sorting
 * - Kompatibel dengan repository.findAll() yang mengembalikan:
 *   { items: any[], pagination: { page, limit, total, totalPages } }
 * - Tidak memaksa format entity baru (biar 1:1 dengan DB schema dari repo)
 */
class GetAllServices {
  /**
   * @param {Object} serviceRepository - instance repository
   *  Wajib punya method: findAll(filters, options)
   */
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  /**
   * @param {Object} filtersIn
   * @param {Object} paginationIn
   * @returns {Promise<{items: any[], pagination: {page:number,limit:number,total:number,totalPages:number}}>}
   */
  async execute(filtersIn = {}, paginationIn = {}) {
    try {
      // --- Normalisasi filter
      const filters = { ...filtersIn };

      // Publik: default hanya status aktif
      if (!filters.status) filters.status = "aktif";

      // angka aman untuk harga_min / harga_max
      if (filters.harga_min != null) {
        const v = Number(filters.harga_min);
        if (!Number.isFinite(v) || v < 0) throw new Error("harga_min invalid");
        filters.harga_min = v;
      }
      if (filters.harga_max != null) {
        const v = Number(filters.harga_max);
        if (!Number.isFinite(v) || v < 0) throw new Error("harga_max invalid");
        filters.harga_max = v;
      }
      if (
        filters.harga_min != null &&
        filters.harga_max != null &&
        Number(filters.harga_min) > Number(filters.harga_max)
      ) {
        throw new Error("Minimum price cannot be greater than maximum price");
      }

      // --- Normalisasi options (paging, sorting)
      const allowedSort = new Set([
        "created_at",
        "harga",
        "rating_rata_rata",
        "total_pesanan",
      ]);

      // Terima page/limit dari filters (swagger kirim via query) atau paginationIn
      const pageIn = Number(filters.page ?? paginationIn.page);
      const limitIn = Number(filters.limit ?? paginationIn.limit);

      const options = {
        page: Number.isFinite(pageIn) && pageIn >= 1 ? pageIn : 1,
        limit:
          Number.isFinite(limitIn) && limitIn >= 1 && limitIn <= 100
            ? limitIn
            : 10,
        sortBy: allowedSort.has(filters.sortBy) ? filters.sortBy : "created_at",
        // Repo kita pakai sortDir (bukan sortOrder)
        sortDir:
          String(
            filters.sortDir || filters.sortOrder || "desc"
          ).toLowerCase() === "asc"
            ? "asc"
            : "desc",
      };

      // --- Ambil data dari repository
      const res = await this.serviceRepository.findAll(filters, options);

      // Bentuk standar dari repo: { items, pagination }
      if (res && Array.isArray(res.items)) {
        const pg = res.pagination || {
          page: options.page,
          limit: options.limit,
          total: res.items.length,
          totalPages: 1,
        };
        return { items: res.items, pagination: pg };
      }

      // Kalau implementasi repo lain sempat balikin array langsung, bungkus agar konsisten
      if (Array.isArray(res)) {
        return {
          items: res,
          pagination: {
            page: options.page,
            limit: options.limit,
            total: res.length,
            totalPages: Math.ceil(res.length / options.limit) || 1,
          },
        };
      }

      // Fallback aman
      return {
        items: [],
        pagination: {
          page: options.page,
          limit: options.limit,
          total: 0,
          totalPages: 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get services: ${error.message}`);
    }
  }
}

module.exports = GetAllServices;
