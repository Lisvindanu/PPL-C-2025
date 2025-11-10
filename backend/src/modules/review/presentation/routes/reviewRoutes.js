/**
 * Review Routes
 * -------------
 * Endpoint publik untuk fitur review & rating.
 */

const express = require('express');
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

module.exports = (reviewController) => {
  const router = express.Router();

  // Create review → wajib login
  router.post('/', authMiddleware, (req, res) =>
    reviewController.createReview(req, res)
  );

  // Ambil review berdasarkan layanan
  router.get('/service/:layanan_id', (req, res) =>
    reviewController.getServiceReviews(req, res)
  );

  // Ambil review berdasarkan freelancer
  router.get('/freelancer/:id', (req, res) =>
    reviewController.getByFreelancer(req, res)
  );

  // Update review → wajib login
  router.put('/:id', authMiddleware, (req, res) =>
    reviewController.updateReview(req, res)
  );

  // Hapus review → wajib login / admin
  router.delete('/:id', authMiddleware, (req, res) =>
    reviewController.deleteReview(req, res)
  );

  // Laporkan review → wajib login
  router.post('/:id/report', authMiddleware, (req, res) =>
    reviewController.reportReview(req, res)
  );

  // Review terbaru
  router.get('/latest', (req, res) =>
    reviewController.getLatestReviews(req, res)
  );

  return router;
};
