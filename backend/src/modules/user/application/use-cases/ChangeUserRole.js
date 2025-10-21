class ChangeUserRole {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(userId, newRole) {
    // Validate role
    const validRoles = ['client', 'freelancer', 'admin'];
    if (!validRoles.includes(newRole)) {
      const error = new Error('Invalid role');
      error.statusCode = 400;
      throw error;
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if user is trying to change to admin role (only existing admin can do this)
    if (newRole === 'admin' && user.role !== 'admin') {
      const error = new Error('Insufficient permissions to assign admin role');
      error.statusCode = 403;
      throw error;
    }

    await user.update({ role: newRole });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      nama_depan: user.nama_depan,
      nama_belakang: user.nama_belakang
    };
  }
}

module.exports = ChangeUserRole;
