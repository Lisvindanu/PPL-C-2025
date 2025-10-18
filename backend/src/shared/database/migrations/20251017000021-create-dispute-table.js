'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dispute', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
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
      diajukan_oleh: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke users (yang mengajukan dispute)'
      },
      tipe: {
        type: Sequelize.ENUM('not_as_described', 'low_quality', 'late_delivery', 'communication_issue', 'other'),
        allowNull: false,
        comment: 'Tipe dispute'
      },
      alasan: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Alasan detail dispute'
      },
      bukti: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array URL bukti (screenshot, file, dll)'
      },
      status: {
        type: Sequelize.ENUM('open', 'under_review', 'resolved', 'closed'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Status dispute'
      },
      keputusan: {
        type: Sequelize.ENUM('client_win', 'freelancer_win', 'partial_refund', 'no_action'),
        allowNull: true,
        comment: 'Keputusan admin'
      },
      alasan_keputusan: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Alasan keputusan admin'
      },
      dibuka_pada: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Waktu dispute dibuka'
      },
      diputuskan_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu dispute diputuskan'
      },
      diputuskan_oleh: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Foreign key ke users (admin yang memutuskan)'
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
    await queryInterface.addIndex('dispute', ['pesanan_id']);
    await queryInterface.addIndex('dispute', ['status']);
    await queryInterface.addIndex('dispute', ['diajukan_oleh']);
    await queryInterface.addIndex('dispute', ['diputuskan_oleh']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dispute');
  }
};
