const UserTokenModel = require('../../../user/infrastructure/models/UserTokenModel');

class VerifyOTP {
  constructor({ userRepository, emailService = null }) {
    this.userRepository = userRepository;
    this.userTokenModel = UserTokenModel;
    this.emailService = emailService;
  }

  async execute({ email, otp }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    // Find the password reset token for this user
    const tokenRow = await this.userTokenModel.findOne({ 
      where: { 
        user_id: user.id, 
        token: otp,
        type: 'password_reset' 
      }
    });

    if (!tokenRow) {
      const err = new Error('No reset token found');
      err.statusCode = 400;
      throw err;
    }

    if (tokenRow.used_at) {
      const err = new Error('Token already used');
      err.statusCode = 400;
      throw err;
    }

    if (new Date(tokenRow.expires_at) < new Date()) {
      const err = new Error('Token expired');
      err.statusCode = 400;
      throw err;
    }

    // Token is already validated by the query above

    // Generate a new token for password reset
    const { v4: uuidv4 } = require('uuid');
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await this.userTokenModel.create({
      user_id: user.id,
      token: resetToken,
      type: 'password_reset',
      expires_at: expiresAt
    });

    // Attempt to send password reset email if service is available
    let emailResult = null;
    if (this.emailService && user.email) {
      try {
        emailResult = await this.emailService.sendPasswordResetEmail(user.email, resetToken);
      } catch (e) {
        /* eslint-disable no-console */
        console.error('[VerifyOTP] sendPasswordResetEmail error', e);
        emailResult = { success: false, error: e };
      }
    }

    return {
      message: 'OTP verified successfully',
      token: resetToken,
      email: emailResult
    };
  }
}

module.exports = VerifyOTP;
