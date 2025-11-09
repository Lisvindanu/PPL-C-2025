/**
 * Layanan Sequelize Model
 * Database model untuk tabel layanan
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Layanan = sequelize.define('Layanan', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    freelancer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'freelancer_id'
    },
    kategori_id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'kategori_id'
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    harga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    waktu_pengerjaan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    batas_revisi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gambar: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('gambar');
        return rawValue ? (typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue) : [];
      }
    },
    rating_rata_rata: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0
    },
    jumlah_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_pesanan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    jumlah_dilihat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('draft', 'aktif', 'nonaktif'),
      allowNull: false,
      defaultValue: 'draft'
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
    tableName: 'layanan',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Associations will be defined in the associate method
  Layanan.associate = (models) => {
    // Layanan belongs to User (freelancer)
    Layanan.belongsTo(models.User, {
      foreignKey: 'freelancer_id',
      as: 'freelancer'
    });

    // Layanan belongs to Kategori
    Layanan.belongsTo(models.Kategori, {
      foreignKey: 'kategori_id',
      as: 'kategori'
    });
  };

  return Layanan;
};
