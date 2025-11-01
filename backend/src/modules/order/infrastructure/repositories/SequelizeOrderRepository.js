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
    // Model akan di-load dari sequelize.models setelah sync
  }

  async create(orderData) {
    // TODO: Implementasi create order
    // const result = await this.sequelize.models.Pesanan.create(orderData);
    // return new Order(result.toJSON());

    throw new Error('Not implemented - Silakan implementasikan dengan Sequelize create()');
  }

  async findById(id) {
    // TODO: Implementasi find by ID dengan include relations
    // const result = await this.sequelize.models.Pesanan.findByPk(id, {
    //   include: [
    //     { model: this.sequelize.models.User, as: 'pembeli' },
    //     { model: this.sequelize.models.User, as: 'penyedia' },
    //     { model: this.sequelize.models.Layanan, as: 'layanan' },
    //     { model: this.sequelize.models.Pembayaran, as: 'pembayaran' }
    //   ]
    // });
    //
    // if (!result) return null;
    // return new Order(result.toJSON());

    throw new Error('Not implemented - Gunakan findByPk dengan include');
  }

  async findByUserId(userId, filters = {}) {
    // TODO: Implementasi find by user (sebagai pembeli)
    // const where = { user_id: userId };
    // if (filters.status) where.status = filters.status;
    //
    // const result = await this.sequelize.models.Pesanan.findAll({
    //   where,
    //   include: [
    //     { model: this.sequelize.models.Layanan, as: 'layanan' },
    //     { model: this.sequelize.models.User, as: 'penyedia' }
    //   ],
    //   limit: filters.limit || 20,
    //   offset: ((filters.page || 1) - 1) * (filters.limit || 20),
    //   order: [['created_at', 'DESC']]
    // });
    //
    // return result.map(r => new Order(r.toJSON()));

    throw new Error('Not implemented - Query dengan where clause dan include');
  }

  async findByPenyediaId(penyediaId, filters = {}) {
    // TODO: Implementasi find by penyedia (sebagai seller)
    // Similar dengan findByUserId tapi where.penyedia_id = penyediaId

    throw new Error('Not implemented - Mirip dengan findByUserId');
  }

  async findByServiceId(serviceId, filters = {}) {
    // TODO: Implementasi find by service
    // Berguna untuk validasi: cek apakah service punya active orders
    // const where = { layanan_id: serviceId };
    // if (filters.status) where.status = filters.status;
    //
    // const result = await this.sequelize.models.Pesanan.findAll({ where });
    // return result.map(r => new Order(r.toJSON()));

    throw new Error('Not implemented - Simple findAll dengan where');
  }

  async updateStatus(id, status) {
    // TODO: Implementasi update status
    // await this.sequelize.models.Pesanan.update(
    //   { status },
    //   { where: { id } }
    // );
    //
    // return await this.findById(id);

    throw new Error('Not implemented - Gunakan update() method');
  }

  async cancel(id, cancelledBy, reason) {
    // TODO: Implementasi cancel order
    // await this.sequelize.models.Pesanan.update(
    //   {
    //     status: 'cancelled',
    //     dibatalkan_oleh: cancelledBy, // 'buyer', 'seller', atau 'admin'
    //     alasan_pembatalan: reason
    //   },
    //   { where: { id } }
    // );
    //
    // return await this.findById(id);

    throw new Error('Not implemented - Update multiple fields');
  }

  async update(id, orderData) {
    // TODO: Implementasi general update
    // await this.sequelize.models.Pesanan.update(orderData, { where: { id } });
    // return await this.findById(id);

    throw new Error('Not implemented - Standard update operation');
  }
}

module.exports = SequelizeOrderRepository;
