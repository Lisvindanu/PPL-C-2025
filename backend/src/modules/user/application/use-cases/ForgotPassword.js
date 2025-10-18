const { v4: uuidv4 } = require('uuid');
const UserTokenModel = require('../../../user/infrastructure/models/UserTokenModel');

class ForgotPassword {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
    this.userTokenModel = UserTokenModel;
  }

  async execute({ email }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // For security, respond as if success
      return { message: 'If the email exists, a reset token was generated' };
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userTokenModel.create({
      user_id: user.id,
      token,
      type: 'password_reset',
      expires_at: expiresAt
    });

    // In production you'd email the token. Here we return it so frontend/dev can use it.
    return { message: 'Password reset token generated', token };
  }
}

module.exports = ForgotPassword;
