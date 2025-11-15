const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SkillConnect API Documentation',
      version: '1.0.0',
      description: 'Marketplace Jasa dan Skill Lokal - Auto-generated API Documentation'
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development Server' },
      { url: 'https://api-ppl.vinmedia.my.id', description: 'Production Server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        // ===== User Schemas =====
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'nama_depan', 'nama_belakang', 'terms_accepted'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            nama_depan: { type: 'string', example: 'John' },
            nama_belakang: { type: 'string', example: 'Doe' },
            terms_accepted: { type: 'boolean', example: true, description: 'User must accept terms and conditions' }
          },
          description: 'All new registrations are automatically assigned the client role'
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Login berhasil' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                user: { $ref: '#/components/schemas/User' }
              }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            nama: { type: 'string', example: 'John Doe' },
            no_hp: { type: 'string', example: '081234567890' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            alamat: { type: 'string', nullable: true, example: 'Jakarta' },
            foto_profil: { type: 'string', nullable: true, example: 'https://example.com/photo.jpg' },
            bio: { type: 'string', nullable: true, example: 'Software Developer' },
            is_verified: { type: 'boolean', example: false },
            created_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
            updated_at: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
          }
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            nama: { type: 'string', example: 'John Doe' },
            no_hp: { type: 'string', example: '081234567890' },
            alamat: { type: 'string', example: 'Jakarta' },
            foto_profil: { type: 'string', example: 'https://example.com/photo.jpg' },
            bio: { type: 'string', example: 'Software Developer' }
          }
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['old_password', 'new_password'],
          properties: {
            old_password: { type: 'string', example: 'oldpassword123' },
            new_password: { type: 'string', minLength: 6, example: 'newpassword123' }
          }
        },

        // ===== Admin Schemas =====
        Admin: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            nama: { type: 'string', example: 'Admin User' },
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            role: { type: 'string', example: 'admin' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        AdminLog: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            admin_id: { type: 'string', format: 'uuid' },
            action: { type: 'string', example: 'CREATE_USER' },
            target_type: { type: 'string', example: 'USER' },
            target_id: { type: 'string', format: 'uuid' },
            details: { type: 'object' },
            ip_address: { type: 'string', example: '127.0.0.1' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },

        // ===== Payment Schemas =====
        CreatePaymentRequest: {
          type: 'object',
          required: ['pesanan_id', 'jumlah', 'metode_pembayaran'],
          properties: {
            pesanan_id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            jumlah: { type: 'number', example: 100000 },
            metode_pembayaran: { type: 'string', enum: ['qris', 'virtual_account', 'e-wallet', 'bank_transfer'], example: 'qris' },
            channel: { type: 'string', example: 'gopay', description: 'Required for e-wallet' }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            pesanan_id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            transaction_id: { type: 'string', example: 'TRX-1234567890' },
            nomor_invoice: { type: 'string', example: 'INV-2024-001' },
            jumlah: { type: 'number', example: 100000 },
            biaya_platform: { type: 'number', example: 5000 },
            biaya_payment_gateway: { type: 'number', example: 2000 },
            metode_pembayaran: { type: 'string', example: 'qris' },
            payment_gateway: { type: 'string', example: 'mock' },
            channel: { type: 'string', nullable: true, example: 'gopay' },
            status: { type: 'string', enum: ['pending', 'paid', 'success', 'failed', 'expired', 'cancelled', 'refunded', 'superseded'], example: 'pending' },
            payment_url: { type: 'string', nullable: true, example: 'https://payment.example.com/pay/123' },
            expired_at: { type: 'string', format: 'date-time' },
            paid_at: { type: 'string', format: 'date-time', nullable: true },
            retry_count: { type: 'number', example: 0 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        PaymentResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Pembayaran berhasil dibuat' },
            data: {
              type: 'object',
              properties: {
                payment: { $ref: '#/components/schemas/Payment' },
                payment_url: { type: 'string', example: 'https://payment.example.com/pay/123' },
                expires_in: { type: 'number', example: 86400 }
              }
            }
          }
        },

        // ===== Escrow Schemas =====
        Escrow: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            pembayaran_id: { type: 'string', format: 'uuid' },
            pesanan_id: { type: 'string', format: 'uuid' },
            jumlah: { type: 'number', example: 100000 },
            status: { type: 'string', enum: ['ditahan', 'dirilis', 'dibatalkan', 'refund_pending', 'refunded'], example: 'ditahan' },
            ditahan_pada: { type: 'string', format: 'date-time' },
            dirilis_pada: { type: 'string', format: 'date-time', nullable: true },
            catatan: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        ReleaseEscrowRequest: {
          type: 'object',
          properties: {
            catatan: { type: 'string', example: 'Pekerjaan selesai dengan baik' }
          }
        },

        // ===== Withdrawal Schemas =====
        CreateWithdrawalRequest: {
          type: 'object',
          required: ['jumlah', 'bank', 'nomor_rekening', 'nama_penerima'],
          properties: {
            jumlah: { type: 'number', example: 500000, description: 'Minimal 50000' },
            bank: { type: 'string', example: 'BCA' },
            nomor_rekening: { type: 'string', example: '1234567890' },
            nama_penerima: { type: 'string', example: 'John Doe' }
          }
        },
        Withdrawal: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            jumlah: { type: 'number', example: 500000 },
            bank: { type: 'string', example: 'BCA' },
            nomor_rekening: { type: 'string', example: '1234567890' },
            nama_penerima: { type: 'string', example: 'John Doe' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'completed'], example: 'pending' },
            admin_id: { type: 'string', format: 'uuid', nullable: true },
            catatan_admin: { type: 'string', nullable: true },
            diproses_pada: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        ProcessWithdrawalRequest: {
          type: 'object',
          required: ['action'],
          properties: {
            action: { type: 'string', enum: ['approve', 'reject'], example: 'approve' },
            catatan_admin: { type: 'string', example: 'Transfer berhasil dilakukan' }
          }
        },

        // ===== Refund Schemas =====
        RequestRefundRequest: {
          type: 'object',
          required: ['pembayaran_id', 'alasan'],
          properties: {
            pembayaran_id: { type: 'string', format: 'uuid' },
            alasan: { type: 'string', example: 'Pesanan tidak sesuai' },
            jumlah_refund: { type: 'number', example: 100000, description: 'Optional, default full amount' }
          }
        },
        Refund: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            pembayaran_id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            jumlah: { type: 'number', example: 100000 },
            alasan: { type: 'string', example: 'Pesanan tidak sesuai' },
            status: { type: 'string', enum: ['pending', 'disetujui', 'ditolak'], example: 'pending' },
            admin_id: { type: 'string', format: 'uuid', nullable: true },
            catatan_admin: { type: 'string', nullable: true },
            diproses_pada: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        ProcessRefundRequest: {
          type: 'object',
          required: ['action'],
          properties: {
            action: { type: 'string', enum: ['approve', 'reject'], example: 'approve' },
            catatan_admin: { type: 'string', example: 'Refund disetujui' }
          }
        },

        // ===== Generic Response Schemas =====
        SuccessResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Operasi berhasil' },
            data: { type: 'object' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Terjadi kesalahan' },
            errors: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      responses: {
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'error' },
                  message: { type: 'string', example: 'Internal server error' }
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'error' },
                  message: { type: 'string', example: 'Resource tidak ditemukan' }
                }
              }
            }
          }
        },
        UnauthorizedError: {
          description: 'Unauthorized - Token tidak valid atau tidak ada',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'error' },
                  message: { type: 'string', example: 'Unauthorized' }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'error' },
                  message: { type: 'string', example: 'Validasi gagal' },
                  errors: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Email wajib diisi', 'Password minimal 6 karakter']
                  }
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Forbidden - Tidak memiliki akses',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'error' },
                  message: { type: 'string', example: 'Akses ditolak' }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Health', description: 'System Core - Health check dan monitoring' },
      { name: 'Users', description: 'Modul 1: User Management - Registrasi, login, profil, role management' },
      { name: 'Services', description: 'Modul 2: Service Listing & Search - CRUD layanan (Dalam Pengembangan)' },
      { name: 'Orders', description: 'Modul 3: Order & Booking System - Buat order (Dalam Pengembangan)' },
      { name: 'Payments', description: 'Modul 4: Payment Gateway - Pembayaran digital' },
      { name: 'Escrow', description: 'Modul 4: Payment Gateway - Escrow fund management' },
      { name: 'Withdrawals', description: 'Modul 4: Payment Gateway - Withdrawal requests' },
      { name: 'Reviews', description: 'Modul 5: Review & Rating System (Dalam Pengembangan)' },
      { name: 'Chat', description: 'Modul 6: Chat & Notification (Dalam Pengembangan)' },
      { name: 'Admin', description: 'Modul 7: Admin Dashboard & Analytics' },
      { name: 'Recommendations', description: 'Modul 8: Recommendation & Personalization (Dalam Pengembangan)' }
    ]
  },
  apis: ['./src/modules/*/presentation/routes/*.js', './src/server.js']
};

module.exports = swaggerJsdoc(options);
