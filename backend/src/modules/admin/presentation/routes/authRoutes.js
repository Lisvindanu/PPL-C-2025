// backend/src/modules/auth/presentation/routes/authRoutes.js
const express = require('express');
const router = express.Router();

module.exports = (authController) => {
  // Login endpoint (public, tidak perlu auth)
  router.post('/login', (req, res) => {
    authController.login(req, res);
  });

  return router;
};