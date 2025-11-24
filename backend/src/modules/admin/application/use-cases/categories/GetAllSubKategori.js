// application/use-cases/categories/GetAllSubKategori.js

class GetAllSubKategori {
  constructor(subKategoriRepository) {
    this.subKategoriRepository = subKategoriRepository;
  }

  async execute(filters = {}) {
    try {
      // ✅ PERBAIKAN: Set default value untuk filters
      const safeFilters = {
        kategoriId: filters?.kategoriId || null,
        isActive: filters?.isActive !== undefined ? filters.isActive : null
      };

      console.log('🔍 GetAllSubKategori filters:', safeFilters);

      const subKategoriList = await this.subKategoriRepository.findAll(true); // include kategori

      // ✅ PERBAIKAN: Handle jika kategori null/undefined
      return subKategoriList.map(subKat => ({
        id: subKat.id,
        nama: subKat.nama,
        slug: subKat.slug,
        deskripsi: subKat.deskripsi,
        icon: subKat.icon,
        is_active: subKat.is_active,
        id_kategori: subKat.id_kategori, // ✅ Tambahkan ini
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