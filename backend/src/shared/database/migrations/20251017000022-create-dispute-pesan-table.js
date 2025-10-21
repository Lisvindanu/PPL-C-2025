'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dispute_pesan', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      dispute_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'dispute',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke dispute'
      },
      pengirim_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke users (pengirim: admin/client/freelancer)'
      },
      pesan: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Isi pesan'
      },
      lampiran: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array URL lampiran (bukti tambahan, screenshot, dll)'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Indexes
    await queryInterface.addIndex('dispute_pesan', ['dispute_id']);
    await queryInterface.addIndex('dispute_pesan', ['pengirim_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dispute_pesan');
  }
};
