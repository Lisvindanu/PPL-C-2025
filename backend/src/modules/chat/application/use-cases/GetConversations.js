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

  async execute(userId, filters = {}) {
    // filters: { page, limit }

    // TODO: Ambil conversations
    // const conversations = await this.conversationRepository.findByUserId(userId, {
    //   page: filters.page || 1,
    //   limit: filters.limit || 20,
    //   includeLastMessage: true,
    //   includeOtherUser: true, // Include info user lawan bicara
    //   sortBy: 'last_message_at',
    //   order: 'DESC'
    // });

    // TODO: Map ke format yang user-friendly
    // const result = conversations.map(conv => ({
    //   id: conv.id,
    //   other_user: conv.getOtherUser(userId), // Helper method di entity
    //   last_message: conv.last_message,
    //   last_message_at: conv.last_message_at,
    //   unread_count: conv.getUnreadCountFor(userId),
    //   created_at: conv.created_at
    // }));

    // return result;

    throw new Error('Not implemented yet - Tinggal query database doang kok');
  }
}

module.exports = GetConversations;
