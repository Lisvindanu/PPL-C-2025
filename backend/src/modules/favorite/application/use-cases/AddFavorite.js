class AddFavorite {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute(userId, layananId) {
    try {
      // Check if already favorited
      const exists = await this.favoriteRepository.exists(userId, layananId);

      // Idempotent add: if already exists, return success
      // The desired state (favorite added) is already achieved
      if (exists) {
        return {
          success: true,
          message: 'Layanan sudah ada di favorit',
          data: { alreadyExists: true }
        };
      }

      const favorite = await this.favoriteRepository.create(userId, layananId);

      return {
        success: true,
        message: 'Layanan berhasil ditambahkan ke favorit',
        data: { favorite, alreadyExists: false }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to add favorite'
      };
    }
  }
}

module.exports = AddFavorite;
