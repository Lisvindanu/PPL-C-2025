require('dotenv').config();
const { sequelize } = require('../connection');

// Mapping ID lama (integer) ke UUID baru
const LAYANAN_UUID_MAP = {
  // Pengembangan Website
  1: 'a1111111-1111-1111-1111-111111111111',
  2: 'a2222222-2222-2222-2222-222222222222',
  3: 'a3333333-3333-3333-3333-333333333333',
  4: 'a4444444-4444-4444-4444-444444444444',
  101: 'a5555555-5555-5555-5555-555555555555',
  102: 'a6666666-6666-6666-6666-666666666666',
  103: 'a7777777-7777-7777-7777-777777777777',
  104: 'a8888888-8888-8888-8888-888888888888',
  105: 'a9999999-9999-9999-9999-999999999999',
  106: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
};

const layananData = [
  {
    id: 1,
    title: "Pembuatan Website Company Profile Modern & Responsif",
    slug: "pembuatan-website-company-profile-modern",
    deskripsi: "Saya akan membuat website company profile yang modern, responsif, dan professional untuk bisnis Anda",
    harga: 2500000,
    waktu_pengerjaan: 7,
    batas_revisi: 3,
    rating_rata_rata: 4.9,
    jumlah_rating: 127,
    total_pesanan: 200
  },
  {
    id: 2,
    title: "Jasa Pembuatan Website E-Commerce Full Fitur",
    slug: "jasa-pembuatan-website-ecommerce",
    deskripsi: "Website e-commerce lengkap dengan payment gateway, inventory management, dan fitur lengkap lainnya",
    harga: 5000000,
    waktu_pengerjaan: 14,
    batas_revisi: 5,
    rating_rata_rata: 5.0,
    jumlah_rating: 89,
    total_pesanan: 150
  },
  {
    id: 3,
    title: "Website Landing Page untuk Bisnis & Produk",
    slug: "website-landing-page-bisnis-produk",
    deskripsi: "Landing page yang menarik dan conversion-oriented untuk produk atau layanan Anda",
    harga: 1500000,
    waktu_pengerjaan: 5,
    batas_revisi: 2,
    rating_rata_rata: 4.8,
    jumlah_rating: 156,
    total_pesanan: 250
  },
  {
    id: 4,
    title: "Pengembangan Website Portal Berita & Blog",
    slug: "pengembangan-website-portal-berita-blog",
    deskripsi: "Website portal berita atau blog dengan CMS yang mudah digunakan",
    harga: 3000000,
    waktu_pengerjaan: 10,
    batas_revisi: 3,
    rating_rata_rata: 4.7,
    jumlah_rating: 92,
    total_pesanan: 120
  },
  {
    id: 101,
    title: "Website Toko Online UMKM Lengkap & Mudah",
    slug: "website-toko-online-umkm",
    deskripsi: "Toko online khusus untuk UMKM dengan fitur yang mudah digunakan",
    harga: 3500000,
    waktu_pengerjaan: 10,
    batas_revisi: 4,
    rating_rata_rata: 4.9,
    jumlah_rating: 84,
    total_pesanan: 180
  },
  {
    id: 102,
    title: "Jasa Redesign Website Modern & SEO Friendly",
    slug: "jasa-redesign-website-modern-seo",
    deskripsi: "Redesign website lama Anda menjadi modern dan SEO friendly",
    harga: 2000000,
    waktu_pengerjaan: 7,
    batas_revisi: 3,
    rating_rata_rata: 4.8,
    jumlah_rating: 71,
    total_pesanan: 140
  },
  {
    id: 103,
    title: "Website Booking & Reservasi Online",
    slug: "website-booking-reservasi-online",
    deskripsi: "Sistem booking dan reservasi online untuk hotel, restoran, atau layanan lainnya",
    harga: 4000000,
    waktu_pengerjaan: 14,
    batas_revisi: 5,
    rating_rata_rata: 5.0,
    jumlah_rating: 63,
    total_pesanan: 100
  },
  {
    id: 104,
    title: "Website Membership & Learning Management",
    slug: "website-membership-learning-management",
    deskripsi: "Platform membership dan learning management system (LMS)",
    harga: 4500000,
    waktu_pengerjaan: 14,
    batas_revisi: 5,
    rating_rata_rata: 4.7,
    jumlah_rating: 58,
    total_pesanan: 90
  },
  {
    id: 105,
    title: "Website Marketplace Multi Vendor",
    slug: "website-marketplace-multi-vendor",
    deskripsi: "Marketplace dengan sistem multi vendor seperti Tokopedia atau Shopee",
    harga: 8000000,
    waktu_pengerjaan: 30,
    batas_revisi: 10,
    rating_rata_rata: 5.0,
    jumlah_rating: 47,
    total_pesanan: 70
  },
  {
    id: 106,
    title: "Website Portfolio Kreatif & Interaktif",
    slug: "website-portfolio-kreatif-interaktif",
    deskripsi: "Website portfolio yang kreatif dan interaktif untuk profesional",
    harga: 1800000,
    waktu_pengerjaan: 7,
    batas_revisi: 2,
    rating_rata_rata: 4.9,
    jumlah_rating: 94,
    total_pesanan: 160
  }
];

async function seedAllLayanan() {
  try {
    console.log('🌱 Seeding complete layanan data...');

    // Get freelancer and kategori IDs
    const [freelancers] = await sequelize.query(`
      SELECT id FROM users WHERE role = 'freelancer' LIMIT 1
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

    // Check existing layanan
    const uuids = Object.values(LAYANAN_UUID_MAP).map(uuid => `'${uuid}'`).join(',');
    const [existing] = await sequelize.query(`
      SELECT id FROM layanan WHERE id IN (${uuids})
    `);

    if (existing.length > 0) {
      console.log(`⚠️  ${existing.length} layanan already exist. Skipping...`);
      return;
    }

    // Build insert values
    const values = layananData.map(layanan => {
      const uuid = LAYANAN_UUID_MAP[layanan.id];
      return `(
        '${uuid}',
        '${freelancerId}',
        '${kategoriId}',
        ${sequelize.escape(layanan.title)},
        '${layanan.slug}',
        ${sequelize.escape(layanan.deskripsi)},
        ${layanan.harga},
        ${layanan.waktu_pengerjaan},
        ${layanan.batas_revisi},
        ${layanan.rating_rata_rata},
        ${layanan.jumlah_rating},
        ${layanan.total_pesanan},
        'aktif',
        NOW(),
        NOW()
      )`;
    }).join(',\n');

    // Insert layanan
    await sequelize.query(`
      INSERT INTO layanan (
        id, freelancer_id, kategori_id, judul, slug, deskripsi,
        harga, waktu_pengerjaan, batas_revisi, rating_rata_rata,
        jumlah_rating, total_pesanan, status, created_at, updated_at
      ) VALUES ${values}
    `);

    console.log(`✅ ${layananData.length} layanan seeded successfully!`);
    console.log('\n📋 UUID Mapping:');
    Object.entries(LAYANAN_UUID_MAP).forEach(([oldId, uuid]) => {
      const layanan = layananData.find(l => l.id == oldId);
      console.log(`   ID ${oldId}: ${uuid} - ${layanan?.title || 'Unknown'}`);
    });

  } catch (error) {
    console.error('❌ Error seeding layanan:', error.message);
    throw error;
  }
}

if (require.main === module) {
  seedAllLayanan()
    .then(() => {
      console.log('\n✅ Complete layanan seeding finished!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = { seedAllLayanan, LAYANAN_UUID_MAP };
