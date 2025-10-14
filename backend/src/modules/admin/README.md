# Modul 7 - Admin Dashboard & Analytics

## 📋 Deskripsi
Modul untuk admin mengelola sistem, monitoring statistik, analytics, dan reporting.

## 🎯 User Stories
- **A-1**: Lihat statistik user & order
- **A-2**: Lihat total pendapatan
- **A-3**: Blokir user/layanan bermasalah
- **A-4**: Ekspor laporan PDF/CSV
- **A-5**: Lihat tren transaksi
- **A-6**: Notifikasi fraud alert

## 📂 Struktur DDD

```
admin/
├── domain/
│   ├── entities/
│   │   ├── SystemStats.js       # Entity statistics
│   │   └── AdminActivityLog.js  # Entity admin activity log
│   └── services/
│       ├── AnalyticsService.js  # Business logic analytics
│       └── FraudDetectionService.js
├── application/
│   ├── use-cases/
│   │   ├── GetDashboardStats.js # Dashboard overview
│   │   ├── GetUserAnalytics.js  # User analytics
│   │   ├── GetRevenueAnalytics.js
│   │   ├── BlockUser.js         # Block/suspend user
│   │   ├── BlockService.js      # Block service
│   │   ├── DeleteReview.js      # Delete review (with log)
│   │   ├── ExportReport.js      # Export reports
│   │   └── GetAdminActivityLog.js  # Get admin activity history
│   └── dtos/
│       ├── StatsDto.js
│       ├── AnalyticsDto.js
│       └── AdminLogDto.js
├── infrastructure/
│   ├── repositories/
│   │   ├── SequelizeAnalyticsRepository.js
│   │   └── SequelizeAdminLogRepository.js
│   ├── models/
│   │   └── AdminActivityLogModel.js
│   └── services/
│       ├── ReportGenerator.js   # Generate PDF/CSV reports
│       └── ChartService.js      # Generate chart data
└── presentation/
    ├── controllers/
    │   ├── AdminController.js
    │   └── AdminLogController.js
    └── routes/
        ├── adminRoutes.js
        └── adminLogRoutes.js
```

## 🌐 API Endpoints

### Admin Dashboard & Analytics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard` | Dashboard overview stats | Admin |
| GET | `/api/admin/users` | List users with filter | Admin |
| GET | `/api/admin/analytics/users` | User analytics | Admin |
| GET | `/api/admin/analytics/revenue` | Revenue analytics | Admin |
| GET | `/api/admin/analytics/orders` | Order trends | Admin |
| PUT | `/api/admin/users/:id/block` | Block user | Admin |
| PUT | `/api/admin/services/:id/block` | Block service | Admin |
| DELETE | `/api/admin/reviews/:id` | Delete review | Admin |
| POST | `/api/admin/reports/export` | Export report | Admin |
| GET | `/api/admin/fraud-alerts` | Fraud detection alerts | Admin |

### Admin Activity Log
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/logs` | Get admin activity logs | Admin |
| GET | `/api/admin/logs/:id` | Get specific log detail | Admin |
| GET | `/api/admin/logs/admin/:adminId` | Logs by specific admin | Admin |

## 📦 Database Schema

### `log_aktivitas_admin` (Admin Activity Log)

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AdminActivityLog = sequelize.define('log_aktivitas_admin', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    admin_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    aksi: {
      type: DataTypes.ENUM(
        'block_user',
        'unblock_user',
        'block_service',
        'unblock_service',
        'delete_review',
        'approve_withdrawal',
        'reject_withdrawal',
        'update_user',
        'export_report'
      ),
      allowNull: false
    },
    target_type: {
      type: DataTypes.ENUM('user', 'layanan', 'ulasan', 'pesanan', 'pembayaran', 'system'),
      allowNull: false
    },
    target_id: DataTypes.CHAR(36),
    detail: DataTypes.JSON,
    ip_address: DataTypes.STRING(45),
    user_agent: DataTypes.TEXT
  }, {
    timestamps: true,
    underscored: true,
    updatedAt: false,
    indexes: [
      { fields: ['admin_id'] },
      { fields: ['aksi'] },
      { fields: ['target_type', 'target_id'] },
      { fields: ['created_at'] }
    ]
  });

  return AdminActivityLog;
};
```

**Note**: Modul admin juga query data dari table existing:
- `users` - untuk statistik user
- `pesanan` - untuk statistik order
- `pembayaran` - untuk revenue analytics
- `layanan` - untuk service statistics

## 💡 Tips Implementasi

### Get Dashboard Stats Use Case
```javascript
class GetDashboardStats {
  constructor(
    userRepository,
    orderRepository,
    paymentRepository,
    serviceRepository
  ) {
    this.userRepository = userRepository;
    this.orderRepository = orderRepository;
    this.paymentRepository = paymentRepository;
    this.serviceRepository = serviceRepository;
  }

  async execute(timeRange = 'today') {
    const dateFilter = this.getDateFilter(timeRange);

    // Parallel queries untuk performa
    const [
      totalUsers,
      newUsers,
      totalOrders,
      newOrders,
      completedOrders,
      totalRevenue,
      revenueGrowth,
      totalServices,
      activeServices
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ createdAt: dateFilter }),
      this.orderRepository.count(),
      this.orderRepository.count({ createdAt: dateFilter }),
      this.orderRepository.count({ status: 'completed', createdAt: dateFilter }),
      this.paymentRepository.sumAmount({ status: 'success' }),
      this.calculateRevenueGrowth(dateFilter),
      this.serviceRepository.count(),
      this.serviceRepository.count({ status: 'active' })
    ]);

    return {
      users: {
        total: totalUsers,
        new: newUsers
      },
      orders: {
        total: totalOrders,
        new: newOrders,
        completed: completedOrders,
        completionRate: ((completedOrders / totalOrders) * 100).toFixed(1)
      },
      revenue: {
        total: totalRevenue,
        growth: revenueGrowth
      },
      services: {
        total: totalServices,
        active: activeServices
      }
    };
  }

  getDateFilter(timeRange) {
    const now = new Date();
    switch (timeRange) {
      case 'today':
        return { $gte: new Date(now.setHours(0, 0, 0, 0)) };
      case 'week':
        return { $gte: new Date(now.setDate(now.getDate() - 7)) };
      case 'month':
        return { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
      case 'year':
        return { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
      default:
        return {};
    }
  }

  async calculateRevenueGrowth(currentPeriod) {
    const currentRevenue = await this.paymentRepository.sumAmount({
      status: 'success',
      createdAt: currentPeriod
    });

    // Previous period (same duration)
    const previousRevenue = await this.paymentRepository.sumAmount({
      status: 'success',
      createdAt: this.getPreviousPeriod(currentPeriod)
    });

    if (previousRevenue === 0) return 100;

    return (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1);
  }
}
```

### Get Revenue Analytics Use Case
```javascript
class GetRevenueAnalytics {
  async execute(period = 'month', year = new Date().getFullYear()) {
    let groupBy;
    let dateFormat;

    switch (period) {
      case 'month':
        groupBy = { $month: '$createdAt' };
        dateFormat = 'month';
        break;
      case 'week':
        groupBy = { $week: '$createdAt' };
        dateFormat = 'week';
        break;
      case 'day':
        groupBy = { $dayOfYear: '$createdAt' };
        dateFormat = 'day';
        break;
    }

    const result = await this.paymentRepository.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: '$amount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return {
      period,
      year,
      data: result.map(item => ({
        period: item._id,
        revenue: item.totalRevenue,
        orders: item.totalOrders,
        avgOrderValue: item.avgOrderValue.toFixed(2)
      })),
      summary: {
        totalRevenue: result.reduce((sum, item) => sum + item.totalRevenue, 0),
        totalOrders: result.reduce((sum, item) => sum + item.totalOrders, 0)
      }
    };
  }
}
```

### Fraud Detection Service
```javascript
class FraudDetectionService {
  async detectSuspiciousActivity() {
    const alerts = [];

    // 1. Deteksi multiple failed payments
    const failedPayments = await this.paymentRepository.find({
      status: 'failed',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    const userFailedCounts = {};
    failedPayments.forEach(payment => {
      userFailedCounts[payment.userId] = (userFailedCounts[payment.userId] || 0) + 1;
    });

    Object.entries(userFailedCounts).forEach(([userId, count]) => {
      if (count >= 5) {
        alerts.push({
          type: 'multiple_failed_payments',
          userId,
          count,
          severity: 'high'
        });
      }
    });

    // 2. Deteksi review spam (banyak review dalam waktu singkat)
    const recentReviews = await this.reviewRepository.find({
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // 1 jam
    });

    const userReviewCounts = {};
    recentReviews.forEach(review => {
      userReviewCounts[review.clientId] = (userReviewCounts[review.clientId] || 0) + 1;
    });

    Object.entries(userReviewCounts).forEach(([userId, count]) => {
      if (count >= 10) {
        alerts.push({
          type: 'review_spam',
          userId,
          count,
          severity: 'medium'
        });
      }
    });

    // 3. Deteksi harga tidak wajar (terlalu murah/mahal)
    const suspiciousServices = await this.serviceRepository.find({
      $or: [
        { price: { $lt: 10000 } },  // Terlalu murah
        { price: { $gt: 10000000 } } // Terlalu mahal
      ]
    });

    suspiciousServices.forEach(service => {
      alerts.push({
        type: 'suspicious_pricing',
        serviceId: service.id,
        price: service.price,
        severity: 'low'
      });
    });

    return alerts;
  }
}
```

### Export Report Use Case
```javascript
class ExportReport {
  constructor(reportGenerator) {
    this.reportGenerator = reportGenerator;
  }

  async execute(reportType, format, filters) {
    let data;

    switch (reportType) {
      case 'transactions':
        data = await this.getTransactionData(filters);
        break;
      case 'users':
        data = await this.getUserData(filters);
        break;
      case 'revenue':
        data = await this.getRevenueData(filters);
        break;
      default:
        throw new Error('Invalid report type');
    }

    if (format === 'pdf') {
      return await this.reportGenerator.generatePDF(reportType, data);
    } else if (format === 'csv') {
      return await this.reportGenerator.generateCSV(reportType, data);
    }

    throw new Error('Invalid format');
  }

  async getTransactionData(filters) {
    return await this.paymentRepository.find({
      createdAt: {
        $gte: filters.startDate,
        $lte: filters.endDate
      },
      status: filters.status
    });
  }
}
```

### Get Admin Activity Log Use Case
```javascript
class GetAdminActivityLog {
  constructor(adminLogRepository, userRepository) {
    this.adminLogRepository = adminLogRepository;
    this.userRepository = userRepository;
  }

  async execute(filters = {}) {
    const { page = 1, limit = 20, aksi, adminId, targetType, startDate, endDate } = filters;
    const offset = (page - 1) * limit;

    // Build query filters
    const where = {};
    if (aksi) where.aksi = aksi;
    if (adminId) where.admin_id = adminId;
    if (targetType) where.target_type = targetType;
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at.$gte = new Date(startDate);
      if (endDate) where.created_at.$lte = new Date(endDate);
    }

    // Query logs with pagination
    const [logs, total] = await Promise.all([
      this.adminLogRepository.findAll({
        where,
        include: [{ model: 'users', as: 'admin', attributes: ['id', 'email', 'nama_depan', 'nama_belakang'] }],
        order: [['created_at', 'DESC']],
        limit,
        offset
      }),
      this.adminLogRepository.count({ where })
    ]);

    return {
      logs: logs.map(log => ({
        logId: log.id,
        admin: {
          adminId: log.admin.id,
          email: log.admin.email,
          name: `${log.admin.nama_depan} ${log.admin.nama_belakang}`
        },
        aksi: log.aksi,
        targetType: log.target_type,
        targetId: log.target_id,
        detail: log.detail,
        ipAddress: log.ip_address,
        userAgent: log.user_agent,
        createdAt: log.created_at
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getByAdmin(adminId, filters = {}) {
    const { startDate, endDate } = filters;

    // Get admin info
    const admin = await this.userRepository.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new Error('Admin not found');
    }

    // Get logs
    const where = { admin_id: adminId };
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at.$gte = new Date(startDate);
      if (endDate) where.created_at.$lte = new Date(endDate);
    }

    const logs = await this.adminLogRepository.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    // Calculate stats
    const stats = {
      totalActions: logs.length,
      byAction: {}
    };

    logs.forEach(log => {
      stats.byAction[log.aksi] = (stats.byAction[log.aksi] || 0) + 1;
    });

    return {
      admin: {
        adminId: admin.id,
        email: admin.email,
        name: `${admin.nama_depan} ${admin.nama_belakang}`
      },
      stats,
      logs: logs.map(log => ({
        logId: log.id,
        aksi: log.aksi,
        targetType: log.target_type,
        targetId: log.target_id,
        detail: log.detail,
        createdAt: log.created_at
      }))
    };
  }
}
```

### Block User Use Case
```javascript
class BlockUser {
  constructor(userRepository, adminLogRepository, emailService) {
    this.userRepository = userRepository;
    this.adminLogRepository = adminLogRepository;
    this.emailService = emailService;
  }

  async execute(userId, adminId, reason, ipAddress, userAgent) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.role === 'admin') {
      throw new Error('Cannot block admin user');
    }

    // Simpan data sebelum diblokir (untuk audit trail)
    const beforeData = {
      email: user.email,
      is_active: user.is_active,
      role: user.role
    };

    user.block(reason);
    await this.userRepository.update(user);

    // Log aktivitas admin
    await this.adminLogRepository.save({
      adminId,
      aksi: 'block_user',
      targetType: 'user',
      targetId: userId,
      detail: {
        reason,
        beforeData,
        afterData: { is_active: false }
      },
      ipAddress,
      userAgent
    });

    // Kirim email notifikasi ke user
    await this.emailService.sendBlockNotification(user.email, reason);

    return { success: true, message: 'User blocked' };
  }
}
```

## 🚀 Frontend Integration

### Get Dashboard Stats
```javascript
GET /api/admin/dashboard?timeRange=today
Response: {
  success: true,
  data: {
    users: { total: 1500, new: 45 },
    orders: {
      total: 3200,
      new: 120,
      completed: 2800,
      completionRate: "87.5"
    },
    revenue: {
      total: 125000000,
      growth: "15.3"
    },
    services: { total: 850, active: 720 }
  }
}
```

### Get Revenue Analytics
```javascript
GET /api/admin/analytics/revenue?period=month&year=2025
Response: {
  success: true,
  data: {
    period: "month",
    year: 2025,
    data: [
      { period: 1, revenue: 10000000, orders: 150, avgOrderValue: "66666.67" },
      { period: 2, revenue: 12000000, orders: 180, avgOrderValue: "66666.67" },
      // ... 12 bulan
    ],
    summary: {
      totalRevenue: 150000000,
      totalOrders: 2000
    }
  }
}
```

### Block User
```javascript
PUT /api/admin/users/:id/block
Headers: { Authorization: "Bearer <admin_token>" }
Body: {
  reason: "Violation of terms of service"
}
Response: {
  success: true,
  message: "User blocked successfully"
}
```

### Export Report
```javascript
POST /api/admin/reports/export
Body: {
  reportType: "transactions",
  format: "pdf",
  filters: {
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "success"
  }
}
Response: {
  success: true,
  data: {
    downloadUrl: "https://storage.com/reports/transactions-jan-2025.pdf",
    expiresAt: "2025-02-01T00:00:00Z"
  }
}
```

### Get Fraud Alerts
```javascript
GET /api/admin/fraud-alerts
Response: {
  success: true,
  data: [
    {
      type: "multiple_failed_payments",
      userId: "user_123",
      count: 7,
      severity: "high",
      timestamp: "2025-01-20T10:00:00Z"
    },
    {
      type: "review_spam",
      userId: "user_456",
      count: 15,
      severity: "medium",
      timestamp: "2025-01-20T11:00:00Z"
    }
  ]
}
```

### Get Admin Activity Logs
```javascript
GET /api/admin/logs?page=1&limit=20&aksi=block_user&startDate=2025-01-01
Headers: { Authorization: "Bearer <admin_token>" }
Response: {
  success: true,
  data: {
    logs: [
      {
        logId: "log_123",
        admin: {
          adminId: "admin_456",
          email: "admin@skillconnect.com",
          name: "John Admin"
        },
        aksi: "block_user",
        targetType: "user",
        targetId: "user_789",
        detail: {
          reason: "Violation of terms",
          beforeData: { is_active: true },
          afterData: { is_active: false }
        },
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0...",
        createdAt: "2025-01-20T10:30:00Z"
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 150,
      totalPages: 8
    }
  }
}
```

### Get Logs by Specific Admin
```javascript
GET /api/admin/logs/admin/:adminId?startDate=2025-01-01&endDate=2025-01-31
Headers: { Authorization: "Bearer <admin_token>" }
Response: {
  success: true,
  data: {
    admin: {
      adminId: "admin_456",
      email: "admin@skillconnect.com",
      name: "John Admin"
    },
    stats: {
      totalActions: 45,
      byAction: {
        block_user: 12,
        delete_review: 8,
        export_report: 25
      }
    },
    logs: [
      {
        logId: "log_123",
        aksi: "block_user",
        targetType: "user",
        targetId: "user_789",
        detail: {...},
        createdAt: "2025-01-20T10:30:00Z"
      }
    ]
  }
}
```

## 📊 Chart Data Format

### Revenue Trend (untuk Chart.js/Recharts)
```javascript
{
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Revenue',
    data: [10000000, 12000000, 15000000, 13000000, 18000000, 20000000],
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    borderColor: 'rgb(59, 130, 246)'
  }]
}
```
