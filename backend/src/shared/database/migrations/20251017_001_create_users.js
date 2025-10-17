/** @param {import('sequelize').QueryInterface} queryInterface */
/** @param {import('sequelize').Sequelize} Sequelize */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        defaultValue: Sequelize.literal('(uuid())')
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('client', 'freelancer', 'admin'),
        allowNull: false,
        defaultValue: 'client'
      },
      nama_depan: { type: Sequelize.STRING(100), allowNull: true },
      nama_belakang: { type: Sequelize.STRING(100), allowNull: true },
      no_telepon: { type: Sequelize.STRING(20), allowNull: true },
      avatar: { type: Sequelize.STRING(255), allowNull: true },
      bio: { type: Sequelize.TEXT, allowNull: true },
      kota: { type: Sequelize.STRING(100), allowNull: true },
      provinsi: { type: Sequelize.STRING(100), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      is_verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      email_verified_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};


