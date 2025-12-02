const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const SimpananModel = sequelize.define('simpanan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    comment: 'Primary key UUID'
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Foreign key ke users (client yang menyimpan)'
  },
  layanan_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Foreign key ke layanan yang disimpan'
  }
}, {
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['user_id'], name: 'idx_simpanan_user_id' },
    { fields: ['layanan_id'], name: 'idx_simpanan_layanan_id' },
    {
      unique: true,
      fields: ['user_id', 'layanan_id'],
      name: 'unique_simpanan_user_layanan'
    }
  ]
});

module.exports = SimpananModel;
