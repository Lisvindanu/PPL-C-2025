class BlockUser {
  constructor(sequelize, adminLogRepository) {
    this.sequelize = sequelize;
    this.adminLogRepository = adminLogRepository;
  }

async execute(adminId, userId, reason, ipAddress, userAgent) {
  try {
    // Validate user exists
    const [user] = await this.sequelize.query(
      'SELECT id FROM users WHERE id = ?',
      { replacements: [userId], raw: true, type: this.sequelize.QueryTypes.SELECT }
    );

    if (!user) {
      throw new Error(`User dengan ID ${userId} tidak ditemukan`);
    }

    // Block user
    await this.sequelize.query(
      'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?',
      { replacements: [userId] }
    );

    // ======== TAMBAHKAN DEBUG INI ========
    console.log('=== DEBUG BEFORE SAVE LOG ===');
    console.log('adminId:', adminId);
    console.log('userId:', userId);
    console.log('reason:', reason);
    console.log('ipAddress:', ipAddress);
    console.log('userAgent:', userAgent);
    console.log('===========================');
    // =====================================

    // Log activity
await this.adminLogRepository.save({
  adminId: adminId,
  action: 'block_user',
  targetType: 'user',
  targetId: userId,
  detail: { reason },
  ipAddress: ipAddress,
  userAgent: userAgent
});

    return {
      userId,
      reason,
      status: 'blocked',
      blockedAt: new Date()
    };
  } catch (error) {
    throw new Error(`Failed to block user: ${error.message}`);
  }
}
}

module.exports = BlockUser;