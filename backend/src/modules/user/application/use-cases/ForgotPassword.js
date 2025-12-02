const UserTokenModel = require('../../../user/infrastructure/models/UserTokenModel');
const NotificationService = require('../../../../shared/services/NotificationService');

class ForgotPassword {
  constructor({ userRepository, notificationService = null }) {
    this.userRepository = userRepository;
    this.userTokenModel = UserTokenModel;
    this.notificationService = notificationService || new NotificationService();
  }

  async execute({ email, phoneNumber = null, channels = ['email'] }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // For security, respond as if success
      return { message: 'If the email exists, a reset OTP was sent' };
    }

    // Generate OTP instead of UUID token
    const otpLength = parseInt(process.env.OTP_LENGTH || '6', 10);
    const otp = this.notificationService.generateOTP(otpLength);
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Save OTP to database
    await this.userTokenModel.create({
      user_id: user.id,
      token: otp,
      type: 'password_reset',
      expires_at: expiresAt
    });

    // Send OTP via configured channels
    const notificationResult = await this.notificationService.sendOTP({
      email: user.email,
      phoneNumber: phoneNumber || user.phone_number,
      otp,
      purpose: 'password_reset',
      channels
    });

    // Return response
    const response = {
      message: 'OTP has been sent',
      channels: notificationResult.channels,
      success: notificationResult.success
    };

    // In development, include OTP for testing
    if (process.env.NODE_ENV !== 'production') {
      response.otp = otp;
      response.expiresAt = expiresAt;
    }

    return response;
  }
}

module.exports = ForgotPassword;





//
