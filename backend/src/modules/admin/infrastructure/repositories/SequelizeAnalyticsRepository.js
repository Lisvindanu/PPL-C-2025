class SequelizeAnalyticsRepository {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

async countOrders(status = null) {
  try {
    let query = 'SELECT COUNT(*) as count FROM pesanan';
    const replacements = [];

    if (status) {
      query += ' WHERE status = ?';
      replacements.push(status);
    }

    console.log('Query:', query, 'Replacements:', replacements);
    
    const result = await this.sequelize.query(query, {
      replacements,
      raw: true,
      type: this.sequelize.QueryTypes.SELECT
    });

    console.log('Result:', result);
    return result[0]?.count || 0;
  } catch (error) {
    throw new Error(`Failed to count orders: ${error.message}`);
  }
}

  async sumPlatformFees() {
    try {
      const result = await this.sequelize.query(
        'SELECT SUM(biaya_platform) as total FROM pembayaran WHERE status = "berhasil"',
        {
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );
      return result[0]?.total || 0;
    } catch (error) {
      throw new Error(`Failed to sum platform fees: ${error.message}`);
    }
  }

  async getUserTrend() {
    try {
      const result = await this.sequelize.query(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as count
        FROM users
        WHERE role != 'admin'
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month ASC
      `, {
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to get user trend: ${error.message}`);
    }
  }

  // Get user status distribution for pie chart
  async getUserStatusDistribution() {
    try {
      const result = await this.sequelize.query(`
        SELECT 
          CASE 
            WHEN is_active = 1 THEN 'Aktif'
            WHEN is_active = 0 THEN 'Diblokir'
            ELSE 'Diblokir'
          END as name,
          COUNT(*) as value
        FROM users
        WHERE role != 'admin'
        GROUP BY is_active
        ORDER BY value DESC
      `, {
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to get user status distribution: ${error.message}`);
    }
  }

  // Get order trends for line chart
  async getOrderTrends() {
    try {
      // Get data for last 12 months
      const result = await this.sequelize.query(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as orders
        FROM pesanan
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month ASC
      `, {
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      // Generate complete 12 months data with Indonesian month names
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      const currentDate = new Date();
      const completeData = [];

      // Generate last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const monthKey = `${year}-${month}`;
        const monthName = monthNames[date.getMonth()];

        // Find data for this month
        const monthData = result.find(item => item.month === monthKey);
        const orders = monthData ? monthData.orders : 0;

        completeData.push({
          month: monthName,
          orders: orders
        });
      }

      return completeData;
    } catch (error) {
      throw new Error(`Failed to get order trends: ${error.message}`);
    }
  }

  async getRevenueTrend(startDate, endDate) {
    try {
      const result = await this.sequelize.query(`
        SELECT 
          DATE_FORMAT(dibayar_pada, '%Y-%m') as month,
          SUM(biaya_platform) as amount
        FROM pembayaran
        WHERE status = "berhasil" 
          AND dibayar_pada >= ? 
          AND dibayar_pada <= ?
        GROUP BY DATE_FORMAT(dibayar_pada, '%Y-%m')
        ORDER BY month ASC
      `, {
        replacements: [startDate, endDate],
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to get revenue trend: ${error.message}`);
    }
  }

    async getOrderStats(startDate, endDate) {
    try {
      const orders = await this.sequelize.query(
        `SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as bulan,
          COUNT(*) as total,
          status
        FROM pesanan
        WHERE created_at BETWEEN ? AND ?
        GROUP BY DATE_FORMAT(created_at, '%Y-%m'), status
        ORDER BY bulan DESC`,
        {
          replacements: [startDate, endDate],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      return orders;
    } catch (error) {
      throw new Error(`Failed to get order stats: ${error.message}`);
    }
  }

  async detectAnomalies() {
    try {
      const result = await this.sequelize.query(`
        SELECT 
          u.id,
          u.email,
          COUNT(p.id) as transaction_count,
          SUM(p.total_bayar) as total_spent,
          COUNT(CASE WHEN p.status = 'gagal' THEN 1 END) as failed_count
        FROM users u
        LEFT JOIN pembayaran p ON u.id = p.user_id
        WHERE u.role != 'admin'
        GROUP BY u.id
        HAVING failed_count > 3 OR transaction_count > 50
      `, {
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to detect anomalies: ${error.message}`);
    }
  }
}

module.exports = SequelizeAnalyticsRepository;