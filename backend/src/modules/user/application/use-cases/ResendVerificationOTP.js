const UserTokenModel = require('../../../user/infrastructure/models/UserTokenModel');
const NotificationService = require('../../../../shared/services/NotificationService');

/**
 * ResendVerificationOTP Use Case
 * Resend OTP for email verification
 */
class ResendVerificationOTP {
  constructor({ userRepository, notificationService = null }) {
    this.userRepository = userRepository;
    this.userTokenModel = UserTokenModel;
    this.notificationService = notificationService || new NotificationService();
  }

  async execute({ email }) {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    // Check if already verified
    if (user.is_verified) {
      const err = new Error('Email already verified');
      err.statusCode = 400;
      throw err;
    }

    // Check rate limiting - prevent spam
    const recentOTP = await this.userTokenModel.findOne({
      where: {
        user_id: user.id,
        type: 'email_verification',
        created_at: {
          [require('sequelize').Op.gte]: new Date(Date.now() - 60 * 1000) // Last 1 minute
        }
      }
    });

    if (recentOTP) {
      const err = new Error('Please wait before requesting another OTP');
      err.statusCode = 429;
      throw err;
    }

    // Generate new OTP
    const otpLength = parseInt(process.env.OTP_LENGTH || '6', 10);
    const otp = this.notificationService.generateOTP(otpLength);
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Save OTP to database
    await this.userTokenModel.create({
      user_id: user.id,
      token: otp,
      type: 'email_verification',
      expires_at: expiresAt
    });

    // Send OTP via email
    const notificationResult = await this.notificationService.sendOTP({
      email: user.email,
      phoneNumber: null,
      otp,
      purpose: 'verification',
      channels: ['email']
    });

    // Build response
    const response = {
      message: 'Verification OTP has been resent',
      emailSent: notificationResult.success,
      expiresIn: `${expiryMinutes} minutes`
    };

    // In development, include OTP for testing
    if (process.env.NODE_ENV !== 'production') {
      response.otp = otp;
      response.expiresAt = expiresAt;
    }

    return response;
  }
}

module.exports = ResendVerificationOTP;
