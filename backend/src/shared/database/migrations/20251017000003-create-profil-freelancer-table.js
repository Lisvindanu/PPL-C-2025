'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profil_freelancer', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        comment: 'Foreign key ke users (unique)',
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      judul_profesi: {
        type: Sequelize.STRING(255),
        comment: 'Professional title (e.g., "Expert Logo Designer")'
      },
      keahlian: {
        type: Sequelize.JSON,
        comment: 'Array of skills (JSON format)'
      },
      portfolio_url: {
        type: Sequelize.STRING(255),
        comment: 'Portfolio website URL'
      },
      total_pekerjaan_selesai: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total completed jobs'
      },
      rating_rata_rata: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Average rating (0.00 - 5.00)'
      },
      total_ulasan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total number of reviews'
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
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });

    // Add indexes
    await queryInterface.addIndex('profil_freelancer', ['user_id'], {
      name: 'profil_freelancer_user_id',
      unique: true
    });
    await queryInterface.addIndex('profil_freelancer', ['rating_rata_rata']);
    await queryInterface.addIndex('profil_freelancer', ['total_pekerjaan_selesai']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profil_freelancer');
  }
};