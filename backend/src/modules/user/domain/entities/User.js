class User {
  constructor({
    id,
    email,
    password,
    role = 'client',
    firstName = null,
    lastName = null,
    phoneNumber = null,
    avatar = null,
    bio = null,
    city = null,
    province = null,
    isActive = true,
    isVerified = false,
    emailVerifiedAt = null,
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.avatar = avatar;
    this.bio = bio;
    this.city = city;
    this.province = province;
    this.isActive = isActive;
    this.isVerified = isVerified;
    this.emailVerifiedAt = emailVerifiedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = User;


