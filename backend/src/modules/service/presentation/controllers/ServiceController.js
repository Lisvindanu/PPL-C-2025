"use strict";

/**
 * Service Controller (FINAL)
 * - Bind semua handler supaya aman dipakai langsung di router
 * - Normalisasi query: map sortOrder -> sortDir (kompatibel dengan repo)
 * - Konsisten response { status, message, data }
 */
class ServiceController {
  constructor(
    getAllServicesUseCase,
    getServiceByIdUseCase,
    createServiceUseCase,
    updateServiceUseCase,
    deleteServiceUseCase,
    searchServicesUseCase,
    approveServiceUseCase
  ) {
    this.getAllServicesUseCase = getAllServicesUseCase;
    this.getServiceByIdUseCase = getServiceByIdUseCase;
    this.createServiceUseCase = createServiceUseCase;
    this.updateServiceUseCase = updateServiceUseCase;
    this.deleteServiceUseCase = deleteServiceUseCase;
    this.searchServicesUseCase = searchServicesUseCase;
    this.approveServiceUseCase = approveServiceUseCase;

    // bind semua method agar "this" tetap ke instance controller
    this.createService = this.createService.bind(this);
    this.getAllServices = this.getAllServices.bind(this);
    this.searchServices = this.searchServices.bind(this);
    this.getServiceById = this.getServiceById.bind(this);
    this.getMyServices = this.getMyServices.bind(this);
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
    this.updateServiceStatus = this.updateServiceStatus.bind(this);
  }

  // ---------- helpers ----------
  ok(res, message, data, code = 200) {
    return res.status(code).json({ status: "success", message, data });
  }
  err(res, error, fallback = 500) {
    const code = error.status || error.statusCode || fallback;
    return res
      .status(code)
      .json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
  }
  getUserId(req) {
    const u = req.user || {};
    return u.id || u.userId || u.user_id || null;
  }
  toSortDir(q) {
    const raw = (q.sortDir || q.sortOrder || "").toString().toLowerCase();
    return raw === "asc" ? "asc" : "desc";
  }

  // ---------- handlers ----------
  /**
   * POST /api/services
   * Create service (freelancer, status draft)
   */
  async createService(req, res) {
    try {
      const result = await this.createServiceUseCase.execute(
        req.body,
        req.user || {}
      );
      return this.ok(res, "Service created successfully", result, 201);
    } catch (error) {
      return this.err(res, error);
    }
  }

  /**
   * GET /api/services
   * List services (public, default hanya status aktif)
   */
  async getAllServices(req, res) {
    try {
      const filters = {
        kategori_id: req.query.kategori_id,
        harga_min: req.query.harga_min,
        harga_max: req.query.harga_max,
        rating_min: req.query.rating_min,
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        // map sortOrder -> sortDir agar kompatibel dengan repo
        sortDir: this.toSortDir(req.query),
        status: req.query.status, // biarkan kosong => default 'aktif' di use-case
      };

      const result = await this.getAllServicesUseCase.execute(filters);
      return this.ok(res, "Services retrieved successfully", result);
    } catch (error) {
      return this.err(res, error, 400);
    }
  }

  /**
   * GET /api/services/search
   * Search services (public)
   */
  async searchServices(req, res) {
    try {
      // use-case SearchServices kita sudah meng-handle query req.query apa adanya
      const result = await this.searchServicesUseCase.execute(req.query || {});
      return this.ok(res, "Services search retrieved successfully", result);
    } catch (error) {
      return this.err(res, error);
    }
  }

  /**
   * GET /api/services/:id
   * Get service detail by id (public, hanya aktif)
   */
  async getServiceById(req, res) {
    try {
      const serviceId = req.params.id;
      const options = { userId: this.getUserId(req) };
      const result = await this.getServiceByIdUseCase.execute(
        serviceId,
        options
      );
      return this.ok(res, "Service detail retrieved successfully", result);
    } catch (error) {
      const statusCode = error.message?.includes("not found")
        ? 404
        : error.status || 400;
      return res
        .status(statusCode)
        .json({ status: "error", message: error.message });
    }
  }

  /**
   * GET /api/services/my
   * List my services (freelancer, semua status)
   */
  async getMyServices(req, res) {
    try {
      const userId = this.getUserId(req);
      if (!userId)
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });

      // gunakan repo yang sama untuk konsistensi; filter owner via freelancer_id
      const result = await this.getAllServicesUseCase.serviceRepository.findAll(
        {
          status: req.query.status || "aktif", // default aktif
          freelancer_id: userId,
        },
        {
          page: Number(req.query.page || 1),
          limit: Number(req.query.limit || 50),
          sortBy: req.query.sortBy || "updated_at",
          sortDir: this.toSortDir(req.query) || "desc",
        }
      );

      return this.ok(res, "My services retrieved successfully", result);
    } catch (error) {
      return this.err(res, error);
    }
  }

  /**
   * PUT /api/services/:id
   * Update service (freelancer owner)
   */
  async updateService(req, res) {
    try {
      const result = await this.updateServiceUseCase.execute(
        req.params.id,
        req.body,
        req.user || {}
      );
      return this.ok(res, "Service updated successfully", result);
    } catch (error) {
      return this.err(res, error);
    }
  }

  /**
   * DELETE /api/services/:id
   * Delete service (set nonaktif, freelancer owner)
   */
  async deleteService(req, res) {
    try {
      const result = await this.deleteServiceUseCase.execute(
        req.params.id,
        req.user || {}
      );
      return this.ok(res, "Service deleted successfully", result);
    } catch (error) {
      return this.err(res, error);
    }
  }

  /**
   * PATCH /api/services/:id/status
   * Update service status (admin) → approve / deactivate
   */
  async updateServiceStatus(req, res) {
    try {
      const data = await this.approveServiceUseCase.execute(
        req.params.id,
        req.body || {},
        req.user || {}
      );
      return this.ok(res, "Service status updated", data);
    } catch (error) {
      return this.err(res, error);
    }
  }
}

module.exports = ServiceController;
