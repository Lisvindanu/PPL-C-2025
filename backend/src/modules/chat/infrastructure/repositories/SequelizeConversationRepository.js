/**
 * Sequelize Conversation Repository Implementation
 *
 * Important: Enforce unique constraint (user1_id, user2_id)
 * Di migration, tambahkan:
 * - UNIQUE index pada kombinasi user1_id dan user2_id
 * - Normalisasi: user1_id selalu < user2_id untuk konsistensi
 */

const Conversation = require('../../domain/entities/Conversation');
const { Op } = require('sequelize');

class SequelizeConversationRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async createOrFind(user1Id, user2Id) {
    // TODO: Implementasi findOrCreate conversation
    // Normalize IDs: pastikan user1_id < user2_id
    //
    // const [userId1, userId2] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    //
    // const [conversation, created] = await this.sequelize.models.Percakapan.findOrCreate({
    //   where: {
    //     user1_id: userId1,
    //     user2_id: userId2
    //   },
    //   defaults: {
    //     user1_id: userId1,
    //     user2_id: userId2,
    //     user1_unread_count: 0,
    //     user2_unread_count: 0
    //   }
    // });
    //
    // return new Conversation(conversation.toJSON());

    throw new Error('Not implemented - Gunakan findOrCreate untuk avoid duplicate');
  }

  async findById(id) {
    // TODO: Implementasi find by ID
    // Include both users untuk info lawan bicara
    //
    // const result = await this.sequelize.models.Percakapan.findByPk(id, {
    //   include: [
    //     { model: this.sequelize.models.User, as: 'user1' },
    //     { model: this.sequelize.models.User, as: 'user2' }
    //   ]
    // });
    //
    // if (!result) return null;
    // return new Conversation(result.toJSON());

    throw new Error('Not implemented - findByPk dengan include users');
  }

  async findByUserId(userId, options = {}) {
    // TODO: Implementasi find conversations untuk user
    // User bisa jadi user1 atau user2
    //
    // const where = {
    //   [Op.or]: [
    //     { user1_id: userId },
    //     { user2_id: userId }
    //   ]
    // };
    //
    // const result = await this.sequelize.models.Percakapan.findAll({
    //   where,
    //   include: options.includeOtherUser ? [
    //     { model: this.sequelize.models.User, as: 'user1' },
    //     { model: this.sequelize.models.User, as: 'user2' }
    //   ] : [],
    //   order: [[options.sortBy || 'last_message_at', options.order || 'DESC']],
    //   limit: options.limit || 20,
    //   offset: ((options.page || 1) - 1) * (options.limit || 20)
    // });
    //
    // return result.map(r => new Conversation(r.toJSON()));

    throw new Error('Not implemented - Query dengan OR condition untuk user1/user2');
  }

  async update(id, data) {
    // TODO: Implementasi update conversation
    // await this.sequelize.models.Percakapan.update(data, { where: { id } });
    // return await this.findById(id);

    throw new Error('Not implemented - Standard update');
  }

  async incrementUnreadCount(id, forUserId) {
    // TODO: Implementasi increment unread count
    // Determine mana yang di-increment: user1_unread_count atau user2_unread_count
    //
    // const conversation = await this.sequelize.models.Percakapan.findByPk(id);
    // if (!conversation) throw new Error('Conversation not found');
    //
    // const field = conversation.user1_id === forUserId ? 'user1_unread_count' : 'user2_unread_count';
    // await conversation.increment(field);

    throw new Error('Not implemented - Conditional increment based on user');
  }

  async resetUnreadCount(id, userId) {
    // TODO: Implementasi reset unread count
    // const conversation = await this.sequelize.models.Percakapan.findByPk(id);
    // if (!conversation) return;
    //
    // const field = conversation.user1_id === userId ? 'user1_unread_count' : 'user2_unread_count';
    // await conversation.update({ [field]: 0 });

    throw new Error('Not implemented - Conditional update field');
  }
}

module.exports = SequelizeConversationRepository;
