// infrastructure/models/Kategori.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');
const { v4: uuidv4 } = require('uuid');

const Kategori = sequelize.define('Kategori', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => uuidv4(),
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'kategori',
  timestamps: false,
  underscored: true
});

module.exports = Kategori;
