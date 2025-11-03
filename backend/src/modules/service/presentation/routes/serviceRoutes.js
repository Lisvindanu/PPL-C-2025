const express = require('express');
const ServiceController = require('../controllers/ServiceController');

const router = express.Router();
const serviceController = new ServiceController();

/**
 * @route   GET /api/services
 * @desc    Get list of services with filters
 * @access  Public
 * @query   search, kategori, minPrice, maxPrice, minRating, sortBy, sortOrder, page, limit
 */
router.get('/', (req, res) => serviceController.listServices(req, res));

/**
 * @route   GET /api/services/:identifier
 * @desc    Get service detail by ID or slug
 * @access  Public
 * @param   identifier (UUID or slug)
 */
router.get('/:identifier', (req, res) => serviceController.getServiceDetail(req, res));

module.exports = router;
