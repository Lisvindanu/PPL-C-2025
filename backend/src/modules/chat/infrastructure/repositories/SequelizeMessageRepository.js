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
  }

  async create(messageData) {
    // TODO: Implementasi create message
    // const result = await this.sequelize.models.Pesan.create(messageData);
    // return new Message(result.toJSON());

    throw new Error('Not implemented - Standard create operation');
  }

  async findByConversationId(percakapanId, options = {}) {
    // TODO: Implementasi get messages dengan pagination
    // Support cursor-based pagination untuk infinite scroll
    //
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

    throw new Error('Not implemented - Pagination dengan cursor (before_id)');
  }

  async markAsRead(percakapanId, userId) {
    // TODO: Implementasi mark messages sebagai read
    // Update semua unread messages dari user lain
    //
    // await this.sequelize.models.Pesan.update(
    //   {
    //     is_read: true,
    //     dibaca_pada: new Date()
    //   },
    //   {
    //     where: {
    //       percakapan_id: percakapanId,
    //       pengirim_id: { [Op.ne]: userId }, // Not equal userId (message dari lawan)
    //       is_read: false
    //     }
    //   }
    // );

    throw new Error('Not implemented - Bulk update dengan where condition');
  }

  async countUnread(percakapanId, userId) {
    // TODO: Implementasi count unread messages
    // const count = await this.sequelize.models.Pesan.count({
    //   where: {
    //     percakapan_id: percakapanId,
    //     pengirim_id: { [Op.ne]: userId }, // Messages dari lawan
    //     is_read: false
    //   }
    // });
    //
    // return count;

    throw new Error('Not implemented - count() method dengan where');
  }

  async delete(id, userId) {
    // TODO: Implementasi delete message
    // Validasi ownership terlebih dahulu
    //
    // const message = await this.sequelize.models.Pesan.findByPk(id);
    // if (!message) return false;
    //
    // if (message.pengirim_id !== userId) {
    //   throw new Error('Tidak dapat menghapus pesan user lain');
    // }
    //
    // // Soft delete atau hard delete?
    // // Soft: await message.update({ deleted_at: new Date() });
    // // Hard: await message.destroy();
    //
    // return true;

    throw new Error('Not implemented - Validasi ownership lalu delete');
  }
}

module.exports = SequelizeMessageRepository;
