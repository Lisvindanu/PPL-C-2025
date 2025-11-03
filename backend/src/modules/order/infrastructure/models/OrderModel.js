const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const OrderModel = sequelize.define('pesanan', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  nomor_pesanan: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  client_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  freelancer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  layanan_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'layanan',
      key: 'id'
    }
  },
  paket_id: {
    type: DataTypes.UUID,
    references: {
      model: 'paket_layanan',
      key: 'id'
    }
  },
  judul: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT
  },
  catatan_client: {
    type: DataTypes.TEXT
  },
  harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  biaya_platform: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total_bayar: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  waktu_pengerjaan: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tenggat_waktu: {
    type: DataTypes.DATE
  },
  dikirim_pada: {
    type: DataTypes.DATE
  },
  selesai_pada: {
    type: DataTypes.DATE
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
    defaultValue: 'menunggu_pembayaran'
  },
  lampiran_client: {
    type: DataTypes.JSON
  },
  lampiran_freelancer: {
    type: DataTypes.JSON
  }
}, {
  tableName: 'pesanan',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = OrderModel;
