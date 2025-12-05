/**
 * Get Conversations Use Case
 *
 * Ambil semua percakapan user.
 * Sort by last_message_at biar yang terbaru di atas.
 *
 * Steps:
 * 1. Ambil semua conversation dimana user adalah participant
 * 2. Include last message preview
 * 3. Include unread count
 * 4. Sort by last_message_at DESC
 */

class GetConversations {
  constructor(conversationRepository) {
    this.conversationRepository = conversationRepository;
  }

  /**
   * @param {string} userId - ID user yang sedang login
   * @param {object} filters - { page, limit }
   */

  async execute(userId, filters = {}) {
    const { page = 1, limit = 20 } = filters;

    const conversation = await this.conversationRepository.findByUserId(userId, {
      page,
      limit,
      order: 'DESC'
    });

    const result = conversation.map(conv => {
      const otherUser = conv.user1_id === userId ? conv.user2 : conv.user1;
      const unreadCount = conv.getUnreadCountFor(userId);

      // Format data lawan bicara
      const participant = {
        userId: otherUser.id,
        name: `${otherUser.nama_depan} ${otherUser.nama_belakang}`,
        avatar: otherUser.avatar
      };

      // Format pesan terakhir
      const lastMessage = {
        text: conv.pesan_terakhir,
        timestamp: conv.pesan_terakhir_pada,
        // Read akan diimplementasikan nanti
      };

      return {
        conversationId: conv.id,
        participant: participant,
        lastMessage: lastMessage,
        unreadCount: unreadCount
      };
    });

    return result;
  }
}

module.exports = GetConversations;
