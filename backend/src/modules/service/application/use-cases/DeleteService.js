"use strict";

/**
 * Delete (soft delete) Service Use Case
 * - hanya freelancer pemilik yang boleh menghapus
 * - admin juga boleh (override)
 * - mengubah status => 'nonaktif'
 */
function boom(msg, status = 400) {
  const e = new Error(msg);
  e.status = status;
  return e;
}

class DeleteService {
  /**
   * @param {import('../../infrastructure/repositories/SequelizeServiceRepository')} serviceRepository
   */
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  /**
   * @param {string} serviceId
   * @param {object} authUser
   */
  async execute(serviceId, authUser = {}) {
    if (!authUser || !authUser.id) {
      throw boom("Unauthorized", 401);
    }

    // Toleransi variasi field role dari token
    const role =
      authUser.role ||
      authUser.userRole ||
      (Array.isArray(authUser.roles) ? authUser.roles[0] : undefined);

    // Ambil service
    const service = await this.serviceRepository.findById(serviceId);
    if (!service) {
      throw boom("Service not found", 404);
    }

    // Owner check (freelancer) — kecuali admin
    const isOwner = String(service.freelancer_id) === String(authUser.id);
    const isAdmin = String(role).toLowerCase() === "admin";

    if (!isOwner && !isAdmin) {
      throw boom("Forbidden", 403);
    }

    // Kalau sudah nonaktif, kembalikan info yang konsisten
    if (service.status === "nonaktif") {
      return { id: service.id, deleted: true, status: "nonaktif" };
    }

    // Soft delete -> set status nonaktif
    await this.serviceRepository.softDelete(serviceId);

    return { id: service.id, deleted: true, status: "nonaktif" };
  }
}

module.exports = DeleteService;
