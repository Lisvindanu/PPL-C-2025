/* Simple migration runner: runs all .js files in migrations folder in order */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const { sequelize } = require('./connection');

async function runMigrations() {
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
    const migrationPath = path.join(migrationsDir, file);
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const migration = require(migrationPath);
    if (typeof migration.up !== 'function') {
      console.log(`Skip ${file}: no up() function.`);
      // eslint-disable-next-line no-continue
      continue;
    }
    console.log(`Running migration: ${file}`);
    // eslint-disable-next-line no-await-in-loop
    try {
      await migration.up(sequelize.getQueryInterface(), Sequelize);
    } catch (err) {
      // If migration failed due to duplicate index name (already applied), skip and continue.
      const isDupIndex = err && (err.original && err.original.code === 'ER_DUP_KEYNAME' || err.code === 'ER_DUP_KEYNAME');
      if (isDupIndex) {
        console.log(`Migration ${file} encountered duplicate index; skipping error and continuing.`);
        continue;
      }
      throw err;
    }
  }
  console.log('All migrations executed.');
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

module.exports = { runMigrations };


