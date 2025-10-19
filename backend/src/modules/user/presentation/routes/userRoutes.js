const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../../../../shared/middleware/authMiddleware');

const router = express.Router();
const controller = new UserController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/profile', authMiddleware, controller.getProfile);
router.put('/profile', authMiddleware, controller.updateProfile);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

module.exports = router;


