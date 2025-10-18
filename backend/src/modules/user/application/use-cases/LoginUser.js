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


