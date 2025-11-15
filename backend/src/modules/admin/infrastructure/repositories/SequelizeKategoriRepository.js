const Kategori = require('../models/Kategori');
const SubKategori = require('../models/SubKategori');

class SequelizeKategoriRepository {
  async findAll() {
    return await Kategori.findAll({
      order: [['nama', 'ASC']]
    });
  }

  // ✅ GANTI id_kategori jadi id
  async findById(id) {
    return await Kategori.findOne({
      where: { id }  // ✅ Ganti dari id_kategori
    });
  }

  async findByNama(nama) {
    return await Kategori.findOne({
      where: { nama }
    });
  }

  async findBySlug(slug) {
    return await Kategori.findOne({
      where: { slug }
    });
  }

  async findActive() {
    return await Kategori.findAll({
      where: { is_active: true },
      order: [['nama', 'ASC']]
    });
  }

  async create(kategoriEntity) {
    return await Kategori.create(kategoriEntity.toJSON());
  }

  // ✅ GANTI id_kategori jadi id
  async update(id, updateData) {
    await Kategori.update(updateData, {
      where: { id }  // ✅ Ganti dari id_kategori
    });

    return await this.findById(id);
  }

  // ✅ GANTI id_kategori jadi id
  async delete(id) {
    // CASCADE akan otomatis menghapus sub kategori
    return await Kategori.destroy({
      where: { id }  // ✅ Ganti dari id_kategori
    });
  }

  async countAll() {
    return await Kategori.count();
  }

  async countActive() {
    return await Kategori.count({
      where: { is_active: true }
    });
  }

  // ✅ GANTI id_kategori jadi id (parameter)
  // TAPI tetap pakai kategori_id untuk foreign key di SubKategori
  async hasActiveSubKategori(id) {
    const count = await SubKategori.count({
      where: {
        kategori_id: id,  // ✅ Ini foreign key, tetap kategori_id
        is_active: true
      }
    });
    return count > 0;
  }
}

module.exports = SequelizeKategoriRepository;