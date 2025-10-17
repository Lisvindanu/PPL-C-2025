'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('layanan', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      freelancer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke users (freelancer)'
      },
      kategori_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'kategori',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke kategori'
      },
      judul: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Judul layanan'
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Slug untuk URL (unique)'
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Deskripsi detail layanan'
      },
      harga: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Harga layanan'
      },
      waktu_pengerjaan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Waktu pengerjaan (dalam hari)'
      },
      batas_revisi: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Batas revisi yang diberikan'
      },
      thumbnail: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'URL thumbnail utama'
      },
      gambar: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array URL gambar tambahan'
      },
      rating_rata_rata: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Rating rata-rata'
      },
      jumlah_rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Jumlah rating yang masuk'
      },
      total_pesanan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total pesanan'
      },
      jumlah_dilihat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Jumlah views'
      },
      status: {
        type: Sequelize.ENUM('draft', 'aktif', 'nonaktif'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Status layanan'
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

    // Indexes
    await queryInterface.addIndex('layanan', ['freelancer_id']);
    await queryInterface.addIndex('layanan', ['kategori_id']);
    await queryInterface.addIndex('layanan', ['status']);
    await queryInterface.addIndex('layanan', ['slug']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('layanan');
  }
};
