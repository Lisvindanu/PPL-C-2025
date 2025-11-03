const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const ServiceModel = sequelize.define('layanan', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  freelancer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  kategori_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'kategori',
      key: 'id'
    }
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
    type: DataTypes.STRING(255)
  },
  gambar: {
    type: DataTypes.JSON
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
  }
}, {
  tableName: 'layanan',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ServiceModel;
