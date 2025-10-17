'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_tokens', {
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
      token: {
        type: Sequelize.STRING(500),
        allowNull: false,
        comment: 'Token untuk verifikasi/reset'
      },
      type: {
        type: Sequelize.ENUM('email_verification', 'password_reset'),
        allowNull: false,
        comment: 'Tipe token'
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Waktu kadaluarsa token'
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu token digunakan'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Index
    await queryInterface.addIndex('user_tokens', ['token']);
    await queryInterface.addIndex('user_tokens', ['user_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_tokens');
  }
};
