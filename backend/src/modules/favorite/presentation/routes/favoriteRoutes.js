const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/FavoriteController');
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

const favoriteController = new FavoriteController();

/**
 * @route   POST /api/favorites/counts
 * @desc    Get favorite counts for multiple services
 * @access  Public
 * @body    { layanan_ids: string[] }
 */
router.post('/counts', favoriteController.getFavoriteCounts);

/**
 * @route   GET /api/favorites
 * @desc    Get all favorites for current user
 * @access  Private (Client only)
 */
router.get('/', authMiddleware, favoriteController.getFavorites);

/**
 * @route   POST /api/favorites
 * @desc    Add a service to favorites
 * @access  Private (Client only)
 * @body    { layanan_id: string }
 */
router.post('/', authMiddleware, favoriteController.addFavorite);

/**
 * @route   DELETE /api/favorites/:layananId
 * @desc    Remove a service from favorites
 * @access  Private (Client only)
 */
router.delete('/:layananId', authMiddleware, favoriteController.removeFavorite);

/**
 * @route   GET /api/favorites/check/:layananId
 * @desc    Check if a service is favorited
 * @access  Private (Client only)
 */
router.get('/check/:layananId', authMiddleware, favoriteController.checkFavorite);

module.exports = router;
