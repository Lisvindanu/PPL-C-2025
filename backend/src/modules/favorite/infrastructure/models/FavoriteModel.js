const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const FavoriteModel = sequelize.define('favorit', {
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
    comment: 'Foreign key ke users'
  },
  layanan_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Foreign key ke layanan'
  }
}, {
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['layanan_id'] },
    {
      unique: true,
      fields: ['user_id', 'layanan_id'],
      name: 'unique_user_layanan'
    }
  ]
});

module.exports = FavoriteModel;
