class GetServiceDetail {
  constructor(serviceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async execute(identifier) {
    try {
      // Check if identifier is UUID or slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
      
      let service;
      if (isUUID) {
        service = await this.serviceRepository.findById(identifier);
      } else {
        service = await this.serviceRepository.findBySlug(identifier);
      }

      if (!service) {
        return {
          success: false,
          error: 'Service not found',
          statusCode: 404
        };
      }

      // Increment view count
      if (service.id) {
        await this.serviceRepository.incrementViews(service.id);
      }

      // Transform data untuk response
      const response = {
        id: service.id,
        judul: service.judul,
        slug: service.slug,
        deskripsi: service.deskripsi,
        harga: parseFloat(service.harga),
        waktu_pengerjaan: service.waktu_pengerjaan,
        batas_revisi: service.batas_revisi,
        thumbnail: service.thumbnail,
        gambar: service.gambar || [],
        rating: {
          rata_rata: parseFloat(service.rating_rata_rata),
          jumlah: service.jumlah_rating
        },
        total_pesanan: service.total_pesanan,
        jumlah_dilihat: service.jumlah_dilihat + 1,
        status: service.status,
        kategori: service.kategori ? {
          id: service.kategori.id,
          nama: service.kategori.nama,
          slug: service.kategori.slug,
          icon: service.kategori.icon
        } : null,
        freelancer: service.freelancer ? {
          id: service.freelancer.id,
          nama: `${service.freelancer.nama_depan} ${service.freelancer.nama_belakang}`,
          avatar: service.freelancer.avatar,
          bio: service.freelancer.bio,
          lokasi: service.freelancer.kota && service.freelancer.provinsi 
            ? `${service.freelancer.kota}, ${service.freelancer.provinsi}`
            : null
        } : null,
        created_at: service.created_at,
        updated_at: service.updated_at
      };

      return {
        success: true,
        data: response
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

module.exports = GetServiceDetail;
