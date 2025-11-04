/**
 * Accept Order Use Case (Seller/Penyedia Only)
 *
 * Ini dipanggil sama penyedia layanan buat accept order yang masuk.
 * Cuma penyedia yang bisa accept, jangan sampe orang random bisa accept.
 *
 * Steps:
 * 1. Validasi order exist dan status 'pending'
 * 2. Validasi yang request adalah penyedia dari layanan ini
 * 3. Validasi payment udah dibayar (cek di tabel pembayaran)
 * 4. Update status jadi 'accepted'
 * 5. Kirim notifikasi ke buyer
 */

class AcceptOrder {
  constructor(orderRepository, paymentRepository, notificationService = null) {
    this.orderRepository = orderRepository;
    this.paymentRepository = paymentRepository;
    this.notificationService = notificationService;
  }

  async execute(orderId, userId) {
    // TODO: Validasi order exist
    // const order = await this.orderRepository.findById(orderId);
    // if (!order) {
    //   throw new Error('Order not found');
    // }

    // TODO: Validasi ownership - harus penyedia
    // if (order.penyedia_id !== userId) {
    //   throw new Error('Lu bukan penyedia layanan ini, jangan sok accept');
    // }

    // TODO: Validasi status harus pending
    // if (!order.isPending()) {
    //   throw new Error(`Order udah ${order.status}, ga bisa di-accept lagi`);
    // }

    // TODO: Validasi payment udah dibayar
    // const payment = await this.paymentRepository.findByOrderId(orderId);
    // if (!payment || payment.status !== 'paid') {
    //   throw new Error('Order ini belum dibayar, jangan accept dulu');
    // }

    // TODO: Update status jadi accepted
    // const updatedOrder = await this.orderRepository.updateStatus(orderId, 'accepted');

    // TODO: Kirim notifikasi ke buyer
    // if (this.notificationService) {
    //   await this.notificationService.sendOrderAcceptedNotification(order.user_id, order);
    // }

    // return updatedOrder;

    throw new Error('Not implemented yet - Kerjain dong, penting ini');
  }
}

module.exports = AcceptOrder;
