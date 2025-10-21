'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('percakapan', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      user1_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke users (user 1)'
      },
      user2_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key ke users (user 2)'
      },
      pesanan_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'pesanan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Foreign key ke pesanan (optional)'
      },
      pesan_terakhir: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Preview pesan terakhir'
      },
      pesan_terakhir_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp pesan terakhir'
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
    await queryInterface.addIndex('percakapan', ['user1_id']);
    await queryInterface.addIndex('percakapan', ['user2_id']);

    // Unique constraint
    await queryInterface.addConstraint('percakapan', {
      fields: ['user1_id', 'user2_id'],
      type: 'unique',
      name: 'unique_conversation'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('percakapan');
  }
};
