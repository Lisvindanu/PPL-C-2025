const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('pesanan', {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    nomor_pesanan: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    client_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    freelancer_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    layanan_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: { model: 'layanan', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM(
        'menunggu_pembayaran',
        'dibayar',
        'dikerjakan',
        'menunggu_review',
        'revisi',
        'selesai',
        'dispute',
        'dibatalkan',
        'refunded'
      ),
      allowNull: false,
    },
  }, {
    tableName: 'pesanan',
    modelName: 'Pesanan',
    timestamps: true,
    underscored: true,
  });

  return Order;
};
