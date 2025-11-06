class GetFavorites {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute(userId) {
    try {
      const favorites = await this.favoriteRepository.findByUserId(userId);

      return {
        success: true,
        message: 'Favorites retrieved successfully',
        data: {
          favorites,
          total: favorites.length
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve favorites'
      };
    }
  }
}

module.exports = GetFavorites;
