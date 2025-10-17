/**
 * Escrow Sequelize Model
 * Maps to 'escrow' table
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const EscrowModel = sequelize.define('escrow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  pembayaran_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'pembayaran',
      key: 'id'
    }
  },
  pesanan_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'pesanan',
      key: 'id'
    }
  },
  jumlah_ditahan: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  biaya_platform: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('held', 'released', 'refunded', 'disputed', 'partial_released', 'completed'),
    allowNull: false,
    defaultValue: 'held'
  },
  ditahan_pada: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  akan_dirilis_pada: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dirilis_pada: {
    type: DataTypes.DATE,
    allowNull: true
  },
  alasan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'escrow',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['pembayaran_id'] },
    { fields: ['pesanan_id'] },
    { fields: ['status'] },
    { fields: ['akan_dirilis_pada'] }
  ]
});

module.exports = EscrowModel;
