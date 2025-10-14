# Modul 1 - User Management

## 📋 Deskripsi
Modul untuk mengelola autentikasi, registrasi, login, profil pengguna, dan reset password.

## 🎯 User Stories
- **UM-1**: Registrasi akun pengguna baru
- **UM-2**: Login dan logout pengguna
- **UM-3**: Update profil pengguna
- **UM-4**: Reset password
- **UM-5**: Nonaktifkan akun (admin)
- **UM-6**: Validasi & keamanan data pengguna

## 📂 Struktur DDD

```
user/
├── domain/
│   ├── entities/
│   │   └── User.js              # Entity User (id, email, password, role)
│   ├── value-objects/
│   │   ├── Email.js             # Value Object untuk validasi email
│   │   └── Password.js          # Value Object untuk validasi password
│   └── repositories/
│       └── IUserRepository.js   # Interface Repository
├── application/
│   ├── use-cases/
│   │   ├── RegisterUser.js      # Use Case: Registrasi user
│   │   ├── LoginUser.js         # Use Case: Login user
│   │   ├── UpdateProfile.js     # Use Case: Update profil
│   │   ├── ResetPassword.js     # Use Case: Reset password
│   │   └── DeactivateUser.js    # Use Case: Nonaktifkan akun
│   └── dtos/
│       ├── RegisterDto.js
│       └── LoginDto.js
├── infrastructure/
│   ├── repositories/
│   │   └── MongoUserRepository.js
│   ├── models/
│   │   └── UserModel.js         # Mongoose Schema
│   └── services/
│       ├── JwtService.js        # Generate & verify JWT token
│       └── HashService.js       # Bcrypt hash password
└── presentation/
    ├── controllers/
    │   └── UserController.js
    ├── routes/
    │   └── userRoutes.js
    └── middlewares/
        └── authMiddleware.js
```

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register` | Registrasi user baru | Public |
| POST | `/api/users/login` | Login user | Public |
| GET | `/api/users/profile` | Get profil user | Private |
| PUT | `/api/users/profile` | Update profil | Private |
| POST | `/api/users/forgot-password` | Request reset password | Public |
| POST | `/api/users/reset-password` | Reset password dengan token | Public |
| DELETE | `/api/users/:id/deactivate` | Nonaktifkan akun | Admin |

## 🔐 Authentication Flow

```
Client → POST /api/users/login (email, password)
    ↓
LoginUser Use Case
    ↓
Verify credentials (bcrypt)
    ↓
Generate JWT Token
    ↓
Return { token, user }
```

## 📦 Database Schema (UserModel)

```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  role: Enum ['client', 'freelancer', 'admin'],
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String,
    bio: String
  },
  isActive: Boolean (default: true),
  emailVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 💡 Tips Implementasi

### Hash Password (infrastructure/services/HashService.js)
```javascript
const bcrypt = require('bcrypt');

class HashService {
  async hash(password) {
    return await bcrypt.hash(password, 10);
  }

  async compare(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
```

### JWT Token (infrastructure/services/JwtService.js)
```javascript
const jwt = require('jsonwebtoken');

class JwtService {
  generate(userId, role) {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}
```

## 🚀 Frontend Integration

### Register
```javascript
POST /api/users/register
Body: {
  email: "user@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
  role: "client"
}
Response: {
  success: true,
  data: { userId, email, role }
}
```

### Login
```javascript
POST /api/users/login
Body: { email, password }
Response: {
  success: true,
  data: {
    token: "jwt_token_here",
    user: { id, email, role, profile }
  }
}
// Simpan token di localStorage
localStorage.setItem('token', data.token);
```
