'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pesanan', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },
      nomor_pesanan: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Nomor pesanan (unique)'
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke users (client)'
      },
      freelancer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke users (freelancer)'
      },
      layanan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'layanan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke layanan'
      },
      paket_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'paket_layanan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Foreign key ke paket_layanan (optional)'
      },
      judul: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Judul pesanan'
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Deskripsi pesanan'
      },
      catatan_client: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Catatan dari client'
      },
      harga: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Harga layanan'
      },
      biaya_platform: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Biaya platform'
      },
      total_bayar: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Total yang harus dibayar'
      },
      waktu_pengerjaan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Waktu pengerjaan (hari)'
      },
      tenggat_waktu: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Deadline pengerjaan'
      },
      dikirim_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu freelancer kirim hasil'
      },
      selesai_pada: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu pesanan selesai'
      },
      status: {
        type: Sequelize.ENUM(
          'menunggu',
          'diterima',
          'ditolak',
          'dikerjakan',
          'dikirim',
          'selesai',
          'dibatalkan'
        ),
        allowNull: false,
        defaultValue: 'menunggu',
        comment: 'Status pesanan'
      },
      lampiran_client: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array URL lampiran dari client'
      },
      lampiran_freelancer: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array URL hasil dari freelancer'
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
    await queryInterface.addIndex('pesanan', ['nomor_pesanan']);
    await queryInterface.addIndex('pesanan', ['client_id']);
    await queryInterface.addIndex('pesanan', ['freelancer_id']);
    await queryInterface.addIndex('pesanan', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pesanan');
  }
};
