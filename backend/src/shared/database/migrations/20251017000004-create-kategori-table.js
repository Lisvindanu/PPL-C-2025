'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kategori', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Nama kategori (unique)'
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Slug untuk URL (unique)'
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Deskripsi kategori'
      },
      icon: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'URL icon kategori'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Status aktif/nonaktif'
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
    await queryInterface.addIndex('kategori', ['slug']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('kategori');
  }
};
