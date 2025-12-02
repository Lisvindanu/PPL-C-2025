class CheckSimpanan {
  constructor(simpananRepository) {
    this.simpananRepository = simpananRepository;
  }

  async execute(userId, layananId) {
    try {
      const isSaved = await this.simpananRepository.exists(userId, layananId);

      return {
        success: true,
        message: 'Saved status checked successfully',
        data: {
          isFavorite: isSaved // Keep "isFavorite" key for backward compatibility
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to check saved status',
        data: {
          isFavorite: false
        }
      };
    }
  }
}

module.exports = CheckSimpanan;
