const SequelizeOrderRepository = require('../../infrastructure/repositories/SequelizeOrderRepository');
const SequelizeServiceRepository = require('../../../service/infrastructure/repositories/SequelizeServiceRepository');
const CreateOrder = require('../../application/use-cases/CreateOrder');

class OrderController {
  constructor() {
    this.orderRepository = new SequelizeOrderRepository();
    this.serviceRepository = new SequelizeServiceRepository();
    this.createOrderUseCase = new CreateOrder(this.orderRepository, this.serviceRepository);
  }

  /**
   * POST /api/orders
   * Create new order
   */
  async createOrder(req, res) {
    try {
      // Get user ID from auth middleware
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const result = await this.createOrderUseCase.execute(req.body, userId);

      if (!result.success) {
        return res.status(result.statusCode || 500).json({
          success: false,
          message: result.error
        });
      }

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/orders/:id
   * Get order detail
   */
  async getOrderDetail(req, res) {
    try {
      const { id } = req.params;
      const order = await this.orderRepository.findById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/orders
   * Get user orders
   */
  async getUserOrders(req, res) {
    try {
      const userId = req.user?.id;
      const role = req.query.role || 'client'; // client or freelancer

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const orders = await this.orderRepository.findByUserId(userId, role);

      return res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = OrderController;
