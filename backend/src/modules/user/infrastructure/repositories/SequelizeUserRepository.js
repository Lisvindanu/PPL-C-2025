const IUserRepository = require('../../domain/repositories/IUserRepository');
const UserModel = require('../models/UserModel');

class SequelizeUserRepository extends IUserRepository {
  async findByEmail(email) {
    return UserModel.findOne({ where: { email } });
  }

  async findById(id) {
    return UserModel.findByPk(id);
  }

  async create(userData) {
    const created = await UserModel.create(userData);
    return created;
  }
}

module.exports = SequelizeUserRepository;


