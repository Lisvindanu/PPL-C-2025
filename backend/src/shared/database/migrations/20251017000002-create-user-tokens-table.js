'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_tokens', {
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
        comment: 'Foreign key ke users',
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      token: {
        type: Sequelize.STRING(500),
        allowNull: false,
        comment: 'Token string'
      },
      type: {
        type: Sequelize.ENUM('email_verification', 'password_reset'),
        allowNull: false,
        comment: 'Token type'
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Token expiration time'
      },
      used_at: {
        type: Sequelize.DATE,
        comment: 'When token was used'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });

    // Add indexes
    await queryInterface.addIndex('user_tokens', ['token'], {
      name: 'user_tokens_token'
    });
    await queryInterface.addIndex('user_tokens', ['user_id']);
    await queryInterface.addIndex('user_tokens', ['type']);
    await queryInterface.addIndex('user_tokens', ['expires_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_tokens');
  }
};