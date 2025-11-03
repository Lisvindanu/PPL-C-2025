const SequelizeServiceRepository = require('../../infrastructure/repositories/SequelizeServiceRepository');
const GetServiceList = require('../../application/use-cases/GetServiceList');
const GetServiceDetail = require('../../application/use-cases/GetServiceDetail');

class ServiceController {
  constructor() {
    this.serviceRepository = new SequelizeServiceRepository();
    this.getServiceListUseCase = new GetServiceList(this.serviceRepository);
    this.getServiceDetailUseCase = new GetServiceDetail(this.serviceRepository);
  }

  /**
   * GET /api/services
   * Get list of services with filters and pagination
   */
  async listServices(req, res) {
    try {
      const filters = {
        search: req.query.search,
        kategori: req.query.kategori,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
        minRating: req.query.minRating ? parseFloat(req.query.minRating) : undefined,
        status: req.query.status || 'aktif',
        sortBy: req.query.sortBy || 'created_at',
        sortOrder: req.query.sortOrder || 'DESC',
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10
      };

      const result = await this.getServiceListUseCase.execute(filters);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/services/:identifier
   * Get service detail by ID or slug
   */
  async getServiceDetail(req, res) {
    try {
      const { identifier } = req.params;
      const result = await this.getServiceDetailUseCase.execute(identifier);

      if (!result.success) {
        return res.status(result.statusCode || 500).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ServiceController;
