/**
 * Swagger/OpenAPI Configuration
 * Auto-generates API documentation similar to Laravel Scramble
 */

const swaggerJsdoc = require('swagger-jsdoc');

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
        url: 'http://localhost:5000',
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
        description: '👥 **Module 1: User Management** - User registration, login, profile management, role switching',
      },
      {
        name: 'Authentication',
        description: '🔐 **Module 2: Admin Authentication** - Admin login and authentication',
      },
      {
        name: 'Admin',
        description: '⚙️ **Module 2: Admin Panel** - Dashboard, analytics, user/service management, reports, fraud detection (requires admin role)',
      },
      {
        name: 'Payments',
        description: '💳 **Module 3: Payment System** - Payment creation, processing, and gateway integration',
      },
      {
        name: 'Escrow',
        description: '🔒 **Module 3: Payment System** - Escrow fund holding and release management',
      },
      {
        name: 'Withdrawals',
        description: '💰 **Module 3: Payment System** - Freelancer withdrawal requests and processing',
      },
      {
        name: 'Services',
        description: '🛠️ **Module 4: Service Management** - Service/Layanan listing, creation, and management (Coming Soon)',
      },
      {
        name: 'Orders',
        description: '📦 **Module 5: Order Management** - Order creation, tracking, and fulfillment (Coming Soon)',
      },
      {
        name: 'Reviews',
        description: '⭐ **Module 6: Review System** - Service reviews and ratings (Coming Soon)',
      },
      {
        name: 'Chat',
        description: '💬 **Module 7: Chat & Messaging** - Real-time chat and messaging between users (Coming Soon)',
      },
      {
        name: 'Recommendations',
        description: '🎯 **Module 8: Recommendation Engine** - Service recommendations based on user preferences (Coming Soon)',
      },
      {
        name: 'Categories',
        description: '📁 **Module 9: Category Management** - Service categories and taxonomy (Coming Soon)',
      },
    ],
    'x-tagGroups': [
      {
        name: '🏥 System Core',
        tags: ['Health'],
      },
      {
        name: '👥 Module 1: User Management',
        tags: ['Users'],
      },
      {
        name: '⚙️ Module 2: Admin & Authentication',
        tags: ['Authentication', 'Admin'],
      },
      {
        name: '💳 Module 3: Payment System',
        tags: ['Payments', 'Escrow', 'Withdrawals'],
      },
      {
        name: '🛠️ Module 4: Service Management',
        tags: ['Services'],
      },
      {
        name: '📦 Module 5: Order Management',
        tags: ['Orders'],
      },
      {
        name: '⭐ Module 6: Review System',
        tags: ['Reviews'],
      },
      {
        name: '💬 Module 7: Chat & Messaging',
        tags: ['Chat'],
      },
      {
        name: '🎯 Module 8: Recommendation Engine',
        tags: ['Recommendations'],
      },
      {
        name: '📁 Module 9: Category Management',
        tags: ['Categories'],
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
