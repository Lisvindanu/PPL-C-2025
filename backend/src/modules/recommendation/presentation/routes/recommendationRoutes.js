/**
 * Recommendation Routes
 * API routes untuk fitur rekomendasi layanan SkillConnect
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

// Import validators
const {
  getRecommendationsValidation,
  getSimilarServicesValidation,
  getPopularServicesValidation,
  trackInteractionValidation,
  addFavoriteValidation,
  removeFavoriteValidation,
  getInteractionHistoryValidation
} = require('../validators/recommendationValidators');

module.exports = (recommendationController, favoriteController) => {
  /**
   * @swagger
   * tags:
   *   name: Recommendations
   *   description: API untuk fitur rekomendasi layanan berdasarkan tren, histori pengguna, dan preferensi
   */

  /**
   * @swagger
   * components:
   *   schemas:
   *     Recommendation:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: ID rekomendasi
   *         userId:
   *           type: string
   *           description: ID pengguna
   *         serviceId:
   *           type: string
   *           description: ID layanan
   *         score:
   *           type: number
   *           description: Skor rekomendasi (0-100)
   *         reason:
   *           type: string
   *           description: Alasan rekomendasi
   *         source:
   *           type: string
   *           enum: [clicks, likes, orders, similar, popular]
   *           description: Sumber rekomendasi
   *         metadata:
   *           type: object
   *           description: Data tambahan layanan
   */

  // ==================== RECOMMENDATION ENDPOINTS ====================

  /**
   * @swagger
   * /api/recommendations:
   *   get:
   *     tags: [Recommendations]
   *     summary: Generate rekomendasi personal untuk pengguna
   *     description: Menghasilkan rekomendasi layanan berdasarkan tren, histori aktivitas, dan preferensi pengguna
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *           minimum: 1
   *           maximum: 50
   *         description: Jumlah rekomendasi yang dikembalikan
   *       - in: query
   *         name: refresh
   *         schema:
   *           type: boolean
   *           default: false
   *         description: Force refresh rekomendasi
   *       - in: query
   *         name: exclude
   *         schema:
   *           type: string
   *         description: Service IDs yang di-exclude (comma-separated)
   *     responses:
   *       200:
   *         description: Daftar rekomendasi berhasil dihasilkan
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Recommendations retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Recommendation'
   *                 metadata:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                     timestamp:
   *                       type: string
   *                       format: date-time
   *                     userId:
   *                       type: string
   *       401:
   *         description: Unauthorized - token tidak valid
   *       500:
   *         description: Terjadi kesalahan server
   */
  router.get(
    '/',
    authMiddleware,
    getRecommendationsValidation,
    (req, res) => recommendationController.getRecommendations(req, res)
  );

  /**
   * @swagger
   * /api/recommendations/popular:
   *   get:
   *     tags: [Recommendations]
   *     summary: Ambil layanan yang sedang populer/trending
   *     description: Menampilkan daftar layanan yang paling populer berdasarkan metrik (clicks, likes, orders, rating)
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *           minimum: 1
   *           maximum: 50
   *         description: Jumlah layanan populer
   *       - in: query
   *         name: timeRange
   *         schema:
   *           type: string
   *           enum: [24h, 7d, 30d, all]
   *           default: 7d
   *         description: Rentang waktu untuk menghitung popularitas
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Filter berdasarkan kategori
   *     responses:
   *       200:
   *         description: Daftar layanan populer berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Recommendation'
   *       500:
   *         description: Terjadi kesalahan server
   */
  router.get(
    '/popular',
    getPopularServicesValidation,
    (req, res) => recommendationController.getPopularServices(req, res)
  );

  /**
   * @swagger
   * /api/recommendations/similar/{serviceId}:
   *   get:
   *     tags: [Recommendations]
   *     summary: Ambil layanan serupa
   *     description: Mengambil layanan yang mirip berdasarkan kategori dan karakteristik
   *     parameters:
   *       - in: path
   *         name: serviceId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID layanan untuk mencari layanan serupa
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 5
   *           minimum: 1
   *           maximum: 20
   *         description: Jumlah layanan serupa
   *     responses:
   *       200:
   *         description: Daftar layanan serupa berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Recommendation'
   *       404:
   *         description: Layanan tidak ditemukan
   *       500:
   *         description: Terjadi kesalahan server
   */
  router.get(
    '/similar/:serviceId',
    getSimilarServicesValidation,
    (req, res) => recommendationController.getSimilarServices(req, res)
  );

  /**
   * @swagger
   * /api/recommendations/track:
   *   post:
   *     tags: [Recommendations]
   *     summary: Track interaksi user dengan layanan
   *     description: Mencatat interaksi user (view, click, like, order, dll) untuk meningkatkan akurasi rekomendasi
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - serviceId
   *               - interactionType
   *             properties:
   *               serviceId:
   *                 type: string
   *                 description: ID layanan yang di-interaksi
   *               interactionType:
   *                 type: string
   *                 enum: [view, click, like, unlike, order, rating, hide]
   *                 description: Tipe interaksi
   *               value:
   *                 type: number
   *                 default: 1
   *                 description: Nilai interaksi (untuk rating, dll)
   *               metadata:
   *                 type: object
   *                 description: Data tambahan
   *     responses:
   *       201:
   *         description: Interaksi berhasil dicatat
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.post(
    '/track',
    authMiddleware,
    trackInteractionValidation,
    (req, res) => recommendationController.trackInteraction(req, res)
  );

  /**
   * @swagger
   * /api/recommendations/interactions:
   *   get:
   *     tags: [Recommendations]
   *     summary: Ambil histori interaksi user
   *     description: Mengambil riwayat interaksi user dengan layanan untuk analisis
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: serviceId
   *         schema:
   *           type: string
   *         description: Filter berdasarkan service ID (optional)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 50
   *           minimum: 1
   *           maximum: 100
   *         description: Jumlah interaksi yang dikembalikan
   *     responses:
   *       200:
   *         description: Histori interaksi berhasil diambil
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.get(
    '/interactions',
    authMiddleware,
    getInteractionHistoryValidation,
    (req, res) => recommendationController.getInteractionHistory(req, res)
  );

  // ==================== FAVORITES ENDPOINTS ====================

  /**
   * @swagger
   * /api/recommendations/favorites/{serviceId}:
   *   post:
   *     tags: [Recommendations]
   *     summary: Tambahkan layanan ke favorit
   *     description: Menambahkan layanan ke daftar favorit user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: serviceId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID layanan yang akan ditambahkan ke favorit
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               notes:
   *                 type: string
   *                 maxLength: 500
   *                 description: Catatan tentang favorit (optional)
   *     responses:
   *       201:
   *         description: Layanan berhasil ditambahkan ke favorit
   *       400:
   *         description: Layanan sudah ada di favorit
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.post(
    '/favorites/:serviceId',
    authMiddleware,
    addFavoriteValidation,
    (req, res) => favoriteController.addFavorite(req, res)
  );

  /**
   * @swagger
   * /api/recommendations/favorites/{serviceId}:
   *   delete:
   *     tags: [Recommendations]
   *     summary: Hapus layanan dari favorit
   *     description: Menghapus layanan dari daftar favorit user
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: serviceId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID layanan yang akan dihapus dari favorit
   *     responses:
   *       200:
   *         description: Layanan berhasil dihapus dari favorit
   *       400:
   *         description: Favorit tidak ditemukan
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.delete(
    '/favorites/:serviceId',
    authMiddleware,
    removeFavoriteValidation,
    (req, res) => favoriteController.removeFavorite(req, res)
  );

  /**
   * @swagger
   * /api/recommendations/favorites:
   *   get:
   *     tags: [Recommendations]
   *     summary: Ambil daftar favorit user
   *     description: Mengambil semua layanan yang ada di daftar favorit user
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Daftar favorit berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       userId:
   *                         type: string
   *                       serviceId:
   *                         type: string
   *                       notes:
   *                         type: string
   *                       addedAt:
   *                         type: string
   *                         format: date-time
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */
  router.get(
    '/favorites',
    authMiddleware,
    (req, res) => favoriteController.getFavorites(req, res)
  );

  // ==================== HIDE SERVICE ENDPOINTS ====================

  /**
   * @swagger
   * /api/recommendations/hide/{serviceId}:
   *   post:
   *     tags: [Recommendations]
   *     summary: Sembunyikan layanan dari rekomendasi
   *     description: Menyembunyikan layanan tertentu agar tidak muncul lagi di rekomendasi pengguna
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: serviceId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID layanan yang ingin disembunyikan
   *     responses:
   *       200:
   *         description: Layanan berhasil disembunyikan dari rekomendasi
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Service hidden from recommendations"
   *                 data:
   *                   type: object
   *                   properties:
   *                     userId:
   *                       type: string
   *                       example: "123"
   *                     serviceId:
   *                       type: string
   *                       example: "45"
   *                     hiddenAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-11-08T10:26:37.593Z"
   *       400:
   *         description: Parameter serviceId tidak valid
   *       401:
   *         description: User tidak terautentikasi
   *       404:
   *         description: Layanan tidak ditemukan
   *       500:
   *         description: Terjadi kesalahan server
   */
  router.post(
    '/hide/:serviceId',
    authMiddleware,
    (req, res) => recommendationController.hideService(req, res)
  );


  /**
   * @swagger
   * /api/recommendations/hide/{serviceId}:
   *   delete:
   *     tags: [Recommendations]
   *     summary: Tampilkan kembali layanan yang disembunyikan (Unhide)
   *     description: Mengembalikan layanan yang sebelumnya disembunyikan agar muncul lagi di rekomendasi pengguna
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: serviceId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID layanan yang ingin ditampilkan kembali
   *     responses:
   *       200:
   *         description: Layanan berhasil ditampilkan kembali
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Service unhidden successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     userId:
   *                       type: string
   *                       example: "123"
   *                     serviceId:
   *                       type: string
   *                       example: "45"
   *                     unhiddenAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-11-08T10:30:00.000Z"
   *       400:
   *         description: Parameter serviceId tidak valid
   *       401:
   *         description: User tidak terautentikasi
   *       404:
   *         description: Layanan tidak ditemukan
   *       500:
   *         description: Terjadi kesalahan server
   */
  router.delete(
    '/hide/:serviceId',
    authMiddleware,
    (req, res) => recommendationController.unhideService(req, res)
  );


  // ==================== ADMIN ENDPOINTS ====================

  /**
   * @swagger
   * /api/recommendations/admin/stats:
   *   get:
   *     tags: [Admin]
   *     summary: Dapatkan statistik rekomendasi (Admin)
   *     description: Endpoint untuk melihat ringkasan statistik data rekomendasi, seperti total rekomendasi, jumlah interaksi, dan performa keseluruhan.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Statistik rekomendasi berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Recommendation statistics retrieved successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     totalRecommendations:
   *                       type: integer
   *                       example: 120
   *                     totalInteractions:
   *                       type: integer
   *                       example: 480
   *                     topCategory:
   *                       type: string
   *                       example: "Design & Creative"
   *                     generatedAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-11-08T10:35:00.000Z"
   *       401:
   *         description: User tidak terautentikasi atau tidak memiliki akses admin
   *       500:
   *         description: Terjadi kesalahan server
   */
  router.get(
    '/admin/stats',
    authMiddleware,
    (req, res) => recommendationController.getAdminStats(req, res)
  );


  /**
   * @swagger
   * /api/recommendations/admin/performance:
   *   get:
   *     tags: [Admin]
   *     summary: Dapatkan metrik performa rekomendasi (Admin)
   *     description: Endpoint untuk melihat performa algoritma rekomendasi berdasarkan engagement pengguna (clicks, likes, orders).
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Data performa berhasil diambil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Recommendation performance metrics retrieved successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     accuracy:
   *                       type: number
   *                       format: float
   *                       example: 0.87
   *                     precision:
   *                       type: number
   *                       format: float
   *                       example: 0.81
   *                     recall:
   *                       type: number
   *                       format: float
   *                       example: 0.84
   *                     lastUpdated:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-11-08T10:40:00.000Z"
   *       401:
   *         description: User tidak terautentikasi atau tidak memiliki akses admin
   *       500:
   *         description: Terjadi kesalahan server
   */
  router.get(
    '/admin/performance',
    authMiddleware,
    (req, res) => recommendationController.getRecommendationPerformance(req, res)
  );

  return router;
};