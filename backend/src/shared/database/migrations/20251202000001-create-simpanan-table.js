'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('simpanan', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke users (client yang menyimpan)'
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
        comment: 'Foreign key ke layanan yang disimpan'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Indexes untuk performa query
    await queryInterface.addIndex('simpanan', ['user_id'], {
      name: 'idx_simpanan_user_id'
    });
    await queryInterface.addIndex('simpanan', ['layanan_id'], {
      name: 'idx_simpanan_layanan_id'
    });

    // Unique constraint: satu user hanya bisa simpan satu layanan sekali
    await queryInterface.addConstraint('simpanan', {
      fields: ['user_id', 'layanan_id'],
      type: 'unique',
      name: 'unique_simpanan_user_layanan'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('simpanan');
  }
};
