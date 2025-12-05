class CreateKategoriDto {
  constructor(data) {
    this.nama = data.nama?.trim();
    this.deskripsi = data.deskripsi?.trim() || null;
    this.icon = data.icon?.trim() || null;
  }

  validate() {
    const errors = [];

    if (!this.nama) {
      errors.push('Nama kategori wajib diisi');
    } else if (this.nama.length < 3) {
      errors.push('Nama kategori minimal 3 karakter');
    } else if (this.nama.length > 100) {
      errors.push('Nama kategori maksimal 100 karakter');
    }

    if (this.deskripsi && this.deskripsi.length > 500) {
      errors.push('Deskripsi maksimal 500 karakter');
    }

    if (this.icon) {
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg|webp)$/i;
      if (!urlPattern.test(this.icon)) {
        errors.push('Icon harus berupa URL gambar yang valid');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

class UpdateKategoriDto {
  constructor(data) {
    this.nama = data.nama?.trim();
    this.deskripsi = data.deskripsi !== undefined ? data.deskripsi?.trim() : undefined;
    this.icon = data.icon !== undefined ? data.icon?.trim() : undefined;
  }

  validate() {
    const errors = [];

    if (this.nama !== undefined) {
      if (!this.nama || this.nama.length === 0) {
        errors.push('Nama kategori tidak boleh kosong');
      } else if (this.nama.length < 3) {
        errors.push('Nama kategori minimal 3 karakter');
      } else if (this.nama.length > 100) {
        errors.push('Nama kategori maksimal 100 karakter');
      }
    }

    if (this.deskripsi !== undefined && this.deskripsi && this.deskripsi.length > 500) {
      errors.push('Deskripsi maksimal 500 karakter');
    }

    if (this.icon !== undefined && this.icon) {
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg|webp)$/i;
      if (!urlPattern.test(this.icon)) {
        errors.push('Icon harus berupa URL gambar yang valid');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

class KategoriResponseDto {
  constructor(kategori) {
    this.id_kategori = kategori.id_kategori;
    this.nama = kategori.nama;
    this.slug = kategori.slug;
    this.deskripsi = kategori.deskripsi;
    this.icon = kategori.icon;
    this.is_active = kategori.is_active;
    this.created_at = kategori.created_at;
    this.updated_at = kategori.updated_at;
  }
}

class KategoriStatsDto {
  constructor(kategori, stats) {
    this.id_kategori = kategori.id_kategori;
    this.nama = kategori.nama;
    this.slug = kategori.slug;
    this.is_active = kategori.is_active;
    this.stats = {
      total_layanan: stats.total_layanan || 0,
      active_layanan: stats.active_layanan || 0,
      total_pesanan: stats.total_pesanan || 0,
      completed_pesanan: stats.completed_pesanan || 0,
      average_rating: parseFloat(stats.average_rating || 0).toFixed(2),
      total_revenue: stats.total_revenue || 0
    };
  }
}

module.exports = {
  CreateKategoriDto,
  UpdateKategoriDto,
  KategoriResponseDto,
  KategoriStatsDto
};