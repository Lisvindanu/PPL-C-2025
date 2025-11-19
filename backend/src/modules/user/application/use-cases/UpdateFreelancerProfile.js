class UpdateFreelancerProfile {
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

    // Check if freelancer profile exists
    const profile = (typeof this.userRepository.findFreelancerProfile === 'function')
      ? await this.userRepository.findFreelancerProfile(userId)
      : null;

    if (!profile) {
      const error = new Error('Freelancer profile not found. Create profile first.');
      error.statusCode = 400;
      throw error;
    }

    // Update user's basic contact/profile fields
    const userUpdates = {};
    if (profileData.nama_lengkap) {
      const parts = profileData.nama_lengkap.trim().split(/\s+/);
      userUpdates.nama_depan = parts.shift() || '';
      userUpdates.nama_belakang = parts.join(' ') || '';
    } else {
      if (profileData.nama_depan) userUpdates.nama_depan = profileData.nama_depan;
      if (profileData.nama_belakang) userUpdates.nama_belakang = profileData.nama_belakang;
    }
    if (profileData.no_telepon) userUpdates.no_telepon = profileData.no_telepon;
    if (profileData.bio || profileData.deskripsi) userUpdates.bio = profileData.bio || profileData.deskripsi;
    if (profileData.kota) userUpdates.kota = profileData.kota;
    if (profileData.provinsi) userUpdates.provinsi = profileData.provinsi;
    if (profileData.avatar) userUpdates.avatar = profileData.avatar;

    // Apply user updates
    if (Object.keys(userUpdates).length > 0) {
      await user.update(userUpdates);
    }

    // Prepare freelancer profile payload
    const profilePayload = {};
    
    // Basic fields
    if (profileData.judul_profesi !== undefined) profilePayload.judul_profesi = profileData.judul_profesi;
    if (profileData.gelar !== undefined) profilePayload.judul_profesi = profileData.gelar; // gelar also maps to judul_profesi if provided
    if (profileData.deskripsi_lengkap !== undefined) profilePayload.deskripsi_lengkap = profileData.deskripsi_lengkap;
    
    // Handle array/JSON fields
    if (profileData.keahlian !== undefined) {
      profilePayload.keahlian = this._normalizeArray(profileData.keahlian);
    }
    if (profileData.bahasa !== undefined) {
      profilePayload.bahasa = this._normalizeArray(profileData.bahasa);
    }
    if (profileData.edukasi !== undefined) {
      profilePayload.edukasi = this._normalizeArrayOfObjects(profileData.edukasi);
    }
    if (profileData.lisensi !== undefined) {
      profilePayload.lisensi = this._normalizeArrayOfObjects(profileData.lisensi);
    }

    // Portfolio fields
    if (profileData.portfolio_url !== undefined) profilePayload.portfolio_url = profileData.portfolio_url;
    if (profileData.judul_portfolio !== undefined) profilePayload.judul_portfolio = profileData.judul_portfolio;
    if (profileData.deskripsi_portfolio !== undefined) profilePayload.deskripsi_portfolio = profileData.deskripsi_portfolio;
    if (profileData.file_portfolio !== undefined) profilePayload.file_portfolio = profileData.file_portfolio;
    
    // Photo fields
    if (profileData.avatar !== undefined) profilePayload.avatar = profileData.avatar;
    if (profileData.foto_latar !== undefined) profilePayload.foto_latar = profileData.foto_latar;

    // Update profile
    if (Object.keys(profilePayload).length > 0) {
      await this.userRepository.updateFreelancerProfile(userId, profilePayload);
    }

    // Fetch updated profile to return
    const updatedProfile = await this.userRepository.findFreelancerProfile(userId);

    return {
      profile: {
        id: updatedProfile.id,
        user_id: updatedProfile.user_id,
        judul_profesi: updatedProfile.judul_profesi,
        keahlian: updatedProfile.keahlian,
        bahasa: updatedProfile.bahasa,
        edukasi: updatedProfile.edukasi,
        lisensi: updatedProfile.lisensi,
        deskripsi_lengkap: updatedProfile.deskripsi_lengkap,
        portfolio_url: updatedProfile.portfolio_url,
        judul_portfolio: updatedProfile.judul_portfolio,
        deskripsi_portfolio: updatedProfile.deskripsi_portfolio,
        file_portfolio: updatedProfile.file_portfolio,
        avatar: updatedProfile.avatar,
        foto_latar: updatedProfile.foto_latar
      },
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nama_depan: user.nama_depan,
        nama_belakang: user.nama_belakang,
        no_telepon: user.no_telepon,
        kota: user.kota,
        provinsi: user.provinsi,
        bio: user.bio,
        avatar: user.avatar
      }
    };
  }

  /**
   * Normalize input to array (accept string/array/JSON)
   */
  _normalizeArray(input) {
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : [input];
      } catch (e) {
        // Treat as comma-separated
        return input.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  }

  /**
   * Normalize input to array of objects (for edukasi/lisensi)
   */
  _normalizeArrayOfObjects(input) {
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : [{ name: input }];
      } catch (e) {
        return [{ name: input }];
      }
    }
    return [];
  }
}

module.exports = UpdateFreelancerProfile;
