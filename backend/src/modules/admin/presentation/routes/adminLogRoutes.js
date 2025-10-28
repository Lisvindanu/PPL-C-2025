const express = require('express');
const router = express.Router();

module.exports = (adminLogController) => {
  router.get('/activity-log', (req, res) => adminLogController.getActivityLog(req, res));

  return router;
};