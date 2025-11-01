/**
 * Delete Service Use Case
 *
 * PENTING: Gunakan soft delete, bukan hard delete.
 * Jangan hapus langsung dari database karena akan merusak referensi order history.
 *
 * Steps yang perlu kamu lakukan:
 * 1. Validasi service exist
 * 2. Cek ownership - pastikan service milik user yang request
 * 3. Cek active orders - jangan izinkan delete jika masih ada order berjalan
 * 4. Set is_active = false (soft delete)
 * 5. Return success message
 *
 * Kenapa soft delete?
 * - Menjaga integritas data order history
 * - User bisa restore jika berubah pikiran
 * - Analytics tetap akurat
 */

class DeleteService {
  constructor(serviceRepository, orderRepository = null) {
    this.serviceRepository = serviceRepository;
    this.orderRepository = orderRepository; // Nanti kalo order module udah jadi
  }

  async execute(serviceId, userId) {
    // TODO: Validasi service exist
    // const service = await this.serviceRepository.findById(serviceId);
    // if (!service) {
    //   throw new Error('Service tidak ditemukan');
    // }

    // TODO: Cek ownership
    // if (service.user_id !== userId) {
    //   throw new Error('Tidak dapat menghapus service milik user lain');
    // }

    // TODO: Cek active orders (jika order module sudah diimplementasi)
    // if (this.orderRepository) {
    //   const activeOrders = await this.orderRepository.findByServiceId(serviceId, {
    //     status: ['pending', 'accepted', 'in_progress']
    //   });
    //   if (activeOrders.length > 0) {
    //     throw new Error('Tidak dapat menghapus service yang masih memiliki order aktif');
    //   }
    // }

    // TODO: Soft delete - set is_active menjadi false
    // await this.serviceRepository.update(serviceId, { is_active: false });

    // return { message: 'Service berhasil dihapus' };

    throw new Error('Not implemented yet - Silakan implementasikan logic di sini');
  }
}

module.exports = DeleteService;
