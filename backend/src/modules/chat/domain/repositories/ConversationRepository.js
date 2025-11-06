/**
 * Conversation Repository Interface
 *
 * Repository untuk mengelola percakapan antar user.
 * Ingat: Satu pasangan user hanya punya 1 conversation (unique constraint).
 */

class ConversationRepository {
  /**
   * Create conversation baru atau return yang sudah ada
   *
   * @param {string} user1Id
   * @param {string} user2Id
   * @returns {Promise<Conversation>}
   *
   * Tips: Gunakan findOrCreate untuk avoid duplicate conversation
   */
  async createOrFind(user1Id, user2Id) {
    throw new Error('Method createOrFind() must be implemented');
  }

  /**
   * Cari conversation by ID
   * Include kedua user (user1 dan user2)
   */
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  /**
   * Cari semua conversation milik user
   *
   * @param {string} userId
   * @param {Object} options - { page, limit, includeLastMessage, includeOtherUser }
   *
   * Query hint: WHERE user1_id = ? OR user2_id = ?
   * Sort by last_message_at DESC
   */
  async findByUserId(userId, options = {}) {
    throw new Error('Method findByUserId() must be implemented');
  }

  /**
   * Update conversation (last message, unread count, dll)
   */
  async update(id, data) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Increment unread count untuk user tertentu
   *
   * Logika: Jika pengirim = user1, increment user2_unread_count
   */
  async incrementUnreadCount(id, forUserId) {
    throw new Error('Method incrementUnreadCount() must be implemented');
  }

  /**
   * Reset unread count jadi 0
   * Dipanggil saat user buka conversation
   */
  async resetUnreadCount(id, userId) {
    throw new Error('Method resetUnreadCount() must be implemented');
  }
}

module.exports = ConversationRepository;
