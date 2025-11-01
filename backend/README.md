# SkillConnect Backend

Backend server untuk SkillConnect - Marketplace Jasa dan Skill Lokal.

## 🚀 Tech Stack
- **Node.js 20** - Runtime environment
- **Express.js** - Web framework
- **MySQL 8** - Relational database
- **Sequelize** - ORM (Object-Relational Mapping)
- **JWT** - Authentication & authorization
- **Socket.IO** - Real-time communication (chat)
- **Swagger** - API documentation
- **Nodemailer** - Email notifications
- **PDFKit** - Invoice generation

## 📁 Project Structure

Menggunakan **Domain-Driven Design (DDD)** dengan clean architecture pattern:

```
backend/
├── src/
│   ├── modules/           # 8 Modul Aplikasi
│   │   ├── user/          # ✅ Modul 1: User Management
│   │   ├── service/       # 🔄 Modul 2: Service Listing & Search
│   │   ├── order/         # 🔄 Modul 3: Order & Booking
│   │   ├── payment/       # ✅ Modul 4: Payment Gateway
│   │   ├── review/        # 🔄 Modul 5: Review & Rating
│   │   ├── chat/          # 🔄 Modul 6: Chat & Notification
│   │   ├── admin/         # ✅ Modul 7: Admin Dashboard
│   │   └── recommendation/# 🔄 Modul 8: Recommendation
│   ├── shared/            # Shared utilities
│   │   ├── config/        # Configuration files
│   │   ├── middleware/    # Global middlewares
│   │   ├── database/      # Database connection & migrations
│   │   └── utils/         # Helper functions
│   ├── server.js          # Express app setup
│   └── app.js             # Alternative entry point
├── docs/                  # 📚 Documentation
│   ├── api/               # API documentation
│   ├── guides/            # Development guides
│   ├── setup/             # Setup & deployment guides
│   ├── DATABASE-SCHEMA.md # Complete database schema
│   └── audit-modul.md     # Module progress audit
├── public/                # Static files
│   └── mock-payment/      # Mock payment gateway pages
├── invoices/              # Generated invoice PDFs
├── .env.example           # Environment variables template
├── package.json
└── README.md
```

## 🏗️ DDD Module Structure

Setiap modul mengikuti clean architecture dengan 4 layer:

```
modules/[module-name]/
├── domain/                # Business logic & rules
│   ├── entities/          # Domain entities
│   ├── value-objects/     # Value objects
│   ├── repositories/      # Repository interfaces
│   └── services/          # Domain services
├── application/           # Use cases (business operations)
│   ├── use-cases/         # Business use cases
│   ├── dtos/              # Data transfer objects
│   └── interfaces/        # External service interfaces
├── infrastructure/        # External dependencies
│   ├── repositories/      # Sequelize implementations
│   ├── models/            # Sequelize models
│   └── services/          # External services (email, payment)
└── presentation/          # API layer
    ├── controllers/       # HTTP controllers
    ├── routes/            # Route definitions
    ├── middlewares/       # Route-specific middlewares
    └── validators/        # Request validators
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 20+
- MySQL 8.0+
- npm atau yarn

### Installation Steps

1. **Clone & Install**
```bash
cd backend
npm install
```

2. **Database Setup**
```bash
# Create database
mysql -u root -p
CREATE DATABASE skillconnect;
EXIT;

# Run migrations
npm run migrate

# Seed data (optional)
npm run seed
```

3. **Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi kamu:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skillconnect
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Frontend URL (untuk CORS)
FRONTEND_URL=http://localhost:3000

# Email (optional - untuk production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Payment Gateway (optional - menggunakan mock payment)
PAYMENT_MODE=mock
```

4. **Run Development Server**
```bash
npm run dev
```

Server akan jalan di: **http://localhost:5000**

## 📦 NPM Scripts

```bash
npm run dev          # Development mode dengan nodemon
npm start            # Production mode
npm run migrate      # Run database migrations
npm run migrate:undo # Rollback last migration
npm run seed         # Seed sample data
npm test             # Run tests
npm run lint         # Check code quality
```

## 🌐 API Endpoints

### Health Check
- `GET /` - API info
- `GET /health` - Database health check

### Documentation
- `GET /api-docs` - Swagger UI documentation
- `GET /api-docs.json` - Swagger JSON spec

### Module Endpoints

Lihat dokumentasi lengkap di:
- **Swagger UI**: http://localhost:5000/api-docs
- **API Docs**: [docs/api/API_DOCUMENTATION.md](docs/api/API_DOCUMENTATION.md)

## 🗄️ Database

### Schema
Database schema lengkap: [docs/DATABASE-SCHEMA.md](docs/DATABASE-SCHEMA.md)

### Migrations
```bash
# Create new migration
npm run migrate:create -- --name create-users-table

# Run migrations
npm run migrate

# Rollback
npm run migrate:undo
```

### Seeders
```bash
# Create seeder
npm run seed:create -- --name demo-users

# Run seeders
npm run seed
```

## 📚 Documentation

### Setup & Deployment
- [Setup Node v20](docs/setup/SETUP-NODE-V20.md) - Cara install Node.js 20
- [Deployment Guide](docs/setup/DEPLOYMENT.md) - Deploy ke production

### Development Guides
- [Structure Rules](docs/guides/STRUCTURE-RULES.md) - Aturan struktur DDD
- [MySQL & Sequelize Guide](docs/guides/MYSQL-SEQUELIZE-GUIDE.md) - Database guide
- [Frontend Integration](docs/guides/FRONTEND-INTEGRATION-GUIDE.md) - Cara FE consume API
- [Testing Guide](docs/guides/TESTING-GUIDE.md) - Unit & integration testing
- [Swagger Testing Guide](docs/guides/SWAGGER-TESTING-GUIDE.md) - **Testing API tanpa clone repo!** 🧪
- [Payment Module Guide](docs/guides/PANDUAN-ANIN-PAYMENT.md) - Payment gateway integration
- [Database Team Guide](docs/guides/PANDUAN-TIM-DATABASE.md) - Database collaboration

### Module Documentation
- [Module Audit](docs/audit-modul.md) - Progress audit semua modul

## 🔐 Authentication

Semua protected endpoints membutuhkan JWT token:

```javascript
// Request header
Authorization: Bearer <your_jwt_token>

// Login untuk dapat token
POST /api/users/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

## 🧪 Testing

```bash
npm test                  # Run all tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:coverage     # Coverage report
```

## 📝 Code Style

- **ESLint** - Code linting
- **Prettier** - Code formatting
- Follow **Airbnb JavaScript Style Guide**
- Use **async/await** (no callbacks)
- Comprehensive error handling

## 🚦 Module Status

| Module | Status | Progress | Endpoints |
|--------|--------|----------|-----------|
| User Management | ✅ Complete | 100% | 8 |
| Admin Dashboard | ✅ Complete | 100% | 12 |
| Payment Gateway | ✅ Complete | 100% | 19 |
| Service Listing | 🔄 Skeleton | 15% | 9 |
| Order & Booking | 🔄 Skeleton | 0% | 8 |
| Review & Rating | 🔄 Skeleton | 0% | 8 |
| Chat & Notification | 🔄 Skeleton | 0% | 5 |
| Recommendation | 🔄 Skeleton | 0% | 5 |

**Total Progress: 38%**

Semua modul skeleton sudah dibuat dengan dokumentasi lengkap.
Tinggal implementasi business logic di use cases.

## 🐛 Troubleshooting

### Port sudah dipakai
```bash
# Cek process di port 5000
lsof -ti:5000

# Kill process
kill -9 $(lsof -ti:5000)

# Atau ganti port di .env
PORT=5001
```

### Database connection error
```bash
# Cek MySQL running
mysql -u root -p

# Cek credentials di .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
```

### Sequelize sync issues
```bash
# Drop & recreate database (development only!)
npm run migrate:undo:all
npm run migrate
npm run seed
```

## 📞 Support

Untuk pertanyaan atau issues, silakan buka GitHub Issues atau hubungi tim development.

---

**Happy Coding! 🚀**
