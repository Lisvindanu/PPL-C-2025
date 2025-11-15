const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

// Definisi model Recommendation
const Recommendation = sequelize.define('Recommendation', {
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
    layanan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'layanan_id',
        comment: 'Foreign key ke layanan'
    },
    skor: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Skor rekomendasi'
    },
    alasan: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Alasan rekomendasi'
    },
    sudah_ditampilkan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'sudah_ditampilkan',
        comment: 'Status sudah ditampilkan'
    },
    sudah_diklik: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'sudah_diklik',
        comment: 'Status sudah diklik'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    kadaluarsa_pada: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'kadaluarsa_pada',
        comment: 'Waktu rekomendasi kadaluarsa'
    }
}, {
    tableName: 'rekomendasi_layanan',
    timestamps: false,
    underscored: true,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['layanan_id'] },
        { fields: ['skor'] }
    ]
});

// Associations (relasi opsional)
Recommendation.associate = (models) => {
    Recommendation.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    Recommendation.belongsTo(models.Layanan, {
        foreignKey: 'layanan_id',
        as: 'layanan'
    });
};

module.exports = Recommendation;
