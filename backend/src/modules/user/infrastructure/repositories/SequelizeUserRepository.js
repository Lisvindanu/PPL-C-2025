const IUserRepository = require('../../domain/repositories/IUserRepository');
const UserModel = require('../models/UserModel');
const FreelancerProfileModel = require('../models/FreelancerProfileModel');

class SequelizeUserRepository extends IUserRepository {
  async findByEmail(email) {
    return UserModel.findOne({ where: { email } });
  }

  async findByGoogleId(googleId) {
    return UserModel.findOne({ where: { google_id: googleId } });
  }

  async findById(id) {
    return UserModel.findByPk(id);
  }

  async findByIdWithProfile(id) {
    return UserModel.findByPk(id, {
      include: [{ model: FreelancerProfileModel, as: 'freelancerProfile' }]
    });
  }

  async findFreelancerProfile(userId) {
    return FreelancerProfileModel.findOne({ where: { user_id: userId } });
  }

  async createFreelancerProfile(userId, profileData) {
    const payload = Object.assign({}, profileData, { user_id: userId });
    return FreelancerProfileModel.create(payload);
  }

  async updateFreelancerProfile(userId, profileData) {
    return FreelancerProfileModel.update(profileData, {
      where: { user_id: userId }
    });
  }

  async create(userData) {
    const created = await UserModel.create(userData);
    return created;
  }
}

module.exports = SequelizeUserRepository;


