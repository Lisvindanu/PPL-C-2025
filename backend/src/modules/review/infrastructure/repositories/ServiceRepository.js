class ServiceRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.Service = sequelize.models && sequelize.models.layanan ? sequelize.models.layanan : null;
  }

  /**
   * Update rating rata-rata dan jumlah rating untuk layanan tertentu.
   * @param {string} serviceId - ID layanan.
   * @param {number} average - Nilai rating rata-rata baru.
   * @param {number} count - Jumlah total rating baru.
   */
  async updateRating(serviceId, average, count) {
    if (!this.Service) return null;

    await this.Service.update(
      { 
        rating_rata_rata: average,
        jumlah_rating: count
      },
      { where: { id: serviceId } }
    );

    // Kembalikan data terbaru setelah update
    const updated = await this.Service.findByPk(serviceId);
    return updated ? updated.toJSON() : null;
  }

  /**
   * Tambahan opsional — ambil layanan berdasarkan ID.
   */
  async findById(id) {
    if (!this.Service) return null;
    const service = await this.Service.findByPk(id);
    return service ? service.toJSON() : null;
  }
}

module.exports = ServiceRepository;
