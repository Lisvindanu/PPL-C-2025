// backend/src/modules/auth/config/authDependencies.js

const LoginUser = require('../application/use-cases/LoginUser');
const AuthController = require('../presentation/controllers/AuthController');
const SequelizeUserRepository = require('../infrastructure/repositories/SequelizeUserRepository');

module.exports = function setupAuthDependencies(sequelize) {
  // Create repositories
  const userRepository = new SequelizeUserRepository(sequelize);

  // Create use cases
  const loginUserUseCase = new LoginUser(userRepository);

  // Create controllers
  const authController = new AuthController(loginUserUseCase);

  // Return dependencies
  return {
    authController
  };
};