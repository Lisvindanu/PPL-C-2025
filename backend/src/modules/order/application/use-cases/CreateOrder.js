/**
 * Create Order Use Case
 *
 * Ini logic paling penting di modul order.
 * Jangan sampe user bisa order service yang ga exist atau yang inactive.
 *
 * Flow pembuatan order:
 * 1. Validasi service exist dan active
 * 2. Validasi user ga bisa order service sendiri (jangan order layanan sendiri tolol)
 * 3. Generate nomor pesanan unik (misal: ORD-20240101-XXXXX)
 * 4. Validasi harga yang disepakati masih dalam range (min-max)
 * 5. Create order dengan status 'pending'
 * 6. (Opsional) Kirim notifikasi ke penyedia layanan
 * 7. Return order yang baru dibuat
 *
 * Setelah order dibuat, user harus langsung create payment (modul 4)
 */

class CreateOrder {
  constructor(orderRepository, serviceRepository, notificationService = null) {
    this.orderRepository = orderRepository;
    this.serviceRepository = serviceRepository;
    this.notificationService = notificationService;
  }

  async execute(userId, orderData) {
    // orderData: { layanan_id, harga_disepakati, tanggal_mulai, durasi_estimasi, catatan_pembeli }

    // TODO: Validasi service exist dan active
    // const service = await this.serviceRepository.findById(orderData.layanan_id);
    // if (!service || !service.isActive()) {
    //   throw new Error('Service tidak tersedia atau sudah tidak aktif');
    // }

    // TODO: Validasi user ga order service sendiri
    // if (service.user_id === userId) {
    //   throw new Error('Lu ga bisa order layanan sendiri, ngapain sih');
    // }

    // TODO: Validasi harga dalam range
    // if (orderData.harga_disepakati < service.harga_minimum ||
    //     orderData.harga_disepakati > service.harga_maksimum) {
    //   throw new Error(`Harga harus antara ${service.harga_minimum} - ${service.harga_maksimum}`);
    // }

    // TODO: Generate nomor pesanan
    // const nomorPesanan = this.generateOrderNumber();

    // TODO: Create order
    // const order = await this.orderRepository.create({
    //   nomor_pesanan: nomorPesanan,
    //   user_id: userId,
    //   layanan_id: orderData.layanan_id,
    //   penyedia_id: service.user_id,
    //   judul_pesanan: service.judul,
    //   deskripsi_pesanan: service.deskripsi,
    //   harga_disepakati: orderData.harga_disepakati,
    //   tanggal_mulai: orderData.tanggal_mulai,
    //   durasi_estimasi: orderData.durasi_estimasi,
    //   lokasi_pengerjaan: orderData.lokasi_pengerjaan || service.lokasi,
    //   catatan_pembeli: orderData.catatan_pembeli,
    //   status: 'pending'
    // });

    // TODO: Kirim notifikasi ke penyedia
    // if (this.notificationService) {
    //   await this.notificationService.sendNewOrderNotification(service.user_id, order);
    // }

    // return order;

    throw new Error('Not implemented yet - Kerjain, ini modul penting banget');
  }

  generateOrderNumber() {
    // Format: ORD-YYYYMMDD-XXXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 90000) + 10000;
    return `ORD-${dateStr}-${random}`;
  }
}

module.exports = CreateOrder;
