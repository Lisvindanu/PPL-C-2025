/**
 * Review Routes
 * API routes untuk review dan rating
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

module.exports = (reviewController) => {
  const router = express.Router();

  router.post('/', (req, res) => reviewController.createReview(req, res));
  router.get('/service/:layanan_id', (req, res) => reviewController.getServiceReviews(req, res));
  router.get('/freelancer/:id', (req, res) => reviewController.getByFreelancer(req, res));
  router.put('/:id', (req, res) => reviewController.updateReview(req, res));
  router.delete('/:id', (req, res) => reviewController.deleteReview(req, res));
  router.post('/:id/report', (req, res) => reviewController.reportReview(req, res));
  router.get('/latest', (req, res) => reviewController.getLatestReviews(req, res));

  return router;
};