class GetDashboardStats {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
  }

  async execute() {
    return await this.analyticsService.getDashboardStats();
  }
}
module.exports = GetDashboardStats;
