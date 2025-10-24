const express = require('express');
const router = express.Router();

module.exports = (kategoriController) => {
  // Get all active categories
  router.get('/', kategoriController.getAllKategori.bind(kategoriController));

  return router;
};
