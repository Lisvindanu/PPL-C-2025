/**
 * Send Message Use Case
 *
 * Kirim pesan dalam percakapan.
 * Bisa text, image, atau file attachment.
 *
 * Kalo mau real-time, pake Socket.IO nanti.
 * Tapi sekarang REST API dulu aja, socket nanti belakangan.
 *
 * Steps:
 * 1. Validasi percakapan exist
 * 2. Validasi user adalah participant percakapan
 * 3. Validasi tipe pesan dan content
 * 4. Create message
 * 5. Update last_message di percakapan
 * 6. (Optional) Emit socket event buat real-time
 * 7. Kirim push notification
 */

class SendMessage {
  constructor(
    messageRepository,
    conversationRepository,
    socketService = null,
    notificationService = null
  ) {
    this.messageRepository = messageRepository;
    this.conversationRepository = conversationRepository;
    this.socketService = socketService;
    this.notificationService = notificationService;
  }

  /**
   * @param {string} userId - ID user yang mengirim
   * @param {string} percakapanId - ID percakapan
   * @param {object} messageData - { pesan, tipe, lampiran (opsional) }
   */

  async execute(userId, percakapanId, messageData) {
    // 1. Validasi percakapan
    const conversation = await this.conversationRepository.findById(percakapanId);
    if (!conversation) {
      throw new Error('Percakapan tidak ditemukan');
    }

    // 2. Validasi user adalah participant
    if (!conversation.isParticipant(userId)) {
      throw new Error('Anda bukan bagian dari percakapan ini');
    }

    // 3. Validasi content
    if (messageData.tipe === 'text' && !messageData.pesan) {
      throw new Error('Pesan teks tidak boleh kosong');
    }

    // 4. Create message
    const newMessage = await this.messageRepository.create({
      percakapan_id: percakapanId,
      pengirim_id: userId,
      pesan: messageData.pesan || '',
      tipe: messageData.tipe || 'text',
      lampiran: messageData.lampiran || null,
      is_read: false
    });

    // 5. Update last_message di conversation
    await this.conversationRepository.update(percakapanId, {
      pesan_terakhir: newMessage.pesan || `[${newMessage.tipe}]`,
      pesan_terakhir_pada: newMessage.created_at
    });

    // 6. BARU: Emit socket event buat real-time (C-2)
    if (this.socketService) {
      // Panggil method dari SocketService yang kita buat
      this.socketService.emitNewMessage(percakapanId, newMessage);
    }

    // TODO: Emit socket event buat real-time (kalo pake Socket.IO)
    // if (this.socketService) {
    //   this.socketService.emitNewMessage(percakapanId, message);
    // }

    // TODO: Kirim push notification ke receiver
    // const receiverId = conversation.user1_id === userId ? conversation.user2_id : conversation.user1_id;
    // if (this.notificationService) {
    //   await this.notificationService.sendNewMessageNotification(receiverId, message);
    // }

    return newMessage;

  }
}

module.exports = SendMessage;
