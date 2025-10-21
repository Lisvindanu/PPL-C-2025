class UnblockUser {
  constructor(userRepository, adminLogRepository) {
    this.userRepository = userRepository;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, userId, reason, ipAddress, userAgent) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User tidak ditemukan');

    await this.userRepository.update(userId, { isActive: true });

    const log = new AdminActivityLog({
      adminId,
      action: 'unblock_user',
      targetType: 'user',
      targetId: userId,
      detail: { reason },
      ipAddress,
      userAgent,
    });

    await this.adminLogRepository.save(log);
    return user;
  }
}
module.exports = UnblockUser;
