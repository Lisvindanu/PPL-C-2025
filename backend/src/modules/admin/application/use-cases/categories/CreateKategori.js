const { v4: uuidv4 } = require('uuid');
const KategoriEntity = require('../../../domain/entities/KategoriEntity');

class CreateKategori {
 constructor(kategoriRepository, adminLogRepository) {
  this.kategoriRepository = kategoriRepository;
  this.adminLogRepository = adminLogRepository;
 }

 async execute(adminId, { nama, deskripsi, icon }, { ipAddress, userAgent } = {}) {
  // 1. Validasi Input
  KategoriEntity.validateNama(nama);
  KategoriEntity.validateDeskripsi(deskripsi);
  KategoriEntity.validateIcon(icon);

  // 2. Generate slug dan Cek Uniqueness
  const slug = KategoriEntity.generateSlug(nama);

  const existingByNama = await this.kategoriRepository.findByNama(nama);
  if (existingByNama) {
   throw new Error('Nama kategori sudah digunakan');
  }

  const existingBySlug = await this.kategoriRepository.findBySlug(slug);
  if (existingBySlug) {
   throw new Error('Slug kategori sudah digunakan');
  }

  // 3. Buat Entity
  const kategori = new KategoriEntity({
   id: uuidv4(),
   nama,
   slug,
   deskripsi,
   icon,
   is_active: true
  });

  // 4. Simpan Kategori ke Database (Proses Kritis)
  const result = await this.kategoriRepository.create(kategori);

  // 5. Log Aktivitas Admin (Proses Non-Kritis untuk Transaksi)
  try {
   // Jika adminId null/undefined, error akan terjadi di sini, tapi tidak menghentikan result
   if (!adminId) {
    throw new Error('adminId is required for logging');
   }
      
   await this.adminLogRepository.create({
    adminId: adminId,
    action: 'CREATE_KATEGORI',
    targetType: 'kategori',
    targetId: result.id,
    detail: { nama, slug, deskripsi, icon },
    ipAddress: ipAddress || null,
    userAgent: userAgent || null
   });
  } catch (logError) {
   // Mencatat error log ke console sebagai Peringatan
   console.error(`❌ Peringatan: Gagal mencatat log admin (adminId: ${adminId}) untuk Kategori ID ${result.id}: ${logError.message}`);
   // Proses dilanjutkan karena kategori sudah berhasil dibuat.
  }

  return result;
 }
}

module.exports = CreateKategori;