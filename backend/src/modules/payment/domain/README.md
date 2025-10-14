# Domain Layer - Payment Module

## 📌 Apa itu Domain Layer?

**Domain Layer** adalah inti dari business logic aplikasi. Layer ini **tidak bergantung** pada infrastructure (database, API external, dll).

## 📂 Struktur Folder

```
domain/
├── entities/
│   ├── Payment.js           # Entity Payment
│   └── Transaction.js       # Entity Transaction
├── value-objects/
│   ├── Money.js             # Value Object untuk Amount
│   └── PaymentMethod.js     # Value Object untuk Payment Method
├── events/
│   └── PaymentCreatedEvent.js    # Domain Event
├── services/
│   └── PaymentDomainService.js   # Domain Service
└── repositories/
    └── IPaymentRepository.js     # Interface Repository (kontrak)
```

## 🧱 Entities

**Entity** adalah objek yang memiliki **identitas unik** (ID).

### Contoh: `Payment.js`
```javascript
class Payment {
  constructor(id, orderId, userId, amount, method, status) {
    this.id = id;
    this.orderId = orderId;
    this.userId = userId;
    this.amount = amount;
    this.method = method;
    this.status = status;
    this.createdAt = new Date();
  }

  // Business Logic
  isExpired() {
    const expiryTime = 24 * 60 * 60 * 1000; // 24 jam
    return Date.now() - this.createdAt > expiryTime;
  }

  markAsPaid() {
    if (this.status === 'pending') {
      this.status = 'success';
      return true;
    }
    return false;
  }
}

module.exports = Payment;
```

## 💎 Value Objects

**Value Object** adalah objek yang **tidak memiliki identitas**, hanya nilai.

### Contoh: `Money.js`
```javascript
class Money {
  constructor(amount, currency = 'IDR') {
    if (amount < 0) throw new Error('Amount tidak boleh negatif');
    this.amount = amount;
    this.currency = currency;
  }

  add(other) {
    if (this.currency !== other.currency) {
      throw new Error('Currency harus sama');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  format() {
    return `Rp ${this.amount.toLocaleString('id-ID')}`;
  }
}

module.exports = Money;
```

## 🎯 Domain Services

**Domain Service** berisi business logic yang **tidak cocok** di dalam Entity.

### Contoh: `PaymentDomainService.js`
```javascript
class PaymentDomainService {
  calculateFee(amount, method) {
    const feeRates = {
      bank_transfer: 0.005,  // 0.5%
      e-wallet: 0.01,        // 1%
      credit_card: 0.029,    // 2.9%
    };
    return amount * (feeRates[method] || 0);
  }

  validatePaymentMethod(method) {
    const validMethods = ['bank_transfer', 'e_wallet', 'credit_card', 'qris'];
    return validMethods.includes(method);
  }
}

module.exports = PaymentDomainService;
```

## 📢 Domain Events

**Domain Event** adalah sesuatu yang terjadi di domain dan perlu diketahui oleh bagian lain.

### Contoh: `PaymentCreatedEvent.js`
```javascript
class PaymentCreatedEvent {
  constructor(paymentId, orderId, amount) {
    this.eventName = 'PaymentCreated';
    this.paymentId = paymentId;
    this.orderId = orderId;
    this.amount = amount;
    this.occurredAt = new Date();
  }
}

module.exports = PaymentCreatedEvent;
```

## 🔌 Repository Interface

**Interface** mendefinisikan **kontrak** yang harus diimplementasi oleh Infrastructure Layer.

### Contoh: `IPaymentRepository.js`
```javascript
class IPaymentRepository {
  async save(payment) {
    throw new Error('Method save() harus diimplementasi');
  }

  async findById(id) {
    throw new Error('Method findById() harus diimplementasi');
  }

  async findByUserId(userId) {
    throw new Error('Method findByUserId() harus diimplementasi');
  }

  async update(payment) {
    throw new Error('Method update() harus diimplementasi');
  }
}

module.exports = IPaymentRepository;
```

## ✅ Prinsip Domain Layer

1. **Pure Business Logic** - Tidak ada dependency ke Express, MongoDB, dll
2. **Testable** - Mudah di-test karena tidak ada external dependency
3. **Reusable** - Bisa digunakan di CLI, API, atau job scheduler
4. **Independent** - Tidak bergantung pada framework atau library tertentu

## 🚀 Next Steps

Setelah membuat Domain Layer, lanjut ke:
1. **Application Layer** - Use Cases (CreatePayment, VerifyPayment, dll)
2. **Infrastructure Layer** - Implementasi Repository dengan MongoDB
3. **Presentation Layer** - Controllers dan Routes
