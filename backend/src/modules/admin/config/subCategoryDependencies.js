// backend/src/modules/admin/config/subCategoryDependencies.js

const SequelizeKategoriRepository = require('../infrastructure/repositories/SequelizeKategoriRepository');
const SequelizeSubKategoriRepository = require('../infrastructure/repositories/SequelizeSubKategoriRepository');
const SequelizeAdminLogRepository = require('../infrastructure/repositories/SequelizeAdminLogRepository');

// Use Cases - SubKategori
const CreateSubKategori = require('../application/use-cases/categories/CreateSubKategori');
const UpdateSubKategori = require('../application/use-cases/categories/UpdateSubKategori');
const DeleteSubKategori = require('../application/use-cases/categories/DeleteSubKategori');
const GetAllSubKategori = require('../application/use-cases/categories/GetAllSubKategori');

// Controller
const AdminSubKategoriController = require('../presentation/controllers/AdminSubKategoriController');

module.exports = function setupSubKategoriDependencies(sequelize) {
  
  const adminLogRepository = new SequelizeAdminLogRepository(sequelize);
  const kategoriRepository = new SequelizeKategoriRepository();
  const subKategoriRepository = new SequelizeSubKategoriRepository();

  const createSubKategori = new CreateSubKategori(
    subKategoriRepository,
    kategoriRepository,
    adminLogRepository
  );

  const updateSubKategori = new UpdateSubKategori(
    subKategoriRepository,
    kategoriRepository,
    adminLogRepository
  );

  const deleteSubKategori = new DeleteSubKategori(
    subKategoriRepository,
    adminLogRepository
  );

  const getAllSubKategori = new GetAllSubKategori(
    subKategoriRepository,
    kategoriRepository
  );

  const adminSubKategoriController = new AdminSubKategoriController(
    createSubKategori,
    updateSubKategori,
    deleteSubKategori,
    getAllSubKategori
  );

  return {
    adminSubKategoriController
  };
};
