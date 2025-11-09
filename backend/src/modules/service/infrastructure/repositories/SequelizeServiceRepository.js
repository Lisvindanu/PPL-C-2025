/**
 * Sequelize Service Repository Implementation
 * Database implementation untuk Service Repository
 */

const Service = require('../../domain/entities/Service');
const { Op } = require('sequelize');

class SequelizeServiceRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
    
    // Define models
    const { DataTypes } = require('sequelize');
    
    // User Model
    this.UserModel = sequelize.models.User || sequelize.define('User', {
      id: { type: DataTypes.UUID, primaryKey: true },
      nama_depan: DataTypes.STRING,
      nama_belakang: DataTypes.STRING,
      email: DataTypes.STRING,
      no_telepon: DataTypes.STRING,
      avatar: DataTypes.STRING,
      bio: DataTypes.TEXT,
      kota: DataTypes.STRING
    }, {
      tableName: 'users',
      timestamps: false
    });
    
    // Kategori Model
    this.KategoriModel = sequelize.models.Kategori || sequelize.define('Kategori', {
      id: { type: DataTypes.UUID, primaryKey: true },
      nama: DataTypes.STRING,
      slug: DataTypes.STRING,
      icon: DataTypes.STRING
    }, {
      tableName: 'kategori',
      timestamps: false
    });
    
    // Layanan Model
    this.LayananModel = sequelize.models.Layanan || sequelize.define('Layanan', {
      id: { type: DataTypes.UUID, primaryKey: true },
      freelancer_id: DataTypes.UUID,
      kategori_id: DataTypes.UUID,
      judul: DataTypes.STRING,
      slug: DataTypes.STRING,
      deskripsi: DataTypes.TEXT,
      harga: DataTypes.DECIMAL(10, 2),
      waktu_pengerjaan: DataTypes.INTEGER,
      batas_revisi: DataTypes.INTEGER,
      thumbnail: DataTypes.STRING,
      gambar: {
        type: DataTypes.JSON,
        get() {
          const rawValue = this.getDataValue('gambar');
          return rawValue ? (typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue) : [];
        }
      },
      rating_rata_rata: DataTypes.DECIMAL(3, 2),
      jumlah_rating: DataTypes.INTEGER,
      total_pesanan: DataTypes.INTEGER,
      jumlah_dilihat: DataTypes.INTEGER,
      status: DataTypes.ENUM('draft', 'aktif', 'nonaktif')
    }, {
      tableName: 'layanan',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    
    // Setup associations
    this.LayananModel.belongsTo(this.UserModel, {
      foreignKey: 'freelancer_id',
      as: 'freelancer'
    });
    
    this.LayananModel.belongsTo(this.KategoriModel, {
      foreignKey: 'kategori_id',
      as: 'kategori'
    });
  }

  async create(serviceData) {
    // TODO: Implement service creation
    // Will create record in 'layanan' table
    throw new Error('Not implemented yet - Service creation will be added in future sprint');
  }

  async findById(id) {
    try {
      const layanan = await this.LayananModel.findByPk(id, {
        include: [
          {
            model: this.UserModel,
            as: 'freelancer',
            attributes: ['id', 'nama_depan', 'nama_belakang', 'email', 'no_telepon', 'avatar', 'bio', 'kota']
          },
          {
            model: this.KategoriModel,
            as: 'kategori',
            attributes: ['id', 'nama', 'slug', 'icon']
          }
        ]
      });

      if (!layanan) {
        return null;
      }

      return this.toDomainEntity(layanan);
    } catch (error) {
      throw new Error(`Error finding service by ID: ${error.message}`);
    }
  }

  async findBySlug(slug) {
    // TODO: Implement find by slug
    throw new Error('Not implemented yet - Service search by slug will be added in future sprint');
  }

  async findByUserId(userId, filters = {}) {
    // TODO: Implement find all services by user
    throw new Error('Not implemented yet - User services listing will be added in future sprint');
  }

  async findAll(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'DESC' } = pagination;
      const { kategori_id, harga_min, harga_max, rating_min, status = 'aktif' } = filters;

      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause = { status };

      if (kategori_id) {
        whereClause.kategori_id = kategori_id;
      }

      if (harga_min || harga_max) {
        whereClause.harga = {};
        if (harga_min) whereClause.harga[Op.gte] = harga_min;
        if (harga_max) whereClause.harga[Op.lte] = harga_max;
      }

      if (rating_min) {
        whereClause.rating_rata_rata = { [Op.gte]: rating_min };
      }

      // Query with Sequelize ORM
      const { count, rows } = await this.LayananModel.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: this.UserModel,
            as: 'freelancer',
            attributes: ['id', 'nama_depan', 'nama_belakang', 'avatar', 'kota']
          },
          {
            model: this.KategoriModel,
            as: 'kategori',
            attributes: ['id', 'nama', 'slug']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder]],
        distinct: true
      });

      // Convert to domain entities
      const services = rows.map(layanan => this.toDomainEntity(layanan));

      return {
        services,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      throw new Error(`Error finding all services: ${error.message}`);
    }
  }

  async update(id, serviceData) {
    // TODO: Implement service update
    throw new Error('Not implemented yet - Service update will be added in future sprint');
  }

  async delete(id) {
    // TODO: Implement soft delete (set is_active = false)
    throw new Error('Not implemented yet - Service deletion will be added in future sprint');
  }

  async search(keyword, filters = {}, pagination = {}) {
    // TODO: Implement full-text search on judul and deskripsi
    // Combined with filters (kategori, harga, lokasi, rating)
    throw new Error('Not implemented yet - Service search will be added in future sprint');
  }

  async updateStatus(id, status, reason = null) {
    // TODO: Implement status update (for admin approval/rejection)
    throw new Error('Not implemented yet - Status management will be added in future sprint');
  }

  async updateRating(id, newRating, reviewCount) {
    // TODO: Implement rating update when new review added
    throw new Error('Not implemented yet - Rating update will be added in future sprint');
  }

  async incrementOrderCount(id) {
    // TODO: Implement order counter increment
    throw new Error('Not implemented yet - Order tracking will be added in future sprint');
  }

  /**
   * Convert Sequelize model to Domain Entity
   */
  toDomainEntity(layananModel) {
    const plain = layananModel.get({ plain: true });
    
    // Parse gambar JSON if needed
    let gambar = [];
    try {
      gambar = plain.gambar ? (typeof plain.gambar === 'string' ? JSON.parse(plain.gambar) : plain.gambar) : [];
    } catch (e) {
      gambar = [];
    }
    
    return new Service({
      id: plain.id,
      user_id: plain.freelancer_id,
      kategori_id: plain.kategori_id,
      sub_kategori_id: null,
      judul: plain.judul,
      slug: plain.slug,
      deskripsi: plain.deskripsi,
      harga_minimum: parseFloat(plain.harga),
      harga_maksimum: parseFloat(plain.harga),
      durasi_estimasi: plain.waktu_pengerjaan,
      satuan_durasi: 'hari',
      lokasi: null,
      area_layanan: [],
      foto_layanan: gambar,
      status: plain.status === 'aktif' ? 'active' : plain.status,
      alasan_ditolak: null,
      rating_rata_rata: parseFloat(plain.rating_rata_rata) || 0,
      jumlah_review: plain.jumlah_rating || 0,
      total_pesanan: plain.total_pesanan || 0,
      is_active: plain.status === 'aktif',
      created_at: plain.created_at,
      updated_at: plain.updated_at,
      // Include relations
      freelancer: plain.freelancer,
      kategori: plain.kategori,
      thumbnail: plain.thumbnail,
      waktu_pengerjaan: plain.waktu_pengerjaan,
      batas_revisi: plain.batas_revisi,
      jumlah_dilihat: plain.jumlah_dilihat
    });
  }
}

module.exports = SequelizeServiceRepository;
