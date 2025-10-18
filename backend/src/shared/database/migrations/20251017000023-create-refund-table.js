'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('refund', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      pembayaran_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pembayaran',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke pembayaran'
      },
      escrow_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'escrow',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke escrow'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke users (penerima refund)'
      },
      jumlah_refund: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Jumlah yang di-refund'
      },
      alasan: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Alasan refund'
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Status refund'
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Transaction ID refund dari payment gateway'
      },
      diproses_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu mulai diproses'
      },
      selesai_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu refund selesai'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Indexes
    await queryInterface.addIndex('refund', ['pembayaran_id']);
    await queryInterface.addIndex('refund', ['escrow_id']);
    await queryInterface.addIndex('refund', ['user_id']);
    await queryInterface.addIndex('refund', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('refund');
  }
};
