"use strict";

/**
 * Get Service By ID (FINAL)
 * - Ambil detail service by ID
 * - Hanya expose status 'aktif' untuk endpoint publik
 * - Kompatibel dengan repository yang mengembalikan plain object (bukan Entity)
 */
class GetServiceById {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  /**
   * @param {string} id
   * @param {object} [options]
   * @returns {Promise<object>}
   */
  async execute(id, _options = {}) {
    if (!id || typeof id !== "string") {
      const e = new Error("Invalid service id");
      e.status = 400;
      throw e;
    }

    // Ambil dari repo (plain object)
    const svc = await this.serviceRepository.findById(id);
    if (!svc) {
      const e = new Error("Service not found");
      e.status = 404;
      throw e;
    }

    // Endpoint publik: hanya tampilkan yang 'aktif'
    if ((svc.status || "").toLowerCase() !== "aktif") {
      const e = new Error("Service not found");
      e.status = 404;
      throw e;
    }

    // (Opsional) increment views? Repository kita belum expose method itu, skip dulu.
    // await this.serviceRepository.incrementViews?.(id).catch(() => {});

    return svc;
  }
}

module.exports = GetServiceById;
