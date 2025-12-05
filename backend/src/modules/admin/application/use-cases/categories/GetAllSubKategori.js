// application/use-cases/categories/GetAllSubKategori.js

class GetAllSubKategori {
  constructor(subKategoriRepository) {
    this.subKategoriRepository = subKategoriRepository;
  }

  /**
   * Mengambil semua data Sub Kategori dengan dukungan filtering dan sorting.
   *
   * @param {object} filters - Objek yang berisi kriteria filter (search, status, kategoriId, sortBy, sortOrder).
   */
  async execute(filters = {}) {
    try {
      // 1. Siapkan opsi yang akan diteruskan ke Repository
      const repositoryOptions = {
        // Gabungkan semua filter yang diterima dari controller
        ...filters, 
        // Pastikan Kategori selalu di-include untuk admin panel
        includeKategori: true 
      };

      console.log('🔍 GetAllSubKategori filters diteruskan ke Repo:', repositoryOptions);

      // 2. Panggil repository dengan repositoryOptions yang sudah berisi filter
      const subKategoriList = await this.subKategoriRepository.findAll(repositoryOptions);

      // 3. Mapping data hasil (tetap sama seperti sebelumnya)
      return subKategoriList.map(subKat => ({
        id: subKat.id,
        nama: subKat.nama,
        slug: subKat.slug,
        deskripsi: subKat.deskripsi,
        icon: subKat.icon,
        is_active: subKat.is_active,
        id_kategori: subKat.id_kategori,
        kategori: subKat.kategori ? {
          id: subKat.kategori.id,
          nama: subKat.kategori.nama,
          slug: subKat.kategori.slug,
          is_active: subKat.kategori.is_active
        } : null,
        created_at: subKat.created_at,
        updated_at: subKat.updated_at
      }));
    } catch (error) {
      console.error('Error in GetAllSubKategori:', error);
      throw new Error(`Gagal mengambil data sub kategori: ${error.message}`);
    }
  }
}

module.exports = GetAllSubKategori;