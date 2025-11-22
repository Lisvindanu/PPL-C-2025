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

async function runSeeders() {
  try {
    console.log('🌱 Starting database seeding...\n');

    await seedUsers();
    await seedKategori();
    // (previous targeted fraud seeder removed)

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

module.exports = { runSeeders, seedUsers, seedKategori };
