/**
 * Sequelize Order Repository Implementation
 *
 * Implementasi konkrit dari OrderRepository menggunakan Sequelize ORM.
 * Dokumentasi Sequelize: https://sequelize.org/docs/v6/
 */

const Order = require('../../domain/entities/Order');
const { Op } = require('sequelize');

class SequelizeOrderRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
    // Pastikan model Pesanan terdaftar
    this.OrderModel = this.sequelize.models.pesanan || require('../models/OrderModel');

    const { DataTypes } = require('sequelize');
    // Related models (lightweight definitions if not present)
    this.UserModel = this.sequelize.models.User || this.sequelize.define('User', {
      id: { type: DataTypes.UUID, primaryKey: true },
      nama_depan: DataTypes.STRING,
      nama_belakang: DataTypes.STRING,
      avatar: DataTypes.STRING
    }, { tableName: 'users', timestamps: false });

    this.LayananModel = this.sequelize.models.Layanan || this.sequelize.define('Layanan', {
      id: { type: DataTypes.UUID, primaryKey: true },
      judul: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      harga: DataTypes.DECIMAL(10, 2)
    }, { tableName: 'layanan', timestamps: false });

    // Associations (define once)
    if (!this.OrderModel.associations.client) {
      this.OrderModel.belongsTo(this.UserModel, { foreignKey: 'client_id', as: 'client' });
    }
    if (!this.OrderModel.associations.layanan) {
      this.OrderModel.belongsTo(this.LayananModel, { foreignKey: 'layanan_id', as: 'layanan' });
    }
  }

  async create(orderData) {
    const result = await this.OrderModel.create(orderData);
    return result.get({ plain: true });
  }

  async findById(id) {
    // Lazy-require Payment model and set association once
    const PaymentModel = this.sequelize.models.pembayaran || require('../../../payment/infrastructure/models/PaymentModel');
    if (!this.OrderModel.associations.pembayaran) {
      this.OrderModel.hasMany(PaymentModel, { foreignKey: 'pesanan_id', as: 'pembayaran' });
    }

    const result = await this.OrderModel.findByPk(id, {
      attributes: [
        'id', 'nomor_pesanan', 'judul', 'deskripsi', 'catatan_client',
        'status', 'harga', 'biaya_platform', 'total_bayar', 'waktu_pengerjaan',
        'tenggat_waktu', 'dikirim_pada', 'selesai_pada',
        'client_id', 'freelancer_id', 'layanan_id', 'created_at', 'updated_at'
      ],
      include: [
        {
          model: this.UserModel,
          as: 'client',
          attributes: ['id', 'nama_depan', 'nama_belakang', 'avatar']
        },
        {
          model: this.LayananModel,
          as: 'layanan',
          attributes: ['id', 'judul', 'thumbnail', 'harga']
        },
        {
          model: PaymentModel,
          as: 'pembayaran',
          attributes: [
            'id', 'transaction_id', 'nomor_invoice', 'invoice_url',
            'metode_pembayaran', 'channel', 'payment_gateway',
            'jumlah', 'biaya_platform', 'total_bayar', 'status',
            'dibayar_pada', 'kadaluarsa_pada', 'created_at'
          ]
        }
      ]
    });

    if (!result) return null;
    return result.get({ plain: true });
  }

  async findByUserId(userId, filters = {}) {
    const page = Math.max(parseInt(filters.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(filters.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;

    const where = { client_id: userId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.created_from || filters.created_to) {
      where.created_at = {};
      if (filters.created_from) where.created_at[Op.gte] = new Date(filters.created_from);
      if (filters.created_to) where.created_at[Op.lte] = new Date(filters.created_to);
    }

    if (filters.q) {
      where[Op.or] = [
        { nomor_pesanan: { [Op.like]: `%${filters.q}%` } },
        { judul: { [Op.like]: `%${filters.q}%` } }
      ];
    }

    const allowedSort = new Set(['created_at', 'total_bayar', 'harga', 'status', 'tenggat_waktu']);
    const sortBy = allowedSort.has(filters.sortBy) ? filters.sortBy : 'created_at';
    const sortOrder = (filters.sortOrder || 'DESC').toString().toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Lazy-require freelancer User model
    const FreelancerModel = this.sequelize.models.User || this.UserModel;
    if (!this.OrderModel.associations.freelancer) {
      this.OrderModel.belongsTo(FreelancerModel, { foreignKey: 'freelancer_id', as: 'freelancer' });
    }

    const result = await this.OrderModel.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      attributes: [
        'id', 'nomor_pesanan', 'judul', 'status', 'total_bayar', 'harga',
        'waktu_pengerjaan', 'tenggat_waktu', 'created_at', 'updated_at',
        'client_id', 'freelancer_id', 'layanan_id'
      ],
      include: [
        {
          model: FreelancerModel,
          as: 'freelancer',
          attributes: ['id', 'nama_depan', 'nama_belakang', 'avatar']
        },
        {
          model: this.LayananModel,
          as: 'layanan',
          attributes: ['id', 'judul', 'thumbnail', 'harga']
        }
      ]
    });

    return result; // { count, rows }
  }

  async findByPenyediaId(penyediaId, filters = {}) {
    const { Op } = require('sequelize');

    const page = Math.max(parseInt(filters.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(filters.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;

    const where = { freelancer_id: penyediaId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.created_from || filters.created_to) {
      where.created_at = {};
      if (filters.created_from) where.created_at[Op.gte] = new Date(filters.created_from);
      if (filters.created_to) where.created_at[Op.lte] = new Date(filters.created_to);
    }

    if (filters.q) {
      where[Op.or] = [
        { nomor_pesanan: { [Op.like]: `%${filters.q}%` } },
        { judul: { [Op.like]: `%${filters.q}%` } }
      ];
    }

    const allowedSort = new Set(['created_at', 'total_bayar', 'harga', 'status', 'tenggat_waktu']);
    const sortBy = allowedSort.has(filters.sortBy) ? filters.sortBy : 'created_at';
    const sortOrder = (filters.sortOrder || 'DESC').toString().toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const result = await this.OrderModel.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      attributes: [
        'id', 'nomor_pesanan', 'judul', 'status', 'total_bayar', 'harga',
        'waktu_pengerjaan', 'tenggat_waktu', 'created_at', 'updated_at',
        'client_id', 'freelancer_id', 'layanan_id'
      ],
      include: [
        {
          model: this.UserModel,
          as: 'client',
          attributes: ['id', 'nama_depan', 'nama_belakang', 'avatar']
        },
        {
          model: this.LayananModel,
          as: 'layanan',
          attributes: ['id', 'judul', 'thumbnail', 'harga']
        }
      ]
    });

    return result; // { count, rows }
  }

  async findByServiceId(serviceId, filters = {}) {
    const where = { layanan_id: serviceId };

    if (filters.status) {
      where.status = filters.status;
    }

    const result = await this.OrderModel.findAll({
      where,
      attributes: [
        'id', 'nomor_pesanan', 'judul', 'status', 'total_bayar',
        'created_at', 'client_id', 'freelancer_id', 'layanan_id'
      ]
    });

    return result.map(r => r.get({ plain: true }));
  }

  async updateStatus(id, status) {
    await this.OrderModel.update(
      { status },
      { where: { id } }
    );

    return await this.findById(id);
  }

  async cancel(id, reason) {
    await this.OrderModel.update(
      {
        status: 'dibatalkan'
      },
      { where: { id } }
    );

    return await this.findById(id);
  }

  async update(id, orderData) {
    await this.OrderModel.update(orderData, { where: { id } });
    return await this.findById(id);
  }
}

module.exports = SequelizeOrderRepository;
