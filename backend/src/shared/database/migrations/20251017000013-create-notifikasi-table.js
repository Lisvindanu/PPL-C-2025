'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifikasi', {
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
        comment: 'Foreign key ke users'
      },
      tipe: {
        type: Sequelize.ENUM(
          'pesanan_baru',
          'pesanan_diterima',
          'pesanan_ditolak',
          'pesanan_selesai',
          'pembayaran_berhasil',
          'pesan_baru',
          'ulasan_baru'
        ),
        allowNull: false,
        comment: 'Tipe notifikasi'
      },
      judul: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Judul notifikasi'
      },
      pesan: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Isi notifikasi'
      },
      related_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'ID relasi (pesanan_id, pembayaran_id, dll)'
      },
      related_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Tipe relasi (pesanan, pembayaran, dll)'
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
      dikirim_via_email: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Status dikirim via email'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Indexes
    await queryInterface.addIndex('notifikasi', ['user_id']);
    await queryInterface.addIndex('notifikasi', ['is_read']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notifikasi');
  }
};
