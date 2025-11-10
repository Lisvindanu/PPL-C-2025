'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Email user (unique)'
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Hashed password'
      },
      role: {
        type: Sequelize.ENUM('client', 'freelancer', 'admin'),
        allowNull: false,
        defaultValue: 'client',
        comment: 'User role (defaults to client for new registrations)'
      },
      nama_depan: {
        type: Sequelize.STRING(100),
        comment: 'First name'
      },
      nama_belakang: {
        type: Sequelize.STRING(100),
        comment: 'Last name'
      },
      no_telepon: {
        type: Sequelize.STRING(20),
        comment: 'Phone number'
      },
      avatar: {
        type: Sequelize.STRING(255),
        comment: 'Avatar URL'
      },
      bio: {
        type: Sequelize.TEXT,
        comment: 'User bio'
      },
      kota: {
        type: Sequelize.STRING(100),
        comment: 'City'
      },
      provinsi: {
        type: Sequelize.STRING(100),
        comment: 'Province'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Account active status'
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Email verification status'
      },
      email_verified_at: {
        type: Sequelize.DATE,
        comment: 'Email verified timestamp'
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

    // Add indexes
    // `email` is already declared as unique in column definition which creates the index.
    // Add role index; ignore errors if index already exists.
    try {
      await queryInterface.addIndex('users', ['role']);
    } catch (err) {
      // Duplicate index name or already exists -> ignore
      if (err && (err.original && err.original.code === 'ER_DUP_KEYNAME' || err.code === 'ER_DUP_KEYNAME')) {
        console.log('Index `users_role` already exists, skipping');
      } else {
        throw err;
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};