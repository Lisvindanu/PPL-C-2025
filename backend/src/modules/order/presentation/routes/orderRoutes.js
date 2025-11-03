const express = require('express');
const OrderController = require('../controllers/OrderController');
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

const router = express.Router();
const orderController = new OrderController();

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private (Client only)
 */
router.post('/', authMiddleware, (req, res) => orderController.createOrder(req, res));

/**
 * @route   GET /api/orders
 * @desc    Get user orders
 * @access  Private
 */
router.get('/', authMiddleware, (req, res) => orderController.getUserOrders(req, res));

/**
 * @route   GET /api/orders/:id
 * @desc    Get order detail
 * @access  Private
 */
router.get('/:id', authMiddleware, (req, res) => orderController.getOrderDetail(req, res));

module.exports = router;
