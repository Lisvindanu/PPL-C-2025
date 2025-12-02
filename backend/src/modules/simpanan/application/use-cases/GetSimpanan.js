class GetSimpanan {
  constructor(simpananRepository) {
    this.simpananRepository = simpananRepository;
  }

  async execute(userId) {
    try {
      const saved = await this.simpananRepository.findByUserId(userId);

      return {
        success: true,
        message: 'Saved services retrieved successfully',
        data: {
          favorites: saved, // Keep key name for backward compatibility
          total: saved.length
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve saved services'
      };
    }
  }
}

module.exports = GetSimpanan;
