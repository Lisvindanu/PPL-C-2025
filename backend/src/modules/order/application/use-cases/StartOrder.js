/**
 * Start Order Use Case
 *
 * Use case untuk freelancer memulai pengerjaan order.
 * Mengubah status dari 'dibayar' menjadi 'dikerjakan'.
 *
 * Steps:
 * 1. Validasi order exist dan status 'dibayar'
 * 2. Validasi yang request adalah freelancer pemilik
 * 3. Update status jadi 'dikerjakan'
 * 4. Return updated order
 */

class StartOrder {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderId, userId) {
    // Validasi order exist
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      const error = new Error('Order tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Validasi ownership
    if (order.freelancer_id !== userId) {
      const error = new Error('Anda tidak memiliki akses untuk memulai order ini');
      error.statusCode = 403;
      throw error;
    }

    // Validasi status harus 'dibayar'
    if (order.status !== 'dibayar') {
      const error = new Error(`Order dengan status ${order.status} tidak dapat dimulai. Pastikan pembayaran sudah berhasil.`);
      error.statusCode = 400;
      throw error;
    }

    // Update status jadi 'dikerjakan'
    const updatedOrder = await this.orderRepository.updateStatus(orderId, 'dikerjakan');

    return updatedOrder;
  }
}

module.exports = StartOrder;
