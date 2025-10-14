# Application Layer - Payment Module

## 📌 Apa itu Application Layer?

**Application Layer** berisi **Use Cases** (business flow) aplikasi. Layer ini mengkoordinasikan Domain Layer dan Infrastructure Layer.

## 📂 Struktur Folder

```
application/
├── use-cases/
│   ├── CreatePayment.js         # Use Case: Buat payment baru
│   ├── VerifyPayment.js         # Use Case: Verifikasi payment dari webhook
│   ├── GetPaymentHistory.js     # Use Case: Ambil riwayat payment
│   ├── GetEarnings.js           # Use Case: Ambil penghasilan freelancer
│   └── ExportReport.js          # Use Case: Ekspor laporan transaksi
├── dtos/
│   ├── CreatePaymentDto.js      # Data Transfer Object
│   └── PaymentResponseDto.js    # Response DTO
└── interfaces/
    └── IPaymentGateway.js       # Interface Payment Gateway
```

## 🎯 Use Cases

**Use Case** adalah skenario bisnis yang dilakukan user. Setiap use case adalah **satu aksi utama**.

### Contoh: `CreatePayment.js`

```javascript
class CreatePayment {
  constructor(paymentRepository, paymentGateway, orderRepository) {
    this.paymentRepository = paymentRepository;
    this.paymentGateway = paymentGateway;
    this.orderRepository = orderRepository;
  }

  async execute(dto) {
    // 1. Validasi order exists
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) throw new Error('Order tidak ditemukan');

    // 2. Validasi order belum dibayar
    if (order.isPaid) throw new Error('Order sudah dibayar');

    // 3. Buat entity Payment (Domain)
    const payment = new Payment({
      orderId: dto.orderId,
      userId: dto.userId,
      amount: new Money(dto.amount, 'IDR'),
      method: dto.method,
      status: 'pending'
    });

    // 4. Request ke Payment Gateway
    const gatewayResponse = await this.paymentGateway.createTransaction({
      amount: payment.amount.amount,
      orderId: payment.orderId,
      method: payment.method
    });

    payment.transactionId = gatewayResponse.transactionId;
    payment.paymentUrl = gatewayResponse.paymentUrl;

    // 5. Simpan ke database
    await this.paymentRepository.save(payment);

    // 6. Return response
    return {
      paymentId: payment.id,
      transactionId: payment.transactionId,
      paymentUrl: payment.paymentUrl,
      expiresAt: payment.expiresAt
    };
  }
}

module.exports = CreatePayment;
```

### Contoh: `VerifyPayment.js`

```javascript
class VerifyPayment {
  constructor(paymentRepository, paymentGateway, orderRepository, eventBus) {
    this.paymentRepository = paymentRepository;
    this.paymentGateway = paymentGateway;
    this.orderRepository = orderRepository;
    this.eventBus = eventBus;
  }

  async execute(webhookData) {
    // 1. Validasi signature webhook
    const isValid = this.paymentGateway.validateSignature(webhookData);
    if (!isValid) throw new Error('Invalid signature');

    // 2. Ambil payment dari DB
    const payment = await this.paymentRepository.findByTransactionId(
      webhookData.transactionId
    );
    if (!payment) throw new Error('Payment tidak ditemukan');

    // 3. Update status payment
    payment.updateStatus(webhookData.status);
    await this.paymentRepository.update(payment);

    // 4. Jika success, update order status
    if (webhookData.status === 'success') {
      const order = await this.orderRepository.findById(payment.orderId);
      order.markAsPaid();
      await this.orderRepository.update(order);

      // 5. Trigger event untuk generate invoice
      this.eventBus.publish(new PaymentSuccessEvent(payment));
    }

    return { success: true };
  }
}

module.exports = VerifyPayment;
```

### Contoh: `GetPaymentHistory.js`

```javascript
class GetPaymentHistory {
  constructor(paymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async execute(userId, filters = {}) {
    // 1. Ambil payment history dari repository
    const payments = await this.paymentRepository.findByUserId(userId, {
      status: filters.status,
      startDate: filters.startDate,
      endDate: filters.endDate,
      page: filters.page || 1,
      limit: filters.limit || 10
    });

    // 2. Transform ke DTO
    return payments.map(payment => ({
      paymentId: payment.id,
      orderId: payment.orderId,
      amount: payment.amount.format(),
      method: payment.method,
      status: payment.status,
      createdAt: payment.createdAt
    }));
  }
}

module.exports = GetPaymentHistory;
```

## 📦 DTOs (Data Transfer Objects)

**DTO** digunakan untuk **transfer data** antar layer tanpa expose internal structure.

### Contoh: `CreatePaymentDto.js`

```javascript
class CreatePaymentDto {
  constructor(data) {
    this.orderId = data.orderId;
    this.userId = data.userId;
    this.amount = data.amount;
    this.method = data.method;
  }

  validate() {
    if (!this.orderId) throw new Error('Order ID required');
    if (!this.userId) throw new Error('User ID required');
    if (this.amount <= 0) throw new Error('Amount harus lebih dari 0');
    if (!['bank_transfer', 'e_wallet', 'credit_card', 'qris'].includes(this.method)) {
      throw new Error('Payment method tidak valid');
    }
    return true;
  }
}

module.exports = CreatePaymentDto;
```

### Contoh: `PaymentResponseDto.js`

```javascript
class PaymentResponseDto {
  static fromEntity(payment) {
    return {
      paymentId: payment.id,
      transactionId: payment.transactionId,
      orderId: payment.orderId,
      amount: payment.amount.format(),
      method: payment.method,
      status: payment.status,
      paymentUrl: payment.paymentUrl,
      createdAt: payment.createdAt,
      expiresAt: payment.expiresAt
    };
  }

  static fromEntityList(payments) {
    return payments.map(p => this.fromEntity(p));
  }
}

module.exports = PaymentResponseDto;
```

## 🔌 Interfaces

**Interface** mendefinisikan kontrak untuk external services.

### Contoh: `IPaymentGateway.js`

```javascript
class IPaymentGateway {
  async createTransaction(data) {
    throw new Error('Method createTransaction() harus diimplementasi');
  }

  async checkStatus(transactionId) {
    throw new Error('Method checkStatus() harus diimplementasi');
  }

  validateSignature(webhookData) {
    throw new Error('Method validateSignature() harus diimplementasi');
  }
}

module.exports = IPaymentGateway;
```

## 🔄 Flow Diagram Use Case

```
User Request → Controller (Presentation)
                    ↓
              Use Case (Application)
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
   Domain Logic          Infrastructure
   (Entities,            (Repository,
   Services)             Payment Gateway)
        ↓                       ↓
        └───────────┬───────────┘
                    ↓
              Response DTO
```

## ✅ Prinsip Application Layer

1. **Orchestration** - Mengkoordinasi Domain dan Infrastructure
2. **Use Case per Action** - Satu use case = satu business action
3. **No Business Logic** - Business logic ada di Domain Layer
4. **DTO untuk Transfer** - Gunakan DTO untuk input/output
5. **Interface untuk Dependency** - Gunakan interface, bukan konkrit class

## 🚀 Next Steps

Setelah membuat Application Layer, lanjut ke:
1. **Infrastructure Layer** - Implementasi Repository dan Payment Gateway
2. **Presentation Layer** - Controllers yang memanggil Use Cases
