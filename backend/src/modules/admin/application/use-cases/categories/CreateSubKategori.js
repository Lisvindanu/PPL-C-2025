// application/use-cases/categories/CreateSubKategori.js

class CreateSubKategori {
  constructor(subKategoriRepository, kategoriRepository, adminLogRepository) {
    this.subKategoriRepository = subKategoriRepository;
    this.kategoriRepository = kategoriRepository;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, { nama, deskripsi, icon, id_kategori }, { ipAddress, userAgent } = {}) {
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
    const kategori = await this.kategoriRepository.findById(id_kategori);
    

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

    const result = await this.subKategoriRepository.create(subKategoriData);

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
      console.error('❌ Error saving admin log:', logError);
    }

    return result;
  }
}

module.exports = CreateSubKategori;