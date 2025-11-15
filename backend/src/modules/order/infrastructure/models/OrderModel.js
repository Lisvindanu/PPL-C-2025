/**
 * Order (Pesanan) Sequelize Model
 * Maps to 'pesanan' table
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const OrderModel = sequelize.define('pesanan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  nomor_pesanan: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  client_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  freelancer_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  layanan_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  paket_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  judul: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  catatan_client: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  biaya_platform: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  total_bayar: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  waktu_pengerjaan: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tenggat_waktu: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dikirim_pada: {
    type: DataTypes.DATE,
    allowNull: true
  },
  selesai_pada: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(
      'menunggu_pembayaran',
      'dibayar',
      'dikerjakan',
      'menunggu_review',
      'revisi',
      'selesai',
      'dispute',
      'dibatalkan',
      'refunded'
    ),
    allowNull: false,
    defaultValue: 'menunggu_pembayaran'
  }
}, {
  tableName: 'pesanan',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['nomor_pesanan'] },
    { fields: ['client_id'] },
    { fields: ['freelancer_id'] },
    { fields: ['status'] }
  ]
});

module.exports = OrderModel;