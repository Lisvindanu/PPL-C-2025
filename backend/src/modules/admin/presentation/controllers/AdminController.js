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

  async getUserDetails(req, res) {
    try {
      const { id } = req.params;
      
      // Get user details directly
      const userData = await this.adminLogService.userRepository.findById(id);
      
      if (!userData) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Get block log if user is blocked
      let blockLog = null;
      if (!userData.is_active || userData.is_active === 0) {
        blockLog = await this.adminLogService.getBlockLogByUserId(id);
      }

      res.json({
        success: true,
        message: 'User details retrieved',
        data: {
          ...userData,
          blockLog: blockLog ? {
            reason: blockLog.detail?.reason || 'Tidak ada keterangan',
            blockedAt: blockLog.created_at,
            adminEmail: blockLog.admin_email,
            adminName: blockLog.admin_nama_depan && blockLog.admin_nama_belakang
              ? `${blockLog.admin_nama_depan} ${blockLog.admin_nama_belakang}`
              : blockLog.admin_email
          } : null
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

    const adminId = req.user?.userId || req.user?.id; 
    
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
    const adminId = req.user?.userId || req.user?.id;
    
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
    const adminId = req.user?.userId || req.user?.id; // ← Ambil dari token JWT
    
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

    const adminId = req.user?.userId || req.user?.id;
    
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

      // Support both userId and id from JWT token
      const adminId = req.user?.userId || req.user?.id;
      
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
        // Use filepath if available, otherwise use filename
        const filePath = report.filepath || report.filename;
        if (filePath) {
          return res.download(filePath, report.filename || `report.${format === 'csv' ? 'csv' : format === 'excel' ? 'xlsx' : 'pdf'}`, (err) => {
            if (err) {
              console.error('Error downloading file:', err);
              if (!res.headersSent) {
                res.status(500).json({
                  success: false,
                  error: 'Failed to download file'
                });
              }
            }
          });
        } else {
          return res.status(500).json({
            success: false,
            error: 'Report file not generated'
          });
        }
      } else {
        res.json({
          success: true,
          message: 'Report exported successfully',
          data: report
        });
      }
    } catch (error) {
      console.error('Error in exportReport:', error);
      res.status(400).json({
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

async getActivityLogs(req, res) {
  try {
    const { adminId, limit, offset } = req.query;

    const filters = {};
    if (adminId) filters.adminId = adminId;
    if (limit) filters.limit = parseInt(limit, 10);
    if (offset) filters.offset = parseInt(offset, 10);

    const logs = await this.adminLogService.getLogs(filters);

    if (!logs || logs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No logs found'
      });
    }

    res.json({
      success: true,
      message: 'Logs retrieved successfully',
      data: logs
    });
  } catch (error) {
    console.error('❌ Error in getActivityLogs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}



async getActivityLogDetail(req, res) {
  try {
    const { id } = req.query; // ambil dari query param

    const log = await this.adminLogService.getLogDetail(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Log not found'
      });
    }

    res.json({
      success: true,
      message: 'Activity log detail retrieved',
      data: log
    });
  } catch (error) {
    console.error('Error in getActivityLogDetail:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}


async getActivityLogsByAdmin(req, res) {
  try {
    const { adminId } = req.params; // ✅ ambil dari params
    const { limit = 50, offset = 0 } = req.query;

    console.log('🎯 Controller: getActivityLogsByAdmin called');
    console.log('📋 Params:', { adminId });
    console.log('📋 Query:', { limit, offset });

    const filters = {
      adminId,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const logs = await this.getActivityLogsUseCase.execute(filters);

    if (!logs.data || logs.data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No logs found for this admin'
      });
    }

    res.json({
      success: true,
      message: 'Admin activity logs retrieved',
      data: logs.data,
      pagination: {
        limit: logs.limit,
        offset: logs.offset,
        total: logs.total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}



  async getServices(req, res) {
    try {
      const { page = 1, limit = 10, status, search, kategori } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Build query with joins
      let query = `
        SELECT 
          l.id,
          l.judul,
          l.status,
          l.created_at,
          CONCAT(u.nama_depan, ' ', u.nama_belakang) as freelancer_name,
          u.id as freelancer_id,
          k.nama as kategori_name,
          k.id as kategori_id
        FROM layanan l
        LEFT JOIN users u ON l.freelancer_id = u.id
        LEFT JOIN kategori k ON l.kategori_id = k.id
        WHERE 1=1
      `;
      const replacements = [];

      // Filter by status
      if (status && status !== 'all') {
        if (status === 'active') {
          query += ' AND l.status = ?';
          replacements.push('aktif');
        } else if (status === 'blocked') {
          query += ' AND l.status = ?';
          replacements.push('nonaktif');
        }
      }

      // Filter by kategori
      if (kategori && kategori !== 'all') {
        query += ' AND k.id = ?';
        replacements.push(kategori);
      }

      // Search filter
      if (search) {
        query += ' AND (l.judul LIKE ? OR u.nama_depan LIKE ? OR u.nama_belakang LIKE ? OR k.nama LIKE ?)';
        const searchPattern = `%${search}%`;
        replacements.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      // Get total count
      let countQuery = `
        SELECT COUNT(*) as count
        FROM layanan l
        LEFT JOIN users u ON l.freelancer_id = u.id
        LEFT JOIN kategori k ON l.kategori_id = k.id
        WHERE 1=1
      `;
      const countReplacements = [];

      if (status && status !== 'all') {
        if (status === 'active') {
          countQuery += ' AND l.status = ?';
          countReplacements.push('aktif');
        } else if (status === 'blocked') {
          countQuery += ' AND l.status = ?';
          countReplacements.push('nonaktif');
        }
      }

      if (kategori && kategori !== 'all') {
        countQuery += ' AND k.id = ?';
        countReplacements.push(kategori);
      }

      if (search) {
        countQuery += ' AND (l.judul LIKE ? OR u.nama_depan LIKE ? OR u.nama_belakang LIKE ? OR k.nama LIKE ?)';
        const searchPattern = `%${search}%`;
        countReplacements.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      // Add pagination
      query += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
      replacements.push(parseInt(limit), offset);

      // Execute queries
      const services = await this.sequelize.query(query, {
        replacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      const totalResult = await this.sequelize.query(countQuery, {
        replacements: countReplacements,
        raw: true,
        type: this.sequelize.QueryTypes.SELECT
      });

      const total = totalResult[0]?.count || 0;

      res.json({
        success: true,
        message: 'Services retrieved',
        data: services || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          totalPages: Math.ceil(total / parseInt(limit))
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

  async getServiceDetails(req, res) {
    try {
      const { id } = req.params;
      
      // Get service details with joins
      const service = await this.sequelize.query(
        `SELECT 
          l.id,
          l.judul,
          l.deskripsi,
          l.harga,
          l.waktu_pengerjaan,
          l.batas_revisi,
          l.status,
          l.rating_rata_rata,
          l.jumlah_rating,
          l.total_pesanan,
          l.created_at,
          CONCAT(u.nama_depan, ' ', u.nama_belakang) as freelancer_name,
          u.email as freelancer_email,
          u.id as freelancer_id,
          k.nama as kategori_name,
          k.id as kategori_id
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

      if (!service || service.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Service not found'
        });
      }

      const serviceData = service[0];

      // Get block log if service is blocked
      let blockLog = null;
      if (serviceData.status === 'nonaktif') {
        blockLog = await this.adminLogService.getBlockLogByServiceId(id);
      }

      res.json({
        success: true,
        message: 'Service details retrieved',
        data: {
          ...serviceData,
          blockLog: blockLog ? {
            reason: blockLog.detail?.reason || 'Tidak ada keterangan',
            blockedAt: blockLog.created_at,
            adminEmail: blockLog.admin_email,
            adminName: blockLog.admin_nama_depan && blockLog.admin_nama_belakang
              ? `${blockLog.admin_nama_depan} ${blockLog.admin_nama_belakang}`
              : blockLog.admin_email
          } : null
        }
      });
    } catch (error) {
      console.error('Error in getServiceDetails:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AdminController;