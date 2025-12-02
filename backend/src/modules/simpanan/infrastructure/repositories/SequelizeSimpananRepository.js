const SimpananModel = require('../models/SimpananModel');

class SequelizeSimpananRepository {
  /**
   * Get all saved services (simpanan) for a user with full service details
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - List of saved services with details
   */
  async findByUserId(userId) {
    try {
      const { QueryTypes } = require('sequelize');
      const sequelize = SimpananModel.sequelize;

      // Join with layanan table to get full service details
      const saved = await sequelize.query(`
        SELECT
          s.id AS simpanan_id,
          s.user_id,
          s.layanan_id,
          s.created_at AS saved_at,
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
        FROM simpanan s
        INNER JOIN layanan l ON s.layanan_id = l.id
        LEFT JOIN kategori k ON l.kategori_id = k.id
        LEFT JOIN users u ON l.freelancer_id = u.id
        WHERE s.user_id = :userId
        ORDER BY s.created_at DESC
      `, {
        replacements: { userId },
        type: QueryTypes.SELECT
      });

      return saved;
    } catch (error) {
      throw new Error(`Failed to fetch saved services: ${error.message}`);
    }
  }

  /**
   * Add a service to saved (simpanan)
   * @param {string} userId - User ID
   * @param {string} layananId - Service ID
   * @returns {Promise<Object>} - Created simpanan entry
   */
  async create(userId, layananId) {
    try {
      const simpanan = await SimpananModel.create({
        user_id: userId,
        layanan_id: layananId
      });
      return simpanan;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Layanan sudah ada di simpanan');
      }
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new Error('Layanan tidak ditemukan. Pastikan layanan_id valid.');
      }
      throw new Error(`Failed to add to saved: ${error.message}`);
    }
  }

  /**
   * Remove a service from saved (simpanan)
   * @param {string} userId - User ID
   * @param {string} layananId - Service ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(userId, layananId) {
    try {
      const result = await SimpananModel.destroy({
        where: {
          user_id: userId,
          layanan_id: layananId
        }
      });
      return result > 0;
    } catch (error) {
      throw new Error(`Failed to remove from saved: ${error.message}`);
    }
  }

  /**
   * Check if a service is saved by user
   * @param {string} userId - User ID
   * @param {string} layananId - Service ID
   * @returns {Promise<boolean>} - Saved status
   */
  async exists(userId, layananId) {
    try {
      const simpanan = await SimpananModel.findOne({
        where: {
          user_id: userId,
          layanan_id: layananId
        }
      });
      return !!simpanan;
    } catch (error) {
      throw new Error(`Failed to check saved status: ${error.message}`);
    }
  }

  /**
   * Get saved count for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Count of saved services
   */
  async countByUserId(userId) {
    try {
      const count = await SimpananModel.count({
        where: { user_id: userId }
      });
      return count;
    } catch (error) {
      throw new Error(`Failed to count saved services: ${error.message}`);
    }
  }
}

module.exports = SequelizeSimpananRepository;
