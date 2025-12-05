const Email = require('../../domain/value-objects/Email');
const Password = require('../../domain/value-objects/Password');
const UserTokenModel = require('../../../user/infrastructure/models/UserTokenModel');
const NotificationService = require('../../../../shared/services/NotificationService');

class RegisterUser {
  constructor({ userRepository, hashService, emailService, notificationService = null }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.emailService = emailService;
    this.notificationService = notificationService || new NotificationService();
    this.userTokenModel = UserTokenModel;
  }

  async execute({ email, password, firstName, lastName, termsAccepted }) {
    console.log('Terms accepted in use case:', termsAccepted);
    if (termsAccepted !== true) {
      const error = new Error('Terms and conditions must be accepted');
      error.statusCode = 400;
      throw error;
    }
    const emailVo = new Email(email);
    const passwordVo = new Password(password);

    const existing = await this.userRepository.findByEmail(emailVo.value);
    if (existing) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await this.hashService.hash(passwordVo.value);

    const created = await this.userRepository.create({
      email: emailVo.value,
      password: hashedPassword,
      role: 'client', // All new registrations are clients by default
      nama_depan: firstName || null,
      nama_belakang: lastName || null,
      is_verified: false // Set to false, will be true after OTP verification
    });

    // Generate OTP for email verification
    const otpLength = parseInt(process.env.OTP_LENGTH || '6', 10);
    const otp = this.notificationService.generateOTP(otpLength);
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Save OTP to database
    await this.userTokenModel.create({
      user_id: created.id,
      token: otp,
      type: 'email_verification',
      expires_at: expiresAt
    });

    // Send OTP via email
    const notificationResult = await this.notificationService.sendOTP({
      email: created.email,
      phoneNumber: null,
      otp,
      purpose: 'verification',
      channels: ['email']
    });

    // Build response
    const response = {
      id: created.id,
      email: created.email,
      role: created.role,
      message: 'Registration successful. Please verify your email with OTP.',
      emailSent: notificationResult.success
    };

    // In development, include OTP for testing
    if (process.env.NODE_ENV !== 'production') {
      response.otp = otp;
      response.expiresAt = expiresAt;
    }

    return response;
  }
}

module.exports = RegisterUser;


