// infrastructure/repositories/SequelizeSubKategoriRepository.js

const Kategori = require('../models/Kategori');
const SubKategori = require('../models/SubKategori');

class SequelizeSubKategoriRepository {
  async findAll(includeKategori = false) {
    try {
      const options = {
        order: [['nama', 'ASC']]
      };

      if (includeKategori) {
        options.include = [{
          model: Kategori,
          as: 'kategori',
          attributes: ['id', 'nama', 'slug', 'is_active'],
          required: false // ✅ LEFT JOIN (jika kategori null tetap muncul)
        }];
      }

      const result = await SubKategori.findAll(options);
      
      console.log('📦 SubKategori found:', result.length);
      
      return result;
    } catch (error) {
      console.error('❌ Error in findAll:', error);
      throw error;
    }
  }

  async findById(id_sub_kategori, includeKategori = false) {
    try {
      const options = {
        where: { id: id_sub_kategori }
      };

      if (includeKategori) {
        options.include = [{
          model: Kategori,
          as: 'kategori',
          attributes: ['id', 'nama', 'slug', 'is_active'],
          required: false
        }];
      }

      return await SubKategori.findOne(options);
    } catch (error) {
      console.error('❌ Error in findById:', error);
      throw error;
    }
  }

  async findByKategori(id_kategori, includeKategori = true) {
    try {
      const options = {
        where: { id_kategori },
        order: [['nama', 'ASC']]
      };

      if (includeKategori) {
        options.include = [{
          model: Kategori,
          as: 'kategori',
          attributes: ['id', 'nama', 'slug', 'is_active'],
          required: false
        }];
      }

      return await SubKategori.findAll(options);
    } catch (error) {
      console.error('❌ Error in findByKategori:', error);
      throw error;
    }
  }

  async findBySlug(slug, includeKategori = false) {
    try {
      const options = {
        where: { slug }
      };

      if (includeKategori) {
        options.include = [{
          model: Kategori,
          as: 'kategori',
          attributes: ['id', 'nama', 'slug', 'is_active'],
          required: false
        }];
      }

      return await SubKategori.findOne(options);
    } catch (error) {
      console.error('❌ Error in findBySlug:', error);
      throw error;
    }
  }

  async findByNama(nama) {
    try {
      return await SubKategori.findOne({
        where: { nama }
      });
    } catch (error) {
      console.error('❌ Error in findByNama:', error);
      throw error;
    }
  }

  async findActive(id_kategori = null) {
    try {
      const where = { is_active: true };
      if (id_kategori) {
        where.id_kategori = id_kategori;
      }

      return await SubKategori.findAll({
        where,
        include: [{
          model: Kategori,
          as: 'kategori',
          attributes: ['id', 'nama', 'slug', 'is_active'],
          where: { is_active: true },
          required: true // ✅ INNER JOIN (hanya kategori aktif)
        }],
        order: [['nama', 'ASC']]
      });
    } catch (error) {
      console.error('❌ Error in findActive:', error);
      throw error;
    }
  }

  async create(subKategoriData) {
    try {
      const data = subKategoriData.toJSON ? subKategoriData.toJSON() : subKategoriData;
      return await SubKategori.create(data);
    } catch (error) {
      console.error('❌ Error in create:', error);
      throw error;
    }
  }

  async update(id_sub_kategori, updateData) {
    try {
      const [affectedRows] = await SubKategori.update(updateData, {
        where: { id: id_sub_kategori }
      });

      if (affectedRows === 0) {
        return null;
      }

      return await this.findById(id_sub_kategori, true);
    } catch (error) {
      console.error('❌ Error in update:', error);
      throw error;
    }
  }

  async delete(id_sub_kategori) {
    try {
      const deleted = await SubKategori.destroy({
        where: { id: id_sub_kategori }
      });

      return deleted > 0;
    } catch (error) {
      console.error('❌ Error in delete:', error);
      throw error;
    }
  }

  async countByKategori(id_kategori) {
    try {
      return await SubKategori.count({
        where: { id_kategori }
      });
    } catch (error) {
      console.error('❌ Error in countByKategori:', error);
      throw error;
    }
  }
}

module.exports = SequelizeSubKategoriRepository;