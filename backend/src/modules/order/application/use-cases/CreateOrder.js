class CreateOrder {
  constructor(orderRepository, serviceRepository) {
    this.orderRepository = orderRepository;
    this.serviceRepository = serviceRepository;
  }

  async execute(orderData, userId) {
    try {
      // Validate service exists
      const service = await this.serviceRepository.findById(orderData.layanan_id);
      if (!service) {
        return {
          success: false,
          error: 'Layanan tidak ditemukan',
          statusCode: 404
        };
      }

      // Generate order number
      const nomorPesanan = await this.orderRepository.generateOrderNumber();

      // Calculate pricing
      const harga = parseFloat(orderData.harga || service.harga);
      const biayaPlatform = harga * 0.10; // 10% platform fee
      const totalBayar = harga + biayaPlatform;

      // Calculate deadline
      const waktuPengerjaan = orderData.waktu_pengerjaan || service.waktu_pengerjaan;
      const tenggatWaktu = new Date();
      tenggatWaktu.setDate(tenggatWaktu.getDate() + waktuPengerjaan);

      // Create order
      const order = await this.orderRepository.create({
        nomor_pesanan: nomorPesanan,
        client_id: userId,
        freelancer_id: service.freelancer_id,
        layanan_id: service.id,
        paket_id: orderData.paket_id || null,
        judul: orderData.judul || service.judul,
        deskripsi: orderData.deskripsi || service.deskripsi,
        catatan_client: orderData.catatan_client || null,
        harga: harga,
        biaya_platform: biayaPlatform,
        total_bayar: totalBayar,
        waktu_pengerjaan: waktuPengerjaan,
        tenggat_waktu: tenggatWaktu,
        status: 'menunggu_pembayaran',
        lampiran_client: orderData.lampiran_client || null
      });

      return {
        success: true,
        data: {
          id: order.id,
          nomor_pesanan: order.nomor_pesanan,
          status: order.status,
          total_bayar: parseFloat(order.total_bayar)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        statusCode: 500
      };
    }
  }
}

module.exports = CreateOrder;
