/* Reset Database - Drop all tables and recreate fresh */
require('dotenv').config();
const { sequelize } = require('./connection');
const { runMigrations } = require('./migrations');
const { runSeeders } = require('./seeders');

async function resetDatabase() {
  try {
    console.log('🔄 Starting database reset...\n');

    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Get all tables
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
    `);

    if (tables.length > 0) {
      console.log('🗑️  Dropping existing tables...');

      // Disable foreign key checks
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

      // Drop all tables
      for (const table of tables) {
        const tableName = table.TABLE_NAME;
        console.log(`   Dropping table: ${tableName}`);
        await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      }

      // Re-enable foreign key checks
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

      console.log('✅ All tables dropped successfully\n');
    } else {
      console.log('ℹ️  No tables found to drop\n');
    }

    // Run migrations
    console.log('📝 Running migrations...');
    await runMigrations();
    console.log('');

    // Run seeders
    console.log('🌱 Running seeders...');
    await runSeeders();

    console.log('\n✨ Database reset completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  resetDatabase();
}

module.exports = { resetDatabase };
