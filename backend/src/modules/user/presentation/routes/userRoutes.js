// backend/src/modules/user/presentation/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

const userController = new UserController();

/**
 * @route   POST /api/users/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', userController.register);

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', userController.login);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, userController.updateProfile);

/**
 * @route   POST /api/users/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', userController.forgotPassword);

/**
 * @route   POST /api/users/verify-otp
 * @desc    Verify OTP for password reset
 * @access  Public
 */
router.post('/verify-otp', userController.verifyOTP);

/**
 * @route   POST /api/users/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', userController.resetPassword);

/**
 * @route   POST /api/users/update-password-direct
 * @desc    Update password directly (for hybrid service)
 * @access  Public
 */
router.post('/update-password-direct', userController.updatePasswordDirect);

/**
 * @route   POST /api/users/logout
 * @desc    Logout user (invalidate token)
 * @access  Private
 */
router.post('/logout', authMiddleware, userController.logout);

/**
 * @route   PUT /api/users/role
 * @desc    Change user role
 * @access  Private
 */
router.put('/role', authMiddleware, userController.changeRole);

module.exports = router;