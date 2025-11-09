class ServiceRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.Service = sequelize.models && sequelize.models.layanan ? sequelize.models.layanan : null;
  }

  async updateRating(serviceId, average, count) {
    if (!this.Service) return null;
    await this.Service.update({ rating: average, rating_count: count }, { where: { id: serviceId } });
    return true;
  }
}

module.exports = ServiceRepository;
