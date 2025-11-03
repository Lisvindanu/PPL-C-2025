const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const UserModel = sequelize.define('users', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  role: {
    type: DataTypes.ENUM('client', 'freelancer', 'admin'),
    defaultValue: 'client'
  },
  nama_depan: {
    type: DataTypes.STRING(100)
  },
  nama_belakang: {
    type: DataTypes.STRING(100)
  },
  no_telepon: {
    type: DataTypes.STRING(20)
  },
  avatar: {
    type: DataTypes.STRING(255)
  },
  bio: {
    type: DataTypes.TEXT
  },
  kota: {
    type: DataTypes.STRING(100)
  },
  provinsi: {
    type: DataTypes.STRING(100)
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = UserModel;
