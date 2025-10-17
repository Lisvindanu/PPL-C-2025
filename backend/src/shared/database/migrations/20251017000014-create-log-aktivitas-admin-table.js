'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('log_aktivitas_admin', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      admin_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke users (admin)'
      },
      aksi: {
        type: Sequelize.ENUM(
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
        comment: 'Jenis aksi admin'
      },
      target_type: {
        type: Sequelize.ENUM('user', 'layanan', 'ulasan', 'pesanan', 'pembayaran', 'system'),
        allowNull: false,
        comment: 'Tipe target'
      },
      target_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'ID target'
      },
      detail: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Detail aktivitas dalam JSON'
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: 'IP address admin'
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'User agent browser'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Indexes
    await queryInterface.addIndex('log_aktivitas_admin', ['admin_id']);
    await queryInterface.addIndex('log_aktivitas_admin', ['aksi']);
    await queryInterface.addIndex('log_aktivitas_admin', ['target_type', 'target_id']);
    await queryInterface.addIndex('log_aktivitas_admin', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('log_aktivitas_admin');
  }
};
