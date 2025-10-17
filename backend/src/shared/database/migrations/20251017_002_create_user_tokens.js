/** @param {import('sequelize').QueryInterface} queryInterface */
/** @param {import('sequelize').Sequelize} Sequelize */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_tokens', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        defaultValue: Sequelize.literal('(uuid())')
      },
      user_id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      token: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('email_verification', 'password_reset'),
        allowNull: false
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    }, { timestamps: false });

    await queryInterface.addIndex('user_tokens', ['token']);
    await queryInterface.addIndex('user_tokens', ['user_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('user_tokens');
  }
};


