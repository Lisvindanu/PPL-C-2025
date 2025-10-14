# Modul 3 - Order & Booking System

## 📋 Deskripsi
Modul untuk mengelola pemesanan layanan, tracking status order, dan konfirmasi freelancer.

## 🎯 User Stories
- **O-1**: Tambah layanan ke daftar pesanan
- **O-2**: Buat order dan tunggu konfirmasi
- **O-3**: Freelancer menerima/menolak order
- **O-4**: Client melihat status order
- **O-5**: Sistem memperbarui status otomatis
- **O-6**: Admin melihat daftar transaksi

## 📂 Struktur DDD

```
order/
├── domain/
│   ├── entities/
│   │   └── Order.js             # Entity Order
│   ├── value-objects/
│   │   └── OrderStatus.js       # Value Object status order
│   └── events/
│       ├── OrderCreatedEvent.js
│       └── OrderStatusChangedEvent.js
├── application/
│   ├── use-cases/
│   │   ├── CreateOrder.js       # Buat order baru
│   │   ├── AcceptOrder.js       # Freelancer terima order
│   │   ├── RejectOrder.js       # Freelancer tolak order
│   │   ├── CompleteOrder.js     # Selesaikan order
│   │   ├── CancelOrder.js       # Cancel order
│   │   └── GetOrderStatus.js    # Tracking status
│   └── dtos/
│       ├── CreateOrderDto.js
│       └── OrderResponseDto.js
├── infrastructure/
│   ├── repositories/
│   │   └── SequelizeOrderRepository.js
│   ├── models/
│   │   └── OrderModel.js        # Sequelize Model
│   └── services/
│       └── NotificationService.js # Kirim notifikasi status
└── presentation/
    ├── controllers/
    │   └── OrderController.js
    └── routes/
        └── orderRoutes.js
```

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Buat order baru | Client |
| GET | `/api/orders` | List orders user | Private |
| GET | `/api/orders/:id` | Detail order | Private |
| PUT | `/api/orders/:id/accept` | Terima order | Freelancer |
| PUT | `/api/orders/:id/reject` | Tolak order | Freelancer |
| PUT | `/api/orders/:id/complete` | Selesaikan order | Freelancer |
| PUT | `/api/orders/:id/cancel` | Cancel order | Client |
| GET | `/api/orders/freelancer/:id` | Orders untuk freelancer | Freelancer |

## 📊 Order Status Flow

```
pending → accepted → in_progress → completed
   ↓           ↓
rejected    cancelled
```

## 📦 Database Schema (OrderModel)

```javascript
// Sequelize Model Definition
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('pesanan', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    nomor_pesanan: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    client_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    freelancer_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    layanan_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'layanan', key: 'id' }
    },
    paket_id: {
      type: DataTypes.CHAR(36),
      references: { model: 'paket_layanan', key: 'id' }
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    deskripsi: DataTypes.TEXT,
    catatan_client: DataTypes.TEXT,
    harga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    biaya_platform: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    total_bayar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    waktu_pengerjaan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tenggat_waktu: DataTypes.DATE,
    dikirim_pada: DataTypes.DATE,
    selesai_pada: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM(
        'menunggu',
        'diterima',
        'ditolak',
        'dikerjakan',
        'dikirim',
        'selesai',
        'dibatalkan'
      ),
      defaultValue: 'menunggu'
    },
    lampiran_client: DataTypes.JSON,
    lampiran_freelancer: DataTypes.JSON
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['nomor_pesanan'] },
      { fields: ['client_id'] },
      { fields: ['freelancer_id'] },
      { fields: ['status'] }
    ]
  });

  return Order;
};
```

## 💡 Tips Implementasi

### Create Order Use Case
```javascript
class CreateOrder {
  constructor(orderRepository, serviceRepository, notificationService) {
    this.orderRepository = orderRepository;
    this.serviceRepository = serviceRepository;
    this.notificationService = notificationService;
  }

  async execute(dto) {
    // 1. Validasi service exists
    const service = await this.serviceRepository.findById(dto.serviceId);
    if (!service) throw new Error('Service not found');

    // 2. Buat order entity
    const order = new Order({
      orderId: this.generateOrderId(),
      clientId: dto.clientId,
      freelancerId: service.freelancerId,
      serviceId: dto.serviceId,
      price: service.price,
      deliveryTime: service.deliveryTime,
      requirements: dto.requirements,
      status: 'pending'
    });

    // 3. Save order
    await this.orderRepository.save(order);

    // 4. Kirim notifikasi ke freelancer
    await this.notificationService.send({
      userId: service.freelancerId,
      type: 'new_order',
      message: 'You have a new order request!',
      orderId: order.id
    });

    return order;
  }

  generateOrderId() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### Accept Order Use Case
```javascript
class AcceptOrder {
  async execute(orderId, freelancerId) {
    // 1. Get order
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error('Order not found');

    // 2. Validasi freelancer adalah owner
    if (order.freelancerId !== freelancerId) {
      throw new Error('Unauthorized');
    }

    // 3. Validasi status
    if (order.status !== 'pending') {
      throw new Error('Order cannot be accepted');
    }

    // 4. Update status
    order.accept();
    await this.orderRepository.update(order);

    // 5. Notifikasi client
    await this.notificationService.send({
      userId: order.clientId,
      type: 'order_accepted',
      message: 'Your order has been accepted!',
      orderId: order.id
    });

    return order;
  }
}
```

### Order Entity (domain/entities/Order.js)
```javascript
class Order {
  constructor(data) {
    this.id = data.id;
    this.orderId = data.orderId;
    this.clientId = data.clientId;
    this.freelancerId = data.freelancerId;
    this.serviceId = data.serviceId;
    this.status = data.status || 'pending';
    this.price = data.price;
    this.isPaid = data.isPaid || false;
    this.createdAt = data.createdAt || new Date();
    this.statusHistory = data.statusHistory || [];
  }

  // Business logic
  accept() {
    if (this.status !== 'pending') {
      throw new Error('Can only accept pending orders');
    }
    this.changeStatus('accepted');
  }

  reject(reason) {
    if (this.status !== 'pending') {
      throw new Error('Can only reject pending orders');
    }
    this.changeStatus('rejected', reason);
  }

  startWork() {
    if (this.status !== 'accepted') {
      throw new Error('Can only start accepted orders');
    }
    if (!this.isPaid) {
      throw new Error('Order must be paid first');
    }
    this.changeStatus('in_progress');
  }

  complete() {
    if (this.status !== 'in_progress') {
      throw new Error('Can only complete in-progress orders');
    }
    this.changeStatus('completed');
    this.completedAt = new Date();
  }

  cancel() {
    if (['completed', 'cancelled'].includes(this.status)) {
      throw new Error('Cannot cancel this order');
    }
    this.changeStatus('cancelled');
  }

  changeStatus(newStatus, note = '') {
    this.statusHistory.push({
      from: this.status,
      to: newStatus,
      changedAt: new Date(),
      note
    });
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  canBePaid() {
    return this.status === 'accepted' && !this.isPaid;
  }

  markAsPaid() {
    if (!this.canBePaid()) {
      throw new Error('Order cannot be paid');
    }
    this.isPaid = true;
    this.startWork();
  }
}

module.exports = Order;
```

## 🚀 Frontend Integration

### Create Order (Client)
```javascript
POST /api/orders
Headers: { Authorization: "Bearer <token>" }
Body: {
  serviceId: "service_id",
  requirements: "Saya butuh logo untuk toko online..."
}
Response: {
  success: true,
  data: {
    orderId: "ORD-123",
    status: "pending",
    freelancerId: "freelancer_id",
    price: 250000
  }
}
```

### Accept Order (Freelancer)
```javascript
PUT /api/orders/:id/accept
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: true,
  message: "Order accepted successfully"
}
```

### Get Order Status (Client/Freelancer)
```javascript
GET /api/orders/:id
Response: {
  success: true,
  data: {
    orderId: "ORD-123",
    status: "in_progress",
    client: { id, name },
    freelancer: { id, name },
    service: { title, price },
    isPaid: true,
    createdAt: "2025-01-15",
    statusHistory: [
      { status: "pending", date: "2025-01-15" },
      { status: "accepted", date: "2025-01-16" },
      { status: "in_progress", date: "2025-01-17" }
    ]
  }
}
```

## 🔔 Real-time Updates

Gunakan **Socket.io** atau **Server-Sent Events** untuk real-time status updates:

```javascript
// Client subscribe to order updates
socket.on('order:status-changed', (data) => {
  console.log(`Order ${data.orderId} status: ${data.status}`);
  // Update UI
});
```
