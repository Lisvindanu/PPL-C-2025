const UserTokenModel = require('../../../user/infrastructure/models/UserTokenModel');

class VerifyEmail {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
    this.userTokenModel = UserTokenModel;
  }

  async execute({ token }) {
    const tokenRow = await this.userTokenModel.findOne({ where: { token, type: 'email_verification' } });
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

    const user = await this.userRepository.findById(tokenRow.user_id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    await user.update({ is_verified: true, email_verified_at: new Date() });
    await tokenRow.update({ used_at: new Date() });

    return { message: 'Email verified successfully' };
  }
}

module.exports = VerifyEmail;


