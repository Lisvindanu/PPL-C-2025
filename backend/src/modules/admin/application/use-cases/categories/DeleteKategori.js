// application/use-cases/categories/DeleteKategori.js

class DeleteKategori {
  constructor(kategoriRepository, subKategoriRepository, adminLogRepository) {
    this.kategoriRepository = kategoriRepository;
    this.subKategoriRepository = subKategoriRepository;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, kategoriId, { ipAddress, userAgent } = {}) {
    // Validasi adminId
    if (!adminId) {
      throw new Error('Admin ID diperlukan');
    }

    console.log('🗑️  DeleteKategori Input:', { adminId, kategoriId });

    // Cek kategori exist
    const existingKategori = await this.kategoriRepository.findById(kategoriId);
    
    console.log('🔍 Existing Kategori:', existingKategori);

    if (!existingKategori) {
      throw new Error('Kategori tidak ditemukan');
    }

    // ✅ Cek apakah ada sub kategori yang terkait
    const subKategoriCount = await this.subKategoriRepository.countByKategori(kategoriId);
    
    console.log('🔍 SubKategori count:', subKategoriCount);

    if (subKategoriCount > 0) {
      throw new Error(`Tidak dapat menghapus kategori. Masih ada ${subKategoriCount} sub kategori yang terkait`);
    }

    // Hapus kategori
    const deleted = await this.kategoriRepository.delete(kategoriId);

    if (!deleted) {
      throw new Error('Gagal menghapus kategori');
    }

    console.log('✅ Kategori deleted successfully');

    // Log aktivitas admin
    try {
      await this.adminLogRepository.create({
        adminId: adminId,
        action: 'DELETE_KATEGORI',
        targetType: 'kategori',
        targetId: kategoriId,
        detail: {
          nama: existingKategori.nama,
          slug: existingKategori.slug,
          deskripsi: existingKategori.deskripsi
        },
        ipAddress: ipAddress || null,
        userAgent: userAgent || null
      });
    } catch (logError) {
      console.error('❌ Error saving admin log:', logError);
    }

    return { success: true };
  }
}

module.exports = DeleteKategori;