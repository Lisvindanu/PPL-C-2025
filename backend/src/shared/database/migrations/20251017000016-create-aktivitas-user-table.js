'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('aktivitas_user', {
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
      tipe_aktivitas: {
        type: Sequelize.ENUM('lihat_layanan', 'cari', 'tambah_favorit', 'buat_pesanan'),
        allowNull: false,
        comment: 'Tipe aktivitas user'
      },
      layanan_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'layanan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke layanan (optional)'
      },
      kata_kunci: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Kata kunci pencarian'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Index
    await queryInterface.addIndex('aktivitas_user', ['user_id']);
    await queryInterface.addIndex('aktivitas_user', ['layanan_id']);
    await queryInterface.addIndex('aktivitas_user', ['tipe_aktivitas']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('aktivitas_user');
  }
};
