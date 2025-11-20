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

    // Allow fields coming from client edit form:
    // - nama_lengkap (string) -> mapped to nama_depan / nama_belakang
    // - foto_latar (string URL)
    // - avatar (foto profil) (string URL)
    // - no_telepon (string)
    // - lokasi (string) -> attempt to split into kota/provinsi if delimiter provided
    // - bio (string)
    // - anggaran (string)
    // - tipe_proyek (string)

    const updatable = [
      'nama_depan',
      'nama_belakang',
      'no_telepon',
      'avatar',
      'foto_latar',
      'bio',
      'kota',
      'provinsi',
      'anggaran',
      'tipe_proyek'
    ];

    const data = {};

    // Map nama_lengkap -> nama_depan / nama_belakang
    if (payload.nama_lengkap !== undefined && payload.nama_lengkap !== null) {
      const parts = String(payload.nama_lengkap).trim().split(/\s+/);
      data.nama_depan = parts.shift() || '';
      data.nama_belakang = parts.join(' ') || '';
    }

    // Map lokasi -> kota / provinsi (accept formats like 'Kota, Provinsi' or 'Kota/Provinsi')
    if (payload.lokasi !== undefined && payload.lokasi !== null) {
      const loc = String(payload.lokasi).trim();
      let city = null;
      let province = null;
      if (loc.includes(',')) {
        const parts = loc.split(',').map(s => s.trim()).filter(Boolean);
        city = parts[0] || null;
        province = parts[1] || null;
      } else if (loc.includes('/')) {
        const parts = loc.split('/').map(s => s.trim()).filter(Boolean);
        city = parts[0] || null;
        province = parts[1] || null;
      } else {
        // If only one value provided, put it into kota
        city = loc || null;
      }
      if (city) data.kota = city;
      if (province) data.provinsi = province;
    }

    // Copy other updatable fields directly if provided
    updatable.forEach((f) => {
      if (['nama_depan','nama_belakang','kota','provinsi'].includes(f)) return; // already handled
      if (data[f] === undefined && payload[f] !== undefined) data[f] = payload[f];
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
      foto_latar: user.foto_latar,
      bio: user.bio,
      kota: user.kota,
      provinsi: user.provinsi,
      anggaran: user.anggaran,
      tipe_proyek: user.tipe_proyek
    };
  }
}

module.exports = UpdateProfile;
