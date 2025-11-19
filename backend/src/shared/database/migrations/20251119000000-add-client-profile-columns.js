'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add columns if not exists
    await queryInterface.addColumn('users', 'foto_latar', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Cover/banner photo URL (client profile)'
    }).catch(() => {});

    await queryInterface.addColumn('users', 'anggaran', {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Preferred budget or budget range provided by client'
    }).catch(() => {});

    await queryInterface.addColumn('users', 'tipe_proyek', {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'Project type (e.g., desain, development, konsultasi)'
    }).catch(() => {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'tipe_proyek').catch(() => {});
    await queryInterface.removeColumn('users', 'anggaran').catch(() => {});
    await queryInterface.removeColumn('users', 'foto_latar').catch(() => {});
  }
};
