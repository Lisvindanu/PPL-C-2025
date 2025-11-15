const Email = require('../../domain/value-objects/Email');
const Password = require('../../domain/value-objects/Password');
const { v4: uuidv4 } = require('uuid');
const UserTokenModel = require('../../../user/infrastructure/models/UserTokenModel');

class RegisterUser {
  constructor({ userRepository, hashService, emailService }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.emailService = emailService;
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
      nama_belakang: lastName || null
    });

    // Generate email verification token (valid 24h)
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.userTokenModel.create({
      user_id: created.id,
      token,
      type: 'email_verification',
      expires_at: expiresAt
    });

    if (this.emailService && typeof this.emailService.sendVerificationEmail === 'function') {
      await this.emailService.sendVerificationEmail(created.email, token);
    }

    return {
      id: created.id,
      email: created.email,
      role: created.role,
      message: 'Registration successful. Please verify your email.'
    };
  }
}

module.exports = RegisterUser;


