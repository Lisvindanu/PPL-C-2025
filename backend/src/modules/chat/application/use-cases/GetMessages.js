/**
 * Get Messages Use Case
 *
 * Mengambil pesan dalam percakapan dengan paginasi.
 */

class GetMessages {
    constructor(messageRepository, conversationRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }

    async execute(userId, percakapanId, { page = 1, limit = 20 }) {
        // Validasi Percakapan
        const conversation = await this.conversationRepository.findById(percakapanId);
        if (!conversation) {
            throw new Error('Percakapan tidak ditemukan');
        }

        // Validaasi keamanan
        if (!conversation.isParticipant(userId)) {
            throw new Error('Anda bukan bagian dari percakapan ini');
        }

        // Ambil data dari repository
        const { rows, count } = await this.messageRepository.findByConversationId(percakapanId, { page, limit });

        // Hitung metadata paginasi
        const totalPages = Math.ceil(count / limit);

        // Kembalikan data
        return {
            messages: rows,
            pagination: {
                currentPage: parseInt(page, 10),
                totalPages,
                totalMessages: count,
                pageSize: parseInt(limit, 10),
            },
        };
    }
}

module.exports = GetMessages;