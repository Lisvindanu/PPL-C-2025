const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

module.exports = (bookmarkController) => {
  /**
   * @swagger
   * tags:
   *   name: Bookmarks
   *   description: API untuk menyimpan layanan sebagai bookmark (menggunakan storage favorit)
   */

  /**
   * @swagger
   * /api/bookmarks:
   *   get:
   *     tags: [Bookmarks]
   *     summary: Ambil semua bookmark milik user saat ini
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Daftar bookmark berhasil diambil
   *       401:
   *         description: Unauthorized
   */
  router.get('/', authMiddleware, (req, res, next) => bookmarkController.getBookmarks(req, res, next));

  /**
   * @swagger
   * /api/bookmarks:
   *   post:
   *     tags: [Bookmarks]
   *     summary: Tambahkan layanan ke bookmark
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [layanan_id]
   *             properties:
   *               layanan_id:
   *                 type: string
   *     responses:
   *       201:
   *         description: Layanan berhasil ditambahkan ke bookmark
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */
  router.post('/', authMiddleware, (req, res, next) => bookmarkController.addBookmark(req, res, next));

  /**
   * @swagger
   * /api/bookmarks/{layananId}:
   *   delete:
   *     tags: [Bookmarks]
   *     summary: Hapus layanan dari bookmark
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: layananId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Layanan berhasil dihapus dari bookmark
   *       401:
   *         description: Unauthorized
   */
  router.delete('/:layananId', authMiddleware, (req, res, next) => bookmarkController.removeBookmark(req, res, next));

  /**
   * @swagger
   * /api/bookmarks/check/{layananId}:
   *   get:
   *     tags: [Bookmarks]
   *     summary: Cek apakah layanan sudah dibookmark
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: layananId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Status bookmark
   *       401:
   *         description: Unauthorized
   */
  router.get('/check/:layananId', authMiddleware, (req, res, next) => bookmarkController.checkBookmark(req, res, next));

  return router;
};