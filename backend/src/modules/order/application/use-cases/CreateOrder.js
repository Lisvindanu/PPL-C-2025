/**
 * Create Order Use Case
 *
 * Flow pembuatan order:
 * 1. Validasi service exist dan active
 * 2. Validasi user tidak bisa order service sendiri
 * 3. Validasi paket exist jika ada paket_id
 * 4. Generate nomor pesanan unik
 * 5. Hitung biaya platform dan total bayar
 * 6. Create order dengan status 'menunggu_pembayaran'
 * 7. Return order yang baru dibuat
 *
 * Setelah order dibuat, user harus langsung create payment
 */

class CreateOrder {
  constructor(orderRepository, serviceRepository, paketRepository = null) {
    this.orderRepository = orderRepository;
    this.serviceRepository = serviceRepository;
    this.paketRepository = paketRepository;
  }

  async execute(userId, orderData) {
    // orderData: { layanan_id, paket_id (optional), catatan_client }

    // Validasi service exist
    const service = await this.serviceRepository.findById(orderData.layanan_id);
    if (!service) {
      const error = new Error('Service tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    // Validasi service aktif
    if (service.status !== 'aktif') {
      const error = new Error('Service tidak tersedia atau sudah tidak aktif');
      error.statusCode = 400;
      throw error;
    }

    // Validasi user tidak order service sendiri
    if (service.freelancer_id === userId) {
      const error = new Error('Anda tidak dapat memesan layanan sendiri');
      error.statusCode = 400;
      throw error;
    }

    // Ambil data paket jika ada
    let paket = null;
    let harga = service.harga;
    let waktuPengerjaan = service.waktu_pengerjaan;

    if (orderData.paket_id && this.paketRepository) {
      paket = await this.paketRepository.findById(orderData.paket_id);
      if (!paket || paket.layanan_id !== orderData.layanan_id) {
        const error = new Error('Paket tidak valid untuk layanan ini');
        error.statusCode = 400;
        throw error;
      }
      harga = paket.harga;
      waktuPengerjaan = paket.waktu_pengerjaan;
    }

    // Generate nomor pesanan
    const nomorPesanan = this.generateOrderNumber();

    // Hitung biaya platform (10%)
    const biayaPlatform = Math.floor(harga * 0.1);
    const totalBayar = parseFloat(harga) + biayaPlatform;

    // Hitung tenggat waktu
    const tenggat = new Date();
    tenggat.setDate(tenggat.getDate() + waktuPengerjaan);

    // Create order
    const order = await this.orderRepository.create({
      nomor_pesanan: nomorPesanan,
      client_id: userId,
      freelancer_id: service.freelancer_id,
      layanan_id: orderData.layanan_id,
      paket_id: orderData.paket_id || null,
      judul: service.judul,
      deskripsi: service.deskripsi,
      catatan_client: orderData.catatan_client || null,
      harga: harga,
      biaya_platform: biayaPlatform,
      total_bayar: totalBayar,
      waktu_pengerjaan: waktuPengerjaan,
      tenggat_waktu: tenggat,
      status: 'menunggu_pembayaran'
    });

    return order;
  }

  generateOrderNumber() {
    // Format: PES-YYYY-XXXXX
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 90000) + 10000;
    return `PES-${year}-${String(random).padStart(5, '0')}`;
  }
}

module.exports = CreateOrder;
