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
  async getOrderTrends(month = null, year = null) {
    try {
      let query = `
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as orders
        FROM pesanan
        WHERE 1=1
      `;
      const replacements = [];

      // If month and year are provided, filter by that month
      if (month && year) {
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        const startDate = new Date(yearNum, monthNum - 1, 1);
        const endDate = new Date(yearNum, monthNum, 0);
        query += ` AND created_at >= ? AND created_at <= ?`;
        replacements.push(startDate, endDate);
      } else {
        // Default: last 12 months
        query += ` AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)`;
      }

      query += ` GROUP BY DATE_FORMAT(created_at, '%Y-%m') ORDER BY month ASC`;

      const result = await this.sequelize.query(query, {
        replacements: replacements.length > 0 ? replacements : undefined,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      // Generate complete data with Indonesian month names
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      let completeData = [];

      if (month && year) {
        // For specific month, get daily data
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
        
        // Get daily data
        const dailyResult = await this.sequelize.query(`
          SELECT 
            DATE_FORMAT(created_at, '%Y-%m-%d') as date,
            COUNT(*) as orders
          FROM pesanan
          WHERE created_at >= ? AND created_at <= ?
          GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
          ORDER BY date ASC
        `, {
          replacements: [
            new Date(yearNum, monthNum - 1, 1),
            new Date(yearNum, monthNum, 0, 23, 59, 59)
          ],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        });

        // Generate all days in month
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(yearNum, monthNum - 1, day);
          const dateKey = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayData = dailyResult.find(item => item.date === dateKey);
          completeData.push({
            month: `${day}`,
            orders: dayData ? parseInt(dayData.orders) : 0
          });
        }
      } else {
        // For last 12 months, get monthly data
        const currentDate = new Date();
        for (let i = 11; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const monthKey = `${year}-${month}`;
          const monthName = monthNames[date.getMonth()];

          const monthData = result.find(item => item.month === monthKey);
          completeData.push({
            month: monthName,
            orders: monthData ? parseInt(monthData.orders) : 0
          });
        }
      }

      return completeData;
    } catch (error) {
      throw new Error(`Failed to get order trends: ${error.message}`);
    }
  }

  // Get order category trends
  async getOrderCategoryTrends(month = null, year = null) {
    try {
      let query = `
        SELECT 
          k.id as kategori_id,
          k.nama as kategori_nama,
          COUNT(p.id) as orders
        FROM pesanan p
        INNER JOIN layanan l ON p.layanan_id = l.id
        INNER JOIN kategori k ON l.kategori_id = k.id
        WHERE 1=1
      `;
      const replacements = [];

      // If month and year are provided, filter by that month
      if (month && year) {
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        const startDate = new Date(yearNum, monthNum - 1, 1);
        const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);
        query += ` AND p.created_at >= ? AND p.created_at <= ?`;
        replacements.push(startDate, endDate);
      } else {
        // Default: last 12 months
        query += ` AND p.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)`;
      }

      query += ` GROUP BY k.id, k.nama ORDER BY orders DESC`;

      const result = await this.sequelize.query(query, {
        replacements: replacements.length > 0 ? replacements : undefined,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return result.map(item => ({
        kategori_id: item.kategori_id,
        kategori_nama: item.kategori_nama,
        orders: parseInt(item.orders) || 0
      }));
    } catch (error) {
      throw new Error(`Failed to get order category trends: ${error.message}`);
    }
  }

  // Get order category trends by time (for chart)
  async getOrderCategoryTrendsByTime(month = null, year = null) {
    try {
      let dateFormat, dateFilter;
      const replacements = [];

      if (month && year) {
        // Daily data for specific month
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        const startDate = new Date(yearNum, monthNum - 1, 1);
        const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);
        dateFormat = '%Y-%m-%d';
        dateFilter = `p.created_at >= ? AND p.created_at <= ?`;
        replacements.push(startDate, endDate);
      } else {
        // Monthly data for last 12 months
        dateFormat = '%Y-%m';
        dateFilter = `p.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)`;
      }

      const query = `
        SELECT 
          DATE_FORMAT(p.created_at, ?) as period,
          k.id as kategori_id,
          k.nama as kategori_nama,
          COUNT(p.id) as orders
        FROM pesanan p
        INNER JOIN layanan l ON p.layanan_id = l.id
        INNER JOIN kategori k ON l.kategori_id = k.id
        WHERE ${dateFilter}
        GROUP BY DATE_FORMAT(p.created_at, ?), k.id, k.nama
        ORDER BY period ASC, orders DESC
      `;

      const result = await this.sequelize.query(query, {
        replacements: [dateFormat, ...replacements, dateFormat],
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      return result.map(item => ({
        period: item.period,
        kategori_id: item.kategori_id,
        kategori_nama: item.kategori_nama,
        orders: parseInt(item.orders) || 0
      }));
    } catch (error) {
      throw new Error(`Failed to get order category trends by time: ${error.message}`);
    }
  }

  async getRevenueTrend(startDate, endDate, month = null, year = null) {
    try {
      let query = `
        SELECT 
          DATE_FORMAT(dibayar_pada, '%Y-%m') as month,
          SUM(biaya_platform) as amount
        FROM pembayaran
        WHERE status = "berhasil"
      `;
      const replacements = [];

      // If month and year are provided, use that instead
      if (month && year) {
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        const monthStart = new Date(yearNum, monthNum - 1, 1);
        const monthEnd = new Date(yearNum, monthNum, 0, 23, 59, 59);
        query += ` AND dibayar_pada >= ? AND dibayar_pada <= ?`;
        replacements.push(monthStart, monthEnd);
      } else if (startDate && endDate) {
        query += ` AND dibayar_pada >= ? AND dibayar_pada <= ?`;
        replacements.push(startDate, endDate);
      } else {
        // Default: last 12 months
        query += ` AND dibayar_pada >= DATE_SUB(NOW(), INTERVAL 12 MONTH)`;
      }

      query += ` GROUP BY DATE_FORMAT(dibayar_pada, '%Y-%m') ORDER BY month ASC`;

      const result = await this.sequelize.query(query, {
        replacements: replacements.length > 0 ? replacements : undefined,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      // If filtering by specific month, get daily data
      if (month && year) {
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
        
        const dailyResult = await this.sequelize.query(`
          SELECT 
            DATE_FORMAT(dibayar_pada, '%Y-%m-%d') as date,
            SUM(biaya_platform) as amount
          FROM pembayaran
          WHERE status = "berhasil"
            AND dibayar_pada >= ? AND dibayar_pada <= ?
          GROUP BY DATE_FORMAT(dibayar_pada, '%Y-%m-%d')
          ORDER BY date ASC
        `, {
          replacements: [
            new Date(yearNum, monthNum - 1, 1),
            new Date(yearNum, monthNum, 0, 23, 59, 59)
          ],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        });

        const dailyData = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const dateKey = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayData = dailyResult.find(item => item.date === dateKey);
          dailyData.push({
            month: `${day}`,
            amount: dayData ? parseFloat(dayData.amount) || 0 : 0
          });
        }
        return dailyData;
      }

      // Format monthly data
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      return result.map(item => {
        const [year, month] = item.month.split('-');
        const monthIndex = parseInt(month) - 1;
        return {
          month: monthNames[monthIndex] || item.month,
          amount: parseFloat(item.amount) || 0
        };
      });
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
          u.nama_depan,
          u.nama_belakang,
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