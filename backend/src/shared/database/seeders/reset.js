require('dotenv').config();
const { sequelize } = require('../connection');

async function resetDatabase() {
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    console.log('🗑️  Resetting database...');
    
    // Hapus data sesuai urutan foreign key (dari child ke parent)
    const tables = [
      'preferensi_user',
      'metode_pembayaran',
      'pembayaran',
      'pesanan',
      'paket_layanan',
      'layanan',
      'profil_freelancer',
      'kategori',
      'users'
    ];
    
    for (const table of tables) {
      try {
        await queryInterface.bulkDelete(table, {});
        console.log(`✓ ${table} cleared`);
      } catch (err) {
        console.log(`⚠️  ${table} - ${err.message}`);
      }
    }
    
    console.log('\n✅ Database reset successfully!');
    console.log('   Now run: npm run seed\n');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Reset failed:', error.message);
    console.error(error.stack);
    await sequelize.close();
    process.exit(1);
  }
}

resetDatabase();