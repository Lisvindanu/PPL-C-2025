'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pesan', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      percakapan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'percakapan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke percakapan'
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
        comment: 'Foreign key ke users (pengirim)'
      },
      pesan: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Isi pesan'
      },
      tipe: {
        type: Sequelize.ENUM('text', 'image', 'file'),
        allowNull: false,
        defaultValue: 'text',
        comment: 'Tipe pesan'
      },
      lampiran: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array URL lampiran'
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Status sudah dibaca'
      },
      dibaca_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu dibaca'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Index
    await queryInterface.addIndex('pesan', ['percakapan_id']);
    await queryInterface.addIndex('pesan', ['pengirim_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pesan');
  }
};
