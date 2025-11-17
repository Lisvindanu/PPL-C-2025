// domain/entities/SubKategoriEntity.js

class SubKategoriEntity {
  constructor({
    id_sub_kategori,
    id_kategori,
    nama,
    slug,
    deskripsi,
    icon,
    is_active = true,
    created_at = new Date(),
    updated_at = new Date()
  }) {
    this.id_sub_kategori = id_sub_kategori;
    this.id_kategori = id_kategori;
    this.nama = nama;
    this.slug = slug;
    this.deskripsi = deskripsi;
    this.icon = icon;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Validasi nama sub kategori
  static validateNama(nama) {
    if (!nama || nama.trim().length === 0) {
      throw new Error('Nama sub kategori tidak boleh kosong');
    }
    if (nama.length < 3) {
      throw new Error('Nama sub kategori minimal 3 karakter');
    }
    if (nama.length > 100) {
      throw new Error('Nama sub kategori maksimal 100 karakter');
    }
    return true;
  }

  // Generate slug dari nama
  static generateSlug(nama) {
    return nama
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Validasi kategori parent
  static validateKategoriParent(id_kategori) {
    if (!id_kategori) {
      throw new Error('Kategori parent harus dipilih');
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
      id_sub_kategori: this.id_sub_kategori,
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

module.exports = SubKategoriEntity;