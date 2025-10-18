const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const FreelancerProfileModel = sequelize.define('profil_freelancer', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: {
    type: DataTypes.CHAR(36),
    unique: true,
    allowNull: false
  },
  judul_profesi: DataTypes.STRING(255),
  keahlian: DataTypes.JSON,
  portfolio_url: DataTypes.STRING(255),
  total_pekerjaan_selesai: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating_rata_rata: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  total_ulasan: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] }
  ]
});

module.exports = FreelancerProfileModel;


