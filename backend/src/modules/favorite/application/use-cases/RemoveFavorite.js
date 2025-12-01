class RemoveFavorite {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute(userId, layananId) {
    try {
      const deleted = await this.favoriteRepository.delete(userId, layananId);

      // Idempotent delete: even if not found, return success
      // The desired state (favorite removed) is already achieved
      if (!deleted) {
        return {
          success: true,
          message: 'Layanan sudah tidak ada di favorit',
          wasDeleted: false // Optional: indicates it was already removed
        };
      }

      return {
        success: true,
        message: 'Layanan berhasil dihapus dari favorit',
        wasDeleted: true
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
