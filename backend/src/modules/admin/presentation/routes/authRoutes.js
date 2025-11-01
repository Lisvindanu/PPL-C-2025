// backend/src/modules/auth/presentation/routes/authRoutes.js
const express = require('express');
const router = express.Router();

module.exports = (authController) => {
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags: [Authentication]
   *     summary: Admin login
   *     description: Authenticate admin user and get JWT token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         description: Invalid credentials or not an admin
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.post('/login', (req, res) => {
    authController.login(req, res);
  });

  return router;
};