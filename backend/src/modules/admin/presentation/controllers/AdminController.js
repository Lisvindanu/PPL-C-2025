const StatsDto = require('../../application/dtos/StatsDto');
const ChartService = require('../../infrastructure/services/ChartService');

class AdminController {
  constructor(
    getDashboardStats,
    getUserAnalyticsUseCase,
    getRevenueAnalyticsUseCase,
    getOrderAnalyticsUseCase,
    blockUserUseCase,
    unblockUserUseCase,
    blockServiceUseCase,
    unblockServiceUseCase,
    deleteReviewUseCase,
    exportReportUseCase,
    getActivityLogsUseCase,
    fraudDetectionService,
    adminLogService,
    analyticsService,
    sequelize
  ) {
    this.sequelize = sequelize;
    this.getDashboardStats = getDashboardStats;
    this.getUserAnalyticsUseCase = getUserAnalyticsUseCase;
    this.getRevenueAnalyticsUseCase = getRevenueAnalyticsUseCase;
    this.getOrderAnalyticsUseCase = getOrderAnalyticsUseCase;
    this.blockUserUseCase = blockUserUseCase;
    this.unblockUserUseCase = unblockUserUseCase;
    this.blockServiceUseCase = blockServiceUseCase;
    this.unblockServiceUseCase = unblockServiceUseCase;
    this.deleteReviewUseCase = deleteReviewUseCase;
    this.exportReportUseCase = exportReportUseCase;
    this.getActivityLogsUseCase = getActivityLogsUseCase;
    this.fraudDetectionService = fraudDetectionService;
    this.adminLogService = adminLogService;
    this.analyticsService = analyticsService;
  }

  async getDashboard(req, res) {
    try {
      const stats = await this.getDashboardStats.execute();
      res.json({
        success: true,
        message: 'Dashboard stats retrieved',
        data: StatsDto.toResponse(stats)
      });
    } catch (error) {
      console.error('Error in getDashboard:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUsers(req, res) {
    try {
      const { role, status, page = 1, limit = 10 } = req.query;
      
      const filters = {
        role: role || null,
        status: status || 'all',
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const users = await this.adminLogService.getUserList(filters);
      
      res.json({
        success: true,
        message: 'Users retrieved',
        data: users.data,
        pagination: {
          page: users.page,
          limit: users.limit,
          total: users.total,
          totalPages: Math.ceil(users.total / users.limit)
        }
      });
    } catch (error) {
      console.error('Error in getUsers:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

// Update blockUser method di AdminController.js
async blockUser(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Validasi input
    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'reason is required'
      });
    }

    const adminId = req.user?.userId; 
    
    if (!adminId) {
      return res.status(401).json({
        success: false,
        error: 'Admin ID not found. Please login again.'
      });
    }
    
    const ipAddress = req.ip || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    const result = await this.blockUserUseCase.execute(
      adminId,
      id,
      reason,
      ipAddress,
      userAgent
    );

    res.json({
      success: true,
      message: 'User blocked successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in blockUser:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

// Tambah method unblockUser juga
async unblockUser(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'reason is required'
      });
    }

    // ======== PASTIKAN PAKAI userId ========
    const adminId = req.user?.userId;
    
    if (!adminId) {
      return res.status(401).json({
        success: false,
        error: 'Admin ID not found. Please login again.'
      });
    }
    // =======================================

    const ipAddress = req.ip || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    const result = await this.unblockUserUseCase.execute(
      adminId,
      id,
      reason,
      ipAddress,
      userAgent
    );

    res.json({
      success: true,
      message: 'User unblocked successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in unblockUser:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

  async getUserAnalytics(req, res) {
    try {
      const data = await this.getUserAnalyticsUseCase.execute();
      const chart = ChartService.formatForChart(data, 'line');
      res.json({
        success: true,
        message: 'User analytics retrieved',
        data: chart
      });
    } catch (error) {
      console.error('Error in getUserAnalytics:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserStatusDistribution(req, res) {
    try {
      const data = await this.analyticsService.getUserStatusDistribution();
      res.json({
        success: true,
        message: 'User status distribution retrieved',
        data: data
      });
    } catch (error) {
      console.error('Error in getUserStatusDistribution:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getOrderTrends(req, res) {
    try {
      const { month, year } = req.query;
      const data = await this.analyticsService.getOrderTrends(month || null, year || null);
      res.json({
        success: true,
        message: 'Order trends retrieved',
        data: data
      });
    } catch (error) {
      console.error('Error in getOrderTrends:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getOrderCategoryTrends(req, res) {
    try {
      const { month, year } = req.query;
      const data = await this.analyticsService.getOrderCategoryTrends(month || null, year || null);
      res.json({
        success: true,
        message: 'Order category trends retrieved',
        data: data
      });
    } catch (error) {
      console.error('Error in getOrderCategoryTrends:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getOrderCategoryTrendsByTime(req, res) {
    try {
      const { month, year } = req.query;
      const data = await this.analyticsService.getOrderCategoryTrendsByTime(month || null, year || null);
      res.json({
        success: true,
        message: 'Order category trends by time retrieved',
        data: data
      });
    } catch (error) {
      console.error('Error in getOrderCategoryTrendsByTime:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getRevenueAnalytics(req, res) {
    try {
      const { startDate, endDate, month, year } = req.query;

      // If month and year are provided, use them
      if (month && year) {
        const data = await this.analyticsService.getRevenueAnalytics(
          null, null, month, year
        );
        res.json({
          success: true,
          message: 'Revenue analytics retrieved',
          data: data
        });
      } else if (startDate && endDate) {
        const data = await this.getRevenueAnalyticsUseCase.execute(
          new Date(startDate),
          new Date(endDate)
        );
        const chart = ChartService.formatForChart(data, 'line');

        res.json({
          success: true,
          message: 'Revenue analytics retrieved',
          data: chart
        });
      } else {
        // Default: last 12 months
        const data = await this.analyticsService.getRevenueAnalytics(null, null, null, null);
        res.json({
          success: true,
          message: 'Revenue analytics retrieved',
          data: data
        });
      }
    } catch (error) {
      console.error('Error in getRevenueAnalytics:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getOrderAnalytics(req, res) {
    try {
      let { startDate, endDate, month, year } = req.query;

      // Jika ada month & year
      if (month && year) {
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        
        startDate = new Date(yearNum, monthNum - 1, 1).toISOString().split('T')[0];
        endDate = new Date(yearNum, monthNum, 0).toISOString().split('T')[0];
      }
      // Default: bulan saat ini
      else if (!startDate || !endDate) {
        const today = new Date();
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
      }

      const data = await this.getOrderAnalyticsUseCase.execute(startDate, endDate);
      const chart = ChartService.formatForChart(data, 'bar');

      res.json({
        success: true,
        message: 'Order analytics retrieved',
        data: chart
      });
    } catch (error) {
      console.error('Error in getOrderAnalytics:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

async blockService(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'reason is required'
      });
    }

    // ======== UBAH INI ========
    const adminId = req.user?.userId; // ← Ambil dari token JWT
    
    if (!adminId) {
      return res.status(401).json({
        success: false,
        error: 'Admin ID not found. Please login again.'
      });
    }
    // ==========================

    const ipAddress = req.ip || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    const result = await this.blockServiceUseCase.execute(
      adminId,
      id,
      reason,
      ipAddress,
      userAgent
    );

    res.json({
      success: true,
      message: 'Service blocked successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in blockService:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

async unblockService(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'reason is required'
      });
    }

    const adminId = req.user?.userId;
    
    if (!adminId) {
      return res.status(401).json({
        success: false,
        error: 'Admin ID not found. Please login again.'
      });
    }

    const ipAddress = req.ip || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    const result = await this.unblockServiceUseCase.execute(
      adminId,
      id,
      reason,
      ipAddress,
      userAgent
    );

    res.json({
      success: true,
      message: 'Service unblocked successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in unblockService:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          success: false,
          error: 'reason is required'
        });
      }

      const ipAddress = req.ip || 'unknown';
      const userAgent = req.get('user-agent') || 'unknown';
      const adminId = req.user?.userId; // Get from JWT token instead of hardcoded

      const result = await this.deleteReviewUseCase.execute(
        adminId,
        id,
        reason,
        ipAddress,
        userAgent
      );

      res.json({
        success: true,
        message: 'Review deleted successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in deleteReview:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

async exportReport(req, res) {
  try {
    const { reportType, format, filters } = req.body;

    if (!reportType || !format) {
      return res.status(400).json({
        success: false,
        error: 'reportType and format are required'
      });
    }

    // ✅ AMBIL DARI JWT TOKEN
    const adminId = req.user?.userId;
    
    if (!adminId) {
      return res.status(401).json({
        success: false,
        error: 'Admin ID not found. Please login again.'
      });
    }

    const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';

    const report = await this.exportReportUseCase.execute(
      adminId,
      reportType,
      format,
      filters || {},
      ipAddress,
      userAgent
    );

    if (format === 'csv' || format === 'excel' || format === 'pdf') {
      if (report && report.filepath) {
        return res.download(report.filepath, report.filename || `report.${format}`);
      } else {
        return res.status(500).json({
          success: false,
          error: 'Report file not generated'
        });
      }
    } else {
      return res.json({
        success: true,
        message: 'Report exported successfully',
        data: report
      });
    }
  } catch (error) {
    console.error('Error in exportReport:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

  async checkFraud(req, res) {
    try {
      const suspicious = await this.fraudDetectionService.checkSuspiciousPatterns();

      const anomalies = Array.isArray(suspicious.anomalies) ? suspicious.anomalies : [];
      const failedPayments = Array.isArray(suspicious.failedPayments) ? suspicious.failedPayments : [];
      const multipleFailures = Array.isArray(suspicious.multipleFailures) ? suspicious.multipleFailures : [];
      const total = typeof suspicious.total === 'number' ? suspicious.total : (anomalies.length + failedPayments.length + multipleFailures.length);

      return res.status(200).json({
        success: true,
        message: 'Fraud detection alerts retrieved',
        data: {
          anomalies,
          failedPayments,
          multipleFailures,
          total
        },
        count: total
      });
    } catch (error) {
      console.error('Error in checkFraud:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

 

async getAllLogs(req, res) {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const filters = {
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const result = await this.getActivityLogsUseCase.execute(filters);

    if (!result.data || result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Belum ada log'
      });
    }

    res.json({
      success: true,
      message: 'Semua log berhasil diambil',
      data: result.data,
      pagination: {
        limit: result.limit,
        offset: result.offset,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit)
      }
    });
  } catch (error) {
    console.error('❌ Error in getAllLogs:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

async getNotifications(req, res) {
  try {
    const adminId = req.user?.userId;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Get admin user to get their user_id
    const [admin] = await this.sequelize.query(
      'SELECT id FROM users WHERE id = ? AND role = ?',
      {
        replacements: [adminId, 'admin'],
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      }
    );

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }

    // Since fraud alert types are not in the notification ENUM,
    // we'll return fraud alerts directly as notifications
    const suspicious = await this.fraudDetectionService.checkSuspiciousPatterns();
    
    const anomalies = Array.isArray(suspicious.anomalies) ? suspicious.anomalies : [];
    const failedPayments = Array.isArray(suspicious.failedPayments) ? suspicious.failedPayments : [];
    const multipleFailures = Array.isArray(suspicious.multipleFailures) ? suspicious.multipleFailures : [];

    // Convert fraud alerts to notification format
    const notifications = [];
    
    failedPayments.forEach(p => {
      notifications.push({
        id: p.id,
        type: 'fraud_failedPayment',
        title: `Pembayaran Gagal - Order: ${p.pesanan_id ?? p.order_id ?? p.id}`,
        message: `User: ${p.user_id} · Amount: ${p.total_bayar ?? p.amount ?? '-'}`,
        created_at: p.created_at ?? p.createdAt ?? p.date,
        is_read: false,
        raw: { ...p, alertType: 'failedPayment' }
      });
    });

    multipleFailures.forEach(m => {
      notifications.push({
        id: m.user_id || m.id,
        type: 'fraud_multipleFailures',
        title: `Beberapa Pembayaran Gagal - User: ${m.user_id}`,
        message: `Failed: ${m.failed_count}`,
        created_at: m.last_failed,
        is_read: false,
        raw: { ...m, alertType: 'multipleFailures' }
      });
    });

    anomalies.forEach(a => {
      notifications.push({
        id: a.id || a.user_id || a.email,
        type: 'fraud_anomaly',
        title: `Anomali Transaksi - ${a.email || a.user_email || 'Unknown user'}`,
        message: `Transactions: ${a.transaction_count ?? '-'} · Failed: ${a.failed_count ?? '-'}`,
        created_at: null,
        is_read: false,
        raw: { ...a, alertType: 'anomaly' }
      });
    });

    // Sort by date desc
    notifications.sort((x, y) => {
      const dx = x.created_at ? new Date(x.created_at).getTime() : 0;
      const dy = y.created_at ? new Date(y.created_at).getTime() : 0;
      return (dy - dx);
    });

    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const paginated = notifications.slice(offset, offset + parseInt(limit));
    const total = notifications.length;

    res.json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: paginated,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

async markNotificationRead(req, res) {
  try {
    const { id } = req.params;
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Since fraud alerts are not stored as notifications in DB,
    // we'll just return success (in a real system, you'd store read status)
    // For now, we'll accept the request and return success
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error in markNotificationRead:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

async getFraudAlertDetail(req, res) {
  try {
    const { type, id } = req.params;

    let detail = null;

    if (type === 'failedPayment') {
      const [result] = await this.sequelize.query(
        `SELECT p.*, u.email, u.nama_depan, u.nama_belakang, u.id as user_id, 
         pes.judul as order_title
         FROM pembayaran p 
         LEFT JOIN users u ON p.user_id = u.id
         LEFT JOIN pesanan pes ON p.pesanan_id = pes.id
         WHERE p.id = ? AND p.status = 'gagal'`,
        {
          replacements: [id],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );
      detail = result;
    } else if (type === 'multipleFailures') {
      const [result] = await this.sequelize.query(
        `SELECT 
          u.id as user_id,
          u.email,
          u.nama_depan,
          u.nama_belakang,
          COUNT(p.id) as failed_count,
          MAX(p.created_at) as last_failed
         FROM users u
         LEFT JOIN pembayaran p ON u.id = p.user_id AND p.status = 'gagal'
         WHERE u.id = ?
         GROUP BY u.id`,
        {
          replacements: [id],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );
      detail = result;
    } else if (type === 'anomaly') {
      const [result] = await this.sequelize.query(
        `SELECT 
          u.id,
          u.email,
          u.nama_depan,
          u.nama_belakang,
          COUNT(p.id) as transaction_count,
          SUM(p.total_bayar) as total_spent,
          COUNT(CASE WHEN p.status = 'gagal' THEN 1 END) as failed_count
         FROM users u
         LEFT JOIN pembayaran p ON u.id = p.user_id
         WHERE u.id = ?
         GROUP BY u.id`,
        {
          replacements: [id],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );
      detail = result;
    }

    if (!detail) {
      return res.status(404).json({
        success: false,
        message: 'Fraud alert detail not found'
      });
    }

    res.json({
      success: true,
      message: 'Fraud alert detail retrieved',
      data: {
        type,
        ...detail
      }
    });
  } catch (error) {
    console.error('Error in getFraudAlertDetail:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}


async getLogsByAdminId(req, res) {
  try {
    const { adminId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Validasi admin exist
    const [adminExists] = await this.sequelize.query(
      'SELECT id FROM users WHERE id = ? AND role = ?',
      {
        replacements: [adminId, 'admin'],
        type: this.sequelize.QueryTypes.SELECT
      }
    );

    if (!adminExists) {
      return res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan'
      });
    }

    const filters = {
      adminId,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const result = await this.getActivityLogsUseCase.execute(filters);

    if (!result.data || result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Log tidak ditemukan untuk admin ini'
      });
    }

    res.json({
      success: true,
      message: 'Log admin berhasil diambil',
      data: result.data,
      pagination: {
        limit: result.limit,
        offset: result.offset,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit)
      }
    });
  } catch (error) {
    console.error('❌ Error in getLogsByAdminId:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

  async getLogDetail(req, res) {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Log ID harus diisi'
        });
      }

      const log = await this.adminLogService.getLogDetail(id);

      if (!log) {
        return res.status(404).json({
          success: false,
          message: 'Log tidak ditemukan'
        });
      }

      res.json({
        success: true,
        message: 'Detail log berhasil diambil',
        data: log
      });
    } catch (error) {
      console.error('❌ Error in getLogDetail:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserDetails(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      // Get user data
      const [user] = await this.sequelize.query(
        `SELECT 
          id, email, nama_depan, nama_belakang, role, 
          is_active, created_at, updated_at
        FROM users 
        WHERE id = ?`,
        {
          replacements: [id],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Get block reason from activity log if user is blocked
      let blockLog = null;
      if (!user.is_active || user.is_active === 0) {
        const [blockLogData] = await this.sequelize.query(
          `SELECT 
            l.id,
            l.aksi,
            l.detail,
            l.created_at,
            u.nama_depan as admin_nama_depan,
            u.nama_belakang as admin_nama_belakang,
            u.email as admin_email
          FROM log_aktivitas_admin l
          LEFT JOIN users u ON l.admin_id = u.id
          WHERE l.target_type = 'user' 
            AND l.target_id = ? 
            AND l.aksi = 'block_user'
          ORDER BY l.created_at DESC
          LIMIT 1`,
          {
            replacements: [id],
            raw: true,
            type: this.sequelize.QueryTypes.SELECT
          }
        );

        if (blockLogData) {
          const detail = typeof blockLogData.detail === 'string' 
            ? JSON.parse(blockLogData.detail) 
            : blockLogData.detail;
          
          blockLog = {
            reason: detail?.reason || 'Tidak ada alasan tersedia',
            blockedAt: blockLogData.created_at,
            adminName: blockLogData.admin_nama_depan && blockLogData.admin_nama_belakang
              ? `${blockLogData.admin_nama_depan} ${blockLogData.admin_nama_belakang}`
              : blockLogData.admin_email || 'Admin'
          };
        }
      }

      res.json({
        success: true,
        message: 'User details retrieved',
        data: {
          ...user,
          blockLog,
          block_reason: blockLog?.reason || null,
          blockReason: blockLog?.reason || null
        }
      });
    } catch (error) {
      console.error('Error in getUserDetails:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getServiceDetails(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Service ID is required'
        });
      }

      // Get service data with freelancer info
      const [service] = await this.sequelize.query(
        `SELECT 
          l.id,
          l.judul,
          l.deskripsi,
          l.freelancer_id,
          l.kategori_id,
          l.status,
          l.harga,
          l.waktu_pengerjaan,
          l.batas_revisi,
          l.rating_rata_rata,
          l.jumlah_rating,
          l.total_pesanan,
          l.created_at,
          l.updated_at,
          u.id as freelancer_user_id,
          u.email as freelancer_email,
          u.nama_depan as freelancer_nama_depan,
          u.nama_belakang as freelancer_nama_belakang,
          k.nama as kategori_nama
        FROM layanan l
        LEFT JOIN users u ON l.freelancer_id = u.id
        LEFT JOIN kategori k ON l.kategori_id = k.id
        WHERE l.id = ?`,
        {
          replacements: [id],
          raw: true,
          type: this.sequelize.QueryTypes.SELECT
        }
      );

      if (!service) {
        return res.status(404).json({
          success: false,
          error: 'Service not found'
        });
      }

      // Get block reason from activity log if service is blocked/nonaktif
      let blockLog = null;
      if (service.status === 'nonaktif') {
        const [blockLogData] = await this.sequelize.query(
          `SELECT 
            l.id,
            l.aksi,
            l.detail,
            l.created_at,
            u.nama_depan as admin_nama_depan,
            u.nama_belakang as admin_nama_belakang,
            u.email as admin_email
          FROM log_aktivitas_admin l
          LEFT JOIN users u ON l.admin_id = u.id
          WHERE l.target_type = 'layanan' 
            AND l.target_id = ? 
            AND l.aksi = 'block_service'
          ORDER BY l.created_at DESC
          LIMIT 1`,
          {
            replacements: [id],
            raw: true,
            type: this.sequelize.QueryTypes.SELECT
          }
        );

        if (blockLogData) {
          const detail = typeof blockLogData.detail === 'string' 
            ? JSON.parse(blockLogData.detail) 
            : blockLogData.detail;
          
          blockLog = {
            reason: detail?.reason || 'Tidak ada alasan tersedia',
            blockedAt: blockLogData.created_at,
            adminName: blockLogData.admin_nama_depan && blockLogData.admin_nama_belakang
              ? `${blockLogData.admin_nama_depan} ${blockLogData.admin_nama_belakang}`
              : blockLogData.admin_email || 'Admin'
          };
        }
      }

      // Format response
      const formattedService = {
        id: service.id,
        judul: service.judul,
        deskripsi: service.deskripsi,
        freelancer_id: service.freelancer_id,
        kategori_id: service.kategori_id,
        status: service.status,
        harga: service.harga,
        waktu_pengerjaan: service.waktu_pengerjaan,
        batas_revisi: service.batas_revisi,
        rating_rata_rata: service.rating_rata_rata,
        jumlah_rating: service.jumlah_rating,
        total_pesanan: service.total_pesanan,
        created_at: service.created_at,
        updated_at: service.updated_at,
        freelancer: service.freelancer_user_id ? {
          id: service.freelancer_user_id,
          email: service.freelancer_email,
          nama_depan: service.freelancer_nama_depan,
          nama_belakang: service.freelancer_nama_belakang,
          full_name: `${service.freelancer_nama_depan || ''} ${service.freelancer_nama_belakang || ''}`.trim() || service.freelancer_email
        } : null,
        kategori: service.kategori_nama ? {
          id: service.kategori_id,
          nama: service.kategori_nama
        } : null,
        blockLog,
        block_reason: blockLog?.reason || null,
        blockReason: blockLog?.reason || null
      };

      res.json({
        success: true,
        message: 'Service details retrieved',
        data: formattedService
      });
    } catch (error) {
      console.error('Error in getServiceDetails:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getServices(req, res) {
    try {
      const { page = 1, limit = 10, status, kategori } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let query = `
        SELECT 
          l.id,
          l.judul,
          l.freelancer_id,
          l.kategori_id,
          l.status,
          l.harga,
          l.rating_rata_rata,
          l.jumlah_rating,
          l.total_pesanan,
          l.created_at,
          u.id as freelancer_user_id,
          u.email as freelancer_email,
          u.nama_depan as freelancer_nama_depan,
          u.nama_belakang as freelancer_nama_belakang,
          u.is_active as freelancer_is_active,
          k.nama as kategori_nama
        FROM layanan l
        LEFT JOIN users u ON l.freelancer_id = u.id
        LEFT JOIN kategori k ON l.kategori_id = k.id
        WHERE 1=1
      `;
      
      const replacements = [];
      
      if (status && status !== 'all') {
        query += ' AND l.status = ?';
        replacements.push(status);
      }
      
      if (kategori && kategori !== 'all') {
        query += ' AND l.kategori_id = ?';
        replacements.push(kategori);
      }
      
      // Get total count
      const countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
      const [countResult] = await this.sequelize.query(countQuery, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });
      
      // Add pagination
      query += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
      replacements.push(parseInt(limit), offset);
      
      const services = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });
      
      // Format response with freelancer data
      const formattedServices = services.map(service => ({
        id: service.id,
        judul: service.judul,
        freelancer_id: service.freelancer_id,
        kategori_id: service.kategori_id,
        status: service.status,
        harga: service.harga,
        rating_rata_rata: service.rating_rata_rata,
        jumlah_rating: service.jumlah_rating,
        total_pesanan: service.total_pesanan,
        created_at: service.created_at,
        freelancer: service.freelancer_user_id ? {
          id: service.freelancer_user_id,
          email: service.freelancer_email,
          nama_depan: service.freelancer_nama_depan,
          nama_belakang: service.freelancer_nama_belakang,
          is_active: service.freelancer_is_active,
          full_name: `${service.freelancer_nama_depan || ''} ${service.freelancer_nama_belakang || ''}`.trim() || service.freelancer_email
        } : null,
        kategori: service.kategori_nama ? {
          id: service.kategori_id,
          nama: service.kategori_nama
        } : null
      }));
      
      res.json({
        success: true,
        message: 'Services retrieved',
        data: formattedServices,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error in getServices:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AdminController;