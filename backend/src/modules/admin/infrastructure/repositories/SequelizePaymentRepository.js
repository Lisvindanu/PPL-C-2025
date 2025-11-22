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
        'SELECT p.*, u.email, u.nama_depan, u.nama_belakang FROM pembayaran p LEFT JOIN users u ON p.user_id = u.id WHERE p.status = "gagal" ORDER BY p.created_at DESC LIMIT ?',
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
          p.user_id,
          COUNT(*) as failed_count,
          MAX(p.created_at) as last_failed,
          u.email,
          u.nama_depan,
          u.nama_belakang
        FROM pembayaran p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.status = "gagal"
        GROUP BY p.user_id
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