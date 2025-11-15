// application/use-cases/categories/GetAllKategori.js

class GetAllKategori {
  constructor(kategoriRepository) {
    this.kategoriRepository = kategoriRepository;
  }

  async execute(filters = {}) {
    try {
      const { status, search, sortBy = 'created_at', sortOrder = 'DESC' } = filters;

      // Build query options
      const options = {
        sortBy,
        sortOrder
      };

      // Add filters if provided
      if (status !== undefined) {
        options.status = status;
      }

      if (search) {
        options.search = search;
      }

      // Get all categories
      const categories = await this.kategoriRepository.findAll(options);

      return {
        success: true,
        data: categories,
        message: 'Berhasil mengambil data kategori'
      };
    } catch (error) {
      console.error('Error in GetAllKategori:', error);
      throw new Error(`Gagal mengambil data kategori: ${error.message}`);
    }
  }
}

module.exports = GetAllKategori;