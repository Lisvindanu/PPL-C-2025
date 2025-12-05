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
   * tags:
   *   - name: Reviews
   *     description: API untuk mengelola review & rating
   *
   * components:
   *   schemas:
   *     CreateReviewRequest:
   *       type: object
   *       required:
   *         - pesanan_id
   *         - rating
   *         - komentar
   *       properties:
   *         pesanan_id:
   *           type: string
   *           format: uuid
   *           example: "6a1dbdf2-8d46-4b9f-8e63-bc0a597ad8a9"
   *         rating:
   *           type: integer
   *           minimum: 1
   *           maximum: 5
   *           example: 5
   *         judul:
   *           type: string
   *           example: "Luar biasa!"
   *         komentar:
   *           type: string
   *           example: "Desain bagus dan sesuai permintaan."
   *         gambar:
   *           type: array
   *           items:
   *             type: string
   *             format: url
   *
   *     ReplyReviewRequest:
   *       type: object
   *       required:
   *         - reply
   *       properties:
   *         reply:
   *           type: string
   *           example: "Terima kasih! Kami sudah memperbaiki seperti permintaan."
   *
   *     ReportReviewRequest:
   *       type: object
   *       properties:
   *         reason:
   *           type: string
   *           example: "Mengandung ujaran kebencian"
   *
   *     Review:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           example: 72475b9a-de40-4403-9081-b778d9d65e81
   *         pesanan_id:
   *           type: string
   *           example: 6a1dbdf2-8d46-4b9f-8e63-bc0a597ad8a9
   *         layanan_id:
   *           type: string
   *           example: df1d8b1e-7e3a-4b2a-bd23-6db83e820a75
   *         pemberi_ulasan_id:
   *           type: string
   *           example: be8f4f1f-8323-493b-9e7f-54b2cab020fd
   *         penerima_ulasan_id:
   *           type: string
   *           example: 8676fc2a-39e7-4f0e-9cc0-9dd5d11153f0
   *         rating:
   *           type: integer
   *           example: 5
   *         judul:
   *           type: string
   *           example: Luar biasa!
   *         komentar:
   *           type: string
   *           example: Desain bagus dan sesuai permintaan.
   *         gambar:
   *           type: array
   *           items:
   *             type: string
   *         balasan:
   *           type: string
   *           example: null
   *         dibalas_pada:
   *           type: string
   *           format: date-time
   *           example: null
   *         is_approved:
   *           type: tinyinteger
   *           example: 1
   *         is_reported:
   *           type: tinyinteger
   *           example: 0
   *         created_at:
   *           type: string
   *           format: date-time
   *         updated_at:
   *           type: string
   *           format: date-time
   *
   *   responses:
   *     UnauthorizedError:
   *       description: Unauthorized
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *               message:
   *                 type: string
   *
   *     ValidationError:
   *       description: Validation error
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *               message:
   *                 type: string
   *
   *     NotFoundError:
   *       description: Not found
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *               message:
   *                 type: string
   */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create review
 *     description: Buat review untuk pesanan yang sudah selesai
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *     responses:
 *       201:
 *         description: Review berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *             example:
 *               status: "success"
 *               message: "Ulasan berhasil dibuat"
 *               data:
 *                 id: "72475b9a-de40-4403-9081-b778d9d65e81"
 *                 is_approved: true
 *                 is_reported: false
 *                 pesanan_id: "6a1dbdf2-8d46-4b9f-8e63-bc0a597ad8a9"
 *                 layanan_id: "df1d8b1e-7e3a-4b2a-bd23-6db83e820a75"
 *                 pemberi_ulasan_id: "be8f4f1f-8323-493b-9e7f-54b2cab020fd"
 *                 penerima_ulasan_id: "8676fc2a-39e7-4f0e-9cc0-9dd5d11153f0"
 *                 rating: 5
 *                 judul: "Luar biasa!"
 *                 komentar: "Desain bagus dan sesuai permintaan."
 *                 gambar: [ "string" ]
 *                 created_at: "2025-11-22T18:20:28.011Z"
 *                 updated_at: "2025-11-22T18:20:28.011Z"
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
   *     description: Ambil semua review yang saya buat
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Berhasil mengambil review
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Review'
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
   *     description: Ambil semua review untuk layanan tertentu
   *     parameters:
   *       - in: path
   *         name: layanan_id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Berhasil mengambil review
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: object
   *                   properties:
   *                     reviews:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Review'
   */
  router.get('/service/:layanan_id', (req, res) => reviewController.getServiceReviews(req, res));

  /**
   * @swagger
   * /api/reviews/freelancer/{id}:
   *   get:
   *     tags: [Reviews]
   *     summary: Get reviews for freelancer
   *     description: Ambil semua review untuk freelancer tertentu
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Berhasil mengambil review
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: object
   *                   properties:
   *                     reviews:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Review'
   */
  router.get('/freelancer/:id', (req, res) => reviewController.getByFreelancer(req, res));

  /**
   * @swagger
   * /api/reviews/latest:
   *   get:
   *     tags: [Reviews]
   *     summary: Get latest reviews
   *     description: Ambil review terbaru
   *     responses:
   *       200:
   *         description: Berhasil mengambil review
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Review'
   */
  router.get('/latest', (req, res) => reviewController.getLatestReviews(req, res));

  /**
   * @swagger
   * /api/reviews/user/{user_id}:
   *   get:
   *     tags: [Reviews]
   *     summary: Get reviews by user
   *     description: Ambil semua review dari user tertentu
   *     parameters:
   *       - in: path
   *         name: user_id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Berhasil mengambil review
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Review'
   */
  router.get('/user/:user_id', (req, res) => reviewController.getUserReviews(req, res));

  /**
   * @swagger
   * /api/reviews/{id}/report:
   *   post:
   *     tags: [Reviews]
   *     summary: Report review
   *     description: Laporkan review yang melanggar
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ReportReviewRequest'
   *     responses:
   *       200:
   *         description: Review berhasil dilaporkan
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.post('/:id/report', authMiddleware, (req, res) => reviewController.reportReview(req, res));

  /**
   * @swagger
   * /api/reviews/{id}/reply:
   *   post:
   *     tags: [Reviews]
   *     summary: Reply to review (seller only)
   *     description: Balas review sebagai penyedia layanan
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ReplyReviewRequest'
   *     responses:
   *       200:
   *         description: Berhasil membalas review
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.post('/:id/reply', authMiddleware, (req, res) => reviewController.replyToReview(req, res));

  /**
   * @swagger
   * /api/reviews/{id}/helpful:
   *   post:
   *     tags: [Reviews]
   *     summary: Mark review as helpful (Dalam Pengembangan)
   *     description: Tandai review sebagai helpful
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Review ditandai helpful
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
   *     description: Update review
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               judul:
   *                 type: string
   *                 example: Update
   *               komentar:
   *                 type: string
   *                 example: Update
   *               rating:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 5
   *                 example: 5 
   *               gambar:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: url
   *     responses:
   *       200:
   *         description: Review berhasil diupdate
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
   *     description: Hapus review
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Review berhasil dihapus
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.delete('/:id', authMiddleware, (req, res) => reviewController.deleteReview(req, res));

  return router;
};
