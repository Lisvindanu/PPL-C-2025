const SequelizeUserRepository = require('../../infrastructure/repositories/SequelizeUserRepository');
const HashService = require('../../infrastructure/services/HashService');
const JwtService = require('../../infrastructure/services/JwtService');
const RegisterUser = require('../../application/use-cases/RegisterUser');
const LoginUser = require('../../application/use-cases/LoginUser');

class UserController {
  constructor() {
    const userRepository = new SequelizeUserRepository();
    const hashService = new HashService();
    const jwtService = new JwtService();

    this.registerUser = new RegisterUser({ userRepository, hashService });
    this.loginUser = new LoginUser({ userRepository, hashService, jwtService });
  }

  register = async (req, res, next) => {
    try {
      const result = await this.registerUser.execute(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const result = await this.loginUser.execute(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UserController;


