/**
 * GetOrderById Use Case
 * Ambil detail pesanan dan validasi akses (client/freelancer pemilik atau admin)
 */

class GetOrderById {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderId, requester) {
    if (!orderId) {
      const err = new Error('orderId is required');
      err.statusCode = 400;
      throw err;
    }
    if (!requester || !requester.userId) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    const isOwner = order.client_id === requester.userId || order.freelancer_id === requester.userId;
    const isAdmin = requester.role === 'admin';
    if (!isOwner && !isAdmin) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      throw err;
    }

    return { success: true, data: order };
  }
}

module.exports = GetOrderById;