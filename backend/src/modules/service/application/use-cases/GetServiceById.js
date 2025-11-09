/**
 * Get Service By ID Use Case
 * Business logic untuk ambil detail layanan berdasarkan ID
 */

class GetServiceById {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(serviceId, options = {}) {
    try {
      // Validate service ID
      if (!serviceId) {
        throw new Error('Service ID is required');
      }

      // Get service from repository
      const service = await this.serviceRepository.findById(serviceId);

      // Validate service exists
      if (!service) {
        throw new Error('Service not found');
      }

      // Check if service is active (unless owner is viewing)
      if (!service.isActive() && options.userId !== service.user_id) {
        throw new Error('Service is not available');
      }

      // Format and return service detail
      return this.formatServiceDetail(service);
    } catch (error) {
      throw new Error(`Failed to get service detail: ${error.message}`);
    }
  }

  /**
   * Format service entity for detail response
   */
  formatServiceDetail(service) {
    return {
      id: service.id,
      judul: service.judul,
      slug: service.slug,
      deskripsi: service.deskripsi,
      harga: service.harga_minimum,
      waktu_pengerjaan: service.waktu_pengerjaan,
      batas_revisi: service.batas_revisi,
      thumbnail: service.thumbnail,
      gambar: service.foto_layanan || [],
      rating_rata_rata: service.rating_rata_rata,
      jumlah_rating: service.jumlah_review,
      total_pesanan: service.total_pesanan,
      jumlah_dilihat: service.jumlah_dilihat,
      status: service.status,
      created_at: service.created_at,
      updated_at: service.updated_at,
      freelancer: service.freelancer ? {
        id: service.freelancer.id,
        nama_lengkap: `${service.freelancer.nama_depan || ''} ${service.freelancer.nama_belakang || ''}`.trim(),
        email: service.freelancer.email,
        no_telepon: service.freelancer.no_telepon,
        avatar: service.freelancer.avatar,
        bio: service.freelancer.bio,
        kota: service.freelancer.kota
      } : null,
      kategori: service.kategori ? {
        id: service.kategori.id,
        nama_kategori: service.kategori.nama,
        slug: service.kategori.slug,
        icon: service.kategori.icon
      } : null,
      can_be_ordered: service.canBeOrdered()
    };
  }
}

module.exports = GetServiceById;
