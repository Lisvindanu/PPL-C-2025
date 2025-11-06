/**
 * Review Routes
 * API routes untuk review dan rating
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

module.exports = (reviewController) => {
  /**
   * @swagger
   * /api/reviews:
   *   post:
   *     tags: [Reviews]
   *     summary: Create review
   *     description: Buat review untuk pesanan yang sudah selesai (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.post('/', authMiddleware, (req, res) => reviewController.createReview(req, res));

  /**
   * @swagger
   * /api/reviews/my:
   *   get:
   *     tags: [Reviews]
   *     summary: Get my reviews
   *     description: Ambil semua review yang saya buat (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.get('/my', authMiddleware, (req, res) => reviewController.getMyReviews(req, res));

  /**
   * @swagger
   * /api/reviews/service/{layanan_id}:
   *   get:
   *     tags: [Reviews]
   *     summary: Get reviews for a service
   *     description: Ambil semua review untuk layanan tertentu (Dalam Pengembangan)
   *     parameters:
   *       - in: path
   *         name: layanan_id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       501:
   *         description: Not implemented yet
   */
  router.get('/service/:layanan_id', (req, res) => reviewController.getServiceReviews(req, res));

  /**
   * @swagger
   * /api/reviews/user/{user_id}:
   *   get:
   *     tags: [Reviews]
   *     summary: Get reviews by user
   *     description: Ambil semua review dari user tertentu (Dalam Pengembangan)
   *     parameters:
   *       - in: path
   *         name: user_id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       501:
   *         description: Not implemented yet
   */
  router.get('/user/:user_id', (req, res) => reviewController.getUserReviews(req, res));

  /**
   * @swagger
   * /api/reviews/{id}/reply:
   *   post:
   *     tags: [Reviews]
   *     summary: Reply to review (seller only)
   *     description: Balas review sebagai penyedia layanan (Dalam Pengembangan)
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
  router.post('/:id/reply', authMiddleware, (req, res) => reviewController.replyToReview(req, res));

  /**
   * @swagger
   * /api/reviews/{id}/helpful:
   *   post:
   *     tags: [Reviews]
   *     summary: Mark review as helpful
   *     description: Tandai review sebagai helpful (Dalam Pengembangan)
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
  router.post('/:id/helpful', authMiddleware, (req, res) => reviewController.markHelpful(req, res));

  /**
   * @swagger
   * /api/reviews/{id}:
   *   put:
   *     tags: [Reviews]
   *     summary: Update review
   *     description: Update review (Dalam Pengembangan)
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
  router.put('/:id', authMiddleware, (req, res) => reviewController.updateReview(req, res));

  /**
   * @swagger
   * /api/reviews/{id}:
   *   delete:
   *     tags: [Reviews]
   *     summary: Delete review
   *     description: Hapus review (Dalam Pengembangan)
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
  router.delete('/:id', authMiddleware, (req, res) => reviewController.deleteReview(req, res));

  return router;
};
