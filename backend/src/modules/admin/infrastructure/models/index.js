// modules/admin/infrastructure/models/index.js

const Kategori = require('./Kategori');
const SubKategori = require('./SubKategori');

// Kumpulkan semua models
const models = {
  Kategori,
  SubKategori
};

// ✅ Jalankan associate untuk semua models
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;