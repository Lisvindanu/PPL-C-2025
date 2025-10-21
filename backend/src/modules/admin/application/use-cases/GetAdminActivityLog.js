class GetAdminActivityLog {
  constructor(adminLogRepository) {
    this.adminLogRepository = adminLogRepository;
  }

  async execute(filters = {}) {
    try {
      return await this.adminLogRepository.getLogs(filters);
    } catch (error) {
      throw new Error(`Failed to get activity logs: ${error.message}`);
    }
  }
}

module.exports = GetAdminActivityLog;