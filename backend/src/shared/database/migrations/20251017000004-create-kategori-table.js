'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if table exists
    const tables = await queryInterface.showAllTables();
    
    if (!tables.includes('kategori')) {
      await queryInterface.createTable('kategori', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
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
          comment: 'Deskripsi kategori'
        },
        icon: {
          type: Sequelize.STRING(255),
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
      }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      });
    }

    // Check if index exists before adding
    const indexes = await queryInterface.showIndex('kategori');
    const hasSlugIndex = indexes.some(idx => idx.name === 'kategori_slug');
    
    if (!hasSlugIndex) {
      await queryInterface.addIndex('kategori', ['slug'], {
        name: 'kategori_slug'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('kategori');
  }
};