/**
 * Service Module Dependencies Configuration
 * Dependency injection setup untuk service module
 */

module.exports = (sequelize) => {
  // Repository
  const SequelizeServiceRepository = require("../infrastructure/repositories/SequelizeServiceRepository");

  // Use Cases
  const GetAllServices = require("../application/use-cases/GetAllServices");
  const GetServiceById = require("../application/use-cases/GetServiceById");
  const CreateService = require("../application/use-cases/CreateService");
  const UpdateService = require("../application/use-cases/UpdateService");
  const DeleteService = require("../application/use-cases/DeleteService");
  const SearchServices = require("../application/use-cases/SearchServices");
  const ApproveService = require("../application/use-cases/ApproveService");

  // Controllers
  const ServiceController = require("../presentation/controllers/ServiceController");
  const KategoriController = require("../presentation/controllers/KategoriController");
  const SubKategoriController = require("../presentation/controllers/SubKategoriController");

  // Initialize Repository
  const serviceRepository = new SequelizeServiceRepository(sequelize);

  // Initialize Use Cases
  const getAllServicesUseCase = new GetAllServices(serviceRepository);
  const getServiceByIdUseCase = new GetServiceById(serviceRepository);
  const createServiceUseCase = new CreateService(serviceRepository);
  const updateServiceUseCase = new UpdateService(serviceRepository);
  const deleteServiceUseCase = new DeleteService(serviceRepository);
  const searchServicesUseCase = new SearchServices(serviceRepository);
  const approveServiceUseCase = new ApproveService(serviceRepository);

  // Initialize Controllers
  const serviceController = new ServiceController(
    getAllServicesUseCase,
    getServiceByIdUseCase,
    createServiceUseCase,
    updateServiceUseCase,
    deleteServiceUseCase,
    searchServicesUseCase,
    approveServiceUseCase
  );

  const kategoriController = new KategoriController(sequelize);
  const subKategoriController = new SubKategoriController(sequelize);

  return {
    serviceController,
    kategoriController,
    subKategoriController,
  };
};
