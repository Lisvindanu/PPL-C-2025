'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('revisi', {
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
        references: {
          model: 'pesanan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke pesanan'
      },
      ke_berapa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Revisi ke berapa (1, 2, 3, dst)'
      },
      catatan: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Catatan revisi dari client'
      },
      lampiran: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array URL lampiran referensi revisi'
      },
      status: {
        type: Sequelize.ENUM('diminta', 'dikerjakan', 'selesai', 'ditolak'),
        allowNull: false,
        defaultValue: 'diminta',
        comment: 'Status revisi'
      },
      diminta_pada: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Waktu revisi diminta'
      },
      selesai_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu revisi selesai dikerjakan'
      },
      lampiran_revisi: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array URL hasil revisi dari freelancer'
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
    await queryInterface.addIndex('revisi', ['pesanan_id']);
    await queryInterface.addIndex('revisi', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('revisi');
  }
};
