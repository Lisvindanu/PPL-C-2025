// application/use-cases/categories/UpdateKategori.js

class UpdateKategori {
  constructor(kategoriRepository, adminLogRepository) {
    this.kategoriRepository = kategoriRepository;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, kategoriId, { nama, deskripsi, icon }, { ipAddress, userAgent } = {}) {
    // Cek kategori exist
    const existingKategori = await this.kategoriRepository.findById(kategoriId);
    if (!existingKategori) {
      throw new Error('Kategori tidak ditemukan');
    }

    if (existingKategori.is_active === false) {
      throw new Error('Kategori tidak aktif dan tidak dapat diupdate');
    }

    // Prepare update data
    const updateData = {};

    // Update nama dan slug
    if (nama && nama !== existingKategori.nama) {
      if (!nama.trim()) {
        throw new Error('Nama kategori tidak boleh kosong');
      }

      const slug = nama.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      const existingByNama = await this.kategoriRepository.findByNama(nama);
      if (existingByNama && existingByNama.id !== kategoriId) {
        throw new Error('Nama kategori sudah digunakan');
      }

      updateData.nama = nama;
      updateData.slug = slug;
    }

    // Update deskripsi
    if (deskripsi !== undefined) {
      updateData.deskripsi = deskripsi;
    }

    // Update icon
    if (icon !== undefined) {
      updateData.icon = icon;
    }

    // Update timestamp
    updateData.updated_at = new Date();

    // Simpan perubahan
    const result = await this.kategoriRepository.update(kategoriId, updateData);

    // Log aktivitas admin
    await this.adminLogRepository.create({
      adminId: adminId,
      action: 'UPDATE_KATEGORI',
      targetType: 'kategori',
      targetId: kategoriId,
      detail: {
        before: {
          nama: existingKategori.nama,
          deskripsi: existingKategori.deskripsi,
          icon: existingKategori.icon
        },
        after: updateData
      },
      ipAddress: ipAddress || null,
      userAgent: userAgent || null
    });

    return result;
  }
}

module.exports = UpdateKategori;