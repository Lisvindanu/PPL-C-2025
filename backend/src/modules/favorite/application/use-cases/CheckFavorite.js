class CheckFavorite {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute(userId, layananId) {
    try {
      const isFavorite = await this.favoriteRepository.exists(userId, layananId);

      return {
        success: true,
        message: 'Favorite status checked successfully',
        data: { isFavorite }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to check favorite status',
        data: { isFavorite: false }
      };
    }
  }
}

module.exports = CheckFavorite;
