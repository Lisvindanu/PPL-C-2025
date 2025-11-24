// backend/src/modules/admin/config/categoryDependencies.js

const SequelizeKategoriRepository = require('../infrastructure/repositories/SequelizeKategoriRepository');
const SequelizeSubKategoriRepository = require('../infrastructure/repositories/SequelizeSubKategoriRepository');
const SequelizeAdminLogRepository = require('../infrastructure/repositories/SequelizeAdminLogRepository');

// Use Cases - Kategori
const CreateKategori = require('../application/use-cases/categories/CreateKategori');
const UpdateKategori = require('../application/use-cases/categories/UpdateKategori');
const DeleteKategori = require('../application/use-cases/categories/DeleteKategori');
const ToggleKategoriStatus = require('../application/use-cases/categories/ToggleKategoriStatus');
const ExportKategoriReport = require('../application/use-cases/categories/ExportKategoriReport');
const GetAllKategori = require('../application/use-cases/categories/GetAllKategori');

// Use Cases - SubKategori
const CreateSubKategori = require('../application/use-cases/categories/CreateSubKategori');
const UpdateSubKategori = require('../application/use-cases/categories/UpdateSubKategori');
const DeleteSubKategori = require('../application/use-cases/categories/DeleteSubKategori');
const GetAllSubKategori = require('../application/use-cases/categories/GetAllSubKategori');

// Controller
const AdminKategoriController = require('../presentation/controllers/AdminKategoriController');

module.exports = function setupKategoriDependencies(sequelize) {
  
  // Repositories
  const adminLogRepository = new SequelizeAdminLogRepository(sequelize);
  const kategoriRepository = new SequelizeKategoriRepository();
  const subKategoriRepository = new SequelizeSubKategoriRepository();

  // Use Case Instances - Kategori
  const createKategori = new CreateKategori(kategoriRepository, adminLogRepository);
  const updateKategori = new UpdateKategori(kategoriRepository, adminLogRepository);
  const deleteKategori = new DeleteKategori(kategoriRepository, adminLogRepository);
  const toggleKategoriStatus = new ToggleKategoriStatus(kategoriRepository, adminLogRepository);
  const exportKategoriReport = new ExportKategoriReport(kategoriRepository);
  const getAllKategori = new GetAllKategori(kategoriRepository);

  // Use Case Instances - SubKategori
  const createSubKategori = new CreateSubKategori(subKategoriRepository, kategoriRepository, adminLogRepository);
  const updateSubKategori = new UpdateSubKategori(subKategoriRepository, kategoriRepository, adminLogRepository);
  const deleteSubKategori = new DeleteSubKategori(subKategoriRepository, adminLogRepository);
  const getAllSubKategori = new GetAllSubKategori(subKategoriRepository, kategoriRepository);

  // Controller
  const adminKategoriController = new AdminKategoriController(
    createKategori,
    updateKategori,
    deleteKategori,
    toggleKategoriStatus,
    exportKategoriReport,
    createSubKategori,
    updateSubKategori,
    deleteSubKategori,
    getAllKategori,
    getAllSubKategori
  );

  return {
    adminKategoriController,
    kategoriRepository,
    subKategoriRepository,
    adminLogRepository,
    getAllKategori,
    getAllSubKategori
  };
};
