/**
 * Service Module Dependencies Configuration
 * Dependency injection setup untuk service module
 */

module.exports = (sequelize) => {
  // Repository
  const SequelizeServiceRepository = require('../infrastructure/repositories/SequelizeServiceRepository');

  // Use Cases
  const GetAllServices = require('../application/use-cases/GetAllServices');
  const GetServiceById = require('../application/use-cases/GetServiceById');

  // Controllers
  const ServiceController = require('../presentation/controllers/ServiceController');
  const KategoriController = require('../presentation/controllers/KategoriController');
  const SubKategoriController = require('../presentation/controllers/SubKategoriController');

  // Initialize Repository
  const serviceRepository = new SequelizeServiceRepository(sequelize);

  // Initialize Use Cases
  const getAllServicesUseCase = new GetAllServices(serviceRepository);
  const getServiceByIdUseCase = new GetServiceById(serviceRepository);

  // Initialize Controllers
  const serviceController = new ServiceController(
    getAllServicesUseCase,
    getServiceByIdUseCase
  );

  const kategoriController = new KategoriController(sequelize);
  const subKategoriController = new SubKategoriController(sequelize);

  return {
    serviceController,
    kategoriController,
    subKategoriController
  };
};
