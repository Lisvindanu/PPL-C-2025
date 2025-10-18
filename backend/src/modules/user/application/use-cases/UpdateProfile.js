class UpdateProfile {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute(userId, payload) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Only allow certain fields to be updated
    const updatable = [
      'nama_depan',
      'nama_belakang',
      'no_telepon',
      'avatar',
      'bio',
      'kota',
      'provinsi'
    ];

    const data = {};
    updatable.forEach((f) => {
      if (payload[f] !== undefined) data[f] = payload[f];
    });

    await user.update(data);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      nama_depan: user.nama_depan,
      nama_belakang: user.nama_belakang,
      no_telepon: user.no_telepon,
      avatar: user.avatar,
      bio: user.bio,
      kota: user.kota,
      provinsi: user.provinsi
    };
  }
}

module.exports = UpdateProfile;
