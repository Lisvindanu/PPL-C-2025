class CreateFreelancerProfile {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(userId, profileData) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Prevent creating duplicate profile
    const existing = (typeof this.userRepository.findFreelancerProfile === 'function')
      ? await this.userRepository.findFreelancerProfile(userId)
      : null;

    if (existing) {
      const error = new Error('Freelancer profile already exists');
      error.statusCode = 400;
      throw error;
    }

    // Map incoming form fields (frontend freelancer registration form):
    // - nama_lengkap (string) -> mapped to users.nama_depan and users.nama_belakang
    // - gelar (string) -> stored in profil_freelancer.judul_profesi
    // - no_telepon (string) -> stored on users.no_telepon
    // - deskripsi (string) -> stored on users.bio
    // Any other fields sent will be ignored by this use-case (keahlian, portfolio, etc. handled elsewhere)

    // Update user's basic contact/profile fields when provided
    const userUpdates = {};
    if (profileData.nama_lengkap) {
      const parts = String(profileData.nama_lengkap).trim().split(/\s+/);
      userUpdates.nama_depan = parts.shift() || '';
      userUpdates.nama_belakang = parts.join(' ') || '';
    }
    if (profileData.no_telepon) userUpdates.no_telepon = profileData.no_telepon;
    if (profileData.deskripsi) userUpdates.bio = profileData.deskripsi;

    // Prepare freelancer profile payload (only gelar -> judul_profesi)
    const profilePayload = {};
    if (profileData.gelar) profilePayload.judul_profesi = profileData.gelar;

    // create profile record
    const profile = await this.userRepository.createFreelancerProfile(userId, profilePayload);

    // Apply user updates (name, phone, bio)
    if (Object.keys(userUpdates).length > 0) {
      await user.update(userUpdates);
    }

    // After successful creation, switch user's role to freelancer
    await user.update({ role: 'freelancer' });

    return {
      freelancerProfile: {
        id: profile.id,
        user_id: profile.user_id,
        judul_profesi: profile.judul_profesi
      },
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nama_depan: user.nama_depan,
        nama_belakang: user.nama_belakang,
        no_telepon: user.no_telepon,
        bio: user.bio
      }
    };
  }
}

module.exports = CreateFreelancerProfile;
