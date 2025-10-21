class SequelizeServiceRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async findById(id) {
    try {
      const service = await this.sequelize.query(
        'SELECT id, judul, freelancer_id, kategori_id, status, created_at FROM layanan WHERE id = ?',
        {
          replacements: [id],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      return service[0] || null;
    } catch (error) {
      throw new Error(`Failed to find service by id: ${error.message}`);
    }
  }

  async findByPk(id) {
    // Alias untuk konsistensi
    return this.findById(id);
  }

  async update(data, options) {
    try {
      const { id } = options.where;
      
      // Build dynamic SET clause
      const setClause = Object.keys(data)
        .map(key => `${key} = ?`)
        .join(', ');
      
      const values = Object.values(data);
      values.push(id);

      await this.sequelize.query(
        `UPDATE layanan SET ${setClause}, updated_at = NOW() WHERE id = ?`,
        {
          replacements: values
        }
      );

      return true;
    } catch (error) {
      throw new Error(`Failed to update service: ${error.message}`);
    }
  }

  async findAll(filters = {}) {
    try {
      const limit = filters.limit || 50;
      const offset = ((filters.page || 1) - 1) * limit;

      const services = await this.sequelize.query(
        'SELECT id, judul, freelancer_id, kategori_id, status, created_at FROM layanan LIMIT ? OFFSET ?',
        {
          replacements: [limit, offset],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      const total = await this.sequelize.query(
        'SELECT COUNT(*) as count FROM layanan',
        {
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      return {
        data: services || [],
        page: filters.page || 1,
        limit,
        total: total[0]?.count || 0
      };
    } catch (error) {
      throw new Error(`Failed to find services: ${error.message}`);
    }
  }

  async findByStatus(status) {
    try {
      const services = await this.sequelize.query(
        'SELECT id, judul, freelancer_id, kategori_id, status, created_at FROM layanan WHERE status = ?',
        {
          replacements: [status],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      return services;
    } catch (error) {
      throw new Error(`Failed to find services by status: ${error.message}`);
    }
  }

  async blockService(serviceId) {
    try {
      await this.sequelize.query(
        'UPDATE layanan SET status = ?, updated_at = NOW() WHERE id = ?',
        {
          replacements: ['nonaktif', serviceId]
        }
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to block service: ${error.message}`);
    }
  }
}

module.exports = SequelizeServiceRepository;