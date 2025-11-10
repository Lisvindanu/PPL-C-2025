/**
 * Repository Index
 * -----------------
 * Tujuan: Inisialisasi semua repository Sequelize dan expose sebagai 1 objek
 * agar mudah diimport di Controller atau Use Case.
 */

const SequelizeReviewRepository = require('./SequelizeReviewRepository');
const OrderRepository = require('./OrderRepository');
const ServiceRepository = require('./ServiceRepository');

/**
 * Factory function
 * @param {Sequelize} sequelize - Instance Sequelize aktif
 */
function initRepositories(sequelize) {
  if (!sequelize) {
    throw new Error('Sequelize instance is required to initialize repositories');
  }

  const reviewRepository = new SequelizeReviewRepository(sequelize);
  const orderRepository = new OrderRepository(sequelize);
  const serviceRepository = new ServiceRepository(sequelize);

  return {
    reviewRepository,
    orderRepository,
    serviceRepository,
  };
}

module.exports = initRepositories;
