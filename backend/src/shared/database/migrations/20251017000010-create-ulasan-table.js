'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ulasan', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      pesanan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'pesanan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke pesanan (unique)'
      },
      layanan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'layanan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke layanan'
      },
      pemberi_ulasan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke users (pemberi ulasan)'
      },
      penerima_ulasan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke users (penerima ulasan)'
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Rating 1-5'
      },
      judul: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Judul ulasan'
      },
      komentar: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Isi ulasan'
      },
      gambar: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array URL gambar'
      },
      balasan: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Balasan dari freelancer'
      },
      dibalas_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu balasan'
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Status approval admin'
      },
      is_reported: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Status report'
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
    await queryInterface.addIndex('ulasan', ['layanan_id']);
    await queryInterface.addIndex('ulasan', ['rating']);
    await queryInterface.addIndex('ulasan', ['pemberi_ulasan_id']);
    await queryInterface.addIndex('ulasan', ['penerima_ulasan_id']);

    // Check constraint for rating
    await queryInterface.sequelize.query(`
      ALTER TABLE ulasan
      ADD CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ulasan');
  }
};
