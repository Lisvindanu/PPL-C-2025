# Testing Guide - SkillConnect Backend

Panduan lengkap untuk menulis dan menjalankan unit test, integration test, dan end-to-end test.

---

## 📋 Table of Contents

- [Tech Stack Testing](#-tech-stack-testing)
- [Setup Testing Environment](#-setup-testing-environment)
- [Unit Testing](#-unit-testing)
- [Integration Testing](#-integration-testing)
- [E2E Testing](#-e2e-testing)
- [Test Coverage](#-test-coverage)
- [Best Practices](#-best-practices)
- [CI/CD Integration](#-cicd-integration)

---

## 🧪 Tech Stack Testing

- **Jest** - Testing framework
- **Supertest** - HTTP assertions (untuk API testing)
- **@faker-js/faker** - Generate fake data
- **sinon** - Mocking & stubbing (optional)
- **mysql2-promise** - MySQL testing utilities

---

## 🔧 Setup Testing Environment

### 1. Install Dependencies

```bash
npm install --save-dev jest supertest @faker-js/faker
```

### 2. Configure Jest

**`jest.config.js`**
```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/server.js'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000
};
```

### 3. Setup Test Database

**`.env.test`**
```env
NODE_ENV=test
PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skillconnect_test
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql
JWT_SECRET=test_jwt_secret
```

### 4. Test Setup File

**`tests/setup.js`**
```javascript
const { connectDatabase, disconnectDatabase, sequelize } = require('../src/shared/database/connection');

// Setup before all tests
beforeAll(async () => {
  await connectDatabase();
  // Force sync database (recreate tables)
  await sequelize.sync({ force: true });
});

// Cleanup after all tests
afterAll(async () => {
  await sequelize.drop(); // Drop all tables
  await disconnectDatabase();
});

// Clean data between tests
afterEach(async () => {
  // Truncate all tables
  const tables = Object.keys(sequelize.models);
  for (const table of tables) {
    await sequelize.models[table].destroy({ truncate: true, cascade: true });
  }
});
```

### 5. Add Test Scripts

**`package.json`**
```json
{
  "scripts": {
    "test": "NODE_ENV=test jest",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage",
    "test:unit": "NODE_ENV=test jest --testPathPattern=unit",
    "test:integration": "NODE_ENV=test jest --testPathPattern=integration"
  }
}
```

---

## 🔬 Unit Testing

Unit test fokus pada **satu function/class** dalam isolasi.

### Struktur Folder

```
src/modules/payment/
├── domain/
│   ├── entities/
│   │   └── Payment.js
│   └── __tests__/
│       └── Payment.test.js
├── application/
│   ├── useCases/
│   │   └── CreatePaymentUseCase.js
│   └── __tests__/
│       └── CreatePaymentUseCase.test.js
└── infrastructure/
    ├── repositories/
    │   └── SequelizePaymentRepository.js
    └── __tests__/
        └── SequelizePaymentRepository.test.js
```

### Example: Entity Test

**`src/modules/payment/domain/entities/__tests__/Payment.test.js`**
```javascript
const Payment = require('../Payment');

describe('Payment Entity', () => {
  describe('constructor', () => {
    it('should create payment with valid data', () => {
      const paymentData = {
        id: 'payment-123',
        orderId: 'order-123',
        userId: 'user-123',
        amount: 250000,
        status: 'pending'
      };

      const payment = new Payment(paymentData);

      expect(payment.id).toBe('payment-123');
      expect(payment.amount).toBe(250000);
      expect(payment.status).toBe('pending');
    });

    it('should throw error if amount is negative', () => {
      const paymentData = {
        id: 'payment-123',
        amount: -100,
        status: 'pending'
      };

      expect(() => new Payment(paymentData)).toThrow('Amount must be positive');
    });
  });

  describe('markAsSuccess', () => {
    it('should change status from pending to success', () => {
      const payment = new Payment({
        id: 'payment-123',
        amount: 250000,
        status: 'pending'
      });

      payment.markAsSuccess();

      expect(payment.status).toBe('success');
    });

    it('should throw error if payment is not pending', () => {
      const payment = new Payment({
        id: 'payment-123',
        amount: 250000,
        status: 'success'
      });

      expect(() => payment.markAsSuccess()).toThrow(
        'Only pending payments can be marked as success'
      );
    });
  });
});
```

### Example: Use Case Test (with Mocking)

**`src/modules/payment/application/useCases/__tests__/CreatePaymentUseCase.test.js`**
```javascript
const CreatePaymentUseCase = require('../CreatePaymentUseCase');

describe('CreatePaymentUseCase', () => {
  let createPaymentUseCase;
  let mockPaymentRepository;
  let mockOrderRepository;
  let mockPaymentGateway;

  beforeEach(() => {
    // Mock dependencies
    mockPaymentRepository = {
      save: jest.fn(),
      findByOrderId: jest.fn()
    };

    mockOrderRepository = {
      findById: jest.fn()
    };

    mockPaymentGateway = {
      createTransaction: jest.fn()
    };

    createPaymentUseCase = new CreatePaymentUseCase(
      mockPaymentRepository,
      mockOrderRepository,
      mockPaymentGateway
    );
  });

  it('should create payment successfully', async () => {
    const paymentData = {
      orderId: 'order-123',
      userId: 'user-123',
      paymentMethod: 'bank_transfer'
    };

    const mockOrder = {
      id: 'order-123',
      amount: 250000,
      status: 'pending'
    };

    const mockPaymentResponse = {
      transactionId: 'trx-123',
      paymentUrl: 'https://payment.gateway/trx-123'
    };

    // Setup mocks
    mockOrderRepository.findById.mockResolvedValue(mockOrder);
    mockPaymentRepository.findByOrderId.mockResolvedValue(null);
    mockPaymentGateway.createTransaction.mockResolvedValue(mockPaymentResponse);
    mockPaymentRepository.save.mockResolvedValue({
      id: 'payment-123',
      ...paymentData,
      amount: 250000,
      transactionId: 'trx-123'
    });

    // Execute
    const result = await createPaymentUseCase.execute(paymentData);

    // Assertions
    expect(mockOrderRepository.findById).toHaveBeenCalledWith('order-123');
    expect(mockPaymentGateway.createTransaction).toHaveBeenCalled();
    expect(mockPaymentRepository.save).toHaveBeenCalled();
    expect(result.transactionId).toBe('trx-123');
    expect(result.paymentUrl).toBe('https://payment.gateway/trx-123');
  });

  it('should throw error if order not found', async () => {
    mockOrderRepository.findById.mockResolvedValue(null);

    await expect(
      createPaymentUseCase.execute({ orderId: 'invalid-order' })
    ).rejects.toThrow('Order not found');
  });

  it('should throw error if payment already exists', async () => {
    const mockOrder = { id: 'order-123', amount: 250000 };
    const existingPayment = { id: 'payment-123', orderId: 'order-123' };

    mockOrderRepository.findById.mockResolvedValue(mockOrder);
    mockPaymentRepository.findByOrderId.mockResolvedValue(existingPayment);

    await expect(
      createPaymentUseCase.execute({ orderId: 'order-123' })
    ).rejects.toThrow('Payment already exists for this order');
  });
});
```

### Example: Repository Test (with Real Database)

**`src/modules/payment/infrastructure/repositories/__tests__/SequelizePaymentRepository.test.js`**
```javascript
const SequelizePaymentRepository = require('../SequelizePaymentRepository');
const Payment = require('../../models/PaymentModel');
const { faker } = require('@faker-js/faker');

describe('SequelizePaymentRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new SequelizePaymentRepository();
  });

  describe('save', () => {
    it('should save payment to database', async () => {
      const paymentData = {
        orderId: faker.string.uuid(),
        userId: faker.string.uuid(),
        transactionId: faker.string.alphanumeric(16),
        amount: 250000,
        paymentMethod: 'bank_transfer',
        status: 'pending'
      };

      const result = await repository.save(paymentData);

      expect(result.id).toBeDefined();
      expect(result.amount).toBe(250000);
      expect(result.status).toBe('pending');

      // Verify in database
      const savedPayment = await Payment.findByPk(result.id);
      expect(savedPayment).toBeTruthy();
      expect(savedPayment.amount).toBe('250000.00'); // Decimal in DB
    });
  });

  describe('findById', () => {
    it('should return payment by id', async () => {
      // Create test data
      const payment = await Payment.create({
        orderId: faker.string.uuid(),
        userId: faker.string.uuid(),
        transactionId: faker.string.alphanumeric(16),
        amount: 250000,
        paymentMethod: 'e_wallet',
        status: 'success'
      });

      const result = await repository.findById(payment.id);

      expect(result.id).toBe(payment.id);
      expect(result.status).toBe('success');
    });

    it('should return null if payment not found', async () => {
      const result = await repository.findById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update payment status', async () => {
      const payment = await Payment.create({
        orderId: faker.string.uuid(),
        userId: faker.string.uuid(),
        transactionId: faker.string.alphanumeric(16),
        amount: 250000,
        paymentMethod: 'bank_transfer',
        status: 'pending'
      });

      const result = await repository.updateStatus(payment.id, 'success');

      expect(result.status).toBe('success');

      // Verify in database
      const updated = await Payment.findByPk(payment.id);
      expect(updated.status).toBe('success');
    });
  });
});
```

---

## 🔗 Integration Testing

Integration test menguji **interaksi antar komponen** (controller, service, repository, database).

### Example: API Integration Test

**`src/modules/payment/presentation/__tests__/paymentRoutes.integration.test.js`**
```javascript
const request = require('supertest');
const app = require('../../../../server');
const User = require('../../../user/infrastructure/models/UserModel');
const Order = require('../../../order/infrastructure/models/OrderModel');
const Payment = require('../../infrastructure/models/PaymentModel');
const { faker } = require('@faker-js/faker');
const jwt = require('jsonwebtoken');

describe('Payment API Integration Tests', () => {
  let authToken;
  let testUser;
  let testOrder;

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      email: faker.internet.email(),
      password: 'hashedpassword',
      role: 'client',
      first_name: 'Test',
      last_name: 'User'
    });

    // Generate JWT token
    authToken = jwt.sign(
      { id: testUser.id, role: testUser.role },
      process.env.JWT_SECRET
    );

    // Create test order
    testOrder = await Order.create({
      clientId: testUser.id,
      freelancerId: faker.string.uuid(),
      serviceId: faker.string.uuid(),
      amount: 250000,
      status: 'pending'
    });
  });

  describe('POST /api/payments/create', () => {
    it('should create payment successfully', async () => {
      const response = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          orderId: testOrder.id,
          paymentMethod: 'bank_transfer'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('transactionId');
      expect(response.body.data).toHaveProperty('paymentUrl');
      expect(response.body.data.amount).toBe(250000);
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/payments/create')
        .send({
          orderId: testOrder.id,
          paymentMethod: 'bank_transfer'
        });

      expect(response.status).toBe(401);
    });

    it('should return 404 if order not found', async () => {
      const response = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          orderId: 'non-existent-order',
          paymentMethod: 'bank_transfer'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('Order not found');
    });

    it('should return 400 if payment already exists', async () => {
      // Create existing payment
      await Payment.create({
        orderId: testOrder.id,
        userId: testUser.id,
        transactionId: faker.string.alphanumeric(16),
        amount: 250000,
        paymentMethod: 'bank_transfer',
        status: 'pending'
      });

      const response = await request(app)
        .post('/api/payments/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          orderId: testOrder.id,
          paymentMethod: 'bank_transfer'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Payment already exists');
    });
  });

  describe('GET /api/payments/:id', () => {
    it('should get payment detail', async () => {
      const payment = await Payment.create({
        orderId: testOrder.id,
        userId: testUser.id,
        transactionId: faker.string.alphanumeric(16),
        amount: 250000,
        paymentMethod: 'e_wallet',
        status: 'success'
      });

      const response = await request(app)
        .get(`/api/payments/${payment.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(payment.id);
      expect(response.body.data.status).toBe('success');
    });
  });

  describe('POST /api/payments/webhook', () => {
    it('should process webhook successfully', async () => {
      const payment = await Payment.create({
        orderId: testOrder.id,
        userId: testUser.id,
        transactionId: 'TRX-123456',
        amount: 250000,
        paymentMethod: 'bank_transfer',
        status: 'pending'
      });

      const webhookData = {
        transaction_id: 'TRX-123456',
        status_code: '200',
        transaction_status: 'settlement',
        gross_amount: '250000.00'
      };

      const response = await request(app)
        .post('/api/payments/webhook')
        .send(webhookData);

      expect(response.status).toBe(200);

      // Verify payment status updated
      const updatedPayment = await Payment.findByPk(payment.id);
      expect(updatedPayment.status).toBe('success');
    });
  });
});
```

---

## 🌐 E2E Testing

End-to-end test menguji **full user flow** dari request sampai response.

**`tests/e2e/payment-flow.e2e.test.js`**
```javascript
const request = require('supertest');
const app = require('../../src/server');
const { faker } = require('@faker-js/faker');

describe('E2E: Complete Payment Flow', () => {
  let authToken;
  let userId;
  let serviceId;
  let orderId;

  it('should complete full payment flow', async () => {
    // 1. Register user
    const registerRes = await request(app)
      .post('/api/users/register')
      .send({
        email: faker.internet.email(),
        password: 'Password123!',
        role: 'client',
        firstName: 'John',
        lastName: 'Doe'
      });

    expect(registerRes.status).toBe(201);

    // 2. Login
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: registerRes.body.data.email,
        password: 'Password123!'
      });

    expect(loginRes.status).toBe(200);
    authToken = loginRes.body.data.token;
    userId = loginRes.body.data.user.id;

    // 3. Get available services
    const servicesRes = await request(app)
      .get('/api/services')
      .query({ category: 'design', limit: 1 });

    expect(servicesRes.status).toBe(200);
    serviceId = servicesRes.body.data.services[0].id;

    // 4. Create order
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        serviceId: serviceId,
        description: 'Need logo design',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

    expect(orderRes.status).toBe(201);
    orderId = orderRes.body.data.id;

    // 5. Create payment
    const paymentRes = await request(app)
      .post('/api/payments/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        orderId: orderId,
        paymentMethod: 'bank_transfer'
      });

    expect(paymentRes.status).toBe(201);
    expect(paymentRes.body.data).toHaveProperty('paymentUrl');
    expect(paymentRes.body.data).toHaveProperty('transactionId');

    const paymentId = paymentRes.body.data.id;

    // 6. Simulate webhook (payment success)
    const webhookRes = await request(app)
      .post('/api/payments/webhook')
      .send({
        transaction_id: paymentRes.body.data.transactionId,
        transaction_status: 'settlement',
        status_code: '200',
        gross_amount: orderRes.body.data.amount.toString()
      });

    expect(webhookRes.status).toBe(200);

    // 7. Verify payment status
    const paymentDetailRes = await request(app)
      .get(`/api/payments/${paymentId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(paymentDetailRes.status).toBe(200);
    expect(paymentDetailRes.body.data.status).toBe('success');

    // 8. Verify order status updated
    const orderDetailRes = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(orderDetailRes.status).toBe(200);
    expect(orderDetailRes.body.data.status).toBe('paid');
  });
});
```

---

## 📊 Test Coverage

### Run Coverage Report

```bash
npm run test:coverage
```

### Coverage Output

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   82.5  |   75.3   |   80.1  |   82.8  |
 payment/
  domain/
   entities/        |   90.2  |   85.4   |   88.9  |   90.5  |
  application/
   useCases/        |   85.7  |   78.2   |   82.1  |   86.0  |
  infrastructure/
   repositories/    |   80.1  |   72.5   |   77.8  |   80.5  |
--------------------|---------|----------|---------|---------|
```

### Coverage Badges

Tambahkan di README:

```markdown
![Coverage](https://img.shields.io/badge/coverage-82%25-green)
```

---

## ✅ Best Practices

### 1. Test Naming Convention

```javascript
// ✅ Good
describe('PaymentService', () => {
  describe('createPayment', () => {
    it('should create payment with valid data', () => {});
    it('should throw error if amount is negative', () => {});
  });
});

// ❌ Bad
describe('test payment', () => {
  it('works', () => {});
});
```

### 2. AAA Pattern (Arrange, Act, Assert)

```javascript
it('should calculate total with fee', () => {
  // Arrange
  const baseAmount = 100000;
  const feePercentage = 5;

  // Act
  const result = calculateTotal(baseAmount, feePercentage);

  // Assert
  expect(result).toBe(105000);
});
```

### 3. Test Independence

```javascript
// ✅ Good - Each test is independent
describe('UserService', () => {
  beforeEach(() => {
    // Create fresh data for each test
    user = new User({ email: 'test@example.com' });
  });

  it('should update user', () => {
    user.updateEmail('new@example.com');
    expect(user.email).toBe('new@example.com');
  });
});

// ❌ Bad - Tests depend on each other
let user;
it('should create user', () => {
  user = new User({ email: 'test@example.com' });
});
it('should update user', () => {
  user.updateEmail('new@example.com'); // Depends on previous test
});
```

### 4. Mock External Dependencies

```javascript
// ✅ Good - Mock external payment gateway
const mockPaymentGateway = {
  createTransaction: jest.fn().mockResolvedValue({
    transactionId: 'TRX-123',
    paymentUrl: 'https://payment.com/trx-123'
  })
};

// ❌ Bad - Calling real payment gateway in tests
const realPaymentGateway = new MidtransGateway();
await realPaymentGateway.createTransaction(); // Don't do this!
```

### 5. Test Edge Cases

```javascript
describe('validateAmount', () => {
  it('should accept valid positive amount', () => {
    expect(validateAmount(100000)).toBe(true);
  });

  it('should reject zero amount', () => {
    expect(() => validateAmount(0)).toThrow();
  });

  it('should reject negative amount', () => {
    expect(() => validateAmount(-100)).toThrow();
  });

  it('should reject non-number', () => {
    expect(() => validateAmount('abc')).toThrow();
  });

  it('should reject null', () => {
    expect(() => validateAmount(null)).toThrow();
  });

  it('should reject undefined', () => {
    expect(() => validateAmount(undefined)).toThrow();
  });
});
```

---

## 🚀 CI/CD Integration

### GitHub Actions

**`.github/workflows/test.yml`**
```yaml
name: Run Tests

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main, dev ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test_password
          MYSQL_DATABASE: skillconnect_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage
        env:
          DB_HOST: 127.0.0.1
          DB_PORT: 3306
          DB_NAME: skillconnect_test
          DB_USER: root
          DB_PASSWORD: test_password
          JWT_SECRET: test_jwt_secret

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
```

---

## 📝 Test Checklist

Sebelum commit code, pastikan:

- [ ] Semua unit tests pass
- [ ] Test coverage minimal 70%
- [ ] Integration tests untuk API endpoints
- [ ] Edge cases sudah di-test
- [ ] Mock external services (payment gateway, email, dll)
- [ ] Test database menggunakan database terpisah
- [ ] No flaky tests (tests yang kadang pass kadang fail)
- [ ] Test documentation jelas

---

## 🎯 Target Coverage per Module

| Module | Unit | Integration | E2E | Target Coverage |
|--------|------|-------------|-----|-----------------|
| Payment | ✅ | ✅ | ✅ | 85% |
| User | ✅ | ✅ | ⏳ | 80% |
| Service | ✅ | ✅ | ⏳ | 80% |
| Order | ✅ | ✅ | ✅ | 85% |
| Review | ✅ | ⏳ | ⏳ | 75% |
| Chat | ⏳ | ⏳ | ⏳ | 70% |
| Admin | ⏳ | ⏳ | ❌ | 70% |
| Recommendation | ⏳ | ⏳ | ❌ | 70% |

---

## 🔗 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [Testing Best Practices](https://testingjavascript.com/)
- [MySQL Testing with Sequelize](https://sequelize.org/docs/v6/other-topics/testing/)

---

**Happy Testing! 🧪**
