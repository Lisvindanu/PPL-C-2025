
class MarkAsRead {
    constructor(messageRepository, conversationRepository, socketService = null) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.socketService = socketService;
    }

    async execute(percakapanId, userId) {
        // 1. Validasi percakapan dan partisipan
        const conversation = await this.conversationRepository.findById(percakapanId);
        if (!conversation) {
            throw new Error('Percakapan tidak ditemukan');
        }
        if (!conversation.isParticipant(userId)) {
            throw new Error('Anda bukan bagian dari percakapan ini');
        }

        // 2. Mark pesan sebagai terbaca
        await this.messageRepository.markAsRead(percakapanId, userId);

        // 3. Reset unread count di Conversation Model
        await this.conversationRepository.resetUnreadCount(percakapanId, userId);

        // 4. (Opsional) Emit event ke pengirim lama untuk update status pesan mereka
        if (this.socketService) {
            const otherUserId = conversation.getOtherUserId(userId);
        }

        return { message: 'Pesan berhasil ditandai sebagai terbaca' };
    }
}

module.exports = MarkAsRead;