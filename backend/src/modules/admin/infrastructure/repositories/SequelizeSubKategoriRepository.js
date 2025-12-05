const Kategori = require('../models/Kategori');
const SubKategori = require('../models/SubKategori');
const { Op, Sequelize } = require('sequelize');

class SequelizeSubKategoriRepository {
  
  async findAll(options = {}) {
    try {
      console.log("🟡 REPO SubKategori - OPTIONS MASUK:", options);
      
      const { 
        status, 
        search, 
        kategoriId,
        sortBy = 'nama', 
        sortOrder = 'ASC',
        includeKategori = true 
      } = options;

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
      // 2. KATEGORI FILTER
      // ================================
      if (kategoriId) {
        where.id_kategori = kategoriId;
      }

      // ================================
      // 3. SEARCH 
      // ================================
      if (search) {
        const keyword = `%${search.toLowerCase()}%`;
        
        where[Op.or] = [
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('SubKategori.nama')),
            { [Op.like]: keyword }
          ),
        ];
      }

      // ================================
      // 4. BUILD QUERY OPTIONS
      // ================================
      const queryOptions = {
        where,
        order: [[sortBy, sortOrder]]
      };

      if (includeKategori) {
        queryOptions.include = [{
          model: Kategori,
          as: 'kategori',
          attributes: ['id', 'nama', 'slug', 'is_active'],
          required: false // LEFT JOIN
        }];
      }

      const result = await SubKategori.findAll(queryOptions);
      
      console.log('📦 SubKategori found:', result.length);
      
      return result;
    } catch (error) {
      console.error('❌ Error in findAll SubKategori:', error);
      throw error;
    }
  }

  /**
   * Find sub kategori by ID
   */
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

  /**
   * Find sub kategori by kategori ID
   */
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

  /**
   * Find sub kategori by slug
   */
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

  /**
   * Find sub kategori by nama
   */
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

  /**
   * Find active sub kategori
   */
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
          required: true // INNER JOIN
        }],
        order: [['nama', 'ASC']]
      });
    } catch (error) {
      console.error('❌ Error in findActive:', error);
      throw error;
    }
  }

  /**
   * Create new sub kategori
   */
  async create(subKategoriData) {
    try {
      const data = subKategoriData.toJSON ? subKategoriData.toJSON() : subKategoriData;
      return await SubKategori.create(data);
    } catch (error) {
      console.error('❌ Error in create:', error);
      throw error;
    }
  }

  /**
   * Update sub kategori
   */
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

  /**
   * Delete sub kategori
   */
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

  /**
   * Count sub kategori by kategori
   */
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