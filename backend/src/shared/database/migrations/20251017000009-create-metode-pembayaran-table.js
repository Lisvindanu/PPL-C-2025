'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('metode_pembayaran', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke users'
      },
      tipe: {
        type: Sequelize.ENUM('rekening_bank', 'e_wallet', 'kartu_kredit'),
        allowNull: false,
        comment: 'Tipe metode pembayaran'
      },
      provider: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Provider (BCA, Mandiri, GoPay, dll)'
      },
      nomor_rekening: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Nomor rekening/kartu'
      },
      nama_pemilik: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Nama pemilik rekening/kartu'
      },
      empat_digit_terakhir: {
        type: Sequelize.STRING(4),
        allowNull: true,
        comment: '4 digit terakhir untuk display'
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Metode pembayaran default'
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

    // Index
    await queryInterface.addIndex('metode_pembayaran', ['user_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('metode_pembayaran');
  }
};
