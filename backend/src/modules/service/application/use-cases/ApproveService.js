"use strict";

/**
 * Update/Approve Service Status Use Case (FINAL)
 * - Hanya admin (sudah difilter adminMiddleware), tapi kita tetap cek defensif.
 * - action: "approve"  => status = 'aktif'
 *          "deactivate" => status = 'nonaktif'
 * - Kembalikan row terbaru setelah update.
 */
function boom(msg, status = 400) {
  const e = new Error(msg);
  e.status = status;
  return e;
}

class ApproveServiceUseCase {
  /**
   * @param {object} deps
   * @param {import('../../infrastructure/repositories/SequelizeServiceRepository')} deps.serviceRepository
   */
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;

    // fallback bila enum DB berbeda dapat dioverride via ENV
    this.STATUS_ACTIVE = process.env.SERVICE_STATUS_ACTIVE || "aktif";
    this.STATUS_INACTIVE = process.env.SERVICE_STATUS_INACTIVE || "nonaktif";
  }

  async execute(serviceId, payload = {}, authUser = {}) {
    if (
      !authUser ||
      (authUser.role !== "admin" && authUser.is_admin !== true)
    ) {
      // harusnya sudah ketahan di adminMiddleware, tapi tetap defensif
      throw boom("Forbidden", 403);
    }
    if (!serviceId) throw boom("Service id is required", 400);

    const svc = await this.serviceRepository.findById(serviceId);
    if (!svc) throw boom("Service not found", 404);

    const action = String(payload.action || "").toLowerCase();

    let updated;
    if (action === "approve") {
      // Set ke enum valid DB
      updated = await this.serviceRepository.setStatus(
        serviceId,
        this.STATUS_ACTIVE
      );
    } else if (action === "deactivate") {
      updated = await this.serviceRepository.setStatus(
        serviceId,
        this.STATUS_INACTIVE
      );
    } else {
      throw boom("Invalid action. Use 'approve' or 'deactivate'.", 400);
    }

    return updated;
  }
}

module.exports = ApproveServiceUseCase;
