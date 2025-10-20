class GetUserAnalytics {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
  }

  async execute() {
    return await this.analyticsService.getUserAnalytics();
  }
}
module.exports = GetUserAnalytics;
