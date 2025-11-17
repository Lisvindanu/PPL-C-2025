// application/use-cases/categories/DeleteSubKategori.js

class DeleteSubKategori {
  constructor(subKategoriRepository, adminLogRepository) {
    this.subKategoriRepository = subKategoriRepository;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, subKategoriId, { ipAddress, userAgent } = {}) {
    // Validasi adminId
    if (!adminId) {
      throw new Error('Admin ID diperlukan');
    }

    console.log('🗑️  DeleteSubKategori Input:', { adminId, subKategoriId });

    // Cek sub kategori exist
    const existingSubKategori = await this.subKategoriRepository.findById(subKategoriId, true);
    
    console.log('🔍 Existing SubKategori:', existingSubKategori);

    if (!existingSubKategori) {
      throw new Error('Sub kategori tidak ditemukan');
    }

    // Hapus sub kategori
    const deleted = await this.subKategoriRepository.delete(subKategoriId);

    if (!deleted) {
      throw new Error('Gagal menghapus sub kategori');
    }

    console.log('✅ Sub kategori deleted successfully');

    // Log aktivitas admin
    try {
      await this.adminLogRepository.create({
        adminId: adminId,
        action: 'DELETE_SUB_KATEGORI',
        targetType: 'sub_kategori',
        targetId: subKategoriId,
        detail: {
          nama: existingSubKategori.nama,
          slug: existingSubKategori.slug,
          id_kategori: existingSubKategori.id_kategori
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

module.exports = DeleteSubKategori;