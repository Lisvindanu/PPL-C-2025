const UserModel = require('../../../user/infrastructure/models/UserModel');
const OrderModel = require('./OrderModel');
const ServiceModel = require('./ServiceModel');
const ReviewModel = require('./ReviewModel');

/**
 * Helper untuk inisialisasi model:
 * - Jika model hasil require() adalah fungsi → panggil (sequelize)
 * - Jika model sudah berupa class Sequelize.Model → langsung return
 */
function initModel(model, sequelize) {
  // kalau model punya property .init (ciri khas Sequelize.Model class)
  if (model.init && model.name) {
    return model; // langsung return class yang sudah didefinisikan
  }

  // kalau model function biasa, panggil dengan sequelize
  if (typeof model === 'function') {
    return model(sequelize);
  }

  throw new Error('Model tidak valid atau belum dikenali formatnya.');
}

module.exports = (sequelize) => {
  const User = initModel(UserModel, sequelize);
  const Pesanan = initModel(OrderModel, sequelize);
  const Layanan = initModel(ServiceModel, sequelize);
  const Review = initModel(ReviewModel, sequelize);

  // ===================== RELASI =====================
  User.hasMany(Pesanan, { foreignKey: 'client_id', as: 'pesanan_client' });
  User.hasMany(Pesanan, { foreignKey: 'freelancer_id', as: 'pesanan_freelancer' });
  User.hasMany(Review, { foreignKey: 'pemberi_ulasan_id', as: 'ulasan_dibuat' });
  User.hasMany(Review, { foreignKey: 'penerima_ulasan_id', as: 'ulasan_diterima' });

  Pesanan.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
  Pesanan.belongsTo(User, { foreignKey: 'freelancer_id', as: 'freelancer' });
  Pesanan.belongsTo(Layanan, { foreignKey: 'layanan_id', as: 'layanan' });
  Pesanan.hasOne(Review, { foreignKey: 'pesanan_id', as: 'ulasan' });

  Layanan.belongsTo(User, { foreignKey: 'freelancer_id', as: 'freelancer' });
  Layanan.hasMany(Review, { foreignKey: 'layanan_id', as: 'ulasan' });
  Layanan.hasMany(Pesanan, { foreignKey: 'layanan_id', as: 'pesanan' });

  Review.belongsTo(User, { foreignKey: 'pemberi_ulasan_id', as: 'pemberi_ulasan' });
  Review.belongsTo(User, { foreignKey: 'penerima_ulasan_id', as: 'penerima_ulasan' });
  Review.belongsTo(Pesanan, { foreignKey: 'pesanan_id', as: 'pesanan' });
  Review.belongsTo(Layanan, { foreignKey: 'layanan_id', as: 'layanan' });

  sequelize.models.User = User;
  sequelize.models.pesanan = Pesanan;
  sequelize.models.layanan = Layanan;
  sequelize.models.ulasan = Review;

  return { User, Pesanan, Layanan, Review };
};
