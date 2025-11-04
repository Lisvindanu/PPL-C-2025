const FavoriteModel = require('../models/FavoriteModel');

class SequelizeFavoriteRepository {
  /**
   * Get all favorites for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - List of favorites
   */
  async findByUserId(userId) {
    try {
      const favorites = await FavoriteModel.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']]
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
}

module.exports = SequelizeFavoriteRepository;
