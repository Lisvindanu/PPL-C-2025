class GetServiceList {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(filters) {
    try {
      const result = await this.serviceRepository.findAll(filters);
      
      // Transform data untuk response
      const services = result.services.map(service => ({
        id: service.id,
        judul: service.judul,
        slug: service.slug,
        deskripsi: service.deskripsi.substring(0, 150) + '...', // Truncate description
        harga: parseFloat(service.harga),
        waktu_pengerjaan: service.waktu_pengerjaan,
        batas_revisi: service.batas_revisi,
        thumbnail: service.thumbnail,
        rating: {
          rata_rata: parseFloat(service.rating_rata_rata),
          jumlah: service.jumlah_rating
        },
        total_pesanan: service.total_pesanan,
        kategori: service.kategori ? {
          id: service.kategori.id,
          nama: service.kategori.nama,
          slug: service.kategori.slug
        } : null,
        freelancer: service.freelancer ? {
          id: service.freelancer.id,
          nama: `${service.freelancer.nama_depan} ${service.freelancer.nama_belakang}`,
          avatar: service.freelancer.avatar
        } : null
      }));

      return {
        success: true,
        data: {
          services,
          pagination: result.pagination
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = GetServiceList;
