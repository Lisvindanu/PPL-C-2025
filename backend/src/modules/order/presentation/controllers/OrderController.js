/**
 * Order Controller
 * HTTP handler untuk order endpoints
 */

class OrderController {
  constructor({ getIncomingOrdersUseCase }) {
    this.getIncomingOrdersUseCase = getIncomingOrdersUseCase;
  }

  /**
   * Create new order
   * POST /api/orders
   */
  async createOrder(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur create order belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Get all my orders (as buyer)
   * GET /api/orders/my
   */
  async getMyOrders(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur my orders belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Get all orders for my services (as seller)
   * GET /api/orders/incoming
   */
  async getIncomingOrders(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (user.role !== 'freelancer') {
        return res.status(403).json({ success: false, message: 'Hanya freelancer yang dapat melihat pesanan masuk' });
      }

      const result = await this.getIncomingOrdersUseCase.execute(user.userId, {
        page: req.query.page,
        limit: req.query.limit,
        status: req.query.status,
        q: req.query.q,
        created_from: req.query.created_from,
        created_to: req.query.created_to,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
      });

      return res.json({
        success: true,
        message: 'Pesanan masuk berhasil diambil',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get order by ID
   * GET /api/orders/:id
   */
  async getOrderById(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur order detail belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Accept order (seller)
   * PATCH /api/orders/:id/accept
   */
  async acceptOrder(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur accept order belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Start order (seller)
   * PATCH /api/orders/:id/start
   */
  async startOrder(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur start order belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Complete order (seller)
   * PATCH /api/orders/:id/complete
   */
  async completeOrder(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur complete order belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Cancel order
   * PATCH /api/orders/:id/cancel
   */
  async cancelOrder(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur cancel order belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = OrderController;
