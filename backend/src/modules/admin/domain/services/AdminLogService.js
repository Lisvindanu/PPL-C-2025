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

  async getLogs(filters = {}) {
    const { adminId, limit = 50, offset = 0 } = filters;
    
    const whereClause = {};
    if (adminId) {
      whereClause.admin_id = adminId;
    }

    const logs = await this.adminLogRepository.findAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return logs;
  }
}

module.exports = AdminLogService;