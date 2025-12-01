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

    const adjustedOrder = this.applyPaymentStatus(order);

    return { success: true, data: adjustedOrder };
  }

  /**
   * Jika ada pembayaran sukses untuk pesanan ini namun status order masih
   * 'menunggu_pembayaran', tampilkan ke FE sebagai 'dibayar' tanpa mengubah DB.
   */
  applyPaymentStatus(order) {
    if (!order || !Array.isArray(order.pembayaran)) {
      return order;
    }

    const hasSuccessfulPayment = order.pembayaran.some((payment) => {
      if (!payment || !payment.status) return false;
      const normalized = String(payment.status).toLowerCase();
      return ['berhasil', 'success', 'paid', 'settlement'].includes(normalized);
    });

    if (hasSuccessfulPayment && order.status === 'menunggu_pembayaran') {
      return { ...order, status: 'dibayar' };
    }

    return order;
  }
}

module.exports = GetOrderById;
