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
│   │   └── SequelizeUserRepository.js
│   ├── models/
│   │   └── UserModel.js         # Sequelize Model
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

## 📦 Database Schema

### 1. `users` (Main User Table)

```javascript
// Sequelize Model Definition
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('client', 'freelancer', 'admin'),
      defaultValue: 'client'
    },
    nama_depan: DataTypes.STRING(100),
    nama_belakang: DataTypes.STRING(100),
    no_telepon: DataTypes.STRING(20),
    avatar: DataTypes.STRING(255),
    bio: DataTypes.TEXT,
    kota: DataTypes.STRING(100),
    provinsi: DataTypes.STRING(100),
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    email_verified_at: DataTypes.DATE
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['role'] }
    ]
  });

  return User;
};
```

### 2. `user_tokens` (Email Verification & Password Reset)

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserToken = sequelize.define('user_tokens', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('email_verification', 'password_reset'),
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used_at: DataTypes.DATE
  }, {
    timestamps: true,
    underscored: true,
    updatedAt: false,
    indexes: [
      { fields: ['token'] },
      { fields: ['user_id'] }
    ]
  });

  return UserToken;
};
```

### 3. `profil_freelancer` (Freelancer Extended Profile)

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FreelancerProfile = sequelize.define('profil_freelancer', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.CHAR(36),
      unique: true,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    judul_profesi: DataTypes.STRING(255),
    keahlian: DataTypes.JSON,
    portfolio_url: DataTypes.STRING(255),
    total_pekerjaan_selesai: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rating_rata_rata: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0
    },
    total_ulasan: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] }
    ]
  });

  return FreelancerProfile;
};
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
