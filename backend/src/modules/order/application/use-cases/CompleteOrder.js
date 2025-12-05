/**
 * Complete Order Use Case
 *
 * Use case untuk freelancer menandai pesanan sebagai selesai.
 * Setelah selesai, order akan menunggu review dari client.
 *
 * Steps:
 * 1. Validasi order exist dan status 'dikerjakan'
 * 2. Validasi yang request adalah freelancer pemilik
 * 3. Update status jadi 'menunggu_review'
 * 4. Set tanggal selesai
 * 5. Return updated order
 */

class CompleteOrder {
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
      const error = new Error('Anda tidak memiliki akses untuk menyelesaikan order ini');
      error.statusCode = 403;
      throw error;
    }

    // Validasi status harus 'dikerjakan'
    if (order.status !== 'dikerjakan') {
      const error = new Error(`Order dengan status ${order.status} tidak dapat diselesaikan. Pastikan order sedang dikerjakan.`);
      error.statusCode = 400;
      throw error;
    }

    // Update status jadi 'menunggu_review' dan set tanggal selesai
    const updatedOrder = await this.orderRepository.update(orderId, {
      status: 'menunggu_review',
      selesai_pada: new Date()
    });

    return updatedOrder;
  }
}

module.exports = CompleteOrder;
