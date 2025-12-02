const Email = require('../../domain/value-objects/Email');

class LoginUser {
  constructor({ userRepository, hashService, jwtService }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.jwtService = jwtService;
  }

  async execute({ email, password }) {
    const emailVo = new Email(email);
    const user = await this.userRepository.findByEmail(emailVo.value);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await this.hashService.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Check if account is active
    // `is_active` is expected to be a boolean or numeric flag on the user model
    if (user.is_active === false || user.is_active === 0) {
      const err = new Error('Account inactive');
      err.statusCode = 403;
      err.code = 'ACCOUNT_INACTIVE';
      throw err;
    }

    const token = this.jwtService.generate(user.id, user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = LoginUser;


