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

    // prefer to fetch with profile when available
    const user = (typeof this.userRepository.findByIdWithProfile === 'function')
      ? await this.userRepository.findByIdWithProfile(userId)
      : await this.userRepository.findById(userId);
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

    // If changing to freelancer, ensure freelancer profile exists first
    if (newRole === 'freelancer') {
      // if repository supports direct profile lookup use it, otherwise rely on included relation
      let profile = null;
      if (typeof this.userRepository.findFreelancerProfile === 'function') {
        profile = await this.userRepository.findFreelancerProfile(userId);
      } else if (user && user.freelancerProfile) {
        profile = user.freelancerProfile;
      }

      if (!profile) {
        // Do not change role yet — signal frontend to ask user to complete freelancer registration
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          needsFreelancerRegistration: true,
          message: 'Freelancer profile not found. Please complete freelancer registration before switching role.'
        };
      }
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
