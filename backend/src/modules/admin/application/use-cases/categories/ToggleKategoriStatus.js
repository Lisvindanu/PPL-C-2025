// application/use-cases/categories/ToggleKategoriStatus.js

class ToggleKategoriStatus {
  constructor(kategoriRepository, adminLogRepository) {
    // ✅ Hanya 2 parameter
    this.kategoriRepository = kategoriRepository;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, kategoriId, is_active, { ipAddress, userAgent } = {}) {
    const kategori = await this.kategoriRepository.findById(kategoriId);
    if (!kategori) {
      throw new Error('Kategori tidak ditemukan');
    }

    const result = await this.kategoriRepository.update(kategoriId, {
      is_active,
      updated_at: new Date()
    });

    console.log('🔍 ToggleKategoriStatus - adminId:', adminId);
    console.log('🔍 ToggleKategoriStatus - kategoriId:', kategoriId);
    console.log('🔍 ToggleKategoriStatus - is_active:', is_active);

    // Log aktivitas admin
    await this.adminLogRepository.create({
      adminId: adminId,
      action: is_active ? 'ACTIVATE_KATEGORI' : 'DEACTIVATE_KATEGORI',
      targetType: 'kategori',
      targetId: kategoriId,
      detail: {
        before: { is_active: kategori.is_active },
        after: { is_active }
      },
      ipAddress: ipAddress || null,
      userAgent: userAgent || null
    });

    return { kategori: result };
  }
}

module.exports = ToggleKategoriStatus;