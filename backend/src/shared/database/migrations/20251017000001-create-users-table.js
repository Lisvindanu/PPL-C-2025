'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
        comment: 'Password ter-hash'
      },
      role: {
        type: Sequelize.ENUM('client', 'freelancer', 'admin'),
        allowNull: false,
        defaultValue: 'client',
        comment: 'Role user'
      },
      nama_depan: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Nama depan'
      },
      nama_belakang: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Nama belakang'
      },
      no_telepon: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Nomor telepon'
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'URL foto profil'
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Bio/deskripsi user'
      },
      kota: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Kota domisili'
      },
      provinsi: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Provinsi domisili'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Status aktif/nonaktif'
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Status verifikasi email'
      },
      email_verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu verifikasi email'
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
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
