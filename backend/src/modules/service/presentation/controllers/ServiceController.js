"use strict";

/**
 * Service Controller (FINAL)
 * - Bind semua handler
 * - Normalisasi query: map sortOrder -> sortDir
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
    return res.status(code).json({
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
      const basePayload = { ...req.body };

      // File dari multer (serviceMediaUpload)
      const thumbnailFile = req.files?.thumbnail?.[0] || null;
      const gambarFiles = Array.isArray(req.files?.gambar)
        ? req.files.gambar
        : [];

      if (thumbnailFile) {
        // path relatif dari /public
        basePayload.thumbnail = `layanan/${thumbnailFile.filename}`;
      }

      if (gambarFiles.length > 0) {
        basePayload.gambar = gambarFiles.map(
          (file) => `layanan/${file.filename}`
        );
      }

      const result = await this.createServiceUseCase.execute(
        basePayload,
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
        sortDir: this.toSortDir(req.query),
        status: req.query.status,
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
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }

      // Interpretasi parameter status:
      // - "aktif" | "draft" | "nonaktif" => filter spesifik
      // - "all" atau tidak diisi
      const rawStatus = (req.query.status || "").toLowerCase().trim();
      const allow = new Set(["aktif", "draft", "nonaktif"]);
      const filters = { freelancer_id: userId };
      if (allow.has(rawStatus)) {
        filters.status = rawStatus;
      }
      // jika rawStatus 'all' atau kosong -> biarkan tanpa filters.status

      const result = await this.getAllServicesUseCase.serviceRepository.findAll(
        filters,
        {
          page: Number(req.query.page || 1),
          limit: Number(req.query.limit || 6),
          sortBy: req.query.sortBy || "created_at",
          sortOrder: req.query.sortOrder || "DESC",
        }
      );

      return this.ok(res, "My services retrieved successfully", {
        services: result.items || [],
        pagination: result.pagination || {},
      });
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
