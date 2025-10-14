# SkillConnect Backend - Payment Gateway Module

## 🚀 Tech Stack
- **Node.js 20**
- **Express.js**
- **MongoDB** (Mongoose ODM)
- **Midtrans/Xendit** (Payment Gateway)
- **JWT** (Authentication)
- **Node-cron** (Scheduled Tasks)

## 📁 Architecture: Domain-Driven Design (DDD)

Struktur ini menggunakan **Domain-Driven Design** untuk memisahkan business logic, infrastructure, dan presentation layer.

```
backend/
├── src/
│   ├── modules/
│   │   └── payment/              # Payment Gateway Module
│   │       ├── domain/           # Business Logic & Entities
│   │       ├── application/      # Use Cases & Services
│   │       ├── infrastructure/   # External Services (DB, Payment Gateway)
│   │       └── presentation/     # Controllers & Routes
│   └── shared/
│       ├── config/               # Configuration Files
│       ├── middleware/           # Global Middleware
│       ├── utils/                # Helper Functions
│       └── database/             # Database Connection
├── tests/                        # Unit & Integration Tests
├── .env.example                  # Environment Variables Template
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Setup

### 1. Clone & Install
```bash
git clone <repo-url>
cd backend
npm install
```

### 2. Environment Variables
Copy `.env.example` ke `.env` dan isi dengan credentials:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

**Backend akan jalan di: `http://localhost:5000`**

## 📦 NPM Scripts
- `npm run dev` - Development mode dengan nodemon
- `npm start` - Production mode
- `npm test` - Run tests
- `npm run lint` - Check code quality

## 🔐 Environment Variables Required
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillconnect
JWT_SECRET=your_jwt_secret
MIDTRANS_SERVER_KEY=your_midtrans_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_email_api_key
```

## 📖 Module Structure - Payment Gateway

Setiap module mengikuti **DDD layers**:

### 1. **Domain Layer** (`domain/`)
- Entities (Payment, Transaction)
- Value Objects
- Domain Events
- Domain Services

### 2. **Application Layer** (`application/`)
- Use Cases (CreatePayment, VerifyPayment, GetPaymentHistory)
- DTOs (Data Transfer Objects)
- Interfaces

### 3. **Infrastructure Layer** (`infrastructure/`)
- Repository Implementation
- Payment Gateway Integration (Midtrans/Xendit)
- Database Models (Mongoose Schemas)
- External Services (Email, Storage)

### 4. **Presentation Layer** (`presentation/`)
- Controllers (Handle HTTP Requests)
- Routes (API Endpoints)
- Request Validation
- Response Formatters

## 🌐 API Endpoints (Payment Module)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create` | Membuat transaksi pembayaran baru |
| POST | `/api/payments/webhook` | Webhook dari payment gateway |
| GET | `/api/payments/history` | Riwayat pembayaran user |
| GET | `/api/payments/:id` | Detail pembayaran |
| GET | `/api/payments/earnings` | Dashboard penghasilan freelancer |
| POST | `/api/payments/export` | Ekspor laporan transaksi |

## 🧪 Testing
```bash
npm test                  # Run all tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:coverage    # Coverage report
```

## 📝 Code Style
- ESLint + Prettier
- Follow Airbnb JavaScript Style Guide
- Use async/await (no callbacks)
- Error handling dengan try-catch

## 🔗 Related Documentation
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Payment Gateway Integration](./docs/payment-gateway.md)
