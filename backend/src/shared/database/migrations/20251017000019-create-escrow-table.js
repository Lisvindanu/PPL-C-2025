'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('escrow', {
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
      pesanan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pesanan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke pesanan'
      },
      jumlah_ditahan: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Jumlah dana yang ditahan'
      },
      biaya_platform: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Biaya platform yang akan dipotong'
      },
      status: {
        type: Sequelize.ENUM('held', 'released', 'refunded', 'disputed', 'partial_released', 'completed'),
        allowNull: false,
        defaultValue: 'held',
        comment: 'Status escrow'
      },
      ditahan_pada: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Waktu dana mulai ditahan'
      },
      akan_dirilis_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu rencana rilis dana (biasanya +7 hari dari approval)'
      },
      dirilis_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu dana benar-benar dirilis'
      },
      alasan: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Alasan/catatan terkait escrow'
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
    await queryInterface.addIndex('escrow', ['pembayaran_id']);
    await queryInterface.addIndex('escrow', ['pesanan_id']);
    await queryInterface.addIndex('escrow', ['status']);
    await queryInterface.addIndex('escrow', ['akan_dirilis_pada']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('escrow');
  }
};
