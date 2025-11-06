/**
 * Get All Services Use Case
 * Business logic untuk listing dan search layanan
 */

class GetAllServices {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(filters = {}, pagination = { page: 1, limit: 20 }) {
    // TODO: Implement service listing with filters
    // Filters: kategori_id, sub_kategori_id, lokasi, harga_min, harga_max, rating_min
    // Support: pagination, sorting (terbaru, harga, rating, populer)
    // Return: { services, total, page, totalPages }

    throw new Error('Not implemented yet - Service listing will be added in future sprint');
  }
}

module.exports = GetAllServices;
