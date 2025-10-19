const SequelizeUserRepository = require('../../infrastructure/repositories/SequelizeUserRepository');
const HashService = require('../../infrastructure/services/HashService');
const JwtService = require('../../infrastructure/services/JwtService');
const RegisterUser = require('../../application/use-cases/RegisterUser');
const LoginUser = require('../../application/use-cases/LoginUser');
const UpdateProfile = require('../../application/use-cases/UpdateProfile');
const ForgotPassword = require('../../application/use-cases/ForgotPassword');
const ResetPassword = require('../../application/use-cases/ResetPassword');

class UserController {
  constructor() {
    const userRepository = new SequelizeUserRepository();
    const hashService = new HashService();
    const jwtService = new JwtService();

    this.registerUser = new RegisterUser({ userRepository, hashService });
    this.loginUser = new LoginUser({ userRepository, hashService, jwtService });
    this.updateProfileUseCase = new UpdateProfile({ userRepository });
    this.forgotPasswordUseCase = new ForgotPassword({ userRepository });
    this.resetPasswordUseCase = new ResetPassword({ userRepository, hashService });
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

  getProfile = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      const user = await this.loginUser.userRepository.findById(userId);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      res.json({ success: true, data: {
        id: user.id,
        email: user.email,
        role: user.role,
        nama_depan: user.nama_depan,
        nama_belakang: user.nama_belakang,
        no_telepon: user.no_telepon,
        avatar: user.avatar,
        bio: user.bio,
        kota: user.kota,
        provinsi: user.provinsi
      }});
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

  const result = await this.updateProfileUseCase.execute(userId, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
  const result = await this.forgotPasswordUseCase.execute(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
  const result = await this.resetPasswordUseCase.execute(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UserController;


