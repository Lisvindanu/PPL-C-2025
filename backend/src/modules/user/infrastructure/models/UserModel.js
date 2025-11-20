const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const UserModel = sequelize.define('users', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('client', 'freelancer', 'admin'),
    defaultValue: 'client'
  },
  nama_depan: DataTypes.STRING(100),
  nama_belakang: DataTypes.STRING(100),
  no_telepon: DataTypes.STRING(20),
  avatar: DataTypes.STRING(255),
  foto_latar: DataTypes.STRING(255),
  bio: DataTypes.TEXT,
  kota: DataTypes.STRING(100),
  provinsi: DataTypes.STRING(100),
  anggaran: DataTypes.STRING(100),
  tipe_proyek: DataTypes.STRING(100),
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  email_verified_at: DataTypes.DATE
}, {
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['role'] }
  ]
});

module.exports = UserModel;


