'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profil_freelancer', {
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
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke users (unique)'
      },
      judul_profesi: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Judul profesi (misal: UI/UX Designer)'
      },
      keahlian: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array keahlian dalam JSON'
      },
      portfolio_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'URL portfolio eksternal'
      },
      total_pekerjaan_selesai: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Jumlah pekerjaan yang sudah selesai'
      },
      rating_rata_rata: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Rating rata-rata (0.00 - 5.00)'
      },
      total_ulasan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total ulasan yang diterima'
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
    await queryInterface.addIndex('profil_freelancer', ['user_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profil_freelancer');
  }
};
