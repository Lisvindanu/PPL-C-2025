require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../connection');

async function seedOrdersAndPayments() {
  try {
    console.log('🌱 Starting orders & payments seed...\n');

    // Get existing users
    const [users] = await sequelize.query(`
      SELECT id, email, role FROM users
      WHERE role IN ('client', 'freelancer')
      ORDER BY role, email
    `);

    if (users.length < 4) {
      console.log('❌ Need at least 2 clients and 2 freelancers. Please run user seeder first.');
      process.exit(1);
    }

    const clients = users.filter(u => u.role === 'client');
    const freelancers = users.filter(u => u.role === 'freelancer');

    console.log(`✓ Found ${clients.length} clients and ${freelancers.length} freelancers\n`);

    // Get or create kategori
    let [kategori] = await sequelize.query(`SELECT id FROM kategori LIMIT 3`);

    if (kategori.length === 0) {
      console.log('→ Creating kategori...');
      const kategoriIds = [uuidv4(), uuidv4(), uuidv4()];
      await sequelize.query(`
        INSERT INTO kategori (id, nama, slug, deskripsi, is_active, created_at, updated_at)
        VALUES
          (?, 'Desain Grafis', 'desain-grafis', 'Layanan desain grafis profesional', 1, NOW(), NOW()),
          (?, 'Pengembangan Web', 'pengembangan-web', 'Layanan pengembangan website', 1, NOW(), NOW()),
          (?, 'Copywriting', 'copywriting', 'Layanan penulisan konten', 1, NOW(), NOW())
      `, { replacements: kategoriIds });

      [kategori] = await sequelize.query(`SELECT id FROM kategori LIMIT 3`);
      console.log('✓ Kategori created\n');
    }

    // Create profil freelancer if not exists
    const [existingProfiles] = await sequelize.query(
      `SELECT user_id FROM profil_freelancer WHERE user_id IN (?)`,
      { replacements: [freelancers.map(f => f.id)] }
    );

    if (existingProfiles.length < freelancers.length) {
      console.log('→ Creating freelancer profiles...');
      for (const freelancer of freelancers) {
        const exists = existingProfiles.find(p => p.user_id === freelancer.id);
        if (!exists) {
          await sequelize.query(`
            INSERT INTO profil_freelancer
            (id, user_id, judul_profesi, keahlian, total_pekerjaan_selesai, rating_rata_rata, total_ulasan, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `, {
            replacements: [
              uuidv4(),
              freelancer.id,
              'Professional Freelancer',
              JSON.stringify(['Design', 'Development']),
              Math.floor(Math.random() * 50) + 10,
              (Math.random() * 0.5 + 4.5).toFixed(1),
              Math.floor(Math.random() * 40) + 5
            ]
          });
        }
      }
      console.log('✓ Freelancer profiles created\n');
    }

    // Create layanan
    console.log('→ Creating layanan...');
    const layananIds = [];
    const paketIds = [];

    for (let i = 0; i < Math.min(freelancers.length, 3); i++) {
      const layananId = uuidv4();
      const paketId = uuidv4();
      layananIds.push(layananId);
      paketIds.push(paketId);

      const harga = [250000, 500000, 1000000, 2000000, 5000000][Math.floor(Math.random() * 5)];
      const waktu = [3, 5, 7, 14, 20][Math.floor(Math.random() * 5)];

      await sequelize.query(`
        INSERT INTO layanan
        (id, freelancer_id, kategori_id, judul, slug, deskripsi, harga, waktu_pengerjaan, batas_revisi,
         rating_rata_rata, jumlah_rating, total_pesanan, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'aktif', NOW(), NOW())
      `, {
        replacements: [
          layananId,
          freelancers[i].id,
          kategori[i % kategori.length].id,
          `Layanan Profesional ${i + 1}`,
          `layanan-profesional-${layananId}`,
          `Deskripsi layanan profesional yang berkualitas tinggi`,
          harga,
          waktu,
          3,
          (Math.random() * 0.5 + 4.5).toFixed(1),
          Math.floor(Math.random() * 100) + 10,
          Math.floor(Math.random() * 50) + 5
        ]
      });

      // Create paket
      await sequelize.query(`
        INSERT INTO paket_layanan
        (id, layanan_id, tipe, nama, deskripsi, harga, waktu_pengerjaan, batas_revisi, fitur, created_at, updated_at)
        VALUES (?, ?, 'basic', ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, {
        replacements: [
          paketId,
          layananId,
          `Paket Basic ${i + 1}`,
          'Paket dasar dengan fitur lengkap',
          harga,
          waktu,
          3,
          JSON.stringify(['Fitur 1', 'Fitur 2', 'Revisi 3x'])
        ]
      });
    }
    console.log(`✓ Created ${layananIds.length} layanan and paket\n`);

    // Create pesanan dengan berbagai status
    console.log('→ Creating pesanan...');
    const statuses = ['dibayar', 'selesai', 'dibatalkan', 'menunggu_pembayaran'];
    const pesananIds = [];

    // Generate 10 pesanan
    for (let i = 0; i < 10; i++) {
      const pesananId = uuidv4();
      pesananIds.push(pesananId);

      const client = clients[i % clients.length];
      const layananIndex = i % layananIds.length;
      const freelancer = freelancers[layananIndex];
      const status = i < 6 ? 'selesai' : statuses[i % statuses.length]; // 6 selesai, sisanya random

      const harga = [250000, 500000, 750000, 1000000, 2000000][i % 5];
      const biayaPlatform = Math.floor(harga * 0.1);
      const totalBayar = harga + biayaPlatform;

      // Random date dalam 6 bulan terakhir untuk pesanan selesai
      const monthsAgo = Math.floor(Math.random() * 6);
      const createdAt = new Date();
      createdAt.setMonth(createdAt.getMonth() - monthsAgo);

      await sequelize.query(`
        INSERT INTO pesanan
        (id, nomor_pesanan, client_id, freelancer_id, layanan_id, paket_id, judul, deskripsi,
         catatan_client, harga, biaya_platform, total_bayar, waktu_pengerjaan,
         tenggat_waktu, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          pesananId,
          `PES-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}-${pesananId.substring(0, 8)}`,
          client.id,
          freelancer.id,
          layananIds[layananIndex],
          paketIds[layananIndex],
          `Pesanan ${i + 1}`,
          `Deskripsi pesanan untuk layanan profesional`,
          'Mohon dikerjakan dengan baik',
          harga,
          biayaPlatform,
          totalBayar,
          7,
          new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
          status,
          createdAt,
          createdAt
        ]
      });

      // Create pembayaran untuk pesanan yang dibayar atau selesai
      if (status === 'dibayar' || status === 'selesai') {
        await sequelize.query(`
          INSERT INTO pembayaran
          (id, pesanan_id, user_id, transaction_id, jumlah, biaya_platform, total_bayar,
           metode_pembayaran, channel, payment_gateway, status, nomor_invoice,
           dibayar_pada, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'berhasil', ?, ?, ?, ?)
        `, {
          replacements: [
            uuidv4(),
            pesananId,
            client.id,
            `TXN-${Date.now()}-${i}`,
            harga,
            biayaPlatform,
            totalBayar,
            ['transfer_bank', 'e_wallet', 'qris'][i % 3],
            ['bca_va', 'gopay', 'qris'][i % 3],
            'mock',
            `INV-2025-${String(i + 1).padStart(5, '0')}-${pesananId.substring(0, 8)}`,
            createdAt,
            createdAt,
            createdAt
          ]
        });
      }
    }
    console.log(`✓ Created ${pesananIds.length} pesanan\n`);

    // Summary
    const [summary] = await sequelize.query(`
      SELECT
        (SELECT COUNT(*) FROM pesanan) as total_pesanan,
        (SELECT COUNT(*) FROM pesanan WHERE status = 'selesai') as pesanan_selesai,
        (SELECT COUNT(*) FROM pembayaran WHERE status = 'berhasil') as pembayaran_berhasil,
        (SELECT COALESCE(SUM(total_bayar), 0) FROM pembayaran WHERE status = 'berhasil') as total_pendapatan
    `);

    console.log('\n✅ Seeding completed!\n');
    console.log('📊 Summary:');
    console.log('━'.repeat(60));
    console.log(`   Total Pesanan: ${summary[0].total_pesanan}`);
    console.log(`   Pesanan Selesai: ${summary[0].pesanan_selesai}`);
    console.log(`   Pembayaran Berhasil: ${summary[0].pembayaran_berhasil}`);
    console.log(`   Total Pendapatan: Rp ${summary[0].total_pendapatan.toLocaleString('id-ID')}`);
    console.log('━'.repeat(60));

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
}

seedOrdersAndPayments();
