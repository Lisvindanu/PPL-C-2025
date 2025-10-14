# Database Folder

## 📋 Deskripsi
Folder ini berisi **setup koneksi database MySQL** dengan Sequelize ORM dan konfigurasi database global.

## 🔧 Tech Stack
- **MySQL** - Relational Database
- **Sequelize** - ORM (Object-Relational Mapping)
- **mysql2** - MySQL driver

## 📂 File yang Biasanya Ada

### `connection.js`
Setup koneksi MySQL dengan Sequelize

```javascript
const { Sequelize } = require('sequelize');

// Setup Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'skillconnect',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true, // Use snake_case untuk column names
      freezeTableName: true // Jangan pluralize table names
    }
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully');

    // Sync models (development only)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Database models synced');
    }
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await sequelize.close();
    console.log('📦 MySQL connection closed');
  } catch (error) {
    console.error('Error closing MySQL connection:', error);
  }
};

module.exports = {
  sequelize,
  connectDatabase,
  disconnectDatabase
};
```

**Usage di server.js:**
```javascript
const { connectDatabase } = require('./shared/database/connection');

// Connect database sebelum start server
connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

---

### `seeders.js` (Optional)
Seed data untuk development/testing

**Note**: Untuk MySQL, lebih baik gunakan **Sequelize CLI** untuk seeders. Lihat [MYSQL-SEQUELIZE-GUIDE.md](../../../MYSQL-SEQUELIZE-GUIDE.md) untuk detail lengkap.

```javascript
const bcrypt = require('bcrypt');
const User = require('../modules/user/infrastructure/models/UserModel');
const Service = require('../modules/service/infrastructure/models/ServiceModel');

const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'admin@skillconnect.com',
      password: hashedPassword,
      role: 'admin',
      first_name: 'Admin',
      last_name: 'SkillConnect',
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'freelancer@test.com',
      password: hashedPassword,
      role: 'freelancer',
      first_name: 'John',
      last_name: 'Freelancer',
      is_active: true
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      email: 'client@test.com',
      password: hashedPassword,
      role: 'client',
      first_name: 'Jane',
      last_name: 'Client',
      is_active: true
    }
  ];

  try {
    await User.bulkCreate(users, { ignoreDuplicates: true });
    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedServices = async () => {
  // Get freelancer
  const freelancer = await User.findOne({ where: { role: 'freelancer' } });

  const services = [
    {
      freelancer_id: freelancer.id,
      title: 'Logo Design Professional',
      description: 'Desain logo modern dan profesional',
      category: 'design',
      price: 250000,
      delivery_time: 3,
      status: 'active'
    },
    {
      freelancer_id: freelancer.id,
      title: 'Website Development',
      description: 'Pembuatan website dengan React & Node.js',
      category: 'development',
      price: 5000000,
      delivery_time: 14,
      status: 'active'
    }
  ];

  try {
    await Service.bulkCreate(services, { ignoreDuplicates: true });
    console.log('✅ Services seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding services:', error);
  }
};

const runSeeders = async () => {
  console.log('🌱 Starting database seeding...');

  await seedUsers();
  await seedServices();

  console.log('✅ Database seeding completed');
  process.exit(0);
};

// Run seeder jika dipanggil langsung
if (require.main === module) {
  const { connectDatabase } = require('./connection');
  connectDatabase().then(() => {
    runSeeders();
  });
}

module.exports = {
  seedUsers,
  seedServices,
  runSeeders
};
```

**Usage:**
```bash
# Run seeder manual
node src/shared/database/seeders.js

# Atau gunakan Sequelize CLI (recommended)
npx sequelize-cli db:seed:all
```

---

### `indexes.js` (Optional)
Create database indexes untuk performa

**Note**: Untuk MySQL + Sequelize, indexes biasanya didefinisikan langsung di model atau via migrations. Contoh:

```javascript
// Di Sequelize Model
const User = sequelize.define('users', {
  email: {
    type: DataTypes.STRING,
    unique: true,  // Creates unique index
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('client', 'freelancer', 'admin')
  }
}, {
  indexes: [
    { fields: ['email'] },           // Single index
    { fields: ['role'] },
    { fields: ['is_active', 'role'] } // Composite index
  ]
});
```

**Atau via Migration:**
```javascript
// migrations/xxx-add-indexes.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add indexes
    await queryInterface.addIndex('services', ['category', 'status']);
    await queryInterface.addIndex('orders', ['client_id', 'status']);
    await queryInterface.addIndex('payments', ['transaction_id'], { unique: true });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex('services', ['category', 'status']);
    await queryInterface.removeIndex('orders', ['client_id', 'status']);
    await queryInterface.removeIndex('payments', ['transaction_id']);
  }
};
```

---

### Migrations (Sequelize CLI)
Database migrations untuk MySQL

**Note**: Gunakan **Sequelize CLI** untuk migrations. Ini adalah cara yang recommended untuk production.

**Setup Sequelize CLI:**
```bash
npm install --save-dev sequelize-cli
npx sequelize-cli init
```

**Create Migration:**
```bash
# Generate migration file
npx sequelize-cli migration:generate --name create-users-table
```

**Example Migration File:**
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

**Run Migrations:**
```bash
# Run all pending migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all
```

📖 **Detail lengkap**: Lihat [MYSQL-SEQUELIZE-GUIDE.md](../../../MYSQL-SEQUELIZE-GUIDE.md)

---

## ✅ Kapan Pakai Database Folder?
- Setup koneksi database (wajib)
- Seed data untuk development
- Create database indexes
- Database migrations

## ❌ Jangan Taruh di Sini
- Sequelize models (taruh di `infrastructure/models/` setiap modul)
- Repository implementation (taruh di `infrastructure/repositories/`)
- Business logic

## 📝 Best Practices

1. **Satu Connection untuk Semua Module**
   - Jangan bikin koneksi database di setiap modul
   - Gunakan shared connection dari `database/connection.js`

2. **Handle Connection Events**
   - Monitor `error`, `disconnected`, `reconnected`
   - Implement retry mechanism

3. **Graceful Shutdown**
   ```javascript
   process.on('SIGTERM', async () => {
     await disconnectDatabase();
     process.exit(0);
   });
   ```

4. **Use Connection Pooling**
   - Set `pool.max` di Sequelize connection options
   - Default: 10 connections

5. **Index Strategy**
   - Create indexes untuk field yang sering di-query
   - Monitor slow queries
   - Don't over-index (impact write performance)

## 🚀 Quick Start

### 1. Setup MySQL Database
```bash
# Install MySQL
brew install mysql  # macOS

# Start MySQL
brew services start mysql

# Create database
mysql -u root -p
CREATE DATABASE skillconnect;
EXIT;
```

### 2. Setup Environment Variables
```bash
# .env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=skillconnect
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql
```

### 3. Connection sudah ready!
File `connection.js` sudah dibuat di folder ini. Tinggal import di `server.js`:

```javascript
const { connectDatabase } = require('./shared/database/connection');

connectDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
```

Done! 🚀

📖 **Dokumentasi lengkap**: [MYSQL-SEQUELIZE-GUIDE.md](../../../MYSQL-SEQUELIZE-GUIDE.md)
