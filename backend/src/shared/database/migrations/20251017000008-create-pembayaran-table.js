'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pembayaran', {
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
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke users'
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Transaction ID (unique)'
      },
      external_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'External ID dari payment gateway'
      },
      jumlah: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Jumlah pembayaran'
      },
      biaya_platform: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Biaya platform'
      },
      biaya_payment_gateway: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Biaya payment gateway'
      },
      total_bayar: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total yang dibayar'
      },
      metode_pembayaran: {
        type: Sequelize.ENUM(
          'transfer_bank',
          'e_wallet',
          'kartu_kredit',
          'qris',
          'virtual_account'
        ),
        allowNull: false,
        comment: 'Metode pembayaran'
      },
      channel: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Channel pembayaran (gopay, ovo, bca_va, dll)'
      },
      payment_gateway: {
        type: Sequelize.ENUM('midtrans', 'xendit', 'manual'),
        allowNull: false,
        comment: 'Payment gateway yang digunakan'
      },
      payment_url: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'URL redirect ke payment gateway'
      },
      status: {
        type: Sequelize.ENUM('menunggu', 'berhasil', 'gagal', 'kadaluarsa'),
        allowNull: false,
        defaultValue: 'menunggu',
        comment: 'Status pembayaran'
      },
      callback_data: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Data callback dari payment gateway'
      },
      callback_signature: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Signature dari callback'
      },
      nomor_invoice: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
        comment: 'Nomor invoice (unique)'
      },
      invoice_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'URL invoice PDF'
      },
      dibayar_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu pembayaran berhasil'
      },
      kadaluarsa_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu kadaluarsa'
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
    await queryInterface.addIndex('pembayaran', ['transaction_id']);
    await queryInterface.addIndex('pembayaran', ['pesanan_id']);
    await queryInterface.addIndex('pembayaran', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pembayaran');
  }
};
