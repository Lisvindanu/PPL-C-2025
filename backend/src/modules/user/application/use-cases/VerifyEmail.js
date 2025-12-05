const UserTokenModel = require('../../../user/infrastructure/models/UserTokenModel');

class VerifyEmail {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
    this.userTokenModel = UserTokenModel;
  }

  async execute({ email, otp }) {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    // Find OTP token for this user
    const tokenRow = await this.userTokenModel.findOne({ 
      where: { 
        user_id: user.id,
        token: otp,
        type: 'email_verification' 
      } 
    });
    if (!tokenRow) {
      const err = new Error('Invalid or expired token');
      err.statusCode = 400;
      throw err;
    }

    if (tokenRow.used_at) {
      const err = new Error('Token already used');
      err.statusCode = 400;
      throw err;
    }

    if (new Date(tokenRow.expires_at) < new Date()) {
      const err = new Error('OTP expired');
      err.statusCode = 400;
      throw err;
    }

    // Verify email
    await user.update({ is_verified: true, email_verified_at: new Date() });
    await tokenRow.update({ used_at: new Date() });

    return { 
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        is_verified: true
      }
    };
  }
}

module.exports = VerifyEmail;


