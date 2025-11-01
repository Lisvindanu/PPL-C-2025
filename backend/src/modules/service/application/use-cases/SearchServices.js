/**
 * Search Services Use Case
 * Business logic untuk pencarian layanan
 */

class SearchServices {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(keyword, filters = {}, pagination = { page: 1, limit: 20 }) {
    // TODO: Implement full-text search
    // Search in: judul, deskripsi
    // Combined with filters: kategori, lokasi, harga, rating
    // Return: { services, total, page, totalPages, keyword }

    throw new Error('Not implemented yet - Service search will be added in future sprint');
  }
}

module.exports = SearchServices;
