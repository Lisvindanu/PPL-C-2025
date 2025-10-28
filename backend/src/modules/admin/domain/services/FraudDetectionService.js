class FraudDetectionService {
  constructor(analyticsRepository, paymentRepository) {
    this.analyticsRepository = analyticsRepository;
    this.paymentRepository = paymentRepository;
  }

  async checkSuspiciousPatterns() {
    try {
      // Get anomalies dari analytics repository
      const anomalies = await this.analyticsRepository.detectAnomalies();

      // Get failed payments
      const failedPayments = await this.paymentRepository.getFailedRecent(10);

      // Get multiple failed payments by user
      const multipleFailures = await this.paymentRepository.getMultipleFailedByUser(3);

      // Combine suspicious patterns
      const suspicious = {
        anomalies: anomalies || [],
        failedPayments: failedPayments || [],
        multipleFailures: multipleFailures || [],
        total: (anomalies?.length || 0) + (failedPayments?.length || 0) + (multipleFailures?.length || 0)
      };

      return suspicious;
    } catch (error) {
      console.error('Error checking suspicious patterns:', error);
      throw new Error(`Failed to check suspicious patterns: ${error.message}`);
    }
  }
}

module.exports = FraudDetectionService;