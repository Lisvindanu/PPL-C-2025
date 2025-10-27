require('dotenv').config();
const { sequelize } = require('./src/shared/database/connection');

async function checkData() {
  try {
    // Check users
    const [users] = await sequelize.query('SELECT email, role FROM users');

    // Check kategori
    const [kategori] = await sequelize.query('SELECT nama FROM kategori');

    console.log('\n📊 Data Summary:');
    console.log('━'.repeat(60));
    console.log(`\n👥 Users: ${users.length} records`);
    if (users.length > 0) {
      users.forEach(u => {
        console.log(`   - ${u.email} (${u.role})`);
      });
    }

    console.log(`\n📁 Kategori: ${kategori.length} records`);
    if (kategori.length > 0) {
      kategori.forEach(k => {
        console.log(`   - ${k.nama}`);
      });
    }
    console.log('\n' + '━'.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkData();
