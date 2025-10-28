class GetOrderAnalytics {
  constructor(analyticsRepository) {
    this.analyticsRepository = analyticsRepository;
  }

  async execute(startDate, endDate) {
    try {
      // Konversi string ke Date object
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Validasi date
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format');
      }

      // Kirim startDate dan endDate ke repository
      return await this.analyticsRepository.getOrderStats(start, end);
    } catch (error) {
      throw new Error(`Failed to get order analytics: ${error.message}`);
    }
  }
}

module.exports = GetOrderAnalytics;