// application/use-cases/categories/ToggleSubKategoriStatus.js

class ToggleSubKategoriStatus {
  constructor(subKategoriRepository, adminLogRepository) {
    this.subKategoriRepository = subKategoriRepository;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, subKategoriId, newStatus, { ipAddress, userAgent } = {}) {
    try {
      console.log('🔄 ToggleSubKategoriStatus Input:', { adminId, subKategoriId, newStatus });

      // Validasi adminId
      if (!adminId) {
        throw new Error('Admin ID diperlukan');
      }

      // Validasi subKategoriId
      if (!subKategoriId) {
        throw new Error('ID Sub Kategori diperlukan');
      }

      // Validasi newStatus adalah boolean
      if (typeof newStatus !== 'boolean') {
        throw new Error('Status harus berupa boolean (true/false)');
      }

      // Cek apakah sub kategori exist
      const subKategori = await this.subKategoriRepository.findById(subKategoriId, true);
      
      console.log('📦 SubKategori ditemukan:', subKategori);

      if (!subKategori) {
        throw new Error('Sub Kategori tidak ditemukan');
      }

      // Cek apakah status sudah sama (tidak perlu update)
      if (subKategori.is_active === newStatus) {
        console.log('ℹ️ Status sudah sama, tidak perlu update');
        return subKategori;
      }

      // Update status
      const updateData = {
        is_active: newStatus,
        updated_at: new Date()
      };

      console.log('💾 Update data:', updateData);

      const result = await this.subKategoriRepository.update(subKategoriId, updateData);

      if (!result) {
        throw new Error('Gagal mengubah status sub kategori');
      }

      console.log('✅ Status berhasil diubah');

      // Log aktivitas admin
      try {
        await this.adminLogRepository.create({
          adminId: adminId,
          action: newStatus ? 'ACTIVATE_SUB_KATEGORI' : 'DEACTIVATE_SUB_KATEGORI',
          targetType: 'sub_kategori',
          targetId: subKategoriId,
          detail: {
            nama: subKategori.nama,
            old_status: subKategori.is_active,
            new_status: newStatus
          },
          ipAddress: ipAddress || null,
          userAgent: userAgent || null
        });
      } catch (logError) {
        console.error('⚠️ Error saving admin log:', logError);
      }

      return result;
    } catch (error) {
      console.error('❌ Error in ToggleSubKategoriStatus:', error);
      throw error;
    }
  }
}

module.exports = ToggleSubKategoriStatus;