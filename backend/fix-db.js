require('dotenv').config();
const { sequelize } = require('./src/shared/database/connection');

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database schema...\n');

    console.log('Disabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Drop all tables in reverse order of dependencies
    const tables = [
      'pencairan_dana',
      'refund',
      'dispute_pesan',
      'dispute',
      'revisi',
      'escrow',
      'ulasan',
      'pembayaran',
      'metode_pembayaran',
      'paket_layanan',
      'pesanan',
      'pesan',
      'percakapan',
      'notifikasi',
      'rekomendasi_layanan',
      'preferensi_user',
      'aktivitas_user',
      'favorit',
      'layanan',
      'sub_kategori',
      'kategori',
      'log_aktivitas_admin',
      'user_tokens',
      'profil_freelancer',
      'users'
    ];

    for (const table of tables) {
      console.log(`Dropping ${table}...`);
      await sequelize.query(`DROP TABLE IF EXISTS ${table}`);
    }

    console.log('\n✅ All tables dropped successfully');

    console.log('Re-enabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\n✅ Database cleaned! Restart the server now to recreate tables.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable on error
    process.exit(1);
  }
}

fixDatabase();
