const AdminActivityLog = require('../../domain/entities/AdminActivityLog');

class ExportReport {
  constructor(reportGenerator, adminLogRepository) {
    this.reportGenerator = reportGenerator;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, reportType, format, filters, ipAddress, userAgent) {
    try {
      // Validasi dependencies
      if (!this.reportGenerator) {
        throw new Error('reportGenerator is not initialized');
      }
      if (!this.adminLogRepository) {
        throw new Error('adminLogRepository is not initialized');
      }

      // Generate report
      const report = await this.reportGenerator.generate(reportType, format, filters);

      if (!report) {
        throw new Error('Failed to generate report');
      }

      // Log activity
      const log = new AdminActivityLog({
        adminId,
        action: 'export_report',
        targetType: 'system',
        targetId: null,
        detail: { reportType, format, filters },
        ipAddress,
        userAgent,
      });

      await this.adminLogRepository.save(log);
      return report;
    } catch (error) {
      console.error('Error in ExportReport.execute:', error);
      throw error;
    }
  }
}

module.exports = ExportReport;