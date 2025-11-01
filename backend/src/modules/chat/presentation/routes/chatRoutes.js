/**
 * Chat Routes
 * API routes untuk chat dan messaging
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

module.exports = (chatController) => {
  /**
   * @swagger
   * /api/chat/conversations:
   *   get:
   *     tags: [Chat]
   *     summary: Get all conversations
   *     description: Ambil semua percakapan user (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.get('/conversations', authMiddleware, (req, res) => chatController.getConversations(req, res));

  /**
   * @swagger
   * /api/chat/conversations:
   *   post:
   *     tags: [Chat]
   *     summary: Create or get conversation
   *     description: Buat percakapan baru atau ambil yang sudah ada (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.post('/conversations', authMiddleware, (req, res) => chatController.createConversation(req, res));

  /**
   * @swagger
   * /api/chat/conversations/{id}/messages:
   *   get:
   *     tags: [Chat]
   *     summary: Get messages in conversation
   *     description: Ambil semua pesan dalam percakapan (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.get('/conversations/:id/messages', authMiddleware, (req, res) => chatController.getMessages(req, res));

  /**
   * @swagger
   * /api/chat/conversations/{id}/messages:
   *   post:
   *     tags: [Chat]
   *     summary: Send message
   *     description: Kirim pesan dalam percakapan (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.post('/conversations/:id/messages', authMiddleware, (req, res) => chatController.sendMessage(req, res));

  /**
   * @swagger
   * /api/chat/conversations/{id}/read:
   *   patch:
   *     tags: [Chat]
   *     summary: Mark messages as read
   *     description: Tandai pesan sebagai sudah dibaca (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.patch('/conversations/:id/read', authMiddleware, (req, res) => chatController.markAsRead(req, res));

  return router;
};
