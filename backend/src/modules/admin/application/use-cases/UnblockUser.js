class UnblockUser {
  constructor(sequelize, adminLogRepository) {
    this.sequelize = sequelize;
    this.adminLogRepository = adminLogRepository;
  }

  async execute(adminId, userId, reason, ipAddress, userAgent) {
    // ======== UBAH: Pakai sequelize.query langsung ========
    const [user] = await this.sequelize.query(
      'SELECT id FROM users WHERE id = ?',
      { 
        replacements: [userId], 
        raw: true, 
        type: this.sequelize.QueryTypes.SELECT 
      }
    );

    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Update user jadi aktif
    await this.sequelize.query(
      'UPDATE users SET is_active = 1, updated_at = NOW() WHERE id = ?',
      { replacements: [userId] }
    );
    // ======================================================

    // Save log
    await this.adminLogRepository.save({
      admin_id: adminId,
      aksi: 'unblock_user',
      target_type: 'user',
      target_id: userId,
      detail: { reason },
      ip_address: ipAddress,
      user_agent: userAgent
    });

    return {
      userId,
      reason,
      status: 'active',
      unblockedAt: new Date()
    };
  }
}

module.exports = UnblockUser;