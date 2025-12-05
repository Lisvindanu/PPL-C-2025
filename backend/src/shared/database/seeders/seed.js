require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { sequelize } = require('../connection');

async function seedDatabase() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    console.log('🌱 Starting database seed...');

    // Generate UUIDs
    const adminId = uuidv4();
    const clientId1 = uuidv4();
    const clientId2 = uuidv4();
    const freelancerId1 = uuidv4();
    const freelancerId2 = uuidv4();
    const kategoriId1 = uuidv4();
    const kategoriId2 = uuidv4();
    const kategoriId3 = uuidv4();
    const layananId1 = uuidv4();
    const layananId2 = uuidv4();
    const paketId1 = uuidv4();
    const paketId2 = uuidv4();
    const pesananId1 = uuidv4();
    const pesananId2 = uuidv4();
    const pesananId3 = uuidv4();
    const pesananId4 = uuidv4();
    const pesananId5 = uuidv4();
    const layananId3 = uuidv4();
    const paketId3 = uuidv4();

    // Check if users already exist
    const [existingUsers] = await sequelize.query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count > 0) {
      console.log('⚠️  Data already exists. Skipping seed.');
      process.exit(0);
    }

    // =============================
    // USERS
    // =============================
    console.log('→ Seeding users...');
    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        email: 'admin@skillconnect.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'admin',
        nama_depan: 'Admin',
        nama_belakang: 'SkillConnect',
        no_telepon: '08123456789',
        is_active: true,
        is_verified: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: clientId1,
        email: 'client1@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'client',
        nama_depan: 'Budi',
        nama_belakang: 'Santoso',
        no_telepon: '08111111111',
        kota: 'Jakarta',
        provinsi: 'DKI Jakarta',
        is_active: true,
        is_verified: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: clientId2,
        email: 'client2@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'client',
        nama_depan: 'Siti',
        nama_belakang: 'Nurhaliza',
        no_telepon: '08222222222',
        kota: 'Bandung',
        provinsi: 'Jawa Barat',
        is_active: true,
        is_verified: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: freelancerId1,
        email: 'freelancer1@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'freelancer',
        nama_depan: 'Ahmad',
        nama_belakang: 'Designer',
        no_telepon: '08333333333',
        kota: 'Surabaya',
        provinsi: 'Jawa Timur',
        bio: 'Expert graphic designer dengan pengalaman 5 tahun',
        is_active: true,
        is_verified: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: freelancerId2,
        email: 'freelancer2@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'freelancer',
        nama_depan: 'Rina',
        nama_belakang: 'Developer',
        no_telepon: '08444444444',
        kota: 'Jakarta',
        provinsi: 'DKI Jakarta',
        bio: 'Full-stack developer specializing in Node.js & React',
        is_active: true,
        is_verified: true,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log('✓ Users seeded');

    // =============================
    // PROFIL FREELANCER
    // =============================
    console.log('→ Seeding profil freelancer...');
    await queryInterface.bulkInsert('profil_freelancer', [
      {
        id: uuidv4(),
        user_id: freelancerId1,
        judul_profesi: 'Expert Logo Designer',
        keahlian: JSON.stringify(['Logo Design', 'Branding', 'UI Design']),
        portfolio_url: 'https://portfolio.ahmad.com',
        total_pekerjaan_selesai: 45,
        rating_rata_rata: 4.8,
        total_ulasan: 42,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        user_id: freelancerId2,
        judul_profesi: 'Senior Web Developer',
        keahlian: JSON.stringify(['Node.js', 'React', 'MySQL', 'REST API']),
        portfolio_url: 'https://portfolio.rina.com',
        total_pekerjaan_selesai: 78,
        rating_rata_rata: 4.9,
        total_ulasan: 72,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log('✓ Profil Freelancer seeded');

    // =============================
    // KATEGORI
    // =============================
    console.log('→ Seeding kategori...');
    await queryInterface.bulkInsert('kategori', [
      {
        id: kategoriId1,
        nama: 'Desain Grafis',
        slug: 'desain-grafis',
        deskripsi: 'Layanan desain grafis profesional',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: kategoriId2,
        nama: 'Pengembangan Web',
        slug: 'pengembangan-web',
        deskripsi: 'Layanan pengembangan website custom',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: kategoriId3,
        nama: 'Copywriting',
        slug: 'copywriting',
        deskripsi: 'Layanan penulisan konten berkualitas',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log('✓ Kategori seeded');

    // =============================
    // SUB KATEGORI
    // =============================
    console.log('→ Seeding sub kategori...');
    await queryInterface.bulkInsert('sub_kategori', [
      // Sub kategori untuk Desain Grafis
      {
        id: uuidv4(),
        id_kategori: kategoriId1,
        nama: 'Logo Design',
        slug: 'logo-design',
        deskripsi: 'Pembuatan logo profesional untuk brand dan bisnis',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        id_kategori: kategoriId1,
        nama: 'Branding & Identity',
        slug: 'branding-identity',
        deskripsi: 'Layanan branding lengkap termasuk logo, color palette, dan guidelines',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        id_kategori: kategoriId1,
        nama: 'Social Media Design',
        slug: 'social-media-design',
        deskripsi: 'Desain konten untuk platform social media',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        id_kategori: kategoriId1,
        nama: 'Illustration',
        slug: 'illustration',
        deskripsi: 'Ilustrasi digital dan hand-drawn untuk berbagai keperluan',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Sub kategori untuk Pengembangan Web
      {
        id: uuidv4(),
        id_kategori: kategoriId2,
        nama: 'Frontend Development',
        slug: 'frontend-development',
        deskripsi: 'Pembuatan tampilan website dengan React, Vue, atau Angular',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        id_kategori: kategoriId2,
        nama: 'Backend Development',
        slug: 'backend-development',
        deskripsi: 'Pengembangan server-side dengan Node.js, PHP, atau Python',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        id_kategori: kategoriId2,
        nama: 'Full-Stack Development',
        slug: 'fullstack-development',
        deskripsi: 'Pengembangan website lengkap frontend & backend',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        id_kategori: kategoriId2,
        nama: 'WordPress Development',
        slug: 'wordpress-development',
        deskripsi: 'Pembuatan dan customization website WordPress',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Sub kategori untuk Copywriting
      {
        id: uuidv4(),
        id_kategori: kategoriId3,
        nama: 'SEO Content Writing',
        slug: 'seo-content-writing',
        deskripsi: 'Penulisan konten SEO-friendly untuk website dan blog',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        id_kategori: kategoriId3,
        nama: 'Product Description',
        slug: 'product-description',
        deskripsi: 'Penulisan deskripsi produk yang menarik untuk e-commerce',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        id_kategori: kategoriId3,
        nama: 'Social Media Copywriting',
        slug: 'social-media-copywriting',
        deskripsi: 'Pembuatan caption dan konten untuk social media',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        id_kategori: kategoriId3,
        nama: 'Email Marketing Copy',
        slug: 'email-marketing-copy',
        deskripsi: 'Penulisan email marketing yang persuasif dan converting',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log('✓ Sub Kategori seeded');

    // =============================
    // LAYANAN
    // =============================
    console.log('→ Seeding layanan...');
    await queryInterface.bulkInsert('layanan', [
      {
        id: layananId1,
        freelancer_id: freelancerId1,
        kategori_id: kategoriId1,
        judul: 'Desain Logo Profesional',
        slug: 'desain-logo-profesional',
        deskripsi: 'Saya akan membuat logo profesional untuk bisnis Anda dengan konsep yang menarik dan modern',
        harga: 250000,
        waktu_pengerjaan: 3,
        batas_revisi: 2,
        rating_rata_rata: 4.8,
        jumlah_rating: 42,
        total_pesanan: 45,
        status: 'aktif',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: layananId2,
        freelancer_id: freelancerId2,
        kategori_id: kategoriId2,
        judul: 'Develop Website React + Node.js',
        slug: 'develop-website-react-nodejs',
        deskripsi: 'Saya akan membuat website modern dengan React frontend dan Node.js backend',
        harga: 5000000,
        waktu_pengerjaan: 20,
        batas_revisi: 5,
        rating_rata_rata: 4.9,
        jumlah_rating: 72,
        total_pesanan: 78,
        status: 'aktif',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: layananId3,
        freelancer_id: freelancerId2,
        kategori_id: kategoriId2,
        judul: 'Aplikasi Mobile React Native',
        slug: 'aplikasi-mobile-react-native',
        deskripsi: 'Pembuatan aplikasi mobile cross-platform dengan React Native untuk Android dan iOS',
        harga: 8000000,
        waktu_pengerjaan: 30,
        batas_revisi: 4,
        rating_rata_rata: 4.85,
        jumlah_rating: 35,
        total_pesanan: 40,
        status: 'aktif',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log('✓ Layanan seeded');

    // =============================
    // PAKET LAYANAN
    // =============================
    console.log('→ Seeding paket layanan...');
    await queryInterface.bulkInsert('paket_layanan', [
      {
        id: paketId1,
        layanan_id: layananId1,
        tipe: 'basic',
        nama: 'Basic Logo',
        deskripsi: 'Logo desain sederhana dengan 2 revisi',
        harga: 250000,
        waktu_pengerjaan: 3,
        batas_revisi: 2,
        fitur: JSON.stringify(['Logo File (AI, PNG, PDF)', '2x Revisi']),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: paketId2,
        layanan_id: layananId2,
        tipe: 'premium',
        nama: 'Premium Web Package',
        deskripsi: 'Website lengkap dengan backend & frontend',
        harga: 5000000,
        waktu_pengerjaan: 20,
        batas_revisi: 5,
        fitur: JSON.stringify(['React Frontend', 'Node.js API', 'Responsive Design', '5x Revisi']),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: paketId3,
        layanan_id: layananId3,
        tipe: 'standard',
        nama: 'Standard Mobile App',
        deskripsi: 'Aplikasi mobile dengan fitur standar',
        harga: 8000000,
        waktu_pengerjaan: 30,
        batas_revisi: 4,
        fitur: JSON.stringify(['React Native App', 'Android & iOS', 'Push Notification', '4x Revisi']),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log('✓ Paket Layanan seeded');

    // =============================
    // PESANAN
    // =============================
    console.log('→ Seeding pesanan...');
    await queryInterface.bulkInsert('pesanan', [
      {
        id: pesananId1,
        nomor_pesanan: 'PES-2025-00001',
        client_id: clientId1,
        freelancer_id: freelancerId1,
        layanan_id: layananId1,
        paket_id: paketId1,
        judul: 'Logo Restoran Seafood',
        deskripsi: 'Butuh logo restoran seafood dengan tema laut',
        catatan_client: 'Mohon warna biru dan putih dominan',
        harga: 250000,
        biaya_platform: 25000,
        total_bayar: 275000,
        waktu_pengerjaan: 3,
        tenggat_waktu: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'dibayar',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: pesananId2,
        nomor_pesanan: 'PES-2025-00002',
        client_id: clientId2,
        freelancer_id: freelancerId2,
        layanan_id: layananId2,
        paket_id: paketId2,
        judul: 'Website Portofolio Pribadi',
        deskripsi: 'Membuat website portofolio profesional untuk menampilkan karya dan profil.',
        catatan_client: 'Gunakan warna biru navy dan layout minimalis.',
        harga: 5000000,
        biaya_platform: 500000,
        total_bayar: 5500000,
        waktu_pengerjaan: 14,
        tenggat_waktu: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'dibayar',
        created_at: new Date(),
        updated_at: new Date()
      },
      // Order dari Client1 ke Freelancer2
      {
        id: pesananId3,
        nomor_pesanan: 'PES-2025-00003',
        client_id: clientId1,
        freelancer_id: freelancerId2,
        layanan_id: layananId2,
        paket_id: paketId2,
        judul: 'Website Toko Online Furniture',
        deskripsi: 'Membuat website e-commerce untuk toko furniture dengan fitur keranjang dan checkout.',
        catatan_client: 'Desain clean dan modern, warna earth tone.',
        harga: 5000000,
        biaya_platform: 500000,
        total_bayar: 5500000,
        waktu_pengerjaan: 20,
        tenggat_waktu: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'dikerjakan',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date()
      },
      // Order dari Client1 ke Freelancer2 (selesai)
      {
        id: pesananId4,
        nomor_pesanan: 'PES-2025-00004',
        client_id: clientId1,
        freelancer_id: freelancerId2,
        layanan_id: layananId3,
        paket_id: paketId3,
        judul: 'Aplikasi Mobile Delivery Makanan',
        deskripsi: 'Aplikasi mobile untuk layanan pesan antar makanan dengan tracking real-time.',
        catatan_client: 'Seperti GoFood tapi lebih simpel.',
        harga: 8000000,
        biaya_platform: 800000,
        total_bayar: 8800000,
        waktu_pengerjaan: 30,
        tenggat_waktu: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dikirim_pada: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        selesai_pada: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'selesai',
        created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      // Order dari Client2 ke Freelancer2 (dalam proses)
      {
        id: pesananId5,
        nomor_pesanan: 'PES-2025-00005',
        client_id: clientId2,
        freelancer_id: freelancerId2,
        layanan_id: layananId3,
        paket_id: paketId3,
        judul: 'Aplikasi Mobile Booking Salon',
        deskripsi: 'Aplikasi booking untuk salon kecantikan dengan fitur jadwal dan pembayaran.',
        catatan_client: 'Warna pink dan putih, feminine look.',
        harga: 8000000,
        biaya_platform: 800000,
        total_bayar: 8800000,
        waktu_pengerjaan: 30,
        tenggat_waktu: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'dikerjakan',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date()
      }
    ]);
    console.log('✓ Pesanan seeded');

    // =============================
    // PEMBAYARAN
    // =============================
    console.log('→ Seeding pembayaran...');
    await queryInterface.bulkInsert('pembayaran', [
      {
        id: uuidv4(),
        pesanan_id: pesananId1,
        user_id: clientId1,
        transaction_id: 'TXN-' + Date.now(),
        jumlah: 250000,
        biaya_platform: 25000,
        total_bayar: 275000,
        metode_pembayaran: 'transfer_bank',
        channel: 'bca_va',
        payment_gateway: 'mock',
        status: 'berhasil',
        nomor_invoice: 'INV-2025-00001',
        dibayar_pada: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        pesanan_id: pesananId2,
        user_id: clientId2,
        transaction_id: 'TXN-' + (Date.now() + 1),
        jumlah: 5000000,
        biaya_platform: 500000,
        total_bayar: 5500000,
        metode_pembayaran: 'e_wallet',
        channel: 'gopay',
        payment_gateway: 'mock',
        status: 'berhasil',
        nomor_invoice: 'INV-2025-00002',
        dibayar_pada: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Pembayaran untuk pesanan Client1 ke Freelancer2
      {
        id: uuidv4(),
        pesanan_id: pesananId3,
        user_id: clientId1,
        transaction_id: 'TXN-' + (Date.now() + 2),
        jumlah: 5000000,
        biaya_platform: 500000,
        total_bayar: 5500000,
        metode_pembayaran: 'transfer_bank',
        channel: 'mandiri_va',
        payment_gateway: 'mock',
        status: 'berhasil',
        nomor_invoice: 'INV-2025-00003',
        dibayar_pada: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      // Pembayaran untuk pesanan selesai Client1 ke Freelancer2
      {
        id: uuidv4(),
        pesanan_id: pesananId4,
        user_id: clientId1,
        transaction_id: 'TXN-' + (Date.now() + 3),
        jumlah: 8000000,
        biaya_platform: 800000,
        total_bayar: 8800000,
        metode_pembayaran: 'qris',
        channel: 'qris',
        payment_gateway: 'mock',
        status: 'berhasil',
        nomor_invoice: 'INV-2025-00004',
        dibayar_pada: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
      },
      // Pembayaran untuk pesanan Client2 ke Freelancer2
      {
        id: uuidv4(),
        pesanan_id: pesananId5,
        user_id: clientId2,
        transaction_id: 'TXN-' + (Date.now() + 4),
        jumlah: 8000000,
        biaya_platform: 800000,
        total_bayar: 8800000,
        metode_pembayaran: 'e_wallet',
        channel: 'ovo',
        payment_gateway: 'mock',
        status: 'berhasil',
        nomor_invoice: 'INV-2025-00005',
        dibayar_pada: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log('✓ Pembayaran seeded');

    // =============================
    // METODE PEMBAYARAN
    // =============================
    console.log('→ Seeding metode pembayaran...');
    await queryInterface.bulkInsert('metode_pembayaran', [
      {
        id: uuidv4(),
        user_id: freelancerId1,
        tipe: 'rekening_bank',
        provider: 'BCA',
        nomor_rekening: '1234567890',
        nama_pemilik: 'Ahmad Designer',
        empat_digit_terakhir: '7890',
        is_default: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        user_id: freelancerId2,
        tipe: 'e_wallet',
        provider: 'GoPay',
        nama_pemilik: 'Rina Developer',
        empat_digit_terakhir: '6789',
        is_default: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log('✓ Metode Pembayaran seeded');

    // =============================
    // PREFERENSI USER
    // =============================
    console.log('→ Seeding preferensi user...');
    await queryInterface.bulkInsert('preferensi_user', [
      {
        id: uuidv4(),
        user_id: clientId1,
        kategori_favorit: JSON.stringify(['desain-grafis', 'copywriting']),
        budget_min: 100000,
        budget_max: 5000000,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        user_id: clientId2,
        kategori_favorit: JSON.stringify(['pengembangan-web']),
        budget_min: 1000000,
        budget_max: 10000000,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    console.log('✓ Preferensi User seeded');

    // =============================
    // DONE
    // =============================
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials (Password: Password123!):');
    console.log('   Admin: admin@skillconnect.com');
    console.log('   Client: client1@example.com, client2@example.com');
    console.log('   Freelancer: freelancer1@example.com, freelancer2@example.com');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
}

seedDatabase();
