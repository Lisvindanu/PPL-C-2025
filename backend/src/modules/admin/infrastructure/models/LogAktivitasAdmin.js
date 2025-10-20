module.exports = (sequelize, DataTypes) => {
  const LogAktivitasAdmin = sequelize.define('LogAktivitasAdmin', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    admin_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    aksi: {
      type: DataTypes.ENUM(
        'block_user',
        'unblock_user',
        'block_service',
        'unblock_service',
        'delete_review',
        'approve_withdrawal',
        'reject_withdrawal',
        'update_user',
        'export_report'
      ),
      allowNull: false,
    },
    target_type: {
      type: DataTypes.ENUM('user', 'layanan', 'ulasan', 'pesanan', 'pembayaran', 'system'),
      allowNull: false,
    },
    target_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
    },
    detail: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.VARCHAR(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'log_aktivitas_admin',
    timestamps: false,
    indexes: [
      { fields: ['admin_id'] },
      { fields: ['aksi'] },
      { fields: ['target_type', 'target_id'] },
      { fields: ['created_at'] },
    ],
  });

  LogAktivitasAdmin.associate = (models) => {
    LogAktivitasAdmin.belongsTo(models.User, {
      foreignKey: 'admin_id',
      as: 'admin',
    });
  };

  return LogAktivitasAdmin;
};