const express = require('express');
const router = express.Router();

module.exports = (subKategoriController) => {
  /**
   * @swagger
   * /api/sub-kategori:
   *   get:
   *     tags: [Services]
   *     summary: Get all sub categories
   *     description: Retrieve list of all active sub categories, optionally filtered by category
   *     parameters:
   *       - in: query
   *         name: id_kategori
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filter by category ID
   *     responses:
   *       200:
   *         description: Sub categories retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         format: uuid
   *                         example: "123e4567-e89b-12d3-a456-426614174000"
   *                       id_kategori:
   *                         type: string
   *                         format: uuid
   *                         example: "987fcdeb-51a2-43f7-8d9e-12345678abcd"
   *                       nama:
   *                         type: string
   *                         example: "Logo Design"
   *                       slug:
   *                         type: string
   *                         example: "logo-design"
   *                       deskripsi:
   *                         type: string
   *                         example: "Professional logo design services"
   *                       icon:
   *                         type: string
   *                         example: "design"
   *                       nama_kategori:
   *                         type: string
   *                         example: "Desain Grafis"
   *                       kategori_slug:
   *                         type: string
   *                         example: "desain-grafis"
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/', subKategoriController.getAllSubKategori.bind(subKategoriController));

  /**
   * @swagger
   * /api/sub-kategori/{id}:
   *   get:
   *     tags: [Services]
   *     summary: Get sub category by ID
   *     description: Retrieve a specific sub category by its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Sub category ID
   *     responses:
   *       200:
   *         description: Sub category retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     id_kategori:
   *                       type: string
   *                       format: uuid
   *                     nama:
   *                       type: string
   *                     slug:
   *                       type: string
   *                     deskripsi:
   *                       type: string
   *                     icon:
   *                       type: string
   *                     nama_kategori:
   *                       type: string
   *                     kategori_slug:
   *                       type: string
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/:id', subKategoriController.getSubKategoriById.bind(subKategoriController));

  return router;
};
