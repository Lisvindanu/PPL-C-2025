class SequelizeReviewRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async delete(reviewId) {
    return await this.sequelize.query(
      'DELETE FROM ulasan WHERE id = ?',
      { replacements: [reviewId] }
    );
  }
}

module.exports = SequelizeReviewRepository;