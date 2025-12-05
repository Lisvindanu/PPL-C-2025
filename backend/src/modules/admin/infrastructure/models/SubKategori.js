// modules/admin/infrastructure/models/SubKategori.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');
const { v4: uuidv4 } = require('uuid');

const SubKategori = sequelize.define('SubKategori', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => uuidv4(),
  },
  id_kategori: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: 'kategori',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'sub_kategori',
  timestamps: false,
  underscored: true,
});

// ✅ PERBAIKAN: Import Kategori HANYA SEKALI di sini (bukan di atas)
const Kategori = require('./Kategori');

// Define associations langsung setelah model didefinisikan
SubKategori.belongsTo(Kategori, {
  foreignKey: 'id_kategori',
  as: 'kategori'
});

Kategori.hasMany(SubKategori, {
  foreignKey: 'id_kategori',
  as: 'sub_kategori'
});

module.exports = SubKategori;