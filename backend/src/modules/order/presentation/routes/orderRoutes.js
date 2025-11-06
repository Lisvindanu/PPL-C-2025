/**
 * Order Routes
 * API routes untuk pesanan
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

module.exports = (orderController) => {
  /**
   * @swagger
   * /api/orders:
   *   post:
   *     tags: [Orders]
   *     summary: Create new order
   *     description: Buat pesanan baru (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.post('/', authMiddleware, (req, res) => orderController.createOrder(req, res));

  /**
   * @swagger
   * /api/orders/my:
   *   get:
   *     tags: [Orders]
   *     summary: Get my orders (as buyer)
   *     description: Ambil semua pesanan saya sebagai pembeli (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.get('/my', authMiddleware, (req, res) => orderController.getMyOrders(req, res));

  /**
   * @swagger
   * /api/orders/incoming:
   *   get:
   *     tags: [Orders]
   *     summary: Get incoming orders (as seller)
   *     description: Ambil semua pesanan masuk untuk layanan saya (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.get('/incoming', authMiddleware, (req, res) => orderController.getIncomingOrders(req, res));

  /**
   * @swagger
   * /api/orders/{id}:
   *   get:
   *     tags: [Orders]
   *     summary: Get order by ID
   *     description: Ambil detail pesanan (Dalam Pengembangan)
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
  router.get('/:id', authMiddleware, (req, res) => orderController.getOrderById(req, res));

  /**
   * @swagger
   * /api/orders/{id}/accept:
   *   patch:
   *     tags: [Orders]
   *     summary: Accept order (seller only)
   *     description: Terima pesanan (Dalam Pengembangan)
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
  router.patch('/:id/accept', authMiddleware, (req, res) => orderController.acceptOrder(req, res));

  /**
   * @swagger
   * /api/orders/{id}/start:
   *   patch:
   *     tags: [Orders]
   *     summary: Start order (seller only)
   *     description: Mulai mengerjakan pesanan (Dalam Pengembangan)
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
  router.patch('/:id/start', authMiddleware, (req, res) => orderController.startOrder(req, res));

  /**
   * @swagger
   * /api/orders/{id}/complete:
   *   patch:
   *     tags: [Orders]
   *     summary: Complete order (seller only)
   *     description: Tandai pesanan selesai (Dalam Pengembangan)
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
  router.patch('/:id/complete', authMiddleware, (req, res) => orderController.completeOrder(req, res));

  /**
   * @swagger
   * /api/orders/{id}/cancel:
   *   patch:
   *     tags: [Orders]
   *     summary: Cancel order
   *     description: Batalkan pesanan (Dalam Pengembangan)
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
  router.patch('/:id/cancel', authMiddleware, (req, res) => orderController.cancelOrder(req, res));

  return router;
};
