// presentation/routes/admin/adminKategoriRoutes.js

const express = require('express');
const router = express.Router();

const authMiddleware = require('../../../../shared/middleware/authMiddleware');
const { sequelize } = require('../../../../shared/database/connection');

// Import controllers
const AdminKategoriController = require('../controllers/AdminKategoriController');
const AdminSubKategoriController = require('../controllers/AdminSubKategoriController');

// Import use cases - KATEGORI
const CreateKategori = require('../../application/use-cases/categories/CreateKategori');
const UpdateKategori = require('../../application/use-cases/categories/UpdateKategori');
const ToggleKategoriStatus = require('../../application/use-cases/categories/ToggleKategoriStatus');
const DeleteKategori = require('../../application/use-cases/categories/DeleteKategori');
const GetAllKategori = require('../../application/use-cases/categories/GetAllKategori');

// Import use cases - SUB KATEGORI
const CreateSubKategori = require('../../application/use-cases/categories/CreateSubKategori');
const UpdateSubKategori = require('../../application/use-cases/categories/UpdateSubKategori');
const DeleteSubKategori = require('../../application/use-cases/categories/DeleteSubKategori');
const GetAllSubKategori = require('../../application/use-cases/categories/GetAllSubKategori');
const ToggleSubKategoriStatus = require('../../application/use-cases/categories/ToggleSubKategoriStatus');

// Import repositories
const SequelizeKategoriRepository = require('../../infrastructure/repositories/SequelizeKategoriRepository');
const SequelizeSubKategoriRepository = require('../../infrastructure/repositories/SequelizeSubKategoriRepository');
const SequelizeAdminLogRepository = require('../../infrastructure/repositories/SequelizeAdminLogRepository');

// =========================
//  Inisialisasi Repository
// =========================
const kategoriRepository = new SequelizeKategoriRepository(sequelize);
const subKategoriRepository = new SequelizeSubKategoriRepository(sequelize);
const adminLogRepository = new SequelizeAdminLogRepository(sequelize);

// =========================
//  Inisialisasi Use Case
// =========================

// KATEGORI
const createKategoriUseCase = new CreateKategori(kategoriRepository, adminLogRepository);
const updateKategoriUseCase = new UpdateKategori(kategoriRepository, adminLogRepository);
const toggleKategoriStatusUseCase = new ToggleKategoriStatus(kategoriRepository, adminLogRepository);
const deleteKategoriUseCase = new DeleteKategori(kategoriRepository, subKategoriRepository, adminLogRepository);
const getAllKategoriUseCase = new GetAllKategori(kategoriRepository);

// SUB KATEGORI
const createSubKategoriUseCase = new CreateSubKategori(
  subKategoriRepository,
  kategoriRepository,
  adminLogRepository
);

const getAllSubKategoriUseCase = new GetAllSubKategori(
  subKategoriRepository
);

const updateSubKategoriUseCase = new UpdateSubKategori(
  subKategoriRepository,
  kategoriRepository,
  adminLogRepository
);

const toggleSubKategoriStatusUseCase = new ToggleSubKategoriStatus(
  subKategoriRepository,
  adminLogRepository
);


// ✅ PERBAIKI: Hanya 2 parameter
const deleteSubKategoriUseCase = new DeleteSubKategori(
  subKategoriRepository,
  adminLogRepository
);

// =========================
//  CONTROLLERS
// =========================

const adminKategoriController = new AdminKategoriController(
  createKategoriUseCase,
  updateKategoriUseCase,
  toggleKategoriStatusUseCase,
  deleteKategoriUseCase,
  getAllKategoriUseCase
);

const adminSubKategoriController = new AdminSubKategoriController(
  createSubKategoriUseCase,
  getAllSubKategoriUseCase,
  updateSubKategoriUseCase,
  deleteSubKategoriUseCase,
  toggleSubKategoriStatusUseCase   
);

// =========================
//  Middleware
// =========================

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User tidak terautentikasi'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak. Hanya admin yang diizinkan.'
    });
  }

  next();
};

router.use(authMiddleware);
router.use(isAdmin);

// =========================
//  ROUTES
// =========================

// KATEGORI
router.get('/kategori', (req, res) => adminKategoriController.getAllKategori(req, res));
router.post('/kategori', (req, res) => adminKategoriController.createKategori(req, res));
router.put('/kategori/:id', (req, res) => adminKategoriController.updateKategori(req, res));
router.patch('/kategori/:id/toggle-status', (req, res) => adminKategoriController.toggleKategoriStatus(req, res));
router.delete('/kategori/:id', (req, res) => adminKategoriController.deleteKategori(req, res));

// SUB KATEGORI
router.get('/sub-kategori', (req, res) => adminSubKategoriController.getAllSubKategori(req, res));
router.post('/sub-kategori', (req, res) => adminSubKategoriController.createSubKategori(req, res));
router.put('/sub-kategori/:id', (req, res) => adminSubKategoriController.updateSubKategori(req, res));
router.delete('/sub-kategori/:id', (req, res) => adminSubKategoriController.deleteSubKategori(req, res));
router.patch('/sub-kategori/:id/toggle-status', (req, res) => adminSubKategoriController.toggleSubKategoriStatus(req, res));

module.exports = router;