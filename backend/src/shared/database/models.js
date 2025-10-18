// Load and associate all Sequelize models here
const UserModel = require('../../modules/user/infrastructure/models/UserModel');
const UserTokenModel = require('../../modules/user/infrastructure/models/UserTokenModel');
const FreelancerProfileModel = require('../../modules/user/infrastructure/models/FreelancerProfileModel');

function initAssociations() {
  // users -> profil_freelancer (1:1)
  UserModel.hasOne(FreelancerProfileModel, {
    foreignKey: 'user_id',
    as: 'freelancerProfile',
    onDelete: 'CASCADE'
  });
  FreelancerProfileModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // users -> user_tokens (1:N)
  UserModel.hasMany(UserTokenModel, {
    foreignKey: 'user_id',
    as: 'tokens',
    onDelete: 'CASCADE'
  });
  UserTokenModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user'
  });
}

module.exports = { initAssociations, UserModel, UserTokenModel, FreelancerProfileModel };


