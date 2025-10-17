/**
 * Payment Sequelize Model
 * Maps to 'pembayaran' table
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const PaymentModel = sequelize.define('pembayaran', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  pesanan_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'pesanan',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  external_id: {
    type: DataTypes.STRING(255),
    allowNull: true
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
  biaya_payment_gateway: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  total_bayar: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  metode_pembayaran: {
    type: DataTypes.ENUM(
      'transfer_bank',
      'e_wallet',
      'kartu_kredit',
      'qris',
      'virtual_account'
    ),
    allowNull: false
  },
  channel: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  payment_gateway: {
    type: DataTypes.ENUM('midtrans', 'xendit', 'mock', 'manual'),
    allowNull: false,
    defaultValue: 'mock'
  },
  payment_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('menunggu', 'berhasil', 'gagal', 'kadaluarsa'),
    allowNull: false,
    defaultValue: 'menunggu'
  },
  callback_data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  callback_signature: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  nomor_invoice: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  invoice_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  dibayar_pada: {
    type: DataTypes.DATE,
    allowNull: true
  },
  kadaluarsa_pada: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'pembayaran',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['transaction_id'] },
    { fields: ['pesanan_id'] },
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['payment_gateway'] }
  ]
});

module.exports = PaymentModel;
