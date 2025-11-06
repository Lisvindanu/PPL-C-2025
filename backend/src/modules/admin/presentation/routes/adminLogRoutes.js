const express = require('express');
const router = express.Router();

module.exports = (adminLogController) => {
  /**
   * @swagger
   * /api/admin/activity-log:
   *   get:
   *     tags: [Admin]
   *     summary: Get activity log
   *     description: Retrieve all admin activity logs (alternative endpoint)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Activity logs retrieved successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       403:
   *         $ref: '#/components/responses/ForbiddenError'
   *       500:
   *         $ref: '#/components/responses/ServerError'
   */
  router.get('/activity-log', (req, res) => adminLogController.getActivityLog(req, res));

  return router;
};