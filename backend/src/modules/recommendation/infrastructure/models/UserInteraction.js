const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const UserInteraction = sequelize.define('UserInteraction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
        comment: 'Foreign key ke users'
    },
    tipe_aktivitas: {
        type: DataTypes.ENUM('lihat_layanan', 'cari', 'tambah_favorit', 'buat_pesanan'),
        allowNull: false,
        field: 'tipe_aktivitas',
        comment: 'Tipe aktivitas user'
    },
    layanan_id: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'layanan_id',
        comment: 'Foreign key ke layanan (optional)'
    },
    kata_kunci: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'kata_kunci',
        comment: 'Kata kunci pencarian'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'aktivitas_user',
    timestamps: false,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['layanan_id'] },
        { fields: ['tipe_aktivitas'] }
    ]
});

// ✅ Definisikan relasi jika diperlukan
UserInteraction.associate = (models) => {
    UserInteraction.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    UserInteraction.belongsTo(models.Layanan, {
        foreignKey: 'layanan_id',
        as: 'layanan'
    });
};

module.exports = UserInteraction;
