const UserTokenModel = require('../../../user/infrastructure/models/UserTokenModel');
const Password = require('../../domain/value-objects/Password');

class ResetPassword {
  constructor({ userRepository, hashService }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.userTokenModel = UserTokenModel;
  }

  async execute({ email, token, newPassword }) {
    // Validate password strength (8 chars, letters, numbers, symbols)
    try {
      new Password(newPassword);
    } catch (error) {
      const err = new Error('Password does not meet strength requirements: minimum 8 characters, must include letters, numbers, and symbols');
      err.statusCode = 400;
      throw err;
    }
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    const tokenRow = await this.userTokenModel.findOne({ 
      where: { 
        user_id: user.id,
        token, 
        type: 'password_reset' 
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
      const err = new Error('Token expired');
      err.statusCode = 400;
      throw err;
    }

    const hashed = await this.hashService.hash(newPassword);
    await user.update({ password: hashed });

    // mark token used
    await tokenRow.update({ used_at: new Date() });

    return { message: 'Password updated' };
  }
}

module.exports = ResetPassword;
