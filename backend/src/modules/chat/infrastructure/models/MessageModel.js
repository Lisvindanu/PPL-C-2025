// Definisikan model untuk tabel 'pesan'
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const MessageModel = sequelize.define('pesan', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    percakapan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'percakapan', // Merujuk ke tabel 'percakapan'
            key: 'id'
        }
    },
    pengirim_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users', // Merujuk ke tabel 'users'
            key: 'id'
        }
    },
    pesan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tipe: {
        type: DataTypes.ENUM('text', 'image', 'file'),
        allowNull: false,
        defaultValue: 'text'
    },
    lampiran: {
        type: DataTypes.JSON,
        allowNull: true
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    dibaca_pada: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'pesan', // Nama tabel di database
    timestamps: true,
    underscored: true,
    updatedAt: false, // Biasanya pesan tidak di-update, hanya 'created_at'
    indexes: [
        { fields: ['percakapan_id'] }
    ]
});

module.exports = MessageModel;