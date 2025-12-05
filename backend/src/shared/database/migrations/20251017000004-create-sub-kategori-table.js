'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if table exists
    const tables = await queryInterface.showAllTables();

    if (!tables.includes('sub_kategori')) {
      await queryInterface.createTable('sub_kategori', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          comment: 'Primary key UUID'
        },
        id_kategori: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'kategori',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          comment: 'Foreign key ke tabel kategori'
        },
        nama: {
          type: Sequelize.STRING(100),
          allowNull: false,
          comment: 'Nama sub kategori'
        },
        slug: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
          comment: 'Slug untuk URL (unique)'
        },
        deskripsi: {
          type: Sequelize.TEXT,
          comment: 'Deskripsi sub kategori'
        },
        icon: {
          type: Sequelize.STRING(255),
          comment: 'URL icon sub kategori'
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

    // Check if indexes exist before adding
    const indexes = await queryInterface.showIndex('sub_kategori');

    const hasSlugIndex = indexes.some(idx => idx.name === 'sub_kategori_slug');
    if (!hasSlugIndex) {
      await queryInterface.addIndex('sub_kategori', ['slug'], {
        name: 'sub_kategori_slug'
      });
    }

    const hasKategoriIndex = indexes.some(idx => idx.name === 'sub_kategori_id_kategori');
    if (!hasKategoriIndex) {
      await queryInterface.addIndex('sub_kategori', ['id_kategori'], {
        name: 'sub_kategori_id_kategori'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sub_kategori');
  }
};
