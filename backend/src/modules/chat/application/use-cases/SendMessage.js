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
    this.userRepository = userRepository;
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

    const receiverId = conversation.getOtherUserId(userId);
    await this.conversationRepository.incrementUnreadCount(percakapanId, receiverId);

    // 6. Emit socket event buat real-time (C-2)
    if (this.socketService) {
      this.socketService.emitNewMessage(percakapanId, newMessage);
    }

    // 7. Kirim notifikasi email jika penerima offlineKirim notifikasi email jika penerima offline
    if (this.notificationService && this.socketService && this.userRepository) {
      const receiverId = conversation.getOtherUserId(userId);

      const isOnline = await this.socketService.isUserOnline(receiverId);

      if (!isOnline) {
        // userId adalah pengirim, receiverId adalah penerima
        await this.notificationService.sendNewMessageNotification(
          receiverId,
          userId,
          newMessage
        );
      }
    }

    return newMessage;

  }
}

module.exports = SendMessage;
