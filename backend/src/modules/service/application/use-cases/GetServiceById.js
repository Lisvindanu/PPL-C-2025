/**
 * Get Service By ID Use Case
 *
 * Use case paling gampang, cuma ambil data doang.
 * Tapi tetep perlu validasi, jangan asal return null anjir.
 *
 * Yang perlu lo lakuin:
 * 1. Ambil service dari database by ID
 * 2. Include relations (user/penyedia, kategori, sub_kategori, reviews)
 * 3. Hitung average rating (kalo review module udah jadi)
 * 4. Return lengkap dengan semua relasi nya
 *
 * Bonus points kalo lo bikin view counter buat analytics
 */

class GetServiceById {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(serviceId, options = {}) {
    // TODO: Ambil service dari database
    // const service = await this.serviceRepository.findById(serviceId, {
    //   includeUser: true,      // Include data penyedia
    //   includeKategori: true,  // Include kategori & sub_kategori
    //   includeReviews: options.includeReviews || false
    // });

    // TODO: Validasi service exist
    // if (!service) {
    //   throw new Error('Service not found, salah ID kali lu');
    // }

    // TODO: Cek status - kalo draft cuma owner yang bisa liat
    // if (service.status === 'draft' && options.userId !== service.user_id) {
    //   throw new Error('Service ini masih draft, ga bisa diliat orang');
    // }

    // TODO: (Optional) Increment view counter buat analytics
    // if (options.trackView) {
    //   await this.serviceRepository.incrementViewCount(serviceId);
    // }

    // return service;

    throw new Error('Not implemented yet - Kerjain dong, tinggal query doang kok');
  }
}

module.exports = GetServiceById;
