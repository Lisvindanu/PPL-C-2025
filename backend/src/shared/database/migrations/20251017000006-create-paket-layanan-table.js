'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('paket_layanan', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      layanan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'layanan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke layanan'
      },
      tipe: {
        type: Sequelize.ENUM('basic', 'standard', 'premium'),
        allowNull: false,
        comment: 'Tipe paket'
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Nama paket'
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Deskripsi paket'
      },
      harga: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Harga paket'
      },
      waktu_pengerjaan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Waktu pengerjaan (hari)'
      },
      batas_revisi: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Batas revisi'
      },
      fitur: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array fitur yang termasuk'
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

    // Index & Unique constraint
    await queryInterface.addIndex('paket_layanan', ['layanan_id']);
    await queryInterface.addConstraint('paket_layanan', {
      fields: ['layanan_id', 'tipe'],
      type: 'unique',
      name: 'unique_layanan_paket'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('paket_layanan');
  }
};
