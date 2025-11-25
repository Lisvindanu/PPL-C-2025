const Kategori = require('../models/Kategori');
const SubKategori = require('../models/SubKategori');
const { Op, Sequelize } = require('sequelize');

class SequelizeKategoriRepository {

  async findAll(options = {}) {
     console.log("🟡 REPO - OPTIONS MASUK:", options);
    const { status, search, sortBy = 'nama', sortOrder = 'ASC' } = options;

    const where = {};

    // ================================
    // 1. STATUS FILTER 
    // ================================
    if (status === 'aktif') {
      where.is_active = true;
    } else if (status === 'nonaktif') {
      where.is_active = false;
    }

    // ================================
    // 2. SEARCH 
    // ================================
    if (search) {
      const keyword = `%${search.toLowerCase()}%`;

      where[Op.or] = [
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('nama')),
          {
            [Op.like]: keyword
          }
        ),
      ];
    }

    // EXECUTE QUERY
    return await Kategori.findAll({
      where,
      order: [[sortBy, sortOrder]],
    });
  }

  async findById(id) {
    return await Kategori.findOne({ where: { id } });
  }

  async findByNama(nama) {
    return await Kategori.findOne({ where: { nama } });
  }

  async findBySlug(slug) {
    return await Kategori.findOne({ where: { slug } });
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

  async update(id, updateData) {
    await Kategori.update(updateData, { where: { id } });
    return await this.findById(id);
  }

  async delete(id) {
    return await Kategori.destroy({ where: { id } });
  }

  async countAll() {
    return await Kategori.count();
  }

  async countActive() {
    return await Kategori.count({
      where: { is_active: true }
    });
  }

  async hasActiveSubKategori(id) {
    const count = await SubKategori.count({
      where: {
        kategori_id: id,
        is_active: true
      }
    });

    return count > 0;
  }
}

module.exports = SequelizeKategoriRepository;
