// Load and associate all Sequelize models here
const UserModel = require('../../modules/user/infrastructure/models/UserModel');
const UserTokenModel = require('../../modules/user/infrastructure/models/UserTokenModel');
const FreelancerProfileModel = require('../../modules/user/infrastructure/models/FreelancerProfileModel');
const ConversationModel = require('../../modules/chat/infrastructure/models/ConversationModel');
const MessageModel = require('../../modules/chat/infrastructure/models/MessageModel');


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

  // User (1) <-> (N) Percakapan sebagai user1
  UserModel.hasMany(ConversationModel, {
    foreignKey: 'user1_id',
    as: 'conversations1'
  });
  ConversationModel.belongsTo(UserModel, {
    foreignKey: 'user1_id',
    as: 'user1'
  });

  //  User (1) <-> (N) Percakapan sebagai user2
  UserModel.hasMany(ConversationModel, {
    foreignKey: 'user2_id',
    as: 'conversations2'
  });
  ConversationModel.belongsTo(UserModel, {
    foreignKey: 'user2_id',
    as: 'user2'
  });

  // User (1) <-> (N) Pesan (Sebagaai pengirim)
  UserModel.hasMany(MessageModel, {
    foreignKey: 'pengirim_id',
    as: 'messages'
  });
  UserModel.hasMany(UserModel, {
    foreignKey: 'pengirim_id',
    as: 'pengirim'
  });

  // Percakapan (1) <-> (n) Pesan
  ConversationModel.hasMany(MessageModel, {
    foreignKey: 'percakapan_id',
    as: 'messages'
  });
  ConversationModel.hasMany(ConversationModel, {
    foreignKey: 'percakapan_id',
    as: 'conversation'
  });
}

initAssociations();

module.exports = { initAssociations, UserModel, UserTokenModel, FreelancerProfileModel, ConversationModel, MessageModel };


