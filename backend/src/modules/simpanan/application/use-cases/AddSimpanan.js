class AddSimpanan {
  constructor(simpananRepository) {
    this.simpananRepository = simpananRepository;
  }

  async execute(userId, layananId) {
    try {
      // Check if already saved
      const exists = await this.simpananRepository.exists(userId, layananId);

      // Idempotent add: if already exists, return success
      if (exists) {
        return {
          success: true,
          message: 'Layanan sudah ada di simpanan',
          data: { alreadyExists: true }
        };
      }

      const simpanan = await this.simpananRepository.create(userId, layananId);

      return {
        success: true,
        message: 'Layanan berhasil ditambahkan ke simpanan',
        data: { favorite: simpanan, alreadyExists: false } // Keep "favorite" key for backward compatibility
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to add to saved'
      };
    }
  }
}

module.exports = AddSimpanan;
