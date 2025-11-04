require('dotenv').config();
const { sequelize } = require('../connection');
const bcrypt = require('bcrypt');

// UUIDs yang akan digunakan (konsisten dengan frontend mock data)
const LAYANAN_UUIDS = {
  1: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  2: 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
  3: 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
  4: 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
  101: 'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b',
  102: 'f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c'
};

async function seedLayanan() {
  try {
    console.log('🌱 Seeding layanan data...');

    // Get freelancer and kategori IDs
    const [freelancers] = await sequelize.query(`
      SELECT id FROM users WHERE role = 'freelancer' LIMIT 2
    `);

    const [kategoris] = await sequelize.query(`
      SELECT id FROM kategori WHERE nama = 'Pengembangan Website' LIMIT 1
    `);

    if (freelancers.length === 0 || kategoris.length === 0) {
      console.log('⚠️  Please seed users and kategori first!');
      return;
    }

    const freelancerId = freelancers[0].id;
    const kategoriId = kategoris[0].id;

    // Check if layanan already exists
    const [existing] = await sequelize.query(`
      SELECT id FROM layanan WHERE id IN (
        '${LAYANAN_UUIDS[1]}',
        '${LAYANAN_UUIDS[2]}',
        '${LAYANAN_UUIDS[3]}',
        '${LAYANAN_UUIDS[4]}',
        '${LAYANAN_UUIDS[101]}',
        '${LAYANAN_UUIDS[102]}'
      )
    `);

    if (existing.length > 0) {
      console.log('⚠️  Layanan already exists. Skipping...');
      return;
    }

    // Insert layanan
    await sequelize.query(`
      INSERT INTO layanan (
        id, freelancer_id, kategori_id, judul, slug, deskripsi,
        harga, waktu_pengerjaan, batas_revisi, rating_rata_rata,
        jumlah_rating, total_pesanan, status, created_at, updated_at
      ) VALUES
      (
        '${LAYANAN_UUIDS[1]}',
        '${freelancerId}',
        '${kategoriId}',
        'Pembuatan Website Landing Page, Company Profile, Toko Online, Kursus Online',
        'pembuatan-website-landing-page',
        'Saya akan membuat website profesional sesuai kebutuhan Anda',
        1500000,
        7,
        3,
        5.0,
        89,
        150,
        'aktif',
        NOW(),
        NOW()
      ),
      (
        '${LAYANAN_UUIDS[2]}',
        '${freelancerId}',
        '${kategoriId}',
        'Company Profile, eCommerce, LMS, Sosial Media & Website Custom',
        'company-profile-ecommerce-lms',
        'Website custom dengan fitur lengkap dan modern',
        2300000,
        14,
        5,
        4.9,
        156,
        200,
        'aktif',
        NOW(),
        NOW()
      ),
      (
        '${LAYANAN_UUIDS[3]}',
        '${freelancerId}',
        '${kategoriId}',
        'Satu Lengkap Website & Aplikasi Mobile-Android, Web-Based, dan iOS Custom',
        'website-aplikasi-mobile-custom',
        'Solusi lengkap web dan mobile app',
        5000000,
        30,
        10,
        4.8,
        203,
        300,
        'aktif',
        NOW(),
        NOW()
      ),
      (
        '${LAYANAN_UUIDS[4]}',
        '${freelancerId}',
        '${kategoriId}',
        'Professional Website Development',
        'professional-website-development',
        'Website development dengan standar profesional',
        3000000,
        14,
        5,
        4.7,
        134,
        180,
        'aktif',
        NOW(),
        NOW()
      ),
      (
        '${LAYANAN_UUIDS[101]}',
        '${freelancerId}',
        '${kategoriId}',
        'Pembuatan Website e-Learning dan Toko Online Profesional (WordPress / Laravel)',
        'website-elearning-toko-online',
        'Website e-learning dan toko online dengan WordPress atau Laravel',
        7500000,
        30,
        10,
        4.9,
        267,
        400,
        'aktif',
        NOW(),
        NOW()
      ),
      (
        '${LAYANAN_UUIDS[102]}',
        '${freelancerId}',
        '${kategoriId}',
        'Full Stack Developer - Website & Mobile App',
        'full-stack-developer',
        'Jasa full stack development untuk web dan mobile',
        4200000,
        21,
        7,
        4.8,
        178,
        250,
        'aktif',
        NOW(),
        NOW()
      )
    `);

    console.log('✅ Layanan seeded successfully!');
    console.log('\n📋 Seeded Service IDs:');
    Object.entries(LAYANAN_UUIDS).forEach(([key, uuid]) => {
      console.log(`   ID ${key}: ${uuid}`);
    });

  } catch (error) {
    console.error('❌ Error seeding layanan:', error.message);
    throw error;
  }
}

if (require.main === module) {
  seedLayanan()
    .then(() => {
      console.log('\n✅ Layanan seeding completed!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seedLayanan, LAYANAN_UUIDS };
