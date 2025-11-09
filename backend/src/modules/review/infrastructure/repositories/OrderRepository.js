class OrderRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.Order = sequelize.models && sequelize.models.pesanan ? sequelize.models.pesanan : null;
  }

  async findById(id) {
    if (!this.Order) return null;
    const r = await this.Order.findByPk(id);
    return r ? r.toJSON() : null;
  }

  async update(id, data) {
    if (!this.Order) return null;
    await this.Order.update(data, { where: { id } });
    return this.findById(id);
  }
}

module.exports = OrderRepository;
