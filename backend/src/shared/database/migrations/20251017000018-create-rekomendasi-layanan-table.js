'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rekomendasi_layanan', {
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
      skor: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Skor rekomendasi'
      },
      alasan: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Alasan rekomendasi'
      },
      sudah_ditampilkan: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Status sudah ditampilkan'
      },
      sudah_diklik: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Status sudah diklik'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      kadaluarsa_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu rekomendasi kadaluarsa'
      }
    });

    // Indexes
    await queryInterface.addIndex('rekomendasi_layanan', ['user_id']);
    await queryInterface.addIndex('rekomendasi_layanan', ['layanan_id']);
    await queryInterface.addIndex('rekomendasi_layanan', ['skor']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rekomendasi_layanan');
  }
};
