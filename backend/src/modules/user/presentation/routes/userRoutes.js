// backend/src/modules/user/presentation/routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Temporary test routes (akan diganti dengan controller nanti)

/**
 * @route   POST /api/users/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // TODO: Implement register logic with Use Case
    // Temporary response
    res.status(201).json({
      success: true,
      message: 'User registered successfully (TEMPORARY)',
      data: {
        userId: 'temp-user-id',
        email,
        role: role || 'client'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // TODO: Implement login logic with Use Case
    // Temporary response
    res.status(200).json({
      success: true,
      message: 'Login successful (TEMPORARY)',
      data: {
        token: 'temporary-jwt-token',
        user: {
          id: 'temp-user-id',
          email,
          role: 'client',
          firstName: 'Test',
          lastName: 'User'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', (req, res) => {
  // TODO: Add authentication middleware
  res.status(200).json({
    success: true,
    data: {
      id: 'temp-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'client'
    }
  });
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', (req, res) => {
  // TODO: Add authentication middleware
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: req.body
  });
});

module.exports = router;