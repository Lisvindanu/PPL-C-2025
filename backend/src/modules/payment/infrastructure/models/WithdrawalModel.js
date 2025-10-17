/**
 * Withdrawal Sequelize Model (Pencairan Dana)
 * Maps to 'pencairan_dana' table
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const WithdrawalModel = sequelize.define('pencairan_dana', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  escrow_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'escrow',
      key: 'id'
    }
  },
  freelancer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  metode_pembayaran_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'metode_pembayaran',
      key: 'id'
    }
  },
  jumlah: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  biaya_platform: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  jumlah_bersih: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  metode_pencairan: {
    type: DataTypes.ENUM('transfer_bank', 'e_wallet'),
    allowNull: false
  },
  nomor_rekening: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  nama_pemilik: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  bukti_transfer: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dicairkan_pada: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'pencairan_dana',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['escrow_id'] },
    { fields: ['freelancer_id'] },
    { fields: ['status'] }
  ]
});

module.exports = WithdrawalModel;
