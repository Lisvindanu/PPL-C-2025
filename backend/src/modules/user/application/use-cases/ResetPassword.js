const UserTokenModel = require('../../../user/infrastructure/models/UserTokenModel');

class ResetPassword {
  constructor({ userRepository, hashService }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.userTokenModel = UserTokenModel;
  }

  async execute({ email, token, newPassword }) {
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
        type: 'password_reset_verified' 
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
