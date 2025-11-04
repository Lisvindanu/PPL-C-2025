class AddFavorite {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute(userId, layananId) {
    try {
      // Check if already favorited
      const exists = await this.favoriteRepository.exists(userId, layananId);

      if (exists) {
        return {
          success: false,
          message: 'Layanan sudah ada di favorit'
        };
      }

      const favorite = await this.favoriteRepository.create(userId, layananId);

      return {
        success: true,
        message: 'Layanan berhasil ditambahkan ke favorit',
        data: { favorite }
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
