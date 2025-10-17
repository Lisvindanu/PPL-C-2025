class RegisterDto {
  constructor({ email, password, firstName, lastName, role = 'client' }) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
  }
}

module.exports = RegisterDto;


