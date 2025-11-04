class RemoveFavorite {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute(userId, layananId) {
    try {
      const deleted = await this.favoriteRepository.delete(userId, layananId);

      if (!deleted) {
        return {
          success: false,
          message: 'Favorit tidak ditemukan'
        };
      }

      return {
        success: true,
        message: 'Layanan berhasil dihapus dari favorit'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to remove favorite'
      };
    }
  }
}

module.exports = RemoveFavorite;
