/**
 * Update Service Use Case
 *
 * Selamat! Kamu beruntung karena kerangka sudah dibuatkan.
 * Tinggal sambungkan dengan database dan business logic nya.
 *
 * Yang perlu kamu lakukan:
 * 1. Validasi input - pastikan data tidak null/undefined
 * 2. Cek ownership: service ini milik user yang request
 * 3. Generate slug baru jika judul berubah
 * 4. Validasi kategori/sub_kategori masih exist di database
 * 5. Update ke database
 * 6. Return service yang sudah diupdate
 *
 * Contoh validasi yang perlu ditambahkan:
 * - Judul minimal 10 karakter
 * - Deskripsi minimal 50 karakter
 * - Harga minimum <= harga maksimum (basic math)
 * - Foto maksimal 5 files
 *
 * Tips: Lihat modul payment untuk contoh struktur use case yang lengkap
 */

class UpdateService {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(serviceId, userId, updateData) {
    // TODO: Validasi input terlebih dahulu
    // if (!updateData.judul || updateData.judul.length < 10) {
    //   throw new Error('Judul minimal 10 karakter');
    // }

    // TODO: Cek ownership - pastikan ini service milik user
    // const existingService = await this.serviceRepository.findById(serviceId);
    // if (!existingService) {
    //   throw new Error('Service not found');
    // }
    // if (existingService.user_id !== userId) {
    //   throw new Error('Tidak dapat mengubah service milik user lain');
    // }

    // TODO: Generate slug baru jika judul berubah
    // if (updateData.judul && updateData.judul !== existingService.judul) {
    //   updateData.slug = this.generateSlug(updateData.judul);
    // }

    // TODO: Update ke database menggunakan repository
    // const updatedService = await this.serviceRepository.update(serviceId, updateData);

    // TODO: Return hasil update
    // return updatedService;

    throw new Error('Not implemented yet - Silakan implementasikan logic di sini');
  }

  // Helper - bikin slug dari judul
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

module.exports = UpdateService;
