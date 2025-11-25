/**
 * Order Controller
 * HTTP handler untuk order endpoints
 */

class OrderController {
  constructor({
    createOrderUseCase,
    getMyOrdersUseCase,
    getIncomingOrdersUseCase,
    getOrderByIdUseCase,
    acceptOrderUseCase,
    startOrderUseCase,
    completeOrderUseCase,
    cancelOrderUseCase
  }) {
    this.createOrderUseCase = createOrderUseCase;
    this.getMyOrdersUseCase = getMyOrdersUseCase;
    this.getIncomingOrdersUseCase = getIncomingOrdersUseCase;
    this.getOrderByIdUseCase = getOrderByIdUseCase;
    this.acceptOrderUseCase = acceptOrderUseCase;
    this.startOrderUseCase = startOrderUseCase;
    this.completeOrderUseCase = completeOrderUseCase;
    this.cancelOrderUseCase = cancelOrderUseCase;
  }

  /**
   * Create new order
   * POST /api/orders
   */
  async createOrder(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { layanan_id, paket_id, catatan_client } = req.body;

      if (!layanan_id) {
        return res.status(400).json({ success: false, message: 'layanan_id wajib diisi' });
      }

      const order = await this.createOrderUseCase.execute(user.userId, {
        layanan_id,
        paket_id,
        catatan_client
      });

      return res.status(201).json({
        success: true,
        message: 'Order berhasil dibuat',
        data: order
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
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
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const result = await this.getMyOrdersUseCase.execute(user.userId, {
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
        message: 'Pesanan berhasil diambil',
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
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const { id } = req.params;
      const result = await this.getOrderByIdUseCase.execute(id, user);
      return res.json({ success: true, message: 'Detail pesanan berhasil diambil', data: result.data });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
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
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (user.role !== 'freelancer') {
        return res.status(403).json({ success: false, message: 'Hanya freelancer yang dapat menerima pesanan' });
      }

      const { id } = req.params;
      const order = await this.acceptOrderUseCase.execute(id, user.userId);

      return res.json({
        success: true,
        message: 'Order berhasil diterima',
        data: order
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
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
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (user.role !== 'freelancer') {
        return res.status(403).json({ success: false, message: 'Hanya freelancer yang dapat memulai pesanan' });
      }

      const { id } = req.params;
      const order = await this.startOrderUseCase.execute(id, user.userId);

      return res.json({
        success: true,
        message: 'Order berhasil dimulai',
        data: order
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
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
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (user.role !== 'freelancer') {
        return res.status(403).json({ success: false, message: 'Hanya freelancer yang dapat menyelesaikan pesanan' });
      }

      const { id } = req.params;
      const order = await this.completeOrderUseCase.execute(id, user.userId);

      return res.json({
        success: true,
        message: 'Order berhasil diselesaikan',
        data: order
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
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
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;
      const { reason } = req.body;

      const order = await this.cancelOrderUseCase.execute(id, user.userId, reason);

      return res.json({
        success: true,
        message: 'Order berhasil dibatalkan',
        data: order
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = OrderController;
