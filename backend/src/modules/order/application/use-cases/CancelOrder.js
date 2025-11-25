/**
 * Cancel Order Use Case
 *
 * Use case untuk membatalkan pesanan.
 * Client dapat membatalkan sebelum atau setelah dibayar.
 * Freelancer dapat membatalkan jika order sudah dibayar.
 *
 * Steps:
 * 1. Validasi order exist
 * 2. Validasi yang request adalah client atau freelancer terkait
 * 3. Validasi status order bisa dibatalkan
 * 4. Update status jadi 'dibatalkan'
 * 5. Return updated order
 */

class CancelOrder {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderId, userId, reason = null) {
    // Validasi order exist
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      const error = new Error('Order tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Validasi ownership - harus client atau freelancer terkait
    const isClient = order.client_id === userId;
    const isFreelancer = order.freelancer_id === userId;

    if (!isClient && !isFreelancer) {
      const error = new Error('Anda tidak memiliki akses untuk membatalkan order ini');
      error.statusCode = 403;
      throw error;
    }

    // Validasi status - bisa dibatalkan jika belum dikerjakan
    const cancellableStatuses = ['menunggu_pembayaran', 'dibayar'];
    if (!cancellableStatuses.includes(order.status)) {
      const error = new Error(`Order dengan status ${order.status} tidak dapat dibatalkan`);
      error.statusCode = 400;
      throw error;
    }

    // Update status jadi 'dibatalkan'
    const updatedOrder = await this.orderRepository.cancel(orderId, reason);

    return updatedOrder;
  }
}

module.exports = CancelOrder;
