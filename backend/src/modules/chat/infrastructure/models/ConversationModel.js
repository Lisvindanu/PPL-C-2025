//  model untuk tabel 'percakapan'
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const ConversationModel = sequelize.define('percakapan', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user1_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users', // Merujuk ke tabel 'users'
            key: 'id'
        }
    },
    user2_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users', // Merujuk ke tabel 'users'
            key: 'id'
        }
    },
    pesanan_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'pesanan', // Merujuk ke tabel 'pesanan'
            key: 'id'
        }
    },
    pesan_terakhir: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    pesan_terakhir_pada: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'percakapan', // Nama tabel di database
    timestamps: true,
    underscored: true,
    indexes: [
        { unique: true, fields: ['user1_id', 'user2_id'] }
    ]
});

module.exports = ConversationModel;