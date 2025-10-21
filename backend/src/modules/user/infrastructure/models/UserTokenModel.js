const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const UserTokenModel = sequelize.define('user_tokens', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('email_verification', 'password_reset'),
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  used_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  updatedAt: false,
  indexes: [
    { fields: ['token'] },
    { fields: ['user_id'] }
  ]
});

module.exports = UserTokenModel;


