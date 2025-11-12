/**
 * Sequelize Message Repository Implementation
 *
 * Tips untuk chat system:
 * - Gunakan pagination dengan cursor-based (before_id) untuk infinite scroll
 * - Index kolom percakapan_id dan created_at untuk performa
 * - Consider real-time dengan Socket.IO untuk production
 */

const Message = require('../../domain/entities/Message');
const { Op } = require('sequelize');

class SequelizeMessageRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.Pesan = sequelize.models.pesan;
    this.User = sequelize.models.users;
  }

  /**
   * Membuat pesan baru di database
   * @param {object} messageData - Data untuk pesan baru
   * @returns {Promise<Message>}
   */

  async create(messageData) {
    // TODO: Implementasi create message
    const result = await this.Pesan.create(messageData);
    return new Message(result.toJSON());
  }

  /**
   * Temukan pesan berdasarkan ID percakapan dengan paginasi
   * @param {string} percakapanId
   * @param {object} options - { page, limit }
   * @returns {Promise<{rows: Pesan[], count: number}>}
   */

  async findByConversationId(percakapanId, { page = 1, limit = 20 }) {
    // TODO: Implementasi get messages dengan pagination
    const offset = (page - 1) * limit;

    return this.Pesan.findAndCountAll({
      where: {
        percakapan_id: percakapanId,
      },
      include: [
        {
          model: this.User,
          as: 'Pengirim',
          attributes: ['id', 'nama', 'foto_profil'],
        },
      ],

      order: [['created_at', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    })

    // const where = { percakapan_id: percakapanId };
    //
    // // Cursor-based pagination (load older messages)
    // if (options.before_id) {
    //   where.id = { [Op.lt]: options.before_id };
    // }
    //
    // const result = await this.sequelize.models.Pesan.findAll({
    //   where,
    //   include: [{ model: this.sequelize.models.User, as: 'pengirim' }],
    //   order: [['created_at', 'DESC']], // Latest first
    //   limit: options.limit || 50
    // });
    //
    // return result.map(r => new Message(r.toJSON())).reverse(); // Reverse untuk oldest first

  }

  async markAsRead(percakapanId, userId) {
    // TODO: Implementasi mark messages sebagai read
    // Update semua unread messages dari user lain
    //

    await this.Pesan.update(
      {
        is_read: true,
        dibaca_pada: new Date()
      },
      {
        where: {
          percakapan_id: percakapanId,
          pengirim_id: { [Op.ne]: userId },
          is_read: false
        }
      }
    );
  }

  async countUnread(percakapanId, userId) {
    // TODO: Implementasi count unread messages
    const count = await this.Pesan.count({
      where: {
        percakapan_id: percakapanId,
        pengirim_id: { [Op.ne]: userId }, // Messages dari lawan
        is_read: false
      }
    });

    return count;

  }

  async delete(id, userId) {
    // TODO: Implementasi delete message
    // Validasi ownership terlebih dahulu
    //
    const message = await this.Pesan.findByPk(id);
    if (!message) return false;

    if (message.pengirim_id !== userId) {
      throw new Error('Tidak dapat menghapus pesan user lain');
    }

    await message.destroy();
    return true;

  }
}

module.exports = SequelizeMessageRepository;
