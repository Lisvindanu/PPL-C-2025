const express = require('express');
const router = express.Router();

module.exports = (kategoriController) => {
  /**
   * @swagger
   * /api/kategori:
   *   get:
   *     tags: [Services]
   *     summary: Get all categories
   *     description: Retrieve list of all active service categories
   *     responses:
   *       200:
   *         description: Categories retrieved successfully
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
   *                       nama:
   *                         type: string
   *                         example: "Web Development"
   *                       slug:
   *                         type: string
   *                         example: "web-development"
   *                       deskripsi:
   *                         type: string
   *                         example: "Build and maintain websites and web applications"
   *                       icon:
   *                         type: string
   *                         example: "code"
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/', kategoriController.getAllKategori.bind(kategoriController));

  return router;
};
