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
    this.Review = sequelize.models && sequelize.models.ulasan ? sequelize.models.ulasan : null;
  }

  async create(reviewData) {
    if (!this.Review) throw new Error('Review model not registered');
    const result = await this.Review.create(reviewData);
    return result.toJSON();
  }

  async findById(id) {
    if (!this.Review) return null;
    const r = await this.Review.findByPk(id);
    return r ? r.toJSON() : null;
  }

  async findByOrderId(orderId) {
    if (!this.Review) return null;
    const r = await this.Review.findOne({ where: { pesanan_id: orderId } });
    return r ? r.toJSON() : null;
  }

  async findByServiceId(serviceId, filters = {}) {
    if (!this.Review) return [];
    const where = { layanan_id: serviceId };
    if (filters.rating) where.rating = filters.rating;
    const limit = filters.limit || 20;
    const offset = ((filters.page || 1) - 1) * limit;
    const order = [['created_at', 'DESC']];
    const rows = await this.Review.findAll({ where, order, limit, offset });
    return rows.map(r => r.toJSON());
  }

  async findByUserId(userId, filters = {}) {
    if (!this.Review) return [];
    const where = { pemberi_ulasan_id: userId };
    const limit = filters.limit || 20;
    const offset = ((filters.page || 1) - 1) * limit;
    const rows = await this.Review.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit, offset
    });
    return rows.map(r => r.toJSON());
  }

  async calculateAverageRating(serviceId) {
    if (!this.Review) return { average: null, count: 0 };
    const result = await this.Review.findOne({
      where: { layanan_id: serviceId },
      attributes: [
        [this.sequelize.fn('AVG', this.sequelize.col('rating')), 'average'],
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count']
      ],
      raw: true
    });
    const avg = result && result.average ? parseFloat(result.average) : 0;
    const count = result && result.count ? parseInt(result.count, 10) : 0;
    return { average: avg, count };
  }

  async update(id, reviewData) {
    if (!this.Review) return null;
    await this.Review.update(reviewData, { where: { id } });
    return this.findById(id);
  }

  async delete(id) {
    if (!this.Review) return false;
    const deleted = await this.Review.destroy({ where: { id } });
    return deleted > 0;
  }

  async incrementHelpful(id) {
    if (!this.Review) return null;
    await this.Review.increment('helpful_count', { by: 1, where: { id } });
    return this.findById(id);
  }

  async getRatingDistribution(serviceId) {
    if (!this.Review) return { 5:0,4:0,3:0,2:0,1:0 };
    const rows = await this.Review.findAll({
      where: { layanan_id: serviceId },
      attributes: ['rating', [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count']],
      group: ['rating'],
      raw: true
    });
    const dist = { 5:0,4:0,3:0,2:0,1:0 };
    rows.forEach(r => { dist[r.rating] = parseInt(r.count, 10); });
    return dist;
  }
}

module.exports = SequelizeReviewRepository;
