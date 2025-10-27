require('dotenv').config();
const { sequelize } = require('./src/shared/database/connection');

async function checkTables() {
  try {
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      ORDER BY TABLE_NAME
    `);

    console.log('\n✅ Database Tables:');
    console.log('━'.repeat(60));
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.TABLE_NAME}`);
    });
    console.log('━'.repeat(60));
    console.log(`\n📊 Total: ${tables.length} tables\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTables();
