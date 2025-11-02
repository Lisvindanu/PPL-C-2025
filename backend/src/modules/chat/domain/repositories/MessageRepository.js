/**
 * Message Repository Interface
 *
 * Buat CRUD messages.
 * Jangan lupa pagination, chat bisa sampe ribuan pesan.
 */

class MessageRepository {
  /**
   * Create message baru
   */
  async create(messageData) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Cari semua message dalam conversation
   * Harus pake pagination, chat bisa panjang banget
   *
   * @param {string} percakapanId
   * @param {Object} options - { page, limit, before_id }
   * before_id buat infinite scroll ke atas
   */
  async findByConversationId(percakapanId, options = {}) {
    throw new Error('Method findByConversationId() must be implemented');
  }

  /**
   * Mark messages as read
   * Update semua unread messages jadi is_read = true
   */
  async markAsRead(percakapanId, userId) {
    throw new Error('Method markAsRead() must be implemented');
  }

  /**
   * Count unread messages dalam conversation untuk user tertentu
   */
  async countUnread(percakapanId, userId) {
    throw new Error('Method countUnread() must be implemented');
  }

  /**
   * Delete message (soft delete atau hard delete?)
   * Mending soft delete sih, set deleted_at
   */
  async delete(id, userId) {
    throw new Error('Method delete() must be implemented');
  }
}

module.exports = MessageRepository;
