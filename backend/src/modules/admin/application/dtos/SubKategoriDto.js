class CreateSubKategoriDto {
  constructor(data) {
    this.id_kategori = data.id_kategori?.trim() || data.kategori_id?.trim();
    this.nama = data.nama?.trim();
    this.deskripsi = data.deskripsi?.trim() || null;
    this.icon = data.icon?.trim() || null;
  }

  validate() {
    const errors = [];
    if (!this.id_kategori) errors.push('Kategori parent wajib dipilih');
    if (!this.nama) errors.push('Nama sub kategori wajib diisi');
    return { isValid: errors.length === 0, errors };
  }
}

class UpdateSubKategoriDto {
  constructor(data) {
    this.id_kategori = data.id_kategori?.trim() || data.kategori_id?.trim();
    this.nama = data.nama?.trim();
    this.deskripsi = data.deskripsi ?? null;
    this.icon = data.icon ?? null;
  }
  validate() {
    const errors = [];
    if (this.nama && this.nama.length < 3) errors.push('Nama sub kategori minimal 3 karakter');
    return { isValid: errors.length === 0, errors };
  }
}

class SubKategoriResponseDto {
  constructor(subKategori) {
    this.id_sub_kategori = subKategori.id_sub_kategori;
    this.id_kategori = subKategori.id_kategori;
    this.nama = subKategori.nama;
    this.slug = subKategori.slug;
    this.deskripsi = subKategori.deskripsi;
    this.icon = subKategori.icon;
    this.is_active = subKategori.is_active;
    this.created_at = subKategori.created_at;
    this.updated_at = subKategori.updated_at;
  }
}

module.exports = { CreateSubKategoriDto, UpdateSubKategoriDto, SubKategoriResponseDto };
