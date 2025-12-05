// application/use-cases/categories/CreateSubKategori.js

class CreateSubKategori {
  constructor(subKategoriRepository, kategoriRepository, adminLogRepository) {
    this.subKategoriRepository = subKategoriRepository;
    this.kategoriRepository = kategoriRepository;
    this.adminLogRepository = adminLogRepository;
  }

  // application/use-cases/categories/CreateSubKategori.js

async execute(adminId, { nama, deskripsi, icon, id_kategori }, { ipAddress, userAgent } = {}) {
  try {
    console.log('📝 CreateSubKategori - Input:', { adminId, nama, id_kategori, deskripsi, icon });

    // Validasi adminId
    if (!adminId) {
      throw new Error('Admin ID diperlukan');
    }

    // Validasi input nama
    if (!nama || !nama.trim()) {
      throw new Error('Nama sub kategori tidak boleh kosong');
    }

    if (!id_kategori || id_kategori === '' || id_kategori === 'undefined' || id_kategori === 'null') {
      throw new Error('ID Kategori harus dipilih');
    }

    // Cek kategori exist dan aktif
    console.log('🔍 Mencari kategori dengan ID:', id_kategori);
    const kategori = await this.kategoriRepository.findById(id_kategori);
    console.log('📦 Kategori ditemukan:', kategori);

    if (!kategori) {
      throw new Error('Kategori tidak ditemukan');
    }

    if (!kategori.is_active) {
      throw new Error('Kategori tidak aktif');
    }

    // Generate slug
    const slug = nama.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    console.log('🔗 Generated slug:', slug);

    // Cek unique nama
    const existingByNama = await this.subKategoriRepository.findByNama(nama);
    if (existingByNama) {
      throw new Error('Nama sub kategori sudah digunakan');
    }

    // Buat sub kategori
    const subKategoriData = {
      nama: nama.trim(),
      slug,
      deskripsi: deskripsi || null,
      icon: icon || null,
      id_kategori,
      is_active: true
    };

    console.log('💾 Data yang akan disimpan:', subKategoriData);

    const result = await this.subKategoriRepository.create(subKategoriData);

    console.log('✅ Sub kategori berhasil dibuat:', result.id);

    // Log aktivitas
    try {
      await this.adminLogRepository.create({
        adminId: adminId,
        action: 'CREATE_SUB_KATEGORI',
        targetType: 'sub_kategori',
        targetId: result.id,
        detail: {
          nama: result.nama,
          slug: result.slug,
          id_kategori: result.id_kategori,
          nama_kategori: kategori.nama
        },
        ipAddress: ipAddress || null,
        userAgent: userAgent || null
      });
    } catch (logError) {
      console.error('⚠️ Error saving admin log:', logError);
    }

    return result;
  } catch (error) {
    console.error('❌ Error in CreateSubKategori:', error);
    throw error; // Re-throw untuk ditangkap controller
  }
}
} 
module.exports = CreateSubKategori;