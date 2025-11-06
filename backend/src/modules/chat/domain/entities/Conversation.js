/**
 * Conversation Entity
 *
 * Represents percakapan antara 2 user (buyer dan seller).
 * Satu pasangan user cuma punya 1 conversation.
 */

class Conversation {
  constructor({
    id,
    user1_id,
    user2_id,
    last_message,
    last_message_at,
    user1_unread_count,
    user2_unread_count,
    created_at,
    updated_at
  }) {
    this.id = id;
    this.user1_id = user1_id;
    this.user2_id = user2_id;
    this.last_message = last_message;
    this.last_message_at = last_message_at;
    this.user1_unread_count = user1_unread_count || 0;
    this.user2_unread_count = user2_unread_count || 0;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Helper - dapetin ID user lawan bicara
   */
  getOtherUserId(currentUserId) {
    return this.user1_id === currentUserId ? this.user2_id : this.user1_id;
  }

  /**
   * Helper - dapetin unread count untuk user tertentu
   */
  getUnreadCountFor(userId) {
    return this.user1_id === userId ? this.user1_unread_count : this.user2_unread_count;
  }

  /**
   * Cek apakah user adalah participant
   */
  isParticipant(userId) {
    return this.user1_id === userId || this.user2_id === userId;
  }
}

module.exports = Conversation;
