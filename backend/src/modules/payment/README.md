# Modul 4 - Payment Gateway

## 📋 Deskripsi
Modul untuk mengelola pembayaran digital melalui payment gateway (Midtrans/Xendit), verifikasi otomatis, riwayat transaksi, dan invoice.

## 🎯 User Stories
- **P-1**: Pembayaran digital (Midtrans/Xendit)
- **P-2**: Verifikasi status pembayaran otomatis
- **P-3**: Lihat riwayat pembayaran
- **P-4**: Freelancer melihat penghasilan
- **P-5**: Admin unduh laporan transaksi
- **P-6**: Sistem kirim invoice otomatis

## 📂 Struktur DDD

```
payment/
├── domain/
│   ├── entities/
│   │   ├── Payment.js           # Entity Payment
│   │   └── PaymentMethod.js     # Entity metode pembayaran
│   ├── value-objects/
│   │   ├── Amount.js            # Value Object jumlah
│   │   └── PaymentStatus.js     # Value Object status
│   └── repositories/
│       └── IPaymentRepository.js
├── application/
│   ├── use-cases/
│   │   ├── CreatePayment.js     # Buat pembayaran baru
│   │   ├── VerifyPayment.js     # Verifikasi webhook
│   │   ├── GetPaymentHistory.js # Riwayat pembayaran
│   │   ├── GetFreelancerEarnings.js # Penghasilan freelancer
│   │   └── GenerateInvoice.js   # Generate invoice PDF
│   └── dtos/
│       ├── CreatePaymentDto.js
│       └── PaymentResponseDto.js
├── infrastructure/
│   ├── repositories/
│   │   └── SequelizePaymentRepository.js
│   ├── models/
│   │   ├── PaymentModel.js      # Sequelize Model
│   │   └── PaymentMethodModel.js
│   └── services/
│       ├── MidtransService.js   # Integrasi Midtrans
│       ├── XenditService.js     # Integrasi Xendit
│       └── InvoiceService.js    # Generate invoice
└── presentation/
    ├── controllers/
    │   └── PaymentController.js
    └── routes/
        └── paymentRoutes.js
```

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments/create` | Buat pembayaran baru | Client |
| POST | `/api/payments/webhook` | Webhook dari payment gateway | Public |
| GET | `/api/payments/:id` | Detail pembayaran | Private |
| GET | `/api/payments/history` | Riwayat pembayaran user | Private |
| GET | `/api/payments/earnings` | Penghasilan freelancer | Freelancer |
| GET | `/api/payments/:id/invoice` | Download invoice PDF | Private |
| GET | `/api/payments/admin/transactions` | Laporan transaksi (admin) | Admin |

## 💳 Payment Gateway Integration

### Midtrans
```javascript
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY
});

// Create transaction
const transaction = await snap.createTransaction({
  transaction_details: {
    order_id: orderId,
    gross_amount: amount
  },
  customer_details: {
    email: user.email,
    first_name: user.nama_depan
  }
});

// Get payment URL
const paymentUrl = transaction.redirect_url;
```

### Xendit
```javascript
const Xendit = require('xendit-node');
const x = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY
});

const { Invoice } = x;
const invoiceSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);

// Create invoice
const resp = await i.createInvoice({
  externalID: orderId,
  amount: amount,
  payerEmail: user.email,
  description: `Payment for order ${orderId}`
});

// Get payment URL
const paymentUrl = resp.invoice_url;
```

## 📦 Database Schema (PaymentModel)

```javascript
// Sequelize Model Definition
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('pembayaran', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    pesanan_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'pesanan', key: 'id' }
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    transaction_id: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    external_id: DataTypes.STRING(255),
    jumlah: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    biaya_platform: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    biaya_payment_gateway: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    total_bayar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    metode_pembayaran: {
      type: DataTypes.ENUM(
        'transfer_bank',
        'e_wallet',
        'kartu_kredit',
        'qris',
        'virtual_account'
      ),
      allowNull: false
    },
    channel: DataTypes.STRING(100),
    payment_gateway: {
      type: DataTypes.ENUM('midtrans', 'xendit', 'manual'),
      allowNull: false
    },
    payment_url: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('menunggu', 'berhasil', 'gagal', 'kadaluarsa'),
      defaultValue: 'menunggu'
    },
    callback_data: DataTypes.JSON,
    callback_signature: DataTypes.STRING(500),
    nomor_invoice: {
      type: DataTypes.STRING(50),
      unique: true
    },
    invoice_url: DataTypes.STRING(255),
    dibayar_pada: DataTypes.DATE,
    kadaluarsa_pada: DataTypes.DATE
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['transaction_id'] },
      { fields: ['pesanan_id'] },
      { fields: ['status'] }
    ]
  });

  return Payment;
};
```

### 2. `metode_pembayaran` (Saved Payment Methods)

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaymentMethod = sequelize.define('metode_pembayaran', {
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
    tipe: {
      type: DataTypes.ENUM('rekening_bank', 'e_wallet', 'kartu_kredit'),
      allowNull: false
    },
    provider: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nomor_rekening: DataTypes.STRING(50),
    nama_pemilik: DataTypes.STRING(255),
    empat_digit_terakhir: DataTypes.STRING(4),
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] }
    ]
  });

  return PaymentMethod;
};
```

## 💡 Tips Implementasi

### Create Payment Use Case
```javascript
class CreatePayment {
  constructor(paymentRepository, orderRepository, midtransService) {
    this.paymentRepository = paymentRepository;
    this.orderRepository = orderRepository;
    this.midtransService = midtransService;
  }

  async execute(dto) {
    // 1. Validasi order
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) throw new Error('Order not found');
    if (order.status !== 'diterima') {
      throw new Error('Order must be accepted first');
    }

    // 2. Generate transaction ID
    const transactionId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 3. Calculate fees
    const amount = order.total_bayar;
    const platformFee = amount * 0.05; // 5% platform fee
    const gatewayFee = amount * 0.02;  // 2% gateway fee
    const total = amount + platformFee + gatewayFee;

    // 4. Create payment entity
    const payment = new Payment({
      pesanan_id: dto.orderId,
      user_id: dto.userId,
      transaction_id: transactionId,
      jumlah: amount,
      biaya_platform: platformFee,
      biaya_payment_gateway: gatewayFee,
      total_bayar: total,
      metode_pembayaran: dto.paymentMethod,
      payment_gateway: 'midtrans',
      status: 'menunggu'
    });

    // 5. Create payment via Midtrans
    const midtransResponse = await this.midtransService.createTransaction({
      order_id: transactionId,
      gross_amount: total,
      customer: {
        email: order.client.email,
        first_name: order.client.nama_depan
      }
    });

    payment.payment_url = midtransResponse.redirect_url;
    payment.external_id = midtransResponse.token;

    // 6. Save payment
    await this.paymentRepository.save(payment);

    return {
      paymentId: payment.id,
      paymentUrl: payment.payment_url,
      amount: total
    };
  }
}
```

### Verify Payment Webhook
```javascript
class VerifyPayment {
  constructor(paymentRepository, orderRepository) {
    this.paymentRepository = paymentRepository;
    this.orderRepository = orderRepository;
  }

  async execute(webhookData) {
    // 1. Verify signature
    const isValid = this.verifySignature(webhookData);
    if (!isValid) throw new Error('Invalid signature');

    // 2. Get payment
    const payment = await this.paymentRepository.findByTransactionId(
      webhookData.order_id
    );
    if (!payment) throw new Error('Payment not found');

    // 3. Update payment status
    const status = this.mapStatus(webhookData.transaction_status);
    payment.status = status;
    payment.callback_data = webhookData;
    payment.callback_signature = webhookData.signature_key;

    if (status === 'berhasil') {
      payment.dibayar_pada = new Date();

      // 4. Update order status
      const order = await this.orderRepository.findById(payment.pesanan_id);
      order.markAsPaid();
      order.startWork(); // Change to 'dikerjakan'
      await this.orderRepository.update(order);

      // 5. Generate invoice
      payment.nomor_invoice = this.generateInvoiceNumber(payment.id);
      await this.invoiceService.generate(payment);
    }

    await this.paymentRepository.update(payment);

    return { success: true };
  }

  verifySignature(data) {
    const crypto = require('crypto');
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const signatureKey = data.signature_key;

    const hash = crypto
      .createHash('sha512')
      .update(`${data.order_id}${data.status_code}${data.gross_amount}${serverKey}`)
      .digest('hex');

    return hash === signatureKey;
  }

  mapStatus(midtransStatus) {
    const statusMap = {
      'capture': 'berhasil',
      'settlement': 'berhasil',
      'pending': 'menunggu',
      'deny': 'gagal',
      'cancel': 'gagal',
      'expire': 'kadaluarsa'
    };
    return statusMap[midtransStatus] || 'gagal';
  }

  generateInvoiceNumber(paymentId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `INV/${year}/${month}/${paymentId.substr(0, 8).toUpperCase()}`;
  }
}
```

### Get Freelancer Earnings
```javascript
class GetFreelancerEarnings {
  async execute(freelancerId, period = 'all') {
    const { Op } = require('sequelize');
    const where = {
      status: 'berhasil'
    };

    // Filter by period
    if (period !== 'all') {
      const dateFilter = this.getDateFilter(period);
      where.dibayar_pada = { [Op.gte]: dateFilter };
    }

    // Get all successful payments for freelancer's orders
    const payments = await this.paymentRepository.findAll({
      where,
      include: [{
        model: 'pesanan',
        where: { freelancer_id: freelancerId }
      }]
    });

    const totalEarnings = payments.reduce((sum, p) => sum + parseFloat(p.jumlah), 0);
    const platformFees = payments.reduce((sum, p) => sum + parseFloat(p.biaya_platform), 0);
    const netEarnings = totalEarnings - platformFees;

    return {
      totalEarnings,
      platformFees,
      netEarnings,
      totalTransactions: payments.length,
      breakdown: payments.map(p => ({
        paymentId: p.id,
        orderId: p.pesanan_id,
        amount: p.jumlah,
        platformFee: p.biaya_platform,
        netAmount: p.jumlah - p.biaya_platform,
        paidAt: p.dibayar_pada
      }))
    };
  }

  getDateFilter(period) {
    const now = new Date();
    switch (period) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      default:
        return new Date(0); // All time
    }
  }
}
```

## 🚀 Frontend Integration

### Create Payment
```javascript
POST /api/payments/create
Headers: { Authorization: "Bearer <token>" }
Body: {
  orderId: "order_id",
  paymentMethod: "transfer_bank"
}
Response: {
  success: true,
  data: {
    paymentId: "payment_id",
    paymentUrl: "https://app.midtrans.com/snap/v2/...",
    amount: 262500
  }
}

// Redirect user to paymentUrl
window.location.href = data.paymentUrl;
```

### Get Payment History
```javascript
GET /api/payments/history?page=1&limit=10
Response: {
  success: true,
  data: {
    payments: [
      {
        paymentId: "...",
        transactionId: "PAY-123",
        orderId: "...",
        amount: 250000,
        status: "berhasil",
        paymentMethod: "transfer_bank",
        paidAt: "2025-01-20T10:00:00Z"
      }
    ],
    pagination: { page: 1, limit: 10, total: 25 }
  }
}
```

### Get Freelancer Earnings
```javascript
GET /api/payments/earnings?period=month
Headers: { Authorization: "Bearer <freelancer_token>" }
Response: {
  success: true,
  data: {
    totalEarnings: 5000000,
    platformFees: 250000,
    netEarnings: 4750000,
    totalTransactions: 20,
    breakdown: [...]
  }
}
```

### Download Invoice
```javascript
GET /api/payments/:id/invoice
Response: PDF file download
```

## 🔒 Security Best Practices

1. **Webhook Verification**: Always verify signature dari payment gateway
2. **HTTPS Only**: Payment endpoint harus pakai HTTPS
3. **Idempotency**: Handle duplicate webhook callbacks
4. **Logging**: Log semua webhook requests untuk debugging
5. **Environment Variables**: Store API keys di environment variables, NEVER in code

## 📧 Invoice Generation

```javascript
const PDFDocument = require('pdfkit');
const fs = require('fs');

class InvoiceService {
  async generate(payment) {
    const doc = new PDFDocument();
    const filePath = `invoices/${payment.nomor_invoice}.pdf`;

    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.fontSize(10).text(`Invoice Number: ${payment.nomor_invoice}`);
    doc.text(`Date: ${payment.dibayar_pada.toLocaleDateString()}`);

    // Client info
    doc.text(`\nClient: ${payment.order.client.nama_depan}`);
    doc.text(`Email: ${payment.order.client.email}`);

    // Payment details
    doc.text(`\nOrder: ${payment.order.judul}`);
    doc.text(`Amount: Rp ${payment.jumlah.toLocaleString()}`);
    doc.text(`Platform Fee: Rp ${payment.biaya_platform.toLocaleString()}`);
    doc.text(`Payment Gateway Fee: Rp ${payment.biaya_payment_gateway.toLocaleString()}`);
    doc.text(`Total: Rp ${payment.total_bayar.toLocaleString()}`);

    doc.end();

    payment.invoice_url = `/invoices/${payment.nomor_invoice}.pdf`;
    return filePath;
  }
}
```

## 🧪 Testing

```javascript
// Test webhook verification
describe('VerifyPayment', () => {
  it('should verify valid signature', () => {
    const webhookData = {
      order_id: 'PAY-123',
      status_code: '200',
      gross_amount: '250000',
      signature_key: 'valid_signature'
    };

    const result = verifyPayment.verifySignature(webhookData);
    expect(result).toBe(true);
  });

  it('should update order status on successful payment', async () => {
    const webhookData = {
      order_id: 'PAY-123',
      transaction_status: 'settlement'
    };

    await verifyPayment.execute(webhookData);

    const order = await orderRepository.findById(payment.pesanan_id);
    expect(order.status).toBe('dikerjakan');
  });
});
```
