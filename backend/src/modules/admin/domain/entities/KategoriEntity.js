// domain/entities/KategoriEntity.js

class KategoriEntity {
  constructor({
    id_kategori,
    nama,
    slug,
    deskripsi,
    icon,
    is_active = true,
    created_at = new Date(),
    updated_at = new Date()
  }) {
    this.id_kategori = id_kategori;
    this.nama = nama;
    this.slug = slug;
    this.deskripsi = deskripsi;
    this.icon = icon;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Validasi nama kategori
  static validateNama(nama) {
    if (!nama || nama.trim().length === 0) {
      throw new Error('Nama kategori tidak boleh kosong');
    }
    if (nama.length < 3) {
      throw new Error('Nama kategori minimal 3 karakter');
    }
    if (nama.length > 100) {
      throw new Error('Nama kategori maksimal 100 karakter');
    }
    return true;
  }

  // Generate slug dari nama
  static generateSlug(nama) {
    return nama
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Hapus karakter spesial
      .replace(/\s+/g, '-') // Ganti spasi dengan dash
      .replace(/--+/g, '-') // Ganti multiple dash dengan single
      .replace(/^-+|-+$/g, ''); // Hapus dash di awal/akhir
  }

  // Validasi deskripsi
  static validateDeskripsi(deskripsi) {
    if (deskripsi && deskripsi.length > 500) {
      throw new Error('Deskripsi maksimal 500 karakter');
    }
    return true;
  }

  // Validasi icon URL
  static validateIcon(icon) {
    if (!icon || icon.trim().length === 0) {
      return true; // Icon optional
    }
    
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg|webp)$/i;
    if (!urlPattern.test(icon)) {
      throw new Error('Icon harus berupa URL gambar yang valid');
    }
    return true;
  }

  // Method untuk aktivasi/deaktivasi
  activate() {
    this.is_active = true;
    this.updated_at = new Date();
  }

  deactivate() {
    this.is_active = false;
    this.updated_at = new Date();
  }

  // Convert to plain object
  toJSON() {
    return {
      id_kategori: this.id_kategori,
      nama: this.nama,
      slug: this.slug,
      deskripsi: this.deskripsi,
      icon: this.icon,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = KategoriEntity;