const { Op } = require('sequelize');

class SequelizeReviewRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;

    // Sesuaikan nama model
    this.Review =
      sequelize.models && sequelize.models.ulasan
        ? sequelize.models.ulasan
        : null;
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

  async findByServiceId(serviceId = null, filters = {}) {
    if (!this.Review) return [];

    const where = {};
    if (serviceId) where.layanan_id = serviceId;
    if (filters.rating) where.rating = filters.rating;

    const page = Math.max(parseInt(filters.page || 1, 10), 1);
    const limit = parseInt(filters.limit || 20, 10);
    const offset = (page - 1) * limit;

    const sortDirection = filters.sortBy === 'oldest' ? 'ASC' : 'DESC';

    const rows = await this.Review.findAll({
      where,
      order: [['created_at', sortDirection]],
      limit,
      offset,
      raw: true,
    });

    return rows;
  }

  async countByServiceId(serviceId, filters = {}) {
    const where = { layanan_id: serviceId };
    if (filters.rating) where.rating = filters.rating;

    return this.Review.count({ where });
  }

  async findByFreelancerId(freelancerId, filters = {}) {
  if (!this.Review) return [];

  const where = { penerima_ulasan_id: freelancerId };

  const page = Math.max(parseInt(filters.page || 1, 10), 1);
  const limit = parseInt(filters.limit || 20, 10);
  const offset = (page - 1) * limit;

  const rows = await this.Review.findAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  return rows.map((r) => r.toJSON());
}

async countByFreelancerId(freelancerId) {
  if (!this.Review) return 0;

  const count = await this.Review.count({
    where: { penerima_ulasan_id: freelancerId }
  });

  return count;
}

  async findByUserId(userId, filters = {}) {
    if (!this.Review) return [];

    const where = { pemberi_ulasan_id: userId };

    const page = Math.max(parseInt(filters.page || 1, 10), 1);
    const limit = parseInt(filters.limit || 20, 10);
    const offset = (page - 1) * limit;

    const rows = await this.Review.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
      raw: true,
    });

    return rows;
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

  async calculateAverageRating(serviceId) {
    if (!this.Review)
      return { average: 0, count: 0 };

    const result = await this.Review.findOne({
      where: { layanan_id: serviceId },
      attributes: [
        [this.sequelize.fn('AVG', this.sequelize.col('rating')), 'average'],
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
      ],
      raw: true,
    });

    const avg = parseFloat(result?.average || 0) || 0;
    const count = parseInt(result?.count || 0, 10) || 0;

    return { average: avg, count };
  }

  async getRatingDistribution(serviceId) {
    if (!this.Review)
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    const rows = await this.Review.findAll({
      where: { layanan_id: serviceId },
      attributes: [
        'rating',
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
      ],
      group: ['rating'],
      raw: true,
    });

    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    rows.forEach((r) => {
      dist[r.rating] = parseInt(r.count, 10);
    });

    return dist;
  }

  async findLatest(limit = 5) {
    return this.Review.findAll({
      order: [['created_at', 'DESC']],
      limit,
      raw: true,
    });
  }

  async incrementHelpful(id) {
    if (!this.Review) return null;

    await this.Review.increment('helpful_count', {
      by: 1,
      where: { id },
    });

    return this.findById(id);
  }
}

module.exports = SequelizeReviewRepository;
