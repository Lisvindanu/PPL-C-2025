/**
 * Service Controller
 * HTTP handler untuk service endpoints
 */

class ServiceController {
  constructor(getAllServicesUseCase, getServiceByIdUseCase) {
    this.getAllServicesUseCase = getAllServicesUseCase;
    this.getServiceByIdUseCase = getServiceByIdUseCase;
  }

  /**
   * Create new service
   * POST /api/services
   */
  async createService(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur create service belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Get all services with filters
   * GET /api/services
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
        sortOrder: req.query.sortOrder,
        status: req.query.status
      };

      const result = await this.getAllServicesUseCase.execute(filters);

      return res.status(200).json({
        status: 'success',
        message: 'Services retrieved successfully',
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Search services
   * GET /api/services/search
   */
  async searchServices(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur search service belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Get service by ID
   * GET /api/services/:id
   */
  async getServiceById(req, res) {
    try {
      const serviceId = req.params.id;
      const options = {
        userId: req.user?.id // If authenticated
      };

      const result = await this.getServiceByIdUseCase.execute(serviceId, options);

      return res.status(200).json({
        status: 'success',
        message: 'Service detail retrieved successfully',
        data: result
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return res.status(statusCode).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Get service by slug
   * GET /api/services/slug/:slug
   */
  async getServiceBySlug(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur get service by slug belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Get my services (authenticated user)
   * GET /api/services/my
   */
  async getMyServices(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur my services belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Update service
   * PUT /api/services/:id
   */
  async updateService(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur update service belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Delete service
   * DELETE /api/services/:id
   */
  async deleteService(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur delete service belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Update service status (admin only)
   * PATCH /api/services/:id/status
   */
  async updateServiceStatus(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur update status service belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = ServiceController;
