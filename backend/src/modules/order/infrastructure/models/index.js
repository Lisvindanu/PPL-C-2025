const OrderModel = require('./OrderModel');
const { ServiceModel, UserModel } = require('../../../service/infrastructure/models');

// Define associations
OrderModel.belongsTo(ServiceModel, {
  foreignKey: 'layanan_id',
  as: 'layanan'
});

OrderModel.belongsTo(UserModel, {
  foreignKey: 'client_id',
  as: 'client'
});

OrderModel.belongsTo(UserModel, {
  foreignKey: 'freelancer_id',
  as: 'freelancer'
});

module.exports = {
  OrderModel
};
