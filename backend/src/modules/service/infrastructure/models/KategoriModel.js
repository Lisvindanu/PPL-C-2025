/**
 * Kategori Sequelize Model
 * Database model untuk tabel kategori
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Kategori = sequelize.define('Kategori', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nama'
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
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'kategori',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Kategori.associate = (models) => {
    // Kategori has many Layanan
    Kategori.hasMany(models.Layanan, {
      foreignKey: 'kategori_id',
      as: 'layanan'
    });
  };

  return Kategori;
};
