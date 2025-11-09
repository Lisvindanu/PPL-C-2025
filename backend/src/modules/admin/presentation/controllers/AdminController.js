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
      const data = await this.analyticsService.getOrderTrends();
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

  async getRevenueAnalytics(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'startDate and endDate are required'
        });
      }

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
      const adminId = '374d0a01-94b5-4d6f-ad7d-93589be64de4';

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

    if (format === 'csv' || format === 'excel') {
      if (report && report.filepath) {
        return res.download(report.filepath, report.filename || 'report.csv');
      } else {
        return res.status(500).json({
          success: false,
          error: 'Report file not generated'
        });
      }
    } else if (format === 'pdf') {
      return res.json({
        success: true,
        message: 'PDF report generation in progress',
        data: report
      });
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
      res.json({
        success: true,
        message: 'Fraud detection alerts retrieved',
        data: suspicious,
        count: suspicious.length
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


  async getServices(req, res) {
    try {
      const services = await this.sequelize.query(
        'SELECT id, judul, freelancer_id, kategori_id, status, created_at FROM layanan LIMIT 50',
        { raw: true, type: this.sequelize.QueryTypes.SELECT }
      );
      
      res.json({
        success: true,
        message: 'Services retrieved',
        data: services
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