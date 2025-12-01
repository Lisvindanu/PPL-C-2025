const FavoriteModel = require('../models/FavoriteModel');

class SequelizeFavoriteRepository {
  /**
   * Get all favorites for a user with full service details
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - List of favorites with service details
   */
  async findByUserId(userId) {
    try {
      const { QueryTypes } = require('sequelize');
      const sequelize = FavoriteModel.sequelize;

      // Join with layanan table to get full service details
      const favorites = await sequelize.query(`
        SELECT
          f.id AS favorite_id,
          f.user_id,
          f.layanan_id,
          f.created_at AS favorited_at,
          l.id,
          l.judul AS title,
          l.slug,
          l.deskripsi AS description,
          l.harga AS price,
          l.waktu_pengerjaan AS delivery_time,
          l.batas_revisi AS revisions,
          l.thumbnail,
          l.rating_rata_rata AS rating,
          l.jumlah_rating AS reviews,
          l.total_pesanan AS orders,
          k.nama AS category,
          CONCAT(u.nama_depan, ' ', u.nama_belakang) AS freelancer
        FROM favorit f
        INNER JOIN layanan l ON f.layanan_id = l.id
        LEFT JOIN kategori k ON l.kategori_id = k.id
        LEFT JOIN users u ON l.freelancer_id = u.id
        WHERE f.user_id = :userId
        ORDER BY f.created_at DESC
      `, {
        replacements: { userId },
        type: QueryTypes.SELECT
      });

      return favorites;
    } catch (error) {
      throw new Error(`Failed to fetch favorites: ${error.message}`);
    }
  }

  /**
   * Add a favorite
   * @param {string} userId - User ID
   * @param {string} layananId - Service ID
   * @returns {Promise<Object>} - Created favorite
   */
  async create(userId, layananId) {
    try {
      const favorite = await FavoriteModel.create({
        user_id: userId,
        layanan_id: layananId
      });
      return favorite;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Layanan sudah ada di favorit');
      }
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new Error('Layanan tidak ditemukan. Pastikan layanan_id valid.');
      }
      throw new Error(`Failed to add favorite: ${error.message}`);
    }
  }

  /**
   * Remove a favorite
   * @param {string} userId - User ID
   * @param {string} layananId - Service ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(userId, layananId) {
    try {
      const result = await FavoriteModel.destroy({
        where: {
          user_id: userId,
          layanan_id: layananId
        }
      });
      return result > 0;
    } catch (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }
  }

  /**
   * Check if a service is favorited by user
   * @param {string} userId - User ID
   * @param {string} layananId - Service ID
   * @returns {Promise<boolean>} - Favorite status
   */
  async exists(userId, layananId) {
    try {
      const favorite = await FavoriteModel.findOne({
        where: {
          user_id: userId,
          layanan_id: layananId
        }
      });
      return !!favorite;
    } catch (error) {
      throw new Error(`Failed to check favorite status: ${error.message}`);
    }
  }

  /**
   * Get favorite count for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Count of favorites
   */
  async countByUserId(userId) {
    try {
      const count = await FavoriteModel.count({
        where: { user_id: userId }
      });
      return count;
    } catch (error) {
      throw new Error(`Failed to count favorites: ${error.message}`);
    }
  }

  /**
   * Get favorite count for a service (how many users favorited this service)
   * @param {string} layananId - Service ID
   * @returns {Promise<number>} - Count of favorites
   */
  async countByLayananId(layananId) {
    try {
      const count = await FavoriteModel.count({
        where: { layanan_id: layananId }
      });
      return count;
    } catch (error) {
      throw new Error(`Failed to count favorites for service: ${error.message}`);
    }
  }

  /**
   * Get favorite counts for multiple services
   * @param {Array<string>} layananIds - Array of service IDs
   * @returns {Promise<Object>} - Map of service_id => count
   */
  async countByLayananIds(layananIds) {
    try {
      const { Op } = require('sequelize');
      const counts = await FavoriteModel.findAll({
        attributes: [
          'layanan_id',
          [FavoriteModel.sequelize.fn('COUNT', FavoriteModel.sequelize.col('id')), 'count']
        ],
        where: {
          layanan_id: {
            [Op.in]: layananIds
          }
        },
        group: ['layanan_id'],
        raw: true
      });

      // Convert array to map: { service_id: count }
      const countMap = {};
      counts.forEach(row => {
        countMap[row.layanan_id] = parseInt(row.count);
      });

      // Fill in zeros for services with no favorites
      layananIds.forEach(id => {
        if (!countMap[id]) {
          countMap[id] = 0;
        }
      });

      return countMap;
    } catch (error) {
      throw new Error(`Failed to count favorites for services: ${error.message}`);
    }
  }
}

module.exports = SequelizeFavoriteRepository;
