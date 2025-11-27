const SequelizeUserRepository = require('../../infrastructure/repositories/SequelizeUserRepository');
const HashService = require('../../infrastructure/services/HashService');
const JwtService = require('../../infrastructure/services/JwtService');
const EmailService = require('../../infrastructure/services/EmailService');
const RegisterUser = require('../../application/use-cases/RegisterUser');
const LoginUser = require('../../application/use-cases/LoginUser');
const UpdateProfile = require('../../application/use-cases/UpdateProfile');
const ForgotPassword = require('../../application/use-cases/ForgotPassword');
const ResetPassword = require('../../application/use-cases/ResetPassword');
const VerifyOTP = require('../../application/use-cases/VerifyOTP');
const ChangeUserRole = require('../../application/use-cases/ChangeUserRole');
const CreateFreelancerProfile = require('../../application/use-cases/CreateFreelancerProfile');
const UpdateFreelancerProfile = require('../../application/use-cases/UpdateFreelancerProfile');

class UserController {
  constructor() {
    const userRepository = new SequelizeUserRepository();
    const hashService = new HashService();
    const jwtService = new JwtService();
    const emailService = new EmailService();

    this.registerUser = new RegisterUser({ userRepository, hashService, emailService });
    this.loginUser = new LoginUser({ userRepository, hashService, jwtService });
    this.updateProfileUseCase = new UpdateProfile({ userRepository });
    this.forgotPasswordUseCase = new ForgotPassword({ userRepository });
    this.resetPasswordUseCase = new ResetPassword({ userRepository, hashService });
    this.verifyOTPUseCase = new VerifyOTP({ userRepository });
    this.changeUserRoleUseCase = new ChangeUserRole({ userRepository });
    this.createFreelancerProfileUseCase = new CreateFreelancerProfile({ userRepository });
    this.updateFreelancerProfileUseCase = new UpdateFreelancerProfile({ userRepository });
  }

  register = async (req, res, next) => {
    try {
      console.log('Registration request body:', req.body);
      const { email, password, nama_depan, nama_belakang } = req.body;
      // Handle both boolean true and string "true"
      const termsAccepted = req.body.ketentuan_agree === true || req.body.ketentuan_agree === 'true';
      console.log('Terms accepted value:', termsAccepted);

      const result = await this.registerUser.execute({
        email,
        password,
        firstName: nama_depan,
        lastName: nama_belakang,
        termsAccepted
      });
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

      const user = await this.loginUser.userRepository.findByIdWithProfile(userId);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      const profile = user.freelancerProfile || null;

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          nama_depan: user.nama_depan,
          nama_belakang: user.nama_belakang,
          no_telepon: user.no_telepon,
          avatar: user.avatar,
          bio: user.bio,
          kota: user.kota,
          provinsi: user.provinsi,
          foto_latar: user.foto_latar,
          anggaran: user.anggaran,
          tipe_proyek: user.tipe_proyek,
          created_at: user.createdAt,
          freelancerProfile: profile
            ? {
                id: profile.id,
                user_id: profile.user_id,
                judul_profesi: profile.judul_profesi,
                keahlian: profile.keahlian,
                bahasa: profile.bahasa,
                edukasi: profile.edukasi,
                lisensi: profile.lisensi,
                deskripsi_lengkap: profile.deskripsi_lengkap,
                portfolio_url: profile.portfolio_url,
                judul_portfolio: profile.judul_portfolio,
                deskripsi_portfolio: profile.deskripsi_portfolio,
                file_portfolio: profile.file_portfolio,
                avatar: profile.avatar,
                foto_latar: profile.foto_latar,
                total_pekerjaan_selesai: profile.total_pekerjaan_selesai,
                rating_rata_rata: profile.rating_rata_rata,
                total_ulasan: profile.total_ulasan
              }
            : null
        }
      });
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

  verifyOTP = async (req, res, next) => {
    try {
      const result = await this.verifyOTPUseCase.execute(req.body);
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

  updatePasswordDirect = async (req, res, next) => {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        const err = new Error('Email and newPassword are required');
        err.statusCode = 400;
        throw err;
      }

      // Validate password strength (8 chars, letters, numbers, symbols)
      const Password = require('../../domain/value-objects/Password');
      try {
        new Password(newPassword);
      } catch (error) {
        const err = new Error('Password does not meet strength requirements: minimum 8 characters, must include letters, numbers, and symbols');
        err.statusCode = 400;
        throw err;
      }

      // Find user by email
      const user = await this.loginUser.userRepository.findByEmail(email);
      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }

      // Hash new password
      const hashedPassword = await this.loginUser.hashService.hash(newPassword);

      // Update password in database
      await user.update({ password: hashedPassword });

      console.log(`✅ Password updated for user: ${email}`);

      res.json({
        success: true,
        data: {
          message: 'Password updated successfully',
          email: email
        }
      });
    } catch (err) {
      next(err);
    }
  };

  logout = async (req, res, next) => {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, we'll just return success since JWT is stateless
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  };

  changeRole = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      const { role } = req.body;
      const result = await this.changeUserRoleUseCase.execute(userId, role);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  createFreelancerProfile = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      const profileData = req.body || {};
      const result = await this.createFreelancerProfileUseCase.execute(userId, profileData);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  updateFreelancerProfile = async (req, res, next) => {
    try {
      const userId = req.user && req.user.userId;
      if (!userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }

      const profileData = req.body || {};
      const result = await this.updateFreelancerProfileUseCase.execute(userId, profileData);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
  // Public method to get user by ID (for viewing freelancer profiles)
  // Public method to get user by ID (for viewing freelancer profiles)
  getUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        const err = new Error("User ID is required");
        err.statusCode = 400;
        throw err;
      }

      const user = await this.loginUser.userRepository.findByIdWithProfile(id);
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      // Return user data with profile (safe for public viewing)
      const profile = user.freelancerProfile || null;
      const responseData = {
        id: user.id,
        email: user.email,
        nama_depan: user.nama_depan,
        nama_belakang: user.nama_belakang,
        no_telepon: user.no_telepon,
        role: user.role,
        bio: user.bio,
        foto: user.avatar,
        is_verified: user.is_verified,
        created_at: user.createdAt,
        profil_freelancer: profile
      };

      res.json({
        success: true,
        data: responseData
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UserController;
