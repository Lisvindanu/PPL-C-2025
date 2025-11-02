/**
 * Recommendation Routes
 * API routes untuk rekomendasi layanan
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

module.exports = (recommendationController) => {
  /**
   * @swagger
   * /api/recommendations:
   *   get:
   *     tags: [Recommendations]
   *     summary: Get personalized recommendations
   *     description: Ambil rekomendasi layanan berdasarkan preferensi user (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.get('/', authMiddleware, (req, res) => recommendationController.getPersonalizedRecommendations(req, res));

  /**
   * @swagger
   * /api/recommendations/trending:
   *   get:
   *     tags: [Recommendations]
   *     summary: Get trending services
   *     description: Ambil layanan yang sedang trending (Dalam Pengembangan)
   *     responses:
   *       501:
   *         description: Not implemented yet
   */
  router.get('/trending', (req, res) => recommendationController.getTrendingServices(req, res));

  /**
   * @swagger
   * /api/recommendations/similar/{layanan_id}:
   *   get:
   *     tags: [Recommendations]
   *     summary: Get similar services
   *     description: Ambil layanan yang mirip dengan layanan tertentu (Dalam Pengembangan)
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
  router.get('/similar/:layanan_id', (req, res) => recommendationController.getSimilarServices(req, res));

  /**
   * @swagger
   * /api/recommendations/popular/{kategori_id}:
   *   get:
   *     tags: [Recommendations]
   *     summary: Get popular services in category
   *     description: Ambil layanan populer dalam kategori tertentu (Dalam Pengembangan)
   *     parameters:
   *       - in: path
   *         name: kategori_id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       501:
   *         description: Not implemented yet
   */
  router.get('/popular/:kategori_id', (req, res) => recommendationController.getPopularInCategory(req, res));

  /**
   * @swagger
   * /api/recommendations/history:
   *   get:
   *     tags: [Recommendations]
   *     summary: Get recommendations from browsing history
   *     description: Ambil rekomendasi berdasarkan riwayat browsing (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.get('/history', authMiddleware, (req, res) => recommendationController.getRecommendationsFromHistory(req, res));

  return router;
};
