/* Migration runner with tracking: only runs new migrations */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const { sequelize } = require('./connection');

async function createDatabaseIfNotExists() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    const dbName = process.env.DB_NAME || 'skillconnect';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database "${dbName}" ready`);

    await connection.end();
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    throw error;
  }
}

async function createMigrationsTrackerTable() {
  const queryInterface = sequelize.getQueryInterface();
  const tableName = 'sequelize_migrations';

  // Check if table exists
  const tables = await queryInterface.showAllTables();
  if (tables.includes(tableName)) {
    return;
  }

  // Create tracking table
  await queryInterface.createTable(tableName, {
    name: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    executed_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  });
  console.log(`✅ Migrations tracker table created`);
}

async function runMigrations() {
  // Create database first if not exists
  await createDatabaseIfNotExists();

  // Create migrations tracker table
  await createMigrationsTrackerTable();

  const migrationsDir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found. Skipping.');
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.js'))
    .sort();

  for (const file of files) {
    // Check if migration already executed
    const [rows] = await sequelize.query(
      'SELECT * FROM sequelize_migrations WHERE name = ?',
      {
        replacements: [file],
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (rows && rows.length > 0) {
      console.log(`⊘ Skipped: ${file} (already executed)`);
      // eslint-disable-next-line no-continue
      continue;
    }

    const migrationPath = path.join(migrationsDir, file);
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const migration = require(migrationPath);
    if (typeof migration.up !== 'function') {
      console.log(`⊘ Skip ${file}: no up() function.`);
      // eslint-disable-next-line no-continue
      continue;
    }

    try {
      console.log(`→ Running migration: ${file}`);
      // eslint-disable-next-line no-await-in-loop
      await migration.up(sequelize.getQueryInterface(), Sequelize);

      // Record migration as executed
      // eslint-disable-next-line no-await-in-loop
      await sequelize.query(
        'INSERT INTO sequelize_migrations (name) VALUES (?)',
        {
          replacements: [file]
        }
      );

      console.log(`✓ Completed: ${file}`);
    } catch (error) {
      console.error(`✗ Failed: ${file}`);
      console.error(error.message);
      throw error;
    }
  }
  console.log('✅ All migrations executed.');
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err.message);
      process.exit(1);
    });
}

module.exports = { runMigrations };