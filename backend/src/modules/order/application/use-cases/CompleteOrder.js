/**
 * Complete Order Use Case
 *
 * Ini dipanggil penyedia setelah selesai ngerjain orderan.
 * Setelah complete, escrow akan di-release ke penyedia (otomatis atau butuh approval buyer).
 *
 * Steps:
 * 1. Validasi order exist dan status 'in_progress'
 * 2. Validasi yang request adalah penyedia
 * 3. Update status jadi 'completed'
 * 4. Release escrow ke penyedia (panggil modul payment)
 * 5. Kirim notifikasi ke buyer buat review
 * 6. Update stats service (total_pesanan++)
 */

class CompleteOrder {
  constructor(
    orderRepository,
    escrowService,
    serviceRepository,
    notificationService = null
  ) {
    this.orderRepository = orderRepository;
    this.escrowService = escrowService;
    this.serviceRepository = serviceRepository;
    this.notificationService = notificationService;
  }

  async execute(orderId, userId) {
    // TODO: Validasi order exist
    // const order = await this.orderRepository.findById(orderId);
    // if (!order) {
    //   throw new Error('Order not found');
    // }

    // TODO: Validasi ownership
    // if (order.penyedia_id !== userId) {
    //   throw new Error('Lu bukan penyedia, jangan complete order orang');
    // }

    // TODO: Validasi status harus in_progress
    // if (!order.isInProgress()) {
    //   throw new Error(`Order status ${order.status}, harus in_progress dulu`);
    // }

    // TODO: Update status jadi completed
    // const updatedOrder = await this.orderRepository.updateStatus(orderId, 'completed');

    // TODO: Release escrow (auto-release atau tunggu buyer confirm)
    // try {
    //   await this.escrowService.releaseEscrow(order.pesanan_id, userId);
    // } catch (error) {
    //   console.error('Failed to release escrow:', error);
    //   // Order tetep completed, escrow bisa di-release manual nanti
    // }

    // TODO: Update stats service
    // await this.serviceRepository.incrementOrderCount(order.layanan_id);

    // TODO: Kirim notifikasi ke buyer buat review
    // if (this.notificationService) {
    //   await this.notificationService.sendOrderCompletedNotification(order.user_id, order);
    //   await this.notificationService.sendReviewReminderNotification(order.user_id, order);
    // }

    // return updatedOrder;

    throw new Error('Not implemented yet - Penting banget ini, kerjain dong');
  }
}

module.exports = CompleteOrder;
