# 📁 Backend Structure Rules - Domain-Driven Design

## ⚠️ ATURAN PENTING

### 1. **BOLEH Bikin Subfolder di:**
- ✅ **domain/** - Boleh bikin subfolder `entities/`, `value-objects/`, `services/`, `events/`, `repositories/`
- ✅ **application/** - Boleh bikin subfolder `use-cases/`, `dtos/`, `interfaces/`
- ✅ **infrastructure/** - Boleh bikin subfolder `repositories/`, `models/`, `services/`, `payment-gateways/`, dll
- ✅ **presentation/** - Boleh bikin subfolder `controllers/`, `routes/`, `middlewares/`, `validators/`

### 2. **GABOLEH Bikin Modul Dalam Modul**
❌ **JANGAN** bikin struktur kayak gini:
```
modules/
└── payment/
    ├── domain/
    ├── application/
        └── user/  ❌ SALAH! Ini bikin modul dalam modul
```

✅ **HARUS** kayak gini:
```
modules/
├── payment/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
└── user/  ✅ BENAR! Sejajar dengan payment
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── presentation/
```

### 3. **Setiap Modul HARUS Punya 4 Layer**
```
module-name/
├── domain/         # Business logic
├── application/    # Use cases
├── infrastructure/ # External services
└── presentation/   # API endpoints
```

Keempat folder ini **WAJIB** ada, ga boleh dikurangi atau diganti nama!

---

## 📂 Struktur Detail Per Layer

### **Domain Layer** (`domain/`)
```
domain/
├── entities/         # Main business entities
│   ├── User.js
│   └── Order.js
├── value-objects/    # Immutable value objects
│   ├── Email.js
│   └── Money.js
├── services/         # Domain services (business logic yang ga cocok di entity)
│   └── PriceCalculator.js
├── events/           # Domain events
│   └── OrderCreatedEvent.js
└── repositories/     # Interface untuk repository (kontrak)
    └── IUserRepository.js
```

**Aturan Domain Layer:**
- ✅ Boleh bikin subfolder sesuai kebutuhan (entities, value-objects, dll)
- ✅ Boleh bikin file helper di subfolder
- ❌ GABOLEH import Express, Mongoose, atau library external
- ❌ GABOLEH akses database langsung

---

### **Application Layer** (`application/`)
```
application/
├── use-cases/        # Business use cases
│   ├── CreateUser.js
│   ├── LoginUser.js
│   └── UpdateProfile.js
├── dtos/             # Data Transfer Objects
│   ├── CreateUserDto.js
│   └── UserResponseDto.js
└── interfaces/       # Interfaces untuk external services
    ├── IEmailService.js
    └── IPaymentGateway.js
```

**Aturan Application Layer:**
- ✅ Boleh bikin subfolder `use-cases/`, `dtos/`, `interfaces/`
- ✅ Use case file naming: `VerbNoun.js` (CreateUser, DeleteOrder, GetPaymentHistory)
- ❌ GABOLEH ada business logic di sini (business logic di Domain)
- ❌ GABOLEH import Controller atau Express

---

### **Infrastructure Layer** (`infrastructure/`)
```
infrastructure/
├── repositories/            # Implementation repository
│   └── MongoUserRepository.js
├── models/                  # Database schemas
│   └── UserModel.js
├── services/                # External service implementations
│   ├── SendGridEmailService.js
│   ├── JwtService.js
│   └── HashService.js
├── payment-gateways/        # Payment gateway implementations
│   ├── MidtransGateway.js
│   └── XenditGateway.js
└── event-handlers/          # Domain event handlers
    └── SendWelcomeEmailHandler.js
```

**Aturan Infrastructure Layer:**
- ✅ Boleh bikin subfolder sebanyak yang diperlukan
- ✅ Boleh import library external (Mongoose, Axios, Nodemailer, dll)
- ✅ Implementasi interface dari Domain/Application Layer
- ❌ GABOLEH ada business logic (sudah di Domain)

---

### **Presentation Layer** (`presentation/`)
```
presentation/
├── controllers/      # Handle HTTP requests
│   ├── UserController.js
│   └── AuthController.js
├── routes/           # API route definitions
│   └── userRoutes.js
├── middlewares/      # Request middlewares
│   ├── authMiddleware.js
│   └── validateRequest.js
└── validators/       # Request validation schemas
    └── userValidators.js
```

**Aturan Presentation Layer:**
- ✅ Boleh bikin subfolder `controllers/`, `routes/`, `middlewares/`, `validators/`
- ✅ Boleh import Express
- ✅ Controller hanya handle HTTP request/response, panggil Use Case
- ❌ GABOLEH ada business logic di Controller

---

## 🗂️ Shared Folder

```
src/shared/
├── config/           # Configuration files
│   ├── database.js
│   └── env.js
├── middleware/       # Global middlewares
│   ├── errorHandler.js
│   ├── authMiddleware.js
│   └── rateLimiter.js
├── utils/            # Helper functions
│   ├── logger.js
│   ├── formatDate.js
│   └── generateId.js
└── database/         # Database connection setup
    └── connection.js
```

**Aturan Shared Folder:**
- ✅ **Boleh bikin subfolder** di `shared/`
- ✅ Untuk utility yang dipakai **lebih dari 1 modul**
- ❌ Jangan taruh logic spesifik satu modul di sini

**Kapan Pakai Shared?**
- Middleware authentication → `shared/middleware/authMiddleware.js` (dipakai semua modul)
- Logger → `shared/utils/logger.js` (dipakai semua modul)
- Format currency → Kalau cuma modul payment yang pakai, taruh di `infrastructure/services/` aja

---

## 🎯 Naming Conventions

### File Naming
```
✅ PascalCase untuk Classes & Entities:
   - User.js
   - CreateOrder.js
   - PaymentGateway.js

✅ camelCase untuk utility functions:
   - formatCurrency.js
   - validateEmail.js

✅ kebab-case untuk config:
   - database-config.js
```

### Folder Naming
```
✅ Lowercase dengan dash:
   - use-cases/
   - value-objects/
   - payment-gateways/

❌ JANGAN pakai camelCase atau PascalCase untuk folder
```

---

## ❓ FAQ

### Q: Boleh ga bikin folder `helpers/` di dalam `domain/`?
**A:** ✅ **Boleh**, tapi pastikan helper itu pure business logic, ga ada dependency external.

### Q: Boleh ga bikin folder `types/` di dalam `application/`?
**A:** ✅ **Boleh**, kalau pakai TypeScript. Tapi karena ini Node.js biasa, lebih baik pakai `dtos/`.

### Q: Boleh ga bikin file langsung di `domain/` tanpa subfolder?
**A:** ❌ **Tidak disarankan**. Selalu pakai subfolder biar terstruktur (`entities/`, `services/`, dll).

### Q: Module `payment` perlu akses entity `User` dari module `user`, gimana?
**A:** ✅ **Boleh import entity dari module lain**:
```javascript
// Di payment/domain/entities/Payment.js
const User = require('../../../user/domain/entities/User');
```

Tapi **lebih baik** lewat Repository/Use Case di Application Layer:
```javascript
// Di payment/application/use-cases/CreatePayment.js
const userRepository = new UserRepository();
const user = await userRepository.findById(userId);
```

### Q: Shared folder itu untuk apa? Kapan pakainya?
**A:** Shared folder untuk **utility yang dipakai banyak modul**:
- ✅ Auth middleware (semua modul butuh)
- ✅ Error handler (global)
- ✅ Logger (semua modul pakai)
- ❌ Payment logic (cuma modul payment yang pakai, jangan taruh di shared)

---

## 🚫 Anti-Pattern (JANGAN LAKUKAN INI!)

### ❌ Business Logic di Controller
```javascript
// SALAH!
class UserController {
  async register(req, res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword
    });
    res.json({ user });
  }
}
```

### ✅ Business Logic di Use Case
```javascript
// BENAR!
class UserController {
  async register(req, res) {
    const result = await this.registerUserUseCase.execute(req.body);
    res.json(result);
  }
}

// Di application/use-cases/RegisterUser.js
class RegisterUser {
  async execute(data) {
    const hashedPassword = await this.hashService.hash(data.password);
    const user = await this.userRepository.save({ ...data, password: hashedPassword });
    return user;
  }
}
```

---

## 📝 Checklist Sebelum Push

- [ ] Setiap modul punya 4 folder: `domain/`, `application/`, `infrastructure/`, `presentation/`
- [ ] Tidak ada folder kosong (ada `.gitkeep` atau file)
- [ ] Business logic ada di `domain/` atau `application/use-cases/`
- [ ] Controller hanya handle HTTP, ga ada logic
- [ ] Repository implementation ada di `infrastructure/repositories/`
- [ ] Mongoose Schema ada di `infrastructure/models/`
- [ ] Routes ada di `presentation/routes/`
- [ ] Tidak ada duplikasi code (kalau ada, pindahkan ke `shared/`)

---

## 🎓 Kesimpulan

### BOLEH ✅
1. Bikin subfolder di `domain/`, `application/`, `infrastructure/`, `presentation/`
2. Bikin subfolder di `shared/`
3. Import entity dari modul lain
4. Bikin helper/utility di dalam modul (kalau cuma modul itu yang pakai)

### GABOLEH ❌
1. Bikin modul dalam modul
2. Business logic di Controller
3. Import Express di Domain Layer
4. Akses database langsung di Domain Layer
5. Bikin folder selain 4 layer utama di root modul

**Prinsip Utama:** Setiap modul **mandiri** dengan 4 layer DDD yang **jelas tanggung jawabnya**.

---

**Happy Coding! 🚀**
