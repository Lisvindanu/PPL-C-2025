class RemoveSimpanan {
  constructor(simpananRepository) {
    this.simpananRepository = simpananRepository;
  }

  async execute(userId, layananId) {
    try {
      const deleted = await this.simpananRepository.delete(userId, layananId);

      if (!deleted) {
        return {
          success: false,
          message: 'Layanan tidak ditemukan di simpanan'
        };
      }

      return {
        success: true,
        message: 'Layanan berhasil dihapus dari simpanan'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to remove from saved'
      };
    }
  }
}

module.exports = RemoveSimpanan;
