/** @param {import('sequelize').QueryInterface} queryInterface */
/** @param {import('sequelize').Sequelize} Sequelize */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profil_freelancer', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        defaultValue: Sequelize.literal('(uuid())')
      },
      user_id: {
        type: Sequelize.CHAR(36),
        unique: true,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      judul_profesi: { type: Sequelize.STRING(255), allowNull: true },
      keahlian: { type: Sequelize.JSON, allowNull: true },
      portfolio_url: { type: Sequelize.STRING(255), allowNull: true },
      total_pekerjaan_selesai: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      rating_rata_rata: { type: Sequelize.DECIMAL(3, 2), allowNull: false, defaultValue: 0 },
      total_ulasan: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('profil_freelancer', ['user_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('profil_freelancer');
  }
};


