const Email = require('../../domain/value-objects/Email');
const Password = require('../../domain/value-objects/Password');

class RegisterUser {
  constructor({ userRepository, hashService }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
  }

  async execute({ email, password, firstName, lastName, role = 'client' }) {
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
      role,
      nama_depan: firstName || null,
      nama_belakang: lastName || null
    });

    return {
      id: created.id,
      email: created.email,
      role: created.role
    };
  }
}

module.exports = RegisterUser;


