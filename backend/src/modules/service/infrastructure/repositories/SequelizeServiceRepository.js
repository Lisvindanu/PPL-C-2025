const { ServiceModel, KategoriModel, UserModel } = require('../models');
const { Op } = require('sequelize');

class SequelizeServiceRepository {
  async findAll(filters = {}) {
    const {
      search,
      kategori,
      minPrice,
      maxPrice,
      minRating,
      status = 'aktif',
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 10
    } = filters;

    const where = { status };
    
    // Search by title or description
    if (search) {
      where[Op.or] = [
        { judul: { [Op.like]: `%${search}%` } },
        { deskripsi: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by category
    if (kategori) {
      where.kategori_id = kategori;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.harga = {};
      if (minPrice) where.harga[Op.gte] = minPrice;
      if (maxPrice) where.harga[Op.lte] = maxPrice;
    }

    // Filter by rating
    if (minRating) {
      where.rating_rata_rata = { [Op.gte]: minRating };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await ServiceModel.findAndCountAll({
      where,
      include: [
        {
          model: KategoriModel,
          as: 'kategori',
          attributes: ['id', 'nama', 'slug']
        },
        {
          model: UserModel,
          as: 'freelancer',
          attributes: ['id', 'nama_depan', 'nama_belakang', 'avatar']
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    return {
      services: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async findById(id) {
    return await ServiceModel.findByPk(id, {
      include: [
        {
          model: KategoriModel,
          as: 'kategori',
          attributes: ['id', 'nama', 'slug', 'icon']
        },
        {
          model: UserModel,
          as: 'freelancer',
          attributes: ['id', 'nama_depan', 'nama_belakang', 'avatar', 'bio', 'kota', 'provinsi']
        }
      ]
    });
  }

  async findBySlug(slug) {
    return await ServiceModel.findOne({
      where: { slug },
      include: [
        {
          model: KategoriModel,
          as: 'kategori',
          attributes: ['id', 'nama', 'slug', 'icon']
        },
        {
          model: UserModel,
          as: 'freelancer',
          attributes: ['id', 'nama_depan', 'nama_belakang', 'avatar', 'bio', 'kota', 'provinsi']
        }
      ]
    });
  }

  async incrementViews(id) {
    const service = await ServiceModel.findByPk(id);
    if (service) {
      service.jumlah_dilihat = service.jumlah_dilihat + 1;
      await service.save();
    }
    return service;
  }
}

module.exports = SequelizeServiceRepository;
