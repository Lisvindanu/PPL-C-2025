class GetRevenueAnalytics {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
  }

  async execute(startDate, endDate) {
    try {
      return await this.analyticsService.getRevenueAnalytics(startDate, endDate);
    } catch (error) {
      throw new Error(`Failed to get revenue analytics: ${error.message}`);
    }
  }
}

module.exports = GetRevenueAnalytics;