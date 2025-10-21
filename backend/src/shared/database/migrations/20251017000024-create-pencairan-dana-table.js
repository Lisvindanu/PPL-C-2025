'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pencairan_dana', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
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
      freelancer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke users (freelancer)'
      },
      metode_pembayaran_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'metode_pembayaran',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Foreign key ke metode_pembayaran (rekening tujuan)'
      },
      jumlah: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Jumlah kotor (sebelum potong fee)'
      },
      biaya_platform: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Fee platform yang dipotong'
      },
      jumlah_bersih: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Jumlah bersih yang diterima freelancer'
      },
      metode_pencairan: {
        type: Sequelize.ENUM('transfer_bank', 'e_wallet'),
        allowNull: false,
        comment: 'Metode pencairan dana'
      },
      nomor_rekening: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Nomor rekening/e-wallet tujuan'
      },
      nama_pemilik: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Nama pemilik rekening'
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Status pencairan'
      },
      bukti_transfer: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'URL bukti transfer dari admin'
      },
      catatan: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Catatan tambahan'
      },
      dicairkan_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu dana dicairkan'
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
    await queryInterface.addIndex('pencairan_dana', ['escrow_id']);
    await queryInterface.addIndex('pencairan_dana', ['freelancer_id']);
    await queryInterface.addIndex('pencairan_dana', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pencairan_dana');
  }
};
