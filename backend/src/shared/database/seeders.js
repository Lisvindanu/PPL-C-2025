/* Database Seeders - Create initial users for testing */
require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('./connection');

async function seedUsers() {
  const password = await bcrypt.hash('password123', 10);

  const users = [
    {
      id: uuidv4(),
      email: 'admin@skillconnect.com',
      password,
      role: 'admin',
      nama_depan: 'Admin',
      nama_belakang: 'SkillConnect',
      no_telepon: '081234567890',
      bio: 'Administrator SkillConnect',
      kota: 'Jakarta',
      provinsi: 'DKI Jakarta',
      is_active: true,
      is_verified: true,
      email_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      email: 'client@skillconnect.com',
      password,
      role: 'client',
      nama_depan: 'John',
      nama_belakang: 'Doe',
      no_telepon: '081234567891',
      bio: 'Looking for skilled freelancers',
      kota: 'Bandung',
      provinsi: 'Jawa Barat',
      is_active: true,
      is_verified: true,
      email_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      email: 'freelancer@skillconnect.com',
      password,
      role: 'freelancer',
      nama_depan: 'Jane',
      nama_belakang: 'Smith',
      no_telepon: '081234567892',
      bio: 'Professional Graphic Designer with 5 years experience',
      kota: 'Surabaya',
      provinsi: 'Jawa Timur',
      is_active: true,
      is_verified: true,
      email_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      email: 'client2@skillconnect.com',
      password,
      role: 'client',
      nama_depan: 'Alice',
      nama_belakang: 'Johnson',
      no_telepon: '081234567893',
      bio: 'Startup founder seeking talented developers',
      kota: 'Yogyakarta',
      provinsi: 'DI Yogyakarta',
      is_active: true,
      is_verified: true,
      email_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      email: 'freelancer2@skillconnect.com',
      password,
      role: 'freelancer',
      nama_depan: 'Bob',
      nama_belakang: 'Williams',
      no_telepon: '081234567894',
      bio: 'Full Stack Developer - React, Node.js, MySQL',
      kota: 'Semarang',
      provinsi: 'Jawa Tengah',
      is_active: true,
      is_verified: true,
      email_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  try {
    // Check if users already exist
    const [existingUsers] = await sequelize.query(
      'SELECT email FROM users WHERE email IN (?)',
      {
        replacements: [users.map(u => u.email)]
      }
    );

    if (existingUsers.length > 0) {
      console.log('⚠️  Some users already exist. Skipping seeding...');
      console.log('Existing emails:', existingUsers.map(u => u.email).join(', '));
      return;
    }

    // Insert users
    await sequelize.query(`
      INSERT INTO users (
        id, email, password, role, nama_depan, nama_belakang,
        no_telepon, bio, kota, provinsi, is_active, is_verified,
        email_verified_at, created_at, updated_at
      ) VALUES ?
    `, {
      replacements: [users.map(u => [
        u.id, u.email, u.password, u.role, u.nama_depan, u.nama_belakang,
        u.no_telepon, u.bio, u.kota, u.provinsi, u.is_active, u.is_verified,
        u.email_verified_at, u.created_at, u.updated_at
      ])]
    });

    console.log('✅ Users seeded successfully!\n');
    console.log('📋 Test Credentials (password: password123):');
    console.log('━'.repeat(60));
    console.log('👤 Admin:');
    console.log('   Email: admin@skillconnect.com');
    console.log('   Password: password123');
    console.log('');
    console.log('👤 Client #1:');
    console.log('   Email: client@skillconnect.com');
    console.log('   Password: password123');
    console.log('');
    console.log('👤 Client #2:');
    console.log('   Email: client2@skillconnect.com');
    console.log('   Password: password123');
    console.log('');
    console.log('👤 Freelancer #1:');
    console.log('   Email: freelancer@skillconnect.com');
    console.log('   Password: password123');
    console.log('');
    console.log('👤 Freelancer #2:');
    console.log('   Email: freelancer2@skillconnect.com');
    console.log('   Password: password123');
    console.log('━'.repeat(60));
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  }
}

async function seedKategori() {
  const kategoris = [
    {
      id: uuidv4(),
      nama: 'Pengembangan Website',
      slug: 'pengembangan-website',
      deskripsi: 'Layanan pengembangan website profesional untuk berbagai kebutuhan bisnis',
      icon: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      nama: 'Pengembangan Aplikasi Mobile',
      slug: 'pengembangan-aplikasi-mobile',
      deskripsi: 'Pembuatan aplikasi mobile Android dan iOS yang inovatif dan user-friendly',
      icon: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      nama: 'UI/UX Design',
      slug: 'ui-ux-design',
      deskripsi: 'Desain antarmuka dan pengalaman pengguna yang menarik dan intuitif',
      icon: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      nama: 'Data Science & Machine Learning',
      slug: 'data-science-machine-learning',
      deskripsi: 'Analisis data dan implementasi machine learning untuk solusi bisnis cerdas',
      icon: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      nama: 'Cybersecurity & Testing',
      slug: 'cybersecurity-testing',
      deskripsi: 'Layanan keamanan siber dan pengujian aplikasi untuk melindungi sistem Anda',
      icon: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: uuidv4(),
      nama: 'Copy Writing',
      slug: 'copy-writing',
      deskripsi: 'Penulisan konten kreatif dan persuasif untuk berbagai kebutuhan marketing',
      icon: null,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  try {
    // Check if kategori already exist
    const [existingKategori] = await sequelize.query(
      'SELECT nama FROM kategori WHERE nama IN (?)',
      {
        replacements: [kategoris.map(k => k.nama)]
      }
    );

    if (existingKategori.length > 0) {
      console.log('⚠️  Some categories already exist. Skipping seeding...');
      console.log('Existing categories:', existingKategori.map(k => k.nama).join(', '));
      return;
    }

    // Insert kategori
    await sequelize.query(`
      INSERT INTO kategori (
        id, nama, slug, deskripsi, icon, is_active, created_at, updated_at
      ) VALUES ?
    `, {
      replacements: [kategoris.map(k => [
        k.id, k.nama, k.slug, k.deskripsi, k.icon, k.is_active, k.created_at, k.updated_at
      ])]
    });

    console.log('✅ Kategori seeded successfully!\n');
    console.log('📋 Categories Added:');
    console.log('━'.repeat(60));
    kategoris.forEach(k => {
      console.log(`   - ${k.nama}`);
    });
    console.log('━'.repeat(60));
  } catch (error) {
    console.error('❌ Kategori seeding failed:', error.message);
    throw error;
  }
}

async function seedLayanan() {
  try {
    // Get freelancers and kategori
    const [freelancers] = await sequelize.query(
      "SELECT id FROM users WHERE role = 'freelancer' ORDER BY created_at LIMIT 2"
    );

    const [kategori] = await sequelize.query(
      "SELECT id, nama FROM kategori ORDER BY created_at"
    );

    if (freelancers.length === 0) {
      console.log('⚠️  No freelancers found. Please run seedUsers first.');
      return;
    }

    if (kategori.length === 0) {
      console.log('⚠️  No categories found. Please run seedKategori first.');
      return;
    }

    const layanan = [
      {
        id: uuidv4(),
        freelancer_id: freelancers[0].id,
        kategori_id: kategori[0].id, // Pengembangan Website
        judul: 'Pembuatan Website Company Profile Profesional',
        slug: 'pembuatan-website-company-profile',
        deskripsi: 'Jasa pembuatan website company profile yang modern, responsive, dan SEO-friendly. Cocok untuk perusahaan yang ingin meningkatkan kredibilitas online.',
        harga: 5000000,
        waktu_pengerjaan: 14,
        batas_revisi: 3,
        thumbnail: null,
        gambar: null,
        rating_rata_rata: 4.8,
        jumlah_rating: 15,
        total_pesanan: 25,
        jumlah_dilihat: 150,
        status: 'aktif',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        freelancer_id: freelancers[1].id,
        kategori_id: kategori[0].id, // Pengembangan Website
        judul: 'Pembuatan Website E-Commerce Modern',
        slug: 'pembuatan-website-ecommerce',
        deskripsi: 'Layanan pembuatan toko online lengkap dengan sistem pembayaran, manajemen produk, dan dashboard admin. Siap untuk bisnis online Anda!',
        harga: 12000000,
        waktu_pengerjaan: 30,
        batas_revisi: 5,
        thumbnail: null,
        gambar: null,
        rating_rata_rata: 4.9,
        jumlah_rating: 22,
        total_pesanan: 18,
        jumlah_dilihat: 230,
        status: 'aktif',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        freelancer_id: freelancers[0].id,
        kategori_id: kategori[1].id, // Aplikasi Mobile
        judul: 'Pengembangan Aplikasi Mobile Android & iOS',
        slug: 'pengembangan-aplikasi-mobile',
        deskripsi: 'Jasa pengembangan aplikasi mobile cross-platform menggunakan React Native. Satu kode untuk Android dan iOS dengan performa native.',
        harga: 15000000,
        waktu_pengerjaan: 45,
        batas_revisi: 3,
        thumbnail: null,
        gambar: null,
        rating_rata_rata: 4.7,
        jumlah_rating: 12,
        total_pesanan: 10,
        jumlah_dilihat: 180,
        status: 'aktif',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        freelancer_id: freelancers[1].id,
        kategori_id: kategori[2].id, // UI/UX Design
        judul: 'Desain UI/UX Website & Aplikasi Mobile',
        slug: 'desain-ui-ux-modern',
        deskripsi: 'Layanan desain antarmuka yang user-friendly dan menarik. Termasuk wireframe, prototype, dan design system lengkap.',
        harga: 4000000,
        waktu_pengerjaan: 10,
        batas_revisi: 5,
        thumbnail: null,
        gambar: null,
        rating_rata_rata: 5.0,
        jumlah_rating: 28,
        total_pesanan: 35,
        jumlah_dilihat: 320,
        status: 'aktif',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        freelancer_id: freelancers[0].id,
        kategori_id: kategori[3].id, // Data Science
        judul: 'Analisis Data & Machine Learning untuk Bisnis',
        slug: 'analisis-data-machine-learning',
        deskripsi: 'Jasa analisis data dan implementasi model machine learning untuk optimasi bisnis. Termasuk dashboard visualisasi dan prediksi.',
        harga: 8000000,
        waktu_pengerjaan: 21,
        batas_revisi: 2,
        thumbnail: null,
        gambar: null,
        rating_rata_rata: 4.6,
        jumlah_rating: 8,
        total_pesanan: 12,
        jumlah_dilihat: 95,
        status: 'aktif',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        freelancer_id: freelancers[1].id,
        kategori_id: kategori[4].id, // Cybersecurity
        judul: 'Penetration Testing & Security Audit',
        slug: 'penetration-testing-audit',
        deskripsi: 'Layanan pengujian keamanan aplikasi dan website. Identifikasi celah keamanan sebelum hacker jahat menemukannya!',
        harga: 6000000,
        waktu_pengerjaan: 7,
        batas_revisi: 1,
        thumbnail: null,
        gambar: null,
        rating_rata_rata: 4.8,
        jumlah_rating: 10,
        total_pesanan: 15,
        jumlah_dilihat: 120,
        status: 'aktif',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        freelancer_id: freelancers[0].id,
        kategori_id: kategori[5].id, // Copy Writing
        judul: 'Jasa Penulisan Konten SEO & Marketing',
        slug: 'penulisan-konten-seo',
        deskripsi: 'Layanan penulisan artikel SEO-friendly untuk website, blog, dan sosial media. Meningkatkan traffic organik dan engagement.',
        harga: 1500000,
        waktu_pengerjaan: 5,
        batas_revisi: 3,
        thumbnail: null,
        gambar: null,
        rating_rata_rata: 4.9,
        jumlah_rating: 35,
        total_pesanan: 50,
        jumlah_dilihat: 420,
        status: 'aktif',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        freelancer_id: freelancers[1].id,
        kategori_id: kategori[0].id, // Pengembangan Website
        judul: 'Landing Page Conversion Optimization',
        slug: 'landing-page-conversion',
        deskripsi: 'Pembuatan landing page yang dirancang khusus untuk konversi tinggi. Termasuk A/B testing dan analisis performa.',
        harga: 3500000,
        waktu_pengerjaan: 7,
        batas_revisi: 4,
        thumbnail: null,
        gambar: null,
        rating_rata_rata: 4.7,
        jumlah_rating: 18,
        total_pesanan: 22,
        jumlah_dilihat: 165,
        status: 'aktif',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Check if layanan already exist
    const [existingLayanan] = await sequelize.query(
      'SELECT slug FROM layanan WHERE slug IN (?)',
      {
        replacements: [layanan.map(l => l.slug)]
      }
    );

    if (existingLayanan.length > 0) {
      console.log('⚠️  Some services already exist. Skipping seeding...');
      console.log('Existing services:', existingLayanan.map(l => l.slug).join(', '));
      return;
    }

    // Insert layanan
    await sequelize.query(`
      INSERT INTO layanan (
        id, freelancer_id, kategori_id, judul, slug, deskripsi, harga,
        waktu_pengerjaan, batas_revisi, thumbnail, gambar,
        rating_rata_rata, jumlah_rating, total_pesanan, jumlah_dilihat,
        status, created_at, updated_at
      ) VALUES ?
    `, {
      replacements: [layanan.map(l => [
        l.id, l.freelancer_id, l.kategori_id, l.judul, l.slug, l.deskripsi, l.harga,
        l.waktu_pengerjaan, l.batas_revisi, l.thumbnail, l.gambar,
        l.rating_rata_rata, l.jumlah_rating, l.total_pesanan, l.jumlah_dilihat,
        l.status, l.created_at, l.updated_at
      ])]
    });

    console.log('✅ Layanan seeded successfully!\n');
    console.log('📋 Services Added:');
    console.log('━'.repeat(60));
    layanan.forEach((l, idx) => {
      console.log(`   ${idx + 1}. ${l.judul}`);
      console.log(`      Price: Rp ${l.harga.toLocaleString('id-ID')}`);
      console.log(`      Rating: ${l.rating_rata_rata} (${l.jumlah_rating} reviews)`);
      console.log(`      Orders: ${l.total_pesanan}`);
      console.log('');
    });
    console.log('━'.repeat(60));
  } catch (error) {
    console.error('❌ Layanan seeding failed:', error.message);
    throw error;
  }
}

async function runSeeders() {
  try {
    console.log('🌱 Starting database seeding...\n');

    await seedUsers();
    await seedKategori();
    await seedLayanan();

    console.log('\n✅ All seeders completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runSeeders();
}

module.exports = { runSeeders, seedUsers, seedKategori, seedLayanan };

console.log("File ini tidak digunakan. Jalankan: src/shared/database/seeders/seed.js");

