/**
 * Get All Services Use Case
 * Business logic untuk listing dan search layanan
 */

class GetAllServices {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(filters = {}, pagination = { page: 1, limit: 20 }) {
    try {
      // Validate pagination
      const page = parseInt(filters.page) || parseInt(pagination.page) || 1;
      const limit = parseInt(filters.limit) || parseInt(pagination.limit) || 20;

      if (page < 1) {
        throw new Error('Page must be greater than 0');
      }

      if (limit < 1 || limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }

      // Validate filters
      const validFilters = {
        kategori_id: filters.kategori_id,
        harga_min: filters.harga_min ? parseFloat(filters.harga_min) : undefined,
        harga_max: filters.harga_max ? parseFloat(filters.harga_max) : undefined,
        rating_min: filters.rating_min ? parseFloat(filters.rating_min) : undefined,
        status: filters.status || 'aktif'
      };

      // Validate price range
      if (validFilters.harga_min && validFilters.harga_max && validFilters.harga_min > validFilters.harga_max) {
        throw new Error('Minimum price cannot be greater than maximum price');
      }

      // Validate rating
      if (validFilters.rating_min && (validFilters.rating_min < 0 || validFilters.rating_min > 5)) {
        throw new Error('Rating must be between 0 and 5');
      }

      // Setup pagination with sorting
      const paginationOptions = {
        page,
        limit,
        sortBy: filters.sortBy || 'created_at',
        sortOrder: filters.sortOrder || 'DESC'
      };

      // Get services from repository
      const result = await this.serviceRepository.findAll(validFilters, paginationOptions);

      // Format response
      return {
        services: result.services.map(service => this.formatServiceForList(service)),
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      };
    } catch (error) {
      throw new Error(`Failed to get services: ${error.message}`);
    }
  }

  /**
   * Format service entity for list response
   */
  formatServiceForList(service) {
    return {
      id: service.id,
      judul: service.judul,
      slug: service.slug,
      deskripsi: service.deskripsi.substring(0, 150) + '...', // Truncate description
      harga: service.harga_minimum,
      thumbnail: service.thumbnail,
      rating_rata_rata: service.rating_rata_rata,
      jumlah_review: service.jumlah_review,
      total_pesanan: service.total_pesanan,
      waktu_pengerjaan: service.waktu_pengerjaan,
      freelancer: service.freelancer ? {
        id: service.freelancer.id,
        nama_lengkap: `${service.freelancer.nama_depan || ''} ${service.freelancer.nama_belakang || ''}`.trim(),
        avatar: service.freelancer.avatar,
        kota: service.freelancer.kota
      } : null,
      kategori: service.kategori ? {
        id: service.kategori.id,
        nama_kategori: service.kategori.nama,
        slug: service.kategori.slug
      } : null
    };
  }
}

module.exports = GetAllServices;
