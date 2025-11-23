const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('ulasan', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    pesanan_id: {
      type: DataTypes.CHAR(36),
      unique: true,
      allowNull: false,
      references: { model: 'pesanan', key: 'id' },
      onDelete: 'CASCADE'
    },
    layanan_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'layanan', key: 'id' },
      onDelete: 'CASCADE'
    },
    pemberi_ulasan_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    penerima_ulasan_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    judul: DataTypes.STRING(255),
    komentar: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    gambar: DataTypes.JSON,
    balasan: DataTypes.TEXT,
    dibalas_pada: DataTypes.DATE,
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_reported: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true,
    underscored: true,

    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
    indexes: [
      { fields: ['layanan_id'] },
      { fields: ['rating'] },
      { fields: ['pesanan_id'] }
    ]
  });

  return Review;
};