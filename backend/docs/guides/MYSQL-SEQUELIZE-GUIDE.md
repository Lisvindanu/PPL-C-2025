# MySQL + Sequelize Guide for SkillConnect

## 📌 Overview

Backend SkillConnect menggunakan:
- **MySQL** sebagai database (bukan MongoDB)
- **Sequelize** sebagai ORM (Object-Relational Mapping)
- **mysql2** sebagai driver

## 🔧 Setup MySQL Database

### 1. Install MySQL

**MacOS:**
```bash
brew install mysql
brew services start mysql
```

**Windows:**
Download dari https://dev.mysql.com/downloads/mysql/

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### 2. Create Database

```sql
mysql -u root -p

CREATE DATABASE skillconnect;
USE skillconnect;

-- Cek database
SHOW DATABASES;

-- Exit
EXIT;
```

### 3. Setup .env

```bash
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skillconnect
DB_USER=root
DB_PASSWORD=your_password
```

---

## 📦 Sequelize Model (Infrastructure Layer)

Sequelize Model taruh di **`infrastructure/models/`** setiap modul.

### Example: UserModel (Modul User)

```javascript
// src/modules/user/infrastructure/models/UserModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('client', 'freelancer', 'admin'),
    defaultValue: 'client'
  },
  first_name: {
    type: DataTypes.STRING(100)
  },
  last_name: {
    type: DataTypes.STRING(100)
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  avatar: {
    type: DataTypes.STRING(255)
  },
  bio: {
    type: DataTypes.TEXT
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true, // created_at, updated_at
  underscored: true // snake_case column names
});

module.exports = User;
```

### Example: ServiceModel (Modul Service)

```javascript
// src/modules/service/infrastructure/models/ServiceModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const Service = sequelize.define('services', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  freelancer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  delivery_time: {
    type: DataTypes.INTEGER, // dalam hari
    defaultValue: 3
  },
  rating_average: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  rating_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_orders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'deleted'),
    defaultValue: 'active'
  }
}, {
  tableName: 'services',
  timestamps: true,
  underscored: true
});

module.exports = Service;
```

### Example: PaymentModel (Modul Payment)

```javascript
// src/modules/payment/infrastructure/models/PaymentModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../shared/database/connection');

const Payment = sequelize.define('payments', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('bank_transfer', 'e_wallet', 'credit_card', 'qris'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed', 'expired'),
    defaultValue: 'pending'
  },
  payment_url: {
    type: DataTypes.TEXT
  },
  callback_data: {
    type: DataTypes.JSON
  },
  invoice_url: {
    type: DataTypes.STRING(255)
  },
  expires_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true
});

module.exports = Payment;
```

---

## 🔗 Define Relationships (Associations)

Taruh di file terpisah: `src/shared/database/associations.js`

```javascript
// src/shared/database/associations.js
const User = require('../../modules/user/infrastructure/models/UserModel');
const Service = require('../../modules/service/infrastructure/models/ServiceModel');
const Order = require('../../modules/order/infrastructure/models/OrderModel');
const Payment = require('../../modules/payment/infrastructure/models/PaymentModel');
const Review = require('../../modules/review/infrastructure/models/ReviewModel');

// User - Service (1:N)
User.hasMany(Service, {
  foreignKey: 'freelancer_id',
  as: 'services'
});
Service.belongsTo(User, {
  foreignKey: 'freelancer_id',
  as: 'freelancer'
});

// User - Order (1:N as client)
User.hasMany(Order, {
  foreignKey: 'client_id',
  as: 'clientOrders'
});
Order.belongsTo(User, {
  foreignKey: 'client_id',
  as: 'client'
});

// User - Order (1:N as freelancer)
User.hasMany(Order, {
  foreignKey: 'freelancer_id',
  as: 'freelancerOrders'
});
Order.belongsTo(User, {
  foreignKey: 'freelancer_id',
  as: 'freelancer'
});

// Service - Order (1:N)
Service.hasMany(Order, {
  foreignKey: 'service_id',
  as: 'orders'
});
Order.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'service'
});

// Order - Payment (1:1)
Order.hasOne(Payment, {
  foreignKey: 'order_id',
  as: 'payment'
});
Payment.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// Order - Review (1:1)
Order.hasOne(Review, {
  foreignKey: 'order_id',
  as: 'review'
});
Review.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

module.exports = {
  User,
  Service,
  Order,
  Payment,
  Review
};
```

**Load associations di server.js:**
```javascript
// src/server.js
const { connectDatabase } = require('./shared/database/connection');
require('./shared/database/associations'); // Load associations

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

---

## 🏗️ Repository Implementation (Infrastructure Layer)

### Example: UserRepository

```javascript
// src/modules/user/infrastructure/repositories/SequelizeUserRepository.js
const User = require('../models/UserModel');

class SequelizeUserRepository {
  async save(userData) {
    const user = await User.create(userData);
    return user;
  }

  async findById(id) {
    const user = await User.findByPk(id);
    return user;
  }

  async findByEmail(email) {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  async update(id, userData) {
    const [updated] = await User.update(userData, { where: { id } });
    if (updated) {
      return await this.findById(id);
    }
    return null;
  }

  async delete(id) {
    const deleted = await User.destroy({ where: { id } });
    return deleted > 0;
  }

  async findAll(filters = {}) {
    const { role, isActive, limit = 10, offset = 0 } = filters;
    const where = {};

    if (role) where.role = role;
    if (isActive !== undefined) where.is_active = isActive;

    const users = await User.findAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return users;
  }

  async count(filters = {}) {
    const where = {};
    if (filters.role) where.role = filters.role;
    if (filters.isActive !== undefined) where.is_active = filters.isActive;

    return await User.count({ where });
  }
}

module.exports = SequelizeUserRepository;
```

### Example: ServiceRepository

```javascript
// src/modules/service/infrastructure/repositories/SequelizeServiceRepository.js
const { Op } = require('sequelize');
const Service = require('../models/ServiceModel');
const User = require('../../../user/infrastructure/models/UserModel');

class SequelizeServiceRepository {
  async save(serviceData) {
    return await Service.create(serviceData);
  }

  async findById(id) {
    return await Service.findByPk(id, {
      include: [
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'first_name', 'last_name', 'avatar']
        }
      ]
    });
  }

  async search(filters) {
    const { search, category, minPrice, maxPrice, minRating, sortBy, limit = 10, offset = 0 } = filters;
    const where = { status: 'active' };

    // Search by title or description
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    // Filter by rating
    if (minRating) {
      where.rating_average = { [Op.gte]: minRating };
    }

    // Sort
    const order = [];
    switch (sortBy) {
      case 'price_asc':
        order.push(['price', 'ASC']);
        break;
      case 'price_desc':
        order.push(['price', 'DESC']);
        break;
      case 'rating':
        order.push(['rating_average', 'DESC']);
        break;
      case 'popular':
        order.push(['total_orders', 'DESC']);
        break;
      default:
        order.push(['created_at', 'DESC']);
    }

    const services = await Service.findAll({
      where,
      include: [
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'first_name', 'last_name', 'avatar']
        }
      ],
      order,
      limit,
      offset
    });

    const total = await Service.count({ where });

    return { services, total };
  }

  async update(id, serviceData) {
    const [updated] = await Service.update(serviceData, { where: { id } });
    if (updated) {
      return await this.findById(id);
    }
    return null;
  }

  async delete(id) {
    // Soft delete
    return await Service.update({ status: 'deleted' }, { where: { id } });
  }
}

module.exports = SequelizeServiceRepository;
```

---

## 🔄 Transactions

Untuk operasi yang butuh multiple queries:

```javascript
const { sequelize } = require('../../../shared/database/connection');

async createOrderWithPayment(orderData, paymentData) {
  const transaction = await sequelize.transaction();

  try {
    // Create order
    const order = await Order.create(orderData, { transaction });

    // Create payment
    const payment = await Payment.create({
      ...paymentData,
      order_id: order.id
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    return { order, payment };
  } catch (error) {
    // Rollback jika error
    await transaction.rollback();
    throw error;
  }
}
```

---

## 📊 Migrations (Production)

Untuk production, jangan pakai `sequelize.sync()`. Gunakan **migrations**.

### 1. Initialize Sequelize CLI

```bash
npx sequelize-cli init
```

### 2. Create Migration

```bash
npx sequelize-cli migration:generate --name create-users-table
```

### 3. Edit Migration File

```javascript
// migrations/20250114000001-create-users-table.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('client', 'freelancer', 'admin'),
        defaultValue: 'client'
      },
      first_name: Sequelize.STRING(100),
      last_name: Sequelize.STRING(100),
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
```

### 4. Run Migration

```bash
npx sequelize-cli db:migrate
```

---

## 🌱 Seeders

### 1. Create Seeder

```bash
npx sequelize-cli seed:generate --name demo-users
```

### 2. Edit Seeder

```javascript
// seeders/20250114000001-demo-users.js
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'admin@skillconnect.com',
        password: hashedPassword,
        role: 'admin',
        first_name: 'Admin',
        last_name: 'SkillConnect',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
```

### 3. Run Seeder

```bash
npx sequelize-cli db:seed:all
```

---

## 📝 Quick Reference

### Create
```javascript
const user = await User.create({ email, password, role });
```

### Find by ID
```javascript
const user = await User.findByPk(id);
```

### Find One
```javascript
const user = await User.findOne({ where: { email } });
```

### Find All
```javascript
const users = await User.findAll({ where: { role: 'client' } });
```

### Update
```javascript
await User.update({ first_name: 'John' }, { where: { id } });
```

### Delete
```javascript
await User.destroy({ where: { id } });
```

### Count
```javascript
const count = await User.count({ where: { role: 'client' } });
```

---

## 🚀 Start Development

```bash
# 1. Install dependencies
npm install

# 2. Setup database
mysql -u root -p
CREATE DATABASE skillconnect;

# 3. Copy .env
cp .env.example .env

# 4. Edit .env dengan MySQL credentials kamu

# 5. Run server (auto create tables)
npm run dev
```

Done! Backend siap dengan MySQL + Sequelize! 🎉
