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

  async execute(userId, percakapanId, messageData) {
    // messageData: { isi_pesan, tipe_pesan, attachment_url }

    // TODO: Validasi percakapan exist
    // const conversation = await this.conversationRepository.findById(percakapanId);
    // if (!conversation) {
    //   throw new Error('Percakapan not found');
    // }

    // TODO: Validasi user adalah participant
    // if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
    //   throw new Error('Lu bukan participant percakapan ini, jangan nyolong chat orang');
    // }

    // TODO: Validasi content
    // if (messageData.tipe_pesan === 'text' && !messageData.isi_pesan) {
    //   throw new Error('Pesan text ga boleh kosong');
    // }
    // if (['image', 'file'].includes(messageData.tipe_pesan) && !messageData.attachment_url) {
    //   throw new Error('Attachment URL wajib diisi kalo kirim file');
    // }

    // TODO: Create message
    // const message = await this.messageRepository.create({
    //   percakapan_id: percakapanId,
    //   pengirim_id: userId,
    //   isi_pesan: messageData.isi_pesan || '',
    //   tipe_pesan: messageData.tipe_pesan || 'text',
    //   attachment_url: messageData.attachment_url,
    //   is_read: false
    // });

    // TODO: Update last_message di conversation
    // await this.conversationRepository.update(percakapanId, {
    //   last_message: messageData.isi_pesan || '[File]',
    //   last_message_at: new Date(),
    //   unread_count: conversation.getUnreadCountFor(getOtherUserId(userId))
    // });

    // TODO: Emit socket event buat real-time (kalo pake Socket.IO)
    // if (this.socketService) {
    //   this.socketService.emitNewMessage(percakapanId, message);
    // }

    // TODO: Kirim push notification ke receiver
    // const receiverId = conversation.user1_id === userId ? conversation.user2_id : conversation.user1_id;
    // if (this.notificationService) {
    //   await this.notificationService.sendNewMessageNotification(receiverId, message);
    // }

    // return message;

    throw new Error('Not implemented yet - Kerjain, chat penting buat komunikasi buyer-seller');
  }
}

module.exports = SendMessage;
