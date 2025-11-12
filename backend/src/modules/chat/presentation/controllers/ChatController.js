/**
 * Chat Controller
 * HTTP handler untuk chat endpoints
 */

const SequelizeConversationRepository = require('../../infrastructure/repositories/SequelizeConversationRepository');
const SequelizeMessageRepository = require('../../infrastructure/repositories/SequelizeMessageRepository'); // BARU
const GetConversations = require('../../application/use-cases/GetConversations');
const SendMessage = require('../../application/use-cases/SendMessage');
const GetMessages = require('../../application/use-cases/GetMessages');

class ChatController {
  constructor(sequelize, socketService) {
    this.sequelize = sequelize;
    this.socketService = socketService;

    // Inisialisasi repository
    this.conversationRepository = new SequelizeConversationRepository(sequelize);
    this.massageRepository = new SequelizeMessageRepository(sequelize);

    // Inisialisasi use case
    this.getConversationsUseCase = new GetConversations(this.conversationRepository);
    this.getMessagesUseCase = new GetMessages(this.messageRepository, this.conversationRepository);

    this.sendMessageUseCase = new SendMessage(
      this.messageRepository,
      this.conversationRepository,
      this.socketService
    );
  }

  /**
   * Get all conversations for logged in user
   * GET /api/chat/conversations
   */
  async getConversations(req, res) {
    try {
      const userId = req.user.userId;
      const { page, limit } = req.query;
      const conversations = await this.getConversationsUseCase.execute(userId, { page, limit });
      return res.status(200).json({
        status: 'success',
        data: conversations
      });

    } catch (error) {
      console.error('Error getting conversations:', error)
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Get messages in a conversation
   * GET /api/chat/conversations/:id/messages
   */
  async getMessages(req, res) {
    try {
      const { id: percakapanId } = req.params;
      const userId = req.user.userId;
      const { page = 1, limit = 20 } = req.query;

      const data = await this.getMessagesUseCase.execute(
        userId,
        percakapanId,
        { page, limit }
      );

      return res.status(200).json({
        status: 'success',
        data: data
      });

    } catch (error) {
      console.error('Error getting messages:', error);
      // Handel error spesifiknya
      if (error.message === 'Percakapan tidak ditemukan') {
        return res.status(404).json({ status: 'error', message: error.message });
      }
      if (error.message === 'Anda bukan bagian dari percakapan ini') {
        return res.status(403).json({ status: 'error', message: error.message });
      }
      // Error  umumnya
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Internal Server Error'
      });
    }
  }


  /**
   * Send message
   * POST /api/chat/conversations/:id/messages
   */
  async sendMessage(req, res) {
    try {
      const { id: percakapanId } = req.params;
      const userId = req.user.userId;
      const { pesan, tipe = 'text', lampiran = null } = req.body;

      if (!pesan && tipe == 'text') {
        return res.status(400).json({ status: 'error', message: 'Pesan teks tidak boleh kosong' });

      }

      const messageData = { pesan, tipe, lampiran };
      const newMessage = await this.sendMessageUseCase.execute(userId, percakapanId, messageData);

      return res.status(201).json({
        status: 'success',
        data: newMessage
      });

    } catch (error) {
      console.error('Error sending message:', error)
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Mark messages as read
   * PATCH /api/chat/conversations/:id/read
   */
  async markAsRead(req, res) {
    try {
      return res.status(501).json({
        status: 'error',
        message: 'Fitur mark as read belum diimplementasikan - akan ditambahkan di sprint mendatang'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Create or get conversation with another user
   * POST /api/chat/conversations
   */
  async createConversation(req, res) {
    try {
      const { user2_id } = req.body;
      const user1_id = req.user.userId;

      if (!user2_id) {
        return res.status(400).json({ status: 'error', message: 'user2_id diperlukan' });
      }

      const conversation = await this.conversationRepository.createOrFind(user1_id, user2_id);

      return res.status(200).json({
        status: 'success',
        message: 'percakapan berhasil ditemukan atau dibuat',
        data: conversation
      });

    } catch (error) {
      console.error('Error creating conversation:', error);
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

module.exports = ChatController;
