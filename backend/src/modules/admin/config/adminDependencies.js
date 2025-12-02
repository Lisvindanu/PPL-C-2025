// ================================
// 📦 Import Domain Services
// ================================
const AnalyticsService = require('../domain/services/AnalyticsService');
const FraudDetectionService = require('../domain/services/FraudDetectionService');
const AdminLogService = require('../domain/services/AdminLogService');

// ================================
// 🗄️ Import Infrastructure Repositories
// ================================
const SequelizeAdminLogRepository = require('../infrastructure/repositories/SequelizeAdminLogRepository');
const SequelizeUserRepository = require('../infrastructure/repositories/SequelizeUserRepository');
const SequelizeAnalyticsRepository = require('../infrastructure/repositories/SequelizeAnalyticsRepository');
const SequelizePaymentRepository = require('../infrastructure/repositories/SequelizePaymentRepository');
const SequelizeReviewRepository = require('../infrastructure/repositories/SequelizeReviewRepository');
const SequelizeServiceRepository = require('../infrastructure/repositories/SequelizeServiceRepository');

// ================================
// 🧠 Import Application Use Cases
// ================================
const GetDashboardStats = require('../application/use-cases/GetDashboardStats');
const GetUserAnalytics = require('../application/use-cases/GetUserAnalytics');
const GetRevenueAnalytics = require('../application/use-cases/GetRevenueAnalytics');
const GetOrderAnalytics = require('../application/use-cases/GetOrderAnalytics');
const GetTransactionList = require('../application/use-cases/GetTransactionList');
const BlockUser = require('../application/use-cases/BlockUser');
const UnblockUser = require('../application/use-cases/UnblockUser');
const BlockService = require('../application/use-cases/BlockService');
const UnblockService = require('../application/use-cases/UnblockService'); // ← TAMBAHKAN INI
const DeleteReview = require('../application/use-cases/DeleteReview');
const ExportReport = require('../application/use-cases/ExportReport');
const GetAdminActivityLog = require('../application/use-cases/GetAdminActivityLog');

// ================================
// 🛠️ Utility & Infrastructure Services
// ================================
const ReportGenerator = require('../infrastructure/services/ReportGenerator');

// ================================
// 🧱 Import Controllers
// ================================
const AdminController = require('../presentation/controllers/AdminController');
const AdminLogController = require('../presentation/controllers/AdminLogController');

// ================================
// ⚙️ Setup Dependencies
// ================================
module.exports = function setupAdminDependencies(sequelize) {
  // =====================================
  // 🔹 Repository Instances
  // =====================================
  const adminLogRepository = new SequelizeAdminLogRepository(sequelize);
  const userRepository = new SequelizeUserRepository(sequelize);
  const analyticsRepository = new SequelizeAnalyticsRepository(sequelize);
  const paymentRepository = new SequelizePaymentRepository(sequelize);
  const reviewRepository = new SequelizeReviewRepository(sequelize);
  const serviceRepository = new SequelizeServiceRepository(sequelize);

  // =====================================
  // 🧠 Domain Services
  // =====================================
  const analyticsService = new AnalyticsService(
    analyticsRepository,
    paymentRepository,
    userRepository
  );

  const fraudDetectionService = new FraudDetectionService(
    analyticsRepository,
    paymentRepository
  );

  const adminLogService = new AdminLogService(
    adminLogRepository,
    userRepository
  );

  // =====================================
  // ⚙️ Application Use Cases
  // =====================================
  const getDashboardStats = new GetDashboardStats(analyticsService);
  const getUserAnalytics = new GetUserAnalytics(analyticsService);
  const getRevenueAnalytics = new GetRevenueAnalytics(analyticsService);
  const getOrderAnalytics = new GetOrderAnalytics(analyticsRepository);
  const getTransactionList = new GetTransactionList(paymentRepository);

  const blockUser = new BlockUser(sequelize, adminLogRepository);
  const unblockUser = new UnblockUser(sequelize, adminLogRepository);
  const blockService = new BlockService(serviceRepository, adminLogRepository);
  const unblockService = new UnblockService(serviceRepository, adminLogRepository); // ← TAMBAHKAN INI
  const deleteReview = new DeleteReview(reviewRepository, adminLogRepository);

  const reportGenerator = new ReportGenerator(sequelize, adminLogService);
  const exportReport = new ExportReport(reportGenerator, adminLogRepository);
  const getAdminActivityLog = new GetAdminActivityLog(adminLogRepository);

  // =====================================
  // 🧩 Controllers
  // =====================================
  const adminController = new AdminController(
    getDashboardStats,
    getUserAnalytics,
    getRevenueAnalytics,
    getOrderAnalytics,
    getTransactionList,
    blockUser,
    unblockUser,
    blockService,
    unblockService, // ← TAMBAHKAN INI
    deleteReview,
    exportReport,
    getAdminActivityLog,
    fraudDetectionService,
    adminLogService,
    analyticsService,
    sequelize
  );

  const adminLogController = new AdminLogController(getAdminActivityLog);

  // =====================================
  // ✅ Return All Dependencies
  // =====================================
  return {
    adminController,
    adminLogController
  };
};