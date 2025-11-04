/**
 * Sequelize Review Repository Implementation
 *
 * Tips:
 * - Gunakan aggregate functions untuk calculateAverageRating
 * - Index kolom layanan_id untuk performa query yang lebih baik
 * - Consider caching rating statistics untuk high-traffic services
 */

const Review = require('../../domain/entities/Review');
const { Op } = require('sequelize');

class SequelizeReviewRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async create(reviewData) {
    // TODO: Implementasi create review
    // const result = await this.sequelize.models.Review.create(reviewData);
    // return new Review(result.toJSON());

    throw new Error('Not implemented - Standard Sequelize create');
  }

  async findById(id) {
    // TODO: Implementasi find by ID
    // Include user info untuk tampilan review
    // const result = await this.sequelize.models.Review.findByPk(id, {
    //   include: [
    //     { model: this.sequelize.models.User, as: 'reviewer' },
    //     { model: this.sequelize.models.User, as: 'penyedia' }
    //   ]
    // });
    //
    // if (!result) return null;
    // return new Review(result.toJSON());

    throw new Error('Not implemented - findByPk dengan relations');
  }

  async findByOrderId(orderId) {
    // TODO: Implementasi find by order
    // Untuk validasi: user sudah review atau belum
    // const result = await this.sequelize.models.Review.findOne({
    //   where: { pesanan_id: orderId }
    // });
    //
    // if (!result) return null;
    // return new Review(result.toJSON());

    throw new Error('Not implemented - findOne dengan where');
  }

  async findByServiceId(serviceId, filters = {}) {
    // TODO: Implementasi find reviews untuk service
    // Support filtering by rating dan sorting
    // const where = { layanan_id: serviceId };
    // if (filters.rating) where.rating = filters.rating;
    //
    // const orderBy = {
    //   newest: [['created_at', 'DESC']],
    //   highest: [['rating', 'DESC']],
    //   lowest: [['rating', 'ASC']],
    //   helpful: [['helpful_count', 'DESC']]
    // };
    //
    // const result = await this.sequelize.models.Review.findAll({
    //   where,
    //   include: [{ model: this.sequelize.models.User, as: 'reviewer' }],
    //   order: orderBy[filters.sortBy] || orderBy.newest,
    //   limit: filters.limit || 20,
    //   offset: ((filters.page || 1) - 1) * (filters.limit || 20)
    // });
    //
    // return result.map(r => new Review(r.toJSON()));

    throw new Error('Not implemented - findAll dengan sorting dan pagination');
  }

  async findByUserId(userId, filters = {}) {
    // TODO: Implementasi find reviews by user
    // const result = await this.sequelize.models.Review.findAll({
    //   where: { user_id: userId },
    //   include: [{ model: this.sequelize.models.Layanan, as: 'layanan' }],
    //   order: [['created_at', 'DESC']],
    //   limit: filters.limit || 20,
    //   offset: ((filters.page || 1) - 1) * (filters.limit || 20)
    // });
    //
    // return result.map(r => new Review(r.toJSON()));

    throw new Error('Not implemented - Standard findAll');
  }

  async calculateAverageRating(serviceId) {
    // TODO: Implementasi aggregate query untuk average rating
    // Ini PENTING untuk update rating service setelah ada review baru
    //
    // const result = await this.sequelize.models.Review.findOne({
    //   where: { layanan_id: serviceId },
    //   attributes: [
    //     [this.sequelize.fn('AVG', this.sequelize.col('rating')), 'average'],
    //     [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count']
    //   ],
    //   raw: true
    // });
    //
    // return {
    //   newAverage: parseFloat(result.average) || 0,
    //   reviewCount: parseInt(result.count) || 0
    // };

    throw new Error('Not implemented - Gunakan aggregate functions (AVG, COUNT)');
  }

  async update(id, reviewData) {
    // TODO: Implementasi update review
    // await this.sequelize.models.Review.update(reviewData, { where: { id } });
    // return await this.findById(id);

    throw new Error('Not implemented - Standard update');
  }

  async delete(id) {
    // TODO: Implementasi delete review
    // Setelah delete, jangan lupa recalculate rating service
    // const review = await this.findById(id);
    // if (!review) return false;
    //
    // await this.sequelize.models.Review.destroy({ where: { id } });
    // return true;

    throw new Error('Not implemented - destroy() method');
  }

  async incrementHelpful(id) {
    // TODO: Implementasi increment helpful counter
    // await this.sequelize.models.Review.increment('helpful_count', { where: { id } });
    // return await this.findById(id);

    throw new Error('Not implemented - Gunakan increment() method Sequelize');
  }

  async getRatingDistribution(serviceId) {
    // TODO: Implementasi rating distribution
    // Return object: { 5: 10, 4: 5, 3: 2, 2: 1, 1: 0 }
    //
    // const result = await this.sequelize.models.Review.findAll({
    //   where: { layanan_id: serviceId },
    //   attributes: [
    //     'rating',
    //     [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count']
    //   ],
    //   group: ['rating'],
    //   raw: true
    // });
    //
    // const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    // result.forEach(r => {
    //   distribution[r.rating] = parseInt(r.count);
    // });
    //
    // return distribution;

    throw new Error('Not implemented - GROUP BY query dengan COUNT');
  }
}

module.exports = SequelizeReviewRepository;
