# SkillConnect - Marketplace Jasa dan Skill Lokal

Platform marketplace berbasis web yang menghubungkan freelancer dengan klien untuk berbagai jasa dan skill lokal.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Struktur Project](#-struktur-project)
- [8 Modul Aplikasi](#-8-modul-aplikasi)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Development Guide](#-development-guide)
- [Dokumentasi Tambahan](#-dokumentasi-tambahan)

---

## 🚀 Tech Stack

### Backend
- **Node.js 20** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **Sequelize** - ORM (Object-Relational Mapping)
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Midtrans/Xendit** - Payment gateway
- **Nodemailer** - Email service

### Frontend
- **React 18** - UI library
- **Tailwind CSS 3** - Styling
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Query** - Data fetching
- **Zustand** - State management
- **Socket.io Client** - Real-time chat

### Architecture
- **Backend**: Domain-Driven Design (DDD)
- **Frontend**: Atomic Design Pattern

---

## 📁 Struktur Project

```
SkillConnect/
├── backend/                # Node.js + Express (Port 5000)
│   ├── src/
│   │   ├── modules/        # 8 Modul DDD
│   │   │   ├── user/       # Modul 1: User Management
│   │   │   ├── service/    # Modul 2: Service Listing
│   │   │   ├── order/      # Modul 3: Order & Booking
│   │   │   ├── payment/    # Modul 4: Payment Gateway
│   │   │   ├── review/     # Modul 5: Review & Rating
│   │   │   ├── chat/       # Modul 6: Chat & Notification
│   │   │   ├── admin/      # Modul 7: Admin Dashboard
│   │   │   └── recommendation/  # Modul 8: Recommendation
│   │   ├── shared/         # Shared utilities
│   │   │   ├── config/
│   │   │   ├── middleware/
│   │   │   ├── utils/
│   │   │   └── database/
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── README.md
│
├── frontend/               # React + Tailwind (Port 3000)
│   ├── src/
│   │   ├── components/     # Atomic Design
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   ├── organisms/
│   │   │   └── templates/
│   │   ├── pages/
│   │   ├── services/       # API calls
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
│
└── README.md               # This file
```

---

## 🧩 8 Modul Aplikasi

### 1️⃣ Modul 1 - User Management

**Fitur:**
- Registrasi & Login
- Profil pengguna
- Reset password
- Role management (Client, Freelancer, Admin)

**Backend:** `backend/src/modules/user/`
**API Endpoints:**
- `POST /api/users/register` - Registrasi user baru
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get user profile (Private)
- `PUT /api/users/profile` - Update profile (Private)
- `POST /api/users/forgot-password` - Request reset password
- `POST /api/users/reset-password` - Reset password

**Frontend Service:** `frontend/src/services/authService.js`

**Dokumentasi:** [backend/src/modules/user/README.md](backend/src/modules/user/README.md)

---

### 2️⃣ Modul 2 - Service Listing & Search

**Fitur:**
- CRUD layanan (Freelancer)
- Pencarian & filter layanan
- Detail layanan
- Rekomendasi layanan populer

**Backend:** `backend/src/modules/service/`
**API Endpoints:**
- `POST /api/services` - Create service (Freelancer)
- `GET /api/services` - List services dengan filter (Public)
- `GET /api/services/:id` - Detail service (Public)
- `PUT /api/services/:id` - Update service (Freelancer)
- `DELETE /api/services/:id` - Delete service (Freelancer)
- `GET /api/services/popular` - Popular services (Public)
- `GET /api/services/search?q=...&category=...` - Search & filter

**Frontend Service:** `frontend/src/services/serviceService.js`

**Dokumentasi:** [backend/src/modules/service/README.md](backend/src/modules/service/README.md)

---

### 3️⃣ Modul 3 - Order & Booking System

**Fitur:**
- Buat order
- Accept/reject order (Freelancer)
- Tracking status order
- Complete order

**Backend:** `backend/src/modules/order/`
**API Endpoints:**
- `POST /api/orders` - Create order (Client)
- `GET /api/orders` - List user orders (Private)
- `GET /api/orders/:id` - Detail order (Private)
- `PUT /api/orders/:id/accept` - Accept order (Freelancer)
- `PUT /api/orders/:id/reject` - Reject order (Freelancer)
- `PUT /api/orders/:id/complete` - Complete order (Freelancer)
- `PUT /api/orders/:id/cancel` - Cancel order (Client)

**Frontend Service:** `frontend/src/services/orderService.js`

**Dokumentasi:** [backend/src/modules/order/README.md](backend/src/modules/order/README.md)

---

### 4️⃣ Modul 4 - Payment Gateway ⭐

**Fitur:**
- Pembayaran digital (Midtrans/Xendit)
- Multiple payment methods
- Verifikasi otomatis via webhook
- Invoice generation
- Riwayat pembayaran
- Dashboard penghasilan (Freelancer)

**Backend:** `backend/src/modules/payment/`
**API Endpoints:**
- `POST /api/payments/create` - Create payment (Client)
- `POST /api/payments/webhook` - Webhook dari payment gateway (Public)
- `GET /api/payments/history` - Payment history (Private)
- `GET /api/payments/:id` - Payment detail (Private)
- `GET /api/payments/earnings` - Earnings dashboard (Freelancer)
- `POST /api/payments/export` - Export transaction report (Admin)

**Frontend Service:** `frontend/src/services/paymentService.js`

**Dokumentasi:**
- [backend/src/modules/payment/README.md](backend/src/modules/payment/README.md)
- [SRS-Modul4-PaymentGateway.md](SRS-Modul4-PaymentGateway.md)
- [Presentasi-Modul4-PaymentGateway.md](Presentasi-Modul4-PaymentGateway.md)

---

### 5️⃣ Modul 5 - Review & Rating System

**Fitur:**
- Rating & review layanan
- Display rating di service
- Report review yang tidak pantas
- Admin moderation

**Backend:** `backend/src/modules/review/`
**API Endpoints:**
- `POST /api/reviews` - Create review (Client)
- `GET /api/reviews/service/:id` - Reviews untuk service (Public)
- `GET /api/reviews/freelancer/:id` - Reviews freelancer (Public)
- `PUT /api/reviews/:id` - Update review (Client)
- `DELETE /api/reviews/:id` - Delete review (Admin)
- `POST /api/reviews/:id/report` - Report review (Private)

**Frontend Service:** `frontend/src/services/reviewService.js`

**Dokumentasi:** [backend/src/modules/review/README.md](backend/src/modules/review/README.md)

---

### 6️⃣ Modul 6 - Chat & Notification System

**Fitur:**
- Real-time chat (Socket.io)
- Notifikasi order/payment
- Email notification
- Typing indicator
- Read receipts

**Backend:** `backend/src/modules/chat/`
**API Endpoints (REST):**
- `GET /api/chat/conversations` - List conversations (Private)
- `GET /api/chat/:conversationId/messages` - Get messages (Private)
- `PUT /api/chat/:conversationId/read` - Mark as read (Private)
- `GET /api/notifications` - Get notifications (Private)
- `PUT /api/notifications/:id/read` - Mark notification as read (Private)

**Socket.io Events:**
- `chat:send-message` - Send message
- `chat:new-message` - Receive message
- `chat:typing` - Typing indicator
- `notification:new` - New notification

**Frontend Service:** `frontend/src/services/chatService.js`

**Dokumentasi:** [backend/src/modules/chat/README.md](backend/src/modules/chat/README.md)

---

### 7️⃣ Modul 7 - Admin Dashboard & Analytics

**Fitur:**
- Dashboard statistik
- User management (block/unblock)
- Transaction analytics
- Revenue reports
- Fraud detection

**Backend:** `backend/src/modules/admin/`
**API Endpoints:**
- `GET /api/admin/dashboard?timeRange=today` - Dashboard stats (Admin)
- `GET /api/admin/analytics/revenue` - Revenue analytics (Admin)
- `GET /api/admin/analytics/users` - User analytics (Admin)
- `GET /api/admin/users` - List users (Admin)
- `PUT /api/admin/users/:id/block` - Block user (Admin)
- `PUT /api/admin/services/:id/block` - Block service (Admin)
- `POST /api/admin/reports/export` - Export report (Admin)
- `GET /api/admin/fraud-alerts` - Fraud alerts (Admin)

**Frontend Service:** `frontend/src/services/adminService.js`

**Dokumentasi:** [backend/src/modules/admin/README.md](backend/src/modules/admin/README.md)

---

### 8️⃣ Modul 8 - Recommendation & Personalization

**Fitur:**
- Personalized recommendations
- Similar services
- Favorites
- User preferences
- Recommendation analytics

**Backend:** `backend/src/modules/recommendation/`
**API Endpoints:**
- `GET /api/recommendations` - Personalized recommendations (Private)
- `GET /api/recommendations/similar/:serviceId` - Similar services (Public)
- `GET /api/recommendations/popular` - Popular services (Public)
- `POST /api/recommendations/favorites/:serviceId` - Add to favorites (Private)
- `DELETE /api/recommendations/favorites/:serviceId` - Remove favorite (Private)
- `GET /api/recommendations/favorites` - Get favorites (Private)

**Frontend Service:** `frontend/src/services/recommendationService.js`

**Dokumentasi:** [backend/src/modules/recommendation/README.md](backend/src/modules/recommendation/README.md)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MySQL 8.0+
- npm atau yarn

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Setup MySQL database
mysql -u root -p
CREATE DATABASE skillconnect;
EXIT;

# 4. Copy environment file
cp .env.example .env

# 5. Edit .env dengan MySQL credentials kamu
nano .env  # atau editor favorit

# 6. Run development server
npm run dev

# Backend akan jalan di: http://localhost:5000
```

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Edit .env
nano .env
# Set VITE_API_BASE_URL=http://localhost:5000/api

# 5. Run development server
npm run dev

# Frontend akan jalan di: http://localhost:3000
```

### Akses Aplikasi

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

---

## 📖 API Documentation

### Authentication

Semua endpoint yang bertanda **(Private)** membutuhkan JWT token:

```javascript
// Request Header
Authorization: Bearer <your_jwt_token>
```

### Standard Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // ... response data
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    // ... validation errors (optional)
  ]
}
```

### Pagination

Endpoints yang return list data support pagination:

```
GET /api/services?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## 👨‍💻 Development Guide

### Frontend: Cara Fetch Data dari Backend

**Contoh 1: Login User**
```javascript
// frontend/src/services/authService.js
import api from '../utils/axiosConfig';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    // response.data = { success: true, data: { token, user } }

    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  }
};
```

**Contoh 2: Get Services dengan Filter**
```javascript
// frontend/src/services/serviceService.js
import api from '../utils/axiosConfig';

export const serviceService = {
  getServices: async (filters = {}) => {
    const response = await api.get('/services', { params: filters });
    return response.data;
  }
};

// Usage di component
const { data, isLoading } = useQuery({
  queryKey: ['services', filters],
  queryFn: () => serviceService.getServices({
    category: 'design',
    minPrice: 100000,
    maxPrice: 500000,
    page: 1,
    limit: 10
  })
});
```

**Contoh 3: Create Payment**
```javascript
// frontend/src/services/paymentService.js
export const paymentService = {
  createPayment: async (paymentData) => {
    const response = await api.post('/payments/create', paymentData);
    // Redirect ke payment URL
    window.location.href = response.data.data.paymentUrl;
  }
};
```

**Contoh 4: Real-time Chat (Socket.io)**
```javascript
// frontend/src/services/chatService.js
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') }
});

// Listen new messages
socket.on('chat:new-message', (message) => {
  console.log('New message:', message);
});

// Send message
socket.emit('chat:send-message', {
  conversationId: 'conv_id',
  text: 'Hello!'
});
```

**📘 Dokumentasi Lengkap:** [backend/FRONTEND-INTEGRATION-GUIDE.md](backend/FRONTEND-INTEGRATION-GUIDE.md)

---

### Backend: Domain-Driven Design Structure

Setiap modul punya 4 layer:

```
modules/[nama-modul]/
├── domain/             # Business logic & entities
│   ├── entities/       # Domain entities
│   ├── value-objects/  # Value objects
│   ├── services/       # Domain services
│   └── repositories/   # Repository interfaces
├── application/        # Use cases
│   ├── use-cases/      # Business use cases
│   ├── dtos/           # Data transfer objects
│   └── interfaces/     # External service interfaces
├── infrastructure/     # External services & DB
│   ├── repositories/   # Repository implementations
│   ├── models/         # Sequelize models
│   └── services/       # External services (email, payment, etc)
└── presentation/       # API endpoints
    ├── controllers/    # Controllers
    ├── routes/         # Routes
    ├── middlewares/    # Middlewares
    └── validators/     # Request validators
```

**Aturan Penting:**
- ✅ **BOLEH** bikin subfolder di setiap layer
- ❌ **GABOLEH** bikin modul dalam modul
- ❌ **GABOLEH** ada business logic di Controller
- ✅ Business logic harus di Domain/Application layer

**Dokumentasi Lengkap:** [backend/STRUCTURE-RULES.md](backend/STRUCTURE-RULES.md)

---

### MySQL Database

**Connect ke MySQL:**
```bash
mysql -u root -p
USE skillconnect;

# Show tables
SHOW TABLES;

# Query data
SELECT * FROM users LIMIT 10;
```

**Sequelize Models:**

Contoh model taruh di `infrastructure/models/`:

```javascript
// backend/src/modules/payment/infrastructure/models/PaymentModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const Payment = sequelize.define('payments', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transaction_id: {
    type: DataTypes.STRING(255),
    unique: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed')
  }
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true
});

module.exports = Payment;
```

**Dokumentasi MySQL:** [backend/MYSQL-SEQUELIZE-GUIDE.md](backend/MYSQL-SEQUELIZE-GUIDE.md)

---

## 📚 Dokumentasi Tambahan

### Backend Documentation
- [Backend README](backend/README.md) - Setup & overview backend
- [Database Schema](backend/DATABASE-SCHEMA.md) - Complete database schema & relationships
- [Structure Rules](backend/STRUCTURE-RULES.md) - Aturan struktur DDD
- [MySQL Guide](backend/MYSQL-SEQUELIZE-GUIDE.md) - MySQL + Sequelize guide
- [Frontend Integration Guide](backend/FRONTEND-INTEGRATION-GUIDE.md) - Cara FE consume API

### Module-Specific Documentation
- [Payment Module SRS](SRS-Modul4-PaymentGateway.md) - Software Requirements Specification
- [Payment Module Presentation](Presentasi-Modul4-PaymentGateway.md) - Slide presentasi
- [Backlog](backlog.md) - Product backlog & sprint planning

### Frontend Documentation
- [Frontend README](frontend/README.md) - Setup & Atomic Design guide
- [Atoms Components](frontend/src/components/atoms/README.md) - Basic UI components
- [Molecules Components](frontend/src/components/molecules/README.md) - Combined components
- [Organisms Components](frontend/src/components/organisms/README.md) - Complex components
- [Templates](frontend/src/components/templates/README.md) - Layout templates
- [Pages](frontend/src/pages/README.md) - Complete pages
- [Services](frontend/src/services/README.md) - API integration layer
- [Hooks](frontend/src/hooks/README.md) - Custom React hooks
- [Utils](frontend/src/utils/README.md) - Utility functions

---

## 🗓️ Sprint Planning

### Sprint 3 (Week 5-6) - Core Features
**Modul:**
- ✅ User Management (Login, Register, Profile)
- ✅ Payment Gateway (Create payment, Webhook)

### Sprint 4 (Week 7-8) - Service & Transactions
**Modul:**
- ⏳ Service Listing (CRUD, Search, Filter)
- ⏳ Order System (Create, Accept, Tracking)
- ⏳ Payment History & Invoice

### Sprint 5 (Week 9-10) - Engagement
**Modul:**
- ⏳ Review & Rating
- ⏳ Chat & Notification (Socket.io)

### Sprint 6 (Week 11-12) - Admin & Polish
**Modul:**
- ⏳ Admin Dashboard
- ⏳ Recommendation System
- ⏳ Testing & Bug fixing

---

## 🤝 Contribution Guide

### Branch Strategy
```
main          # Production-ready code
└── dev       # Development branch
    ├── feature/user-management
    ├── feature/payment-gateway
    └── feature/chat-system
```

### Workflow
1. Clone repo: `git clone <repo-url>`
2. Create feature branch: `git checkout -b feature/module-name`
3. Develop & commit: `git commit -m "feat: add payment gateway"`
4. Push: `git push origin feature/module-name`
5. Create Pull Request ke `dev` branch

### Commit Convention
```
feat: New feature
fix: Bug fix
docs: Documentation
style: Code style (formatting)
refactor: Code refactoring
test: Add tests
chore: Maintenance tasks
```

---

## 🐛 Troubleshooting

### Backend tidak bisa connect ke MySQL

**Windows (Laragon):**
```bash
# Start Laragon dan pastikan MySQL running
# Buka Laragon > Start All

# Test connection
mysql -u root -p
# Password default Laragon biasanya kosong atau "root"
```

**MacOS:**
```bash
# Cek MySQL running
brew services list

# Start MySQL jika belum running
brew services start mysql

# Test connection
mysql -u root -p
```

**Linux:**
```bash
# Cek MySQL status
sudo systemctl status mysql

# Start MySQL jika belum running
sudo systemctl start mysql

# Test connection
mysql -u root -p
```

### Port 5000 sudah dipakai
```bash
# Edit .env
PORT=5001
```

### Frontend tidak bisa hit API
```bash
# Cek CORS settings di backend
# Pastikan FRONTEND_URL di .env sesuai

# Cek .env frontend
VITE_API_BASE_URL=http://localhost:5000/api
```

### Sequelize models tidak sync
```bash
# Force sync (development only!)
# Edit connection.js: sequelize.sync({ force: true })
# WARNING: Ini akan drop semua tables!
```

---

## 📞 Support & Contact

**Project Repository:** [GitHub Link]
**Documentation:** [Wiki Link]
**Issue Tracker:** [GitHub Issues]

**Team:**
- Product Owner: [Name]
- Scrum Master: [Name]
- Backend Lead: [Name]
- Frontend Lead: [Name]

---

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🚀**

Capstone Project - Teknik Informatika Semester 7
