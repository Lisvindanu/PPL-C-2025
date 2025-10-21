// backend/src/modules/auth/application/use-cases/LoginUser.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class LoginUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, password) {
    try {
      // 1. Validasi input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // 2. Cari user berdasarkan email
      const user = await this.userRepository.findByEmail(email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // 3. Cek apakah user aktif
      if (user.is_active === 0) {
        throw new Error('User account is disabled');
      }

      // 4. Validasi password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // 5. Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          nama_depan: user.nama_depan,
          nama_belakang: user.nama_belakang
        },
        process.env.JWT_SECRET || 'your-secret-key',
        {
          expiresIn: '24h'  // Token valid 24 jam
        }
      );

      // 6. Return token dan user data (tanpa password)
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          nama_depan: user.nama_depan,
          nama_belakang: user.nama_belakang,
          is_active: user.is_active
        }
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}

module.exports = LoginUser;