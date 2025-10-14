# Infrastructure Layer - Payment Module

## 📌 Apa itu Infrastructure Layer?

**Infrastructure Layer** berisi **implementasi teknis** untuk akses external services seperti database, payment gateway, email service, dll.

Layer ini **mengimplementasi interface** yang didefinisikan di Domain/Application Layer.

## 📂 Struktur Folder

```
infrastructure/
├── repositories/
│   └── MongoPaymentRepository.js      # Implementasi Repository dengan MongoDB
├── payment-gateways/
│   ├── MidtransGateway.js             # Implementasi Midtrans
│   └── XenditGateway.js               # Implementasi Xendit
├── models/
│   └── PaymentModel.js                # Mongoose Schema
├── services/
│   ├── EmailService.js                # Service untuk kirim email
│   └── InvoiceGenerator.js            # Service generate invoice PDF
└── event-handlers/
    └── PaymentSuccessHandler.js       # Handle domain events
```

## 🗄️ Repository Implementation

Repository **menghubungkan Domain Entity dengan Database**.

### Contoh: `MongoPaymentRepository.js`

```javascript
const IPaymentRepository = require('../../domain/repositories/IPaymentRepository');
const PaymentModel = require('../models/PaymentModel');
const Payment = require('../../domain/entities/Payment');

class MongoPaymentRepository extends IPaymentRepository {
  async save(payment) {
    const doc = new PaymentModel({
      _id: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
      amount: payment.amount.amount,
      currency: payment.amount.currency,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      paymentUrl: payment.paymentUrl,
      createdAt: payment.createdAt,
      expiresAt: payment.expiresAt
    });

    await doc.save();
    return payment;
  }

  async findById(id) {
    const doc = await PaymentModel.findById(id);
    if (!doc) return null;

    // Convert Mongoose Document ke Domain Entity
    return new Payment({
      id: doc._id.toString(),
      orderId: doc.orderId,
      userId: doc.userId,
      amount: new Money(doc.amount, doc.currency),
      method: doc.method,
      status: doc.status,
      transactionId: doc.transactionId,
      paymentUrl: doc.paymentUrl,
      createdAt: doc.createdAt,
      expiresAt: doc.expiresAt
    });
  }

  async findByUserId(userId, filters = {}) {
    const query = { userId };

    if (filters.status) query.status = filters.status;
    if (filters.startDate) query.createdAt = { $gte: filters.startDate };
    if (filters.endDate) query.createdAt = { ...query.createdAt, $lte: filters.endDate };

    const docs = await PaymentModel
      .find(query)
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .sort({ createdAt: -1 });

    return docs.map(doc => this._toDomain(doc));
  }

  async update(payment) {
    await PaymentModel.findByIdAndUpdate(payment.id, {
      status: payment.status,
      updatedAt: new Date()
    });
    return payment;
  }

  _toDomain(doc) {
    return new Payment({
      id: doc._id.toString(),
      orderId: doc.orderId,
      userId: doc.userId,
      amount: new Money(doc.amount, doc.currency),
      method: doc.method,
      status: doc.status,
      transactionId: doc.transactionId,
      createdAt: doc.createdAt
    });
  }
}

module.exports = MongoPaymentRepository;
```

## 💳 Payment Gateway Implementation

### Contoh: `MidtransGateway.js`

```javascript
const midtransClient = require('midtrans-client');
const IPaymentGateway = require('../../application/interfaces/IPaymentGateway');

class MidtransGateway extends IPaymentGateway {
  constructor() {
    super();
    this.snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === 'production',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });
  }

  async createTransaction(data) {
    const parameter = {
      transaction_details: {
        order_id: `ORDER-${data.orderId}`,
        gross_amount: data.amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        email: data.userEmail,
        phone: data.userPhone
      }
    };

    try {
      const transaction = await this.snap.createTransaction(parameter);

      return {
        transactionId: transaction.token,
        paymentUrl: transaction.redirect_url,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 jam
      };
    } catch (error) {
      throw new Error(`Midtrans error: ${error.message}`);
    }
  }

  async checkStatus(transactionId) {
    try {
      const statusResponse = await this.snap.transaction.status(transactionId);

      return {
        status: this._mapStatus(statusResponse.transaction_status),
        transactionId: statusResponse.transaction_id,
        amount: statusResponse.gross_amount
      };
    } catch (error) {
      throw new Error(`Failed to check status: ${error.message}`);
    }
  }

  validateSignature(webhookData) {
    const crypto = require('crypto');
    const { order_id, status_code, gross_amount, signature_key } = webhookData;

    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
      .digest('hex');

    return hash === signature_key;
  }

  _mapStatus(midtransStatus) {
    const statusMap = {
      'capture': 'success',
      'settlement': 'success',
      'pending': 'pending',
      'deny': 'failed',
      'cancel': 'failed',
      'expire': 'expired'
    };
    return statusMap[midtransStatus] || 'pending';
  }
}

module.exports = MidtransGateway;
```

## 📧 Email Service

### Contoh: `EmailService.js`

```javascript
const nodemailer = require('nodemailer');
const sendgrid = require('@sendgrid/mail');

class EmailService {
  constructor() {
    if (process.env.EMAIL_SERVICE === 'sendgrid') {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      this.provider = 'sendgrid';
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      this.provider = 'smtp';
    }
  }

  async sendInvoice(to, invoiceData) {
    const subject = `Invoice Pembayaran - ${invoiceData.transactionId}`;
    const html = this._generateInvoiceHTML(invoiceData);

    if (this.provider === 'sendgrid') {
      await sendgrid.send({
        to,
        from: process.env.EMAIL_FROM,
        subject,
        html,
        attachments: [
          {
            filename: `invoice-${invoiceData.transactionId}.pdf`,
            content: invoiceData.pdfBuffer,
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      });
    } else {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
        attachments: [
          {
            filename: `invoice-${invoiceData.transactionId}.pdf`,
            content: invoiceData.pdfBuffer
          }
        ]
      });
    }
  }

  _generateInvoiceHTML(data) {
    return `
      <h2>Invoice Pembayaran</h2>
      <p>Transaction ID: ${data.transactionId}</p>
      <p>Amount: ${data.amount}</p>
      <p>Status: ${data.status}</p>
      <p>Terima kasih telah menggunakan SkillConnect!</p>
    `;
  }
}

module.exports = EmailService;
```

## 📄 Invoice Generator

### Contoh: `InvoiceGenerator.js`

```javascript
const PDFDocument = require('pdfkit');
const fs = require('fs');

class InvoiceGenerator {
  async generate(paymentData) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc
        .fontSize(20)
        .text('INVOICE', { align: 'center' })
        .moveDown();

      // Invoice Details
      doc
        .fontSize(12)
        .text(`Invoice No: INV-${paymentData.transactionId}`)
        .text(`Date: ${new Date().toLocaleDateString('id-ID')}`)
        .text(`Transaction ID: ${paymentData.transactionId}`)
        .moveDown();

      // Payment Info
      doc
        .fontSize(14)
        .text('Payment Details', { underline: true })
        .fontSize(12)
        .text(`Amount: ${paymentData.amount}`)
        .text(`Method: ${paymentData.method}`)
        .text(`Status: ${paymentData.status}`)
        .moveDown();

      // Footer
      doc
        .fontSize(10)
        .text('Thank you for using SkillConnect!', { align: 'center' });

      doc.end();
    });
  }
}

module.exports = InvoiceGenerator;
```

## 🗃️ Mongoose Model

### Contoh: `PaymentModel.js`

```javascript
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'IDR'
  },
  method: {
    type: String,
    enum: ['bank_transfer', 'e_wallet', 'credit_card', 'qris'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'expired'],
    default: 'pending'
  },
  paymentUrl: String,
  callbackData: mongoose.Schema.Types.Mixed,
  invoiceUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
```

## ✅ Prinsip Infrastructure Layer

1. **Implementation Details** - Semua detail teknis ada di sini
2. **Implement Interfaces** - Implementasi interface dari Domain/Application
3. **External Dependencies** - Semua library external (Mongoose, Midtrans, dll)
4. **Mapping** - Convert antara Database Model ↔ Domain Entity
5. **Error Handling** - Handle error dari external services

## 🚀 Next Steps

Setelah Infrastructure Layer, lanjut ke **Presentation Layer** untuk handle HTTP requests!
