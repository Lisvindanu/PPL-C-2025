const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define('layanan', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    freelancer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    kategori_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'kategori', key: 'id' }
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
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
      defaultValue: 1
    },
    thumbnail: DataTypes.STRING(255),
    gambar: DataTypes.JSON,
    rating_rata_rata: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0
    },
    jumlah_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_pesanan: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    jumlah_dilihat: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('draft', 'aktif', 'nonaktif'),
      defaultValue: 'draft'
    }
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['freelancer_id'] },
      { fields: ['kategori_id'] },
      { fields: ['status'] },
      { type: 'FULLTEXT', fields: ['judul', 'deskripsi'] }
    ]
  });

  return Service;
};