class AdminActivityLog {
  constructor(data) {
    this.id = data.id;
    this.adminId = data.adminId;
    this.action = data.action; // block_user, unblock_user, etc
    this.targetType = data.targetType; // user, layanan, ulasan, etc
    this.targetId = data.targetId;
    this.detail = data.detail;
    this.ipAddress = data.ipAddress;
    this.userAgent = data.userAgent;
    this.createdAt = data.createdAt || new Date();
  }

  isValid() {
    return this.adminId && this.action && this.targetType;
  }
}

module.exports = AdminActivityLog;