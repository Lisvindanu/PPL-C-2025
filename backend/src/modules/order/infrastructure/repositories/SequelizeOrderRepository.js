const { OrderModel } = require('../models');
const { ServiceModel, UserModel, KategoriModel } = require('../../../service/infrastructure/models');

class SequelizeOrderRepository {
  async create(orderData) {
    return await OrderModel.create(orderData);
  }

  async findById(id) {
    return await OrderModel.findByPk(id, {
      include: [
        {
          model: ServiceModel,
          as: 'layanan',
          include: [
            {
              model: KategoriModel,
              as: 'kategori',
              attributes: ['id', 'nama', 'slug']
            }
          ]
        },
        {
          model: UserModel,
          as: 'client',
          attributes: ['id', 'nama_depan', 'nama_belakang', 'email', 'no_telepon']
        },
        {
          model: UserModel,
          as: 'freelancer',
          attributes: ['id', 'nama_depan', 'nama_belakang', 'email', 'no_telepon']
        }
      ]
    });
  }

  async findByUserId(userId, role = 'client') {
    const whereClause = role === 'client' 
      ? { client_id: userId }
      : { freelancer_id: userId };

    return await OrderModel.findAll({
      where: whereClause,
      include: [
        {
          model: ServiceModel,
          as: 'layanan',
          attributes: ['id', 'judul', 'slug', 'thumbnail']
        },
        {
          model: UserModel,
          as: role === 'client' ? 'freelancer' : 'client',
          attributes: ['id', 'nama_depan', 'nama_belakang', 'avatar']
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Get count of orders today
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const count = await OrderModel.count({
      where: {
        created_at: {
          [require('sequelize').Op.gte]: todayStart
        }
      }
    });

    const orderNum = String(count + 1).padStart(5, '0');
    return `PES-${year}${month}-${orderNum}`;
  }
}

module.exports = SequelizeOrderRepository;
