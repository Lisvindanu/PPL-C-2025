class AdminLogService {
  constructor(adminLogRepository, userRepository) {
    this.adminLogRepository = adminLogRepository;
    this.userRepository = userRepository;
  }

  async getUserList(filters) {
    const users = await this.userRepository.findWithFilters(filters);
    return users;
  }

  async getLogDetail(logId) {
    return await this.adminLogRepository.findById(logId);
  }
}

module.exports = AdminLogService;