const UserTokenModel = require('../../../user/infrastructure/models/UserTokenModel');
const NotificationService = require('../../../../shared/services/NotificationService');

/**
 * SendOTP Use Case
 * Sends OTP via Email and/or WhatsApp for various purposes
 */
class SendOTP {
  constructor({ userRepository, notificationService = null }) {
    this.userRepository = userRepository;
    this.userTokenModel = UserTokenModel;
    this.notificationService = notificationService || new NotificationService();
  }

  /**
   * Execute OTP sending
   * @param {Object} params
   * @param {string} params.email - User email
   * @param {string} params.phoneNumber - User phone number (optional)
   * @param {string} params.purpose - Purpose: 'password_reset', 'verification', 'login', 'transaction'
   * @param {Array<string>} params.channels - Channels: ['email', 'whatsapp']
   * @returns {Promise<Object>}
   */
  async execute({ email, phoneNumber = null, purpose = 'verification', channels = ['email'] }) {
    // Validate user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    // Check rate limiting - prevent spam
    const recentOTP = await this.userTokenModel.findOne({
      where: {
        user_id: user.id,
        type: purpose,
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

    // Generate OTP
    const otpLength = parseInt(process.env.OTP_LENGTH || '6', 10);
    const otp = this.notificationService.generateOTP(otpLength);
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Save OTP to database
    await this.userTokenModel.create({
      user_id: user.id,
      token: otp,
      type: purpose,
      expires_at: expiresAt
    });

    // Send OTP via configured channels
    const notificationResult = await this.notificationService.sendOTP({
      email: user.email,
      phoneNumber: phoneNumber || user.phone_number,
      otp,
      purpose,
      channels
    });

    // Build response
    const response = {
      message: 'OTP has been sent successfully',
      channels: notificationResult.channels,
      success: notificationResult.success,
      expiresIn: `${expiryMinutes} minutes`
    };

    // Include errors if any
    if (notificationResult.errors && notificationResult.errors.length > 0) {
      response.errors = notificationResult.errors;
    }

    // In development, include OTP for testing
    if (process.env.NODE_ENV !== 'production') {
      response.otp = otp;
      response.expiresAt = expiresAt;
    }

    return response;
  }
}

module.exports = SendOTP;
