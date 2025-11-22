const SystemStats = require('../../domain/entities/SystemStats');

class AnalyticsService {
  constructor(analyticsRepository, paymentRepository, userRepository) {
    this.analyticsRepository = analyticsRepository;
    this.paymentRepository = paymentRepository;
    this.userRepository = userRepository;
  }

  async getDashboardStats() {
    try {
      const totalUsers = await this.userRepository.countByRole('all');
      const totalFreelancers = await this.userRepository.countByRole('freelancer');
      const totalClients = await this.userRepository.countByRole('client');
      const totalOrders = await this.analyticsRepository.countOrders();
      const completedOrders = await this.analyticsRepository.countOrders('selesai');
      const totalRevenue = await this.paymentRepository.sumSuccessful();
      const platformFees = await this.analyticsRepository.sumPlatformFees();

      // Return plain object dulu
      return {
        totalUsers,
        totalFreelancers,
        totalClients,
        totalOrders,
        completedOrders,
        totalRevenue,
        platformFees
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
  }

  async getUserAnalytics() {
    return await this.analyticsRepository.getUserTrend();
  }

  async getUserStatusDistribution() {
    return await this.analyticsRepository.getUserStatusDistribution();
  }

  async getOrderTrends(month = null, year = null) {
    return await this.analyticsRepository.getOrderTrends(month, year);
  }

  async getOrderCategoryTrends(month = null, year = null) {
    return await this.analyticsRepository.getOrderCategoryTrends(month, year);
  }

  async getOrderCategoryTrendsByTime(month = null, year = null) {
    return await this.analyticsRepository.getOrderCategoryTrendsByTime(month, year);
  }

  async getRevenueAnalytics(startDate, endDate, month = null, year = null) {
    return await this.analyticsRepository.getRevenueTrend(startDate, endDate, month, year);
  }

  async getOrderAnalytics() {
    return await this.analyticsRepository.getOrderStats();
  }

  async detectFraud() {
    return await this.analyticsRepository.detectAnomalies();
  }
}

module.exports = AnalyticsService;