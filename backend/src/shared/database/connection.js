const { Sequelize } = require('sequelize');

// Setup Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'skillconnect',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true, // Use snake_case untuk column names
      freezeTableName: true // Jangan pluralize table names
    }
  }
);

/**
 * Test database connection
 */
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully');
    console.log(`📦 Database: ${process.env.DB_NAME}`);

    // Sync models (hanya di development, production pakai migrations)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false }); // alter: true untuk auto-update schema
      console.log('✅ Database models synced');
    }

  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
};

/**
 * Disconnect database
 */
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
