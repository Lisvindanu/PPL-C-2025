/**
 * Service Routes
 * API routes untuk layanan/jasa
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../../shared/middleware/authMiddleware');
const adminMiddleware = require('../../../../shared/middleware/adminMiddleware');

module.exports = (serviceController) => {
  /**
   * @swagger
   * /api/services:
   *   get:
   *     tags: [Services]
   *     summary: Get all services with filters
   *     description: List layanan dengan filter kategori, lokasi, harga, rating (Dalam Pengembangan)
   *     parameters:
   *       - in: query
   *         name: kategori_id
   *         schema:
   *           type: string
   *       - in: query
   *         name: sub_kategori_id
   *         schema:
   *           type: string
   *       - in: query
   *         name: lokasi
   *         schema:
   *           type: string
   *       - in: query
   *         name: harga_min
   *         schema:
   *           type: number
   *       - in: query
   *         name: harga_max
   *         schema:
   *           type: number
   *       - in: query
   *         name: rating_min
   *         schema:
   *           type: number
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *           default: 20
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       200:
   *         description: Success
   */
  router.get('/', (req, res) => serviceController.getAllServices(req, res));

  /**
   * @swagger
   * /api/services/search:
   *   get:
   *     tags: [Services]
   *     summary: Search services
   *     description: Pencarian layanan berdasarkan keyword (Dalam Pengembangan)
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *           default: 20
   *     responses:
   *       501:
   *         description: Not implemented yet
   */
  router.get('/search', (req, res) => serviceController.searchServices(req, res));

  /**
   * @swagger
   * /api/services/my:
   *   get:
   *     tags: [Services]
   *     summary: Get my services
   *     description: Ambil semua layanan milik user yang login (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.get('/my', authMiddleware, (req, res) => serviceController.getMyServices(req, res));

  /**
   * @swagger
   * /api/services/{id}:
   *   get:
   *     tags: [Services]
   *     summary: Get service by ID
   *     description: Ambil detail layanan berdasarkan ID (Dalam Pengembangan)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       501:
   *         description: Not implemented yet
   */
  router.get('/:id', (req, res) => serviceController.getServiceById(req, res));

  /**
   * @swagger
   * /api/services/slug/{slug}:
   *   get:
   *     tags: [Services]
   *     summary: Get service by slug
   *     description: Ambil detail layanan berdasarkan slug (Dalam Pengembangan)
   *     parameters:
   *       - in: path
   *         name: slug
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       501:
   *         description: Not implemented yet
   */
  router.get('/slug/:slug', (req, res) => serviceController.getServiceBySlug(req, res));

  /**
   * @swagger
   * /api/services:
   *   post:
   *     tags: [Services]
   *     summary: Create new service
   *     description: Buat layanan baru (Dalam Pengembangan)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       501:
   *         description: Not implemented yet
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  router.post('/', authMiddleware, (req, res) => serviceController.createService(req, res));

  /**
   * @swagger
   * /api/services/{id}:
   *   put:
   *     tags: [Services]
   *     summary: Update service
   *     description: Update layanan (Dalam Pengembangan)
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
  router.put('/:id', authMiddleware, (req, res) => serviceController.updateService(req, res));

  /**
   * @swagger
   * /api/services/{id}:
   *   delete:
   *     tags: [Services]
   *     summary: Delete service
   *     description: Hapus layanan (soft delete) (Dalam Pengembangan)
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
  router.delete('/:id', authMiddleware, (req, res) => serviceController.deleteService(req, res));

  /**
   * @swagger
   * /api/services/{id}/status:
   *   patch:
   *     tags: [Services]
   *     summary: Update service status (Admin only)
   *     description: Approve/reject layanan (Dalam Pengembangan)
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
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   */
  router.patch('/:id/status', authMiddleware, adminMiddleware, (req, res) => serviceController.updateServiceStatus(req, res));

  return router;
};
