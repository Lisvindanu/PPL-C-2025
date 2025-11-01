/**
 * Swagger/OpenAPI Configuration
 * Auto-generates API documentation similar to Laravel Scramble
 */

const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 5000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SkillConnect API Documentation',
      version: '1.0.0',
      description: 'Marketplace Jasa dan Skill Lokal - Auto-generated API Documentation',
      contact: {
        name: 'SkillConnect Team',
        email: 'support@skillconnect.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development Server',
      },
      {
        url: 'https://ppl.vinmedia.my.id',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token from login/register endpoint',
        },
      },
      schemas: {
        // User Schemas
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nama_lengkap: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: { type: 'string', enum: ['client', 'freelancer', 'admin'], example: 'client' },
            nomor_telepon: { type: 'string', example: '+6281234567890' },
            tanggal_lahir: { type: 'string', format: 'date', example: '1990-01-01' },
            alamat: { type: 'string', example: 'Jl. Sudirman No. 1' },
            foto_profil: { type: 'string', format: 'url', nullable: true },
            is_verified: { type: 'boolean', example: false },
            is_blocked: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['nama_lengkap', 'email', 'password', 'role'],
          properties: {
            nama_lengkap: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', minLength: 8, example: 'password123' },
            role: { type: 'string', enum: ['client', 'freelancer'], example: 'client' },
            nomor_telepon: { type: 'string', example: '+6281234567890' },
            tanggal_lahir: { type: 'string', format: 'date', example: '1990-01-01' },
            alamat: { type: 'string', example: 'Jl. Sudirman No. 1' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              },
            },
          },
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            nama_lengkap: { type: 'string', example: 'John Doe Updated' },
            nomor_telepon: { type: 'string', example: '+6281234567890' },
            tanggal_lahir: { type: 'string', format: 'date', example: '1990-01-01' },
            alamat: { type: 'string', example: 'Jl. Sudirman No. 1' },
            foto_profil: { type: 'string', format: 'url' },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john@example.com' },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['token', 'password'],
          properties: {
            token: { type: 'string', example: 'reset-token-here' },
            password: { type: 'string', format: 'password', minLength: 8, example: 'newpassword123' },
          },
        },
        ChangeRoleRequest: {
          type: 'object',
          required: ['role'],
          properties: {
            role: { type: 'string', enum: ['client', 'freelancer'], example: 'freelancer' },
          },
        },
        // Payment Schemas
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            id_pesanan: { type: 'integer', example: 1 },
            id_metode_pembayaran: { type: 'integer', example: 1 },
            jumlah: { type: 'number', format: 'decimal', example: 500000 },
            status: { type: 'string', enum: ['pending', 'success', 'failed', 'refunded'], example: 'pending' },
            payment_url: { type: 'string', format: 'url', nullable: true },
            external_id: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreatePaymentRequest: {
          type: 'object',
          required: ['orderId', 'amount', 'paymentMethod'],
          properties: {
            orderId: { type: 'integer', example: 1 },
            amount: { type: 'number', format: 'decimal', example: 500000 },
            paymentMethod: { type: 'string', example: 'credit_card' },
          },
        },
        Escrow: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            id_pembayaran: { type: 'integer', example: 1 },
            id_pesanan: { type: 'integer', example: 1 },
            jumlah: { type: 'number', format: 'decimal', example: 500000 },
            status: { type: 'string', enum: ['held', 'released', 'refunded'], example: 'held' },
            tanggal_rilis: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ReleaseEscrowRequest: {
          type: 'object',
          required: ['orderId'],
          properties: {
            orderId: { type: 'integer', example: 1 },
          },
        },
        Withdrawal: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            id_user: { type: 'integer', example: 1 },
            jumlah: { type: 'number', format: 'decimal', example: 1000000 },
            status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'], example: 'pending' },
            rekening_tujuan: { type: 'string', example: '1234567890' },
            nama_bank: { type: 'string', example: 'BCA' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateWithdrawalRequest: {
          type: 'object',
          required: ['amount', 'bankAccount', 'bankName'],
          properties: {
            amount: { type: 'number', format: 'decimal', example: 1000000 },
            bankAccount: { type: 'string', example: '1234567890' },
            bankName: { type: 'string', example: 'BCA' },
          },
        },
        // Admin Schemas
        DashboardStats: {
          type: 'object',
          properties: {
            totalUsers: { type: 'integer', example: 1250 },
            totalOrders: { type: 'integer', example: 450 },
            totalRevenue: { type: 'number', format: 'decimal', example: 125000000 },
            activeServices: { type: 'integer', example: 320 },
          },
        },
        UserAnalytics: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date', example: '2024-01-15' },
            newUsers: { type: 'integer', example: 25 },
            activeUsers: { type: 'integer', example: 150 },
          },
        },
        RevenueAnalytics: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date', example: '2024-01-15' },
            revenue: { type: 'number', format: 'decimal', example: 5000000 },
          },
        },
        ExportReportRequest: {
          type: 'object',
          required: ['type', 'format'],
          properties: {
            type: { type: 'string', enum: ['users', 'orders', 'revenue'], example: 'users' },
            format: { type: 'string', enum: ['csv', 'excel', 'pdf'], example: 'csv' },
            startDate: { type: 'string', format: 'date', example: '2024-01-01' },
            endDate: { type: 'string', format: 'date', example: '2024-01-31' },
          },
        },
        // Common Schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string', example: 'Detailed error information' },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Email is required' },
                },
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                message: 'Unauthorized - Please login first',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'User does not have permission to access this resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                message: 'Forbidden - Admin access required',
              },
            },
          },
        },
        NotFoundError: {
          description: 'The requested resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                message: 'Resource not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              example: {
                success: false,
                message: 'Internal server error',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: '🏥 **System Core** - Health check and monitoring endpoints',
      },
      {
        name: 'Users',
        description: '👥 **Modul 1: User Management** - Registrasi, login, profil pengguna, role management (Client, Freelancer, Admin)',
      },
      {
        name: 'Services',
        description: '🛠️ **Modul 2: Service Listing & Search** - CRUD layanan, pencarian & filter, detail layanan, rekomendasi populer - 🚧 *Sedang dalam tahap proses pengembangan*',
      },
      {
        name: 'Orders',
        description: '📦 **Modul 3: Order & Booking System** - Buat order, accept/reject, tracking status, complete order - 🚧 *Sedang dalam tahap proses pengembangan*',
      },
      {
        name: 'Payments',
        description: '💳 **Modul 4: Payment Gateway** - Pembayaran digital, multiple payment methods, verifikasi webhook, invoice generation',
      },
      {
        name: 'Escrow',
        description: '🔒 **Modul 4: Payment Gateway** - Escrow fund management dan release system',
      },
      {
        name: 'Withdrawals',
        description: '💰 **Modul 4: Payment Gateway** - Dashboard penghasilan freelancer dan withdrawal requests',
      },
      {
        name: 'Reviews',
        description: '⭐ **Modul 5: Review & Rating System** - Rating layanan, display rating, report review, admin moderation - 🚧 *Sedang dalam tahap proses pengembangan*',
      },
      {
        name: 'Chat',
        description: '💬 **Modul 6: Chat & Notification System** - Real-time chat (Socket.io), notifikasi order/payment, email notification - 🚧 *Sedang dalam tahap proses pengembangan*',
      },
      {
        name: 'Authentication',
        description: '🔐 **Modul 7: Admin Dashboard & Analytics** - Admin authentication dan login',
      },
      {
        name: 'Admin',
        description: '⚙️ **Modul 7: Admin Dashboard & Analytics** - Dashboard statistik, user management, transaction analytics, revenue reports, fraud detection',
      },
      {
        name: 'Recommendations',
        description: '🎯 **Modul 8: Recommendation & Personalization** - Personalized recommendations, similar services, favorites, user preferences - 🚧 *Sedang dalam tahap proses pengembangan*',
      },
    ],
    'x-tagGroups': [
      {
        name: '🏥 System Core',
        tags: ['Health'],
      },
      {
        name: '👥 Modul 1: User Management',
        tags: ['Users'],
      },
      {
        name: '🛠️ Modul 2: Service Listing & Search 🚧',
        tags: ['Services'],
      },
      {
        name: '📦 Modul 3: Order & Booking System 🚧',
        tags: ['Orders'],
      },
      {
        name: '💳 Modul 4: Payment Gateway',
        tags: ['Payments', 'Escrow', 'Withdrawals'],
      },
      {
        name: '⭐ Modul 5: Review & Rating System 🚧',
        tags: ['Reviews'],
      },
      {
        name: '💬 Modul 6: Chat & Notification System 🚧',
        tags: ['Chat'],
      },
      {
        name: '⚙️ Modul 7: Admin Dashboard & Analytics',
        tags: ['Authentication', 'Admin'],
      },
      {
        name: '🎯 Modul 8: Recommendation & Personalization 🚧',
        tags: ['Recommendations'],
      },
    ],
  },
  // Path to the API routes files
  apis: [
    './src/modules/*/presentation/routes/*.js',
    './src/server.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
