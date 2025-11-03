const ServiceModel = require('./ServiceModel');
const KategoriModel = require('./KategoriModel');
const UserModel = require('./UserModel');

// Define associations
ServiceModel.belongsTo(KategoriModel, {
  foreignKey: 'kategori_id',
  as: 'kategori'
});

ServiceModel.belongsTo(UserModel, {
  foreignKey: 'freelancer_id',
  as: 'freelancer'
});

KategoriModel.hasMany(ServiceModel, {
  foreignKey: 'kategori_id',
  as: 'layanan'
});

UserModel.hasMany(ServiceModel, {
  foreignKey: 'freelancer_id',
  as: 'layanan'
});

module.exports = {
  ServiceModel,
  KategoriModel,
  UserModel
};
