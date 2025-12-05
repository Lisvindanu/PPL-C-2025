// application/use-cases/categories/UpdateSubKategori.js

class UpdateSubKategori {
  constructor(subKategoriRepository, kategoriRepository, adminLogRepository) {
    this.subKategoriRepository = subKategoriRepository;
    this.kategoriRepository = kategoriRepository;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, subKategoriId, { nama, deskripsi, icon, id_kategori }, { ipAddress, userAgent } = {}) {
    // Validasi adminId
    if (!adminId) {
      throw new Error('Admin ID diperlukan');
    }

    console.log('🔍 UpdateSubKategori Input:', {
      adminId,
      subKategoriId,
      nama,
      deskripsi,
      icon,
      id_kategori
    });

    // Cek sub kategori exist
    const existingSubKategori = await this.subKategoriRepository.findById(subKategoriId, true);
    
    console.log('🔍 Existing SubKategori:', existingSubKategori);

    if (!existingSubKategori) {
      throw new Error('Sub kategori tidak ditemukan');
    }

    // 🔥 Rule: sub kategori tidak aktif → tidak boleh diupdate
    if (existingSubKategori.is_active === false) {
      throw new Error('Sub kategori tidak aktif dan tidak dapat diupdate');
    }

    // Prepare update data
    const updateData = {};

    // ✅ PERBAIKAN: Jika id_kategori dikirim, validasi. Jika tidak, gunakan yang lama
    let finalIdKategori = existingSubKategori.id_kategori; // Default: pakai yang lama

    if (id_kategori && id_kategori !== existingSubKategori.id_kategori) {
      // Jika id_kategori dikirim dan berbeda, validasi kategori baru
      const kategori = await this.kategoriRepository.findById(id_kategori);
      
      if (!kategori) {
        throw new Error('Kategori baru tidak ditemukan');
      }

      if (!kategori.is_active) {
        throw new Error('Kategori baru tidak aktif');
      }

      updateData.id_kategori = id_kategori;
      finalIdKategori = id_kategori;
    }
    // ✅ Jika id_kategori tidak dikirim, tetap gunakan yang lama (tidak perlu update)

    // Update nama dan slug
    if (nama && nama !== existingSubKategori.nama) {
      if (!nama.trim()) {
        throw new Error('Nama sub kategori tidak boleh kosong');
      }

      const slug = nama.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const existingByNama = await this.subKategoriRepository.findByNama(nama);
      if (existingByNama && existingByNama.id !== subKategoriId) {
        throw new Error('Nama sub kategori sudah digunakan');
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

    // Jika tidak ada perubahan
    if (Object.keys(updateData).length === 0) {
      return existingSubKategori;
    }

    // Update timestamp
    updateData.updated_at = new Date();

    console.log('💾 Update Data:', updateData);

    // Simpan perubahan
    const result = await this.subKategoriRepository.update(subKategoriId, updateData);

    // Log aktivitas admin
    try {
      await this.adminLogRepository.create({
        adminId: adminId,
        action: 'UPDATE_SUB_KATEGORI',
        targetType: 'sub_kategori',
        targetId: subKategoriId,
        detail: {
          before: {
            nama: existingSubKategori.nama,
            deskripsi: existingSubKategori.deskripsi,
            icon: existingSubKategori.icon,
            id_kategori: existingSubKategori.id_kategori
          },
          after: updateData
        },
        ipAddress: ipAddress || null,
        userAgent: userAgent || null
      });
    } catch (logError) {
      console.error('❌ Error saving admin log:', logError);
    }

    return result;
  }
}

module.exports = UpdateSubKategori;