class SequelizePaymentRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async sumSuccessful() {
    try {
      const result = await this.sequelize.query(
        'SELECT SUM(total_bayar) as total FROM pembayaran WHERE status = "berhasil"',
        {
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );
      return result[0]?.total || 0;
    } catch (error) {
      throw new Error(`Failed to sum successful payments: ${error.message}`);
    }
  }

  async getFailedRecent(limit = 10) {
    try {
      const result = await this.sequelize.query(
        'SELECT * FROM pembayaran WHERE status = "gagal" ORDER BY created_at DESC LIMIT ?',
        {
          replacements: [limit],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to get failed payments: ${error.message}`);
    }
  }

  async getMultipleFailedByUser(limit = 5) {
    try {
      const result = await this.sequelize.query(`
        SELECT 
          user_id,
          COUNT(*) as failed_count,
          MAX(created_at) as last_failed
        FROM pembayaran
        WHERE status = "gagal"
        GROUP BY user_id
        HAVING COUNT(*) >= ?
        ORDER BY failed_count DESC
        LIMIT 10
      `, {
        replacements: [limit],
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to get multiple failed payments: ${error.message}`);
    }
  }
}

module.exports = SequelizePaymentRepository;