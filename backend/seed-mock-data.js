/**
 * Seeder untuk populate database dengan mock data dari frontend
 * Data 100% sama dengan mock data yang ada di ServicesGrid.jsx
 */

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Database connection
const sequelize = new Sequelize('PPL_2025_C', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

// Define models
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('client', 'freelancer', 'admin'),
    defaultValue: 'freelancer'
  },
  nama_depan: DataTypes.STRING,
  nama_belakang: DataTypes.STRING,
  no_telepon: DataTypes.STRING,
  avatar: DataTypes.STRING,
  bio: DataTypes.TEXT,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  underscored: true
});

const Kategori = sequelize.define('Kategori', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  deskripsi: DataTypes.TEXT,
  icon: DataTypes.STRING,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'kategori',
  underscored: true
});

const Layanan = sequelize.define('Layanan', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  freelancer_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  kategori_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  waktu_pengerjaan: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 7
  },
  batas_revisi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  thumbnail: DataTypes.STRING,
  gambar: DataTypes.JSON,
  rating_rata_rata: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  jumlah_rating: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_pesanan: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  jumlah_dilihat: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'aktif', 'nonaktif'),
    defaultValue: 'aktif'
  }
}, {
  tableName: 'layanan',
  underscored: true
});

// Mock data
const mockCategories = [
  { id: 1, nama: 'Pengembangan Website', slug: 'pengembangan-website', deskripsi: 'Layanan pembuatan dan pengembangan website profesional' },
  { id: 2, nama: 'Pengembangan Aplikasi Mobile', slug: 'pengembangan-aplikasi-mobile', deskripsi: 'Layanan pembuatan aplikasi mobile iOS dan Android' },
  { id: 3, nama: 'UI/UX Design', slug: 'ui-ux-design', deskripsi: 'Layanan desain antarmuka dan pengalaman pengguna' },
  { id: 4, nama: 'Data Science & Machine Learning', slug: 'data-science-machine-learning', deskripsi: 'Layanan analisis data dan machine learning' },
  { id: 5, nama: 'Cybersecurity & Testing', slug: 'cybersecurity-testing', deskripsi: 'Layanan keamanan siber dan testing' },
  { id: 6, nama: 'Copy Writing', slug: 'copy-writing', deskripsi: 'Layanan penulisan konten profesional' }
];

const mockFreelancers = [
  { nama: "Ahmad Rizki", email: "ahmad.rizki@skillconnect.test" },
  { nama: "Siti Nurhaliza", email: "siti.nurhaliza@skillconnect.test" },
  { nama: "Budi Santoso", email: "budi.santoso@skillconnect.test" },
  { nama: "Diana Putri", email: "diana.putri@skillconnect.test" },
  { nama: "Rudi Hartono", email: "rudi.hartono@skillconnect.test" },
  { nama: "Linda Kusuma", email: "linda.kusuma@skillconnect.test" },
  { nama: "Andi Wijaya", email: "andi.wijaya@skillconnect.test" },
  { nama: "Dian Permata", email: "dian.permata@skillconnect.test" },
  { nama: "Hendra Gunawan", email: "hendra.gunawan@skillconnect.test" },
  { nama: "Sari Indah", email: "sari.indah@skillconnect.test" },
  { nama: "Eko Prasetyo", email: "eko.prasetyo@skillconnect.test" },
  { nama: "Rina Wijaya", email: "rina.wijaya@skillconnect.test" },
  { nama: "Faisal Rahman", email: "faisal.rahman@skillconnect.test" },
  { nama: "Maya Sari", email: "maya.sari@skillconnect.test" },
  { nama: "Rizky Pratama", email: "rizky.pratama@skillconnect.test" },
  { nama: "Sinta Dewi", email: "sinta.dewi@skillconnect.test" },
  { nama: "Agung Nugroho", email: "agung.nugroho@skillconnect.test" },
  { nama: "Mega Putri", email: "mega.putri@skillconnect.test" },
  { nama: "Bayu Saputra", email: "bayu.saputra@skillconnect.test" },
  { nama: "Kartika Sari", email: "kartika.sari@skillconnect.test" },
  { nama: "Dinda Permata", email: "dinda.permata@skillconnect.test" },
  { nama: "Lina Kartika", email: "lina.kartika@skillconnect.test" },
  { nama: "Reza Firmansyah", email: "reza.firmansyah@skillconnect.test" },
  { nama: "Anisa Rahma", email: "anisa.rahma@skillconnect.test" },
  { nama: "Farhan Alamsyah", email: "farhan.alamsyah@skillconnect.test" },
  { nama: "Wulan Sari", email: "wulan.sari@skillconnect.test" },
  { nama: "Galih Pratama", email: "galih.pratama@skillconnect.test" },
  { nama: "Tari Kusuma", email: "tari.kusuma@skillconnect.test" },
  { nama: "Kevin Wijaya", email: "kevin.wijaya@skillconnect.test" },
  { nama: "Dr. Bambang Sudiro", email: "bambang.sudiro@skillconnect.test" },
  { nama: "Putri Maharani", email: "putri.maharani@skillconnect.test" },
  { nama: "Fitri Nurjanah", email: "fitri.nurjanah@skillconnect.test" },
  { nama: "Dr. Andi Prasetyo", email: "andi.prasetyo@skillconnect.test" },
  { nama: "Sari Wulandari", email: "sari.wulandari@skillconnect.test" },
  { nama: "Indah Permatasari", email: "indah.permatasari@skillconnect.test" },
  { nama: "Ahmad Fauzi", email: "ahmad.fauzi@skillconnect.test" },
  { nama: "Novi Andriani", email: "novi.andriani@skillconnect.test" },
  { nama: "Agus Setiawan", email: "agus.setiawan@skillconnect.test" },
  { nama: "Desi Ratnasari", email: "desi.ratnasari@skillconnect.test" },
  { nama: "Irfan Hakim", email: "irfan.hakim@skillconnect.test" },
  { nama: "Nurul Hidayah", email: "nurul.hidayah@skillconnect.test" },
  { nama: "Dewi Anggraini", email: "dewi.anggraini@skillconnect.test" },
  { nama: "Yoga Pratama", email: "yoga.pratama@skillconnect.test" },
  { nama: "Rina Kusuma", email: "rina.kusuma@skillconnect.test" },
  { nama: "Farhan Ahmad", email: "farhan.ahmad@skillconnect.test" },
  { nama: "Siti Rahayu", email: "siti.rahayu@skillconnect.test" },
  { nama: "Dewi Lestari", email: "dewi.lestari@skillconnect.test" },
  { nama: "Tono Sugiarto", email: "tono.sugiarto@skillconnect.test" },
  { nama: "Ayu Lestari", email: "ayu.lestari@skillconnect.test" },
  { nama: "Fahmi Hidayat", email: "fahmi.hidayat@skillconnect.test" },
  { nama: "Rina Anggraini", email: "rina.anggraini@skillconnect.test" },
  { nama: "Joko Widodo", email: "joko.widodo@skillconnect.test" },
  { nama: "Nina Kusuma", email: "nina.kusuma@skillconnect.test" },
  { nama: "Andi Setiawan", email: "andi.setiawan2@skillconnect.test" }
];

const mockServices = [
  // Pengembangan Website
  { id: "a1111111-1111-1111-1111-111111111111", judul: "Pembuatan Website Company Profile Modern & Responsif", kategori_slug: "pengembangan-website", freelancer: "Ahmad Rizki", rating: 4.9, reviews: 127, harga: 2500000 },
  { id: "a2222222-2222-2222-2222-222222222222", judul: "Jasa Pembuatan Website E-Commerce Full Fitur", kategori_slug: "pengembangan-website", freelancer: "Siti Nurhaliza", rating: 5.0, reviews: 89, harga: 5000000 },
  { id: "a3333333-3333-3333-3333-333333333333", judul: "Website Landing Page untuk Bisnis & Produk", kategori_slug: "pengembangan-website", freelancer: "Budi Santoso", rating: 4.8, reviews: 156, harga: 1500000 },
  { id: "a4444444-4444-4444-4444-444444444444", judul: "Pengembangan Website Portal Berita & Blog", kategori_slug: "pengembangan-website", freelancer: "Diana Putri", rating: 4.7, reviews: 92, harga: 3000000 },
  { id: "a5555555-5555-5555-5555-555555555555", judul: "Website Toko Online UMKM Lengkap & Mudah", kategori_slug: "pengembangan-website", freelancer: "Rudi Hartono", rating: 4.9, reviews: 84, harga: 3500000 },
  { id: "a6666666-6666-6666-6666-666666666666", judul: "Jasa Redesign Website Modern & SEO Friendly", kategori_slug: "pengembangan-website", freelancer: "Linda Kusuma", rating: 4.8, reviews: 71, harga: 2000000 },
  { id: "a7777777-7777-7777-7777-777777777777", judul: "Website Booking & Reservasi Online", kategori_slug: "pengembangan-website", freelancer: "Andi Wijaya", rating: 5.0, reviews: 63, harga: 4000000 },
  { id: "a8888888-8888-8888-8888-888888888888", judul: "Website Membership & Learning Management", kategori_slug: "pengembangan-website", freelancer: "Dian Permata", rating: 4.7, reviews: 58, harga: 4500000 },
  { id: "a9999999-9999-9999-9999-999999999999", judul: "Website Marketplace Multi Vendor", kategori_slug: "pengembangan-website", freelancer: "Hendra Gunawan", rating: 5.0, reviews: 47, harga: 8000000 },
  { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", judul: "Website Portfolio Kreatif & Interaktif", kategori_slug: "pengembangan-website", freelancer: "Sari Indah", rating: 4.9, reviews: 94, harga: 1800000 },

  // Pengembangan Aplikasi Mobile
  { id: "b1111111-1111-1111-1111-111111111111", judul: "Aplikasi Mobile iOS & Android Native", kategori_slug: "pengembangan-aplikasi-mobile", freelancer: "Eko Prasetyo", rating: 4.9, reviews: 73, harga: 8000000 },
  { id: "b2222222-2222-2222-2222-222222222222", judul: "Jasa Pembuatan Aplikasi E-Commerce Mobile", kategori_slug: "pengembangan-aplikasi-mobile", freelancer: "Rina Wijaya", rating: 5.0, reviews: 45, harga: 10000000 },
  { id: "b3333333-3333-3333-3333-333333333333", judul: "Aplikasi Mobile untuk Startup & UMKM", kategori_slug: "pengembangan-aplikasi-mobile", freelancer: "Faisal Rahman", rating: 4.8, reviews: 68, harga: 6000000 },
  { id: "b4444444-4444-4444-4444-444444444444", judul: "Pengembangan Aplikasi Hybrid React Native", kategori_slug: "pengembangan-aplikasi-mobile", freelancer: "Maya Sari", rating: 4.9, reviews: 51, harga: 7000000 },
  { id: "b5555555-5555-5555-5555-555555555555", judul: "Aplikasi Mobile Food Delivery & Ojek Online", kategori_slug: "pengembangan-aplikasi-mobile", freelancer: "Rizky Pratama", rating: 5.0, reviews: 62, harga: 12000000 },
  { id: "b6666666-6666-6666-6666-666666666666", judul: "Aplikasi Mobile Kesehatan & Telemedicine", kategori_slug: "pengembangan-aplikasi-mobile", freelancer: "Sinta Dewi", rating: 4.8, reviews: 48, harga: 9000000 },
  { id: "b7777777-7777-7777-7777-777777777777", judul: "Aplikasi Mobile Point of Sale (POS)", kategori_slug: "pengembangan-aplikasi-mobile", freelancer: "Agung Nugroho", rating: 4.9, reviews: 55, harga: 7500000 },
  { id: "b8888888-8888-8888-8888-888888888888", judul: "Aplikasi Mobile Booking & Tiket Online", kategori_slug: "pengembangan-aplikasi-mobile", freelancer: "Mega Putri", rating: 5.0, reviews: 39, harga: 8500000 },
  { id: "b9999999-9999-9999-9999-999999999999", judul: "Aplikasi Mobile Edukasi & E-Learning", kategori_slug: "pengembangan-aplikasi-mobile", freelancer: "Bayu Saputra", rating: 4.7, reviews: 71, harga: 8000000 },
  { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", judul: "Aplikasi Mobile Fintech & Digital Wallet", kategori_slug: "pengembangan-aplikasi-mobile", freelancer: "Kartika Sari", rating: 5.0, reviews: 44, harga: 15000000 },

  // UI/UX Design
  { id: "c1111111-1111-1111-1111-111111111111", judul: "Desain UI/UX untuk Website & Mobile App", kategori_slug: "ui-ux-design", freelancer: "Dinda Permata", rating: 5.0, reviews: 142, harga: 3500000 },
  { id: "c2222222-2222-2222-2222-222222222222", judul: "Jasa Redesign UI/UX Aplikasi Modern", kategori_slug: "ui-ux-design", freelancer: "Andi Wijaya", rating: 4.9, reviews: 98, harga: 2500000 },
  { id: "c3333333-3333-3333-3333-333333333333", judul: "Prototyping & Wireframing untuk Produk Digital", kategori_slug: "ui-ux-design", freelancer: "Lina Kartika", rating: 4.8, reviews: 76, harga: 2000000 },
  { id: "c4444444-4444-4444-4444-444444444444", judul: "Design System & Component Library", kategori_slug: "ui-ux-design", freelancer: "Reza Firmansyah", rating: 5.0, reviews: 54, harga: 4000000 },
  { id: "c5555555-5555-5555-5555-555555555555", judul: "UI/UX Design untuk E-Commerce & Marketplace", kategori_slug: "ui-ux-design", freelancer: "Anisa Rahma", rating: 4.9, reviews: 87, harga: 3800000 },
  { id: "c6666666-6666-6666-6666-666666666666", judul: "User Research & Usability Testing", kategori_slug: "ui-ux-design", freelancer: "Farhan Alamsyah", rating: 5.0, reviews: 65, harga: 3000000 },
  { id: "c7777777-7777-7777-7777-777777777777", judul: "UI/UX Design Dashboard & Admin Panel", kategori_slug: "ui-ux-design", freelancer: "Wulan Sari", rating: 4.8, reviews: 92, harga: 3200000 },
  { id: "c8888888-8888-8888-8888-888888888888", judul: "Mobile App UI Design iOS & Android", kategori_slug: "ui-ux-design", freelancer: "Galih Pratama", rating: 4.9, reviews: 73, harga: 2800000 },
  { id: "c9999999-9999-9999-9999-999999999999", judul: "Landing Page UI Design High Converting", kategori_slug: "ui-ux-design", freelancer: "Tari Kusuma", rating: 5.0, reviews: 104, harga: 2200000 },
  { id: "cccccccc-cccc-cccc-cccc-cccccccccccc", judul: "Branding & Visual Identity Design", kategori_slug: "ui-ux-design", freelancer: "Kevin Wijaya", rating: 4.7, reviews: 81, harga: 4500000 },

  // Data Science & Machine Learning
  { id: "d1111111-1111-1111-1111-111111111111", judul: "Analisis Data & Visualisasi Dashboard", kategori_slug: "data-science-machine-learning", freelancer: "Dr. Bambang Sudiro", rating: 5.0, reviews: 67, harga: 5000000 },
  { id: "d2222222-2222-2222-2222-222222222222", judul: "Pengembangan Model Machine Learning", kategori_slug: "data-science-machine-learning", freelancer: "Putri Maharani", rating: 4.9, reviews: 43, harga: 8000000 },
  { id: "d3333333-3333-3333-3333-333333333333", judul: "Predictive Analytics untuk Bisnis", kategori_slug: "data-science-machine-learning", freelancer: "Hendra Gunawan", rating: 4.8, reviews: 38, harga: 6000000 },
  { id: "d4444444-4444-4444-4444-444444444444", judul: "Natural Language Processing (NLP) Solutions", kategori_slug: "data-science-machine-learning", freelancer: "Fitri Nurjanah", rating: 5.0, reviews: 29, harga: 9000000 },
  { id: "d5555555-5555-5555-5555-555555555555", judul: "Deep Learning & Neural Network Development", kategori_slug: "data-science-machine-learning", freelancer: "Dr. Andi Prasetyo", rating: 5.0, reviews: 34, harga: 10000000 },
  { id: "d6666666-6666-6666-6666-666666666666", judul: "Big Data Processing & Analytics", kategori_slug: "data-science-machine-learning", freelancer: "Sari Wulandari", rating: 4.9, reviews: 46, harga: 7000000 },
  { id: "d7777777-7777-7777-7777-777777777777", judul: "Computer Vision & Image Recognition", kategori_slug: "data-science-machine-learning", freelancer: "Rudi Hartono", rating: 4.8, reviews: 31, harga: 8500000 },
  { id: "d8888888-8888-8888-8888-888888888888", judul: "Recommender System Development", kategori_slug: "data-science-machine-learning", freelancer: "Indah Permatasari", rating: 5.0, reviews: 28, harga: 6500000 },
  { id: "d9999999-9999-9999-9999-999999999999", judul: "Time Series Forecasting & Analysis", kategori_slug: "data-science-machine-learning", freelancer: "Ahmad Fauzi", rating: 4.9, reviews: 52, harga: 5500000 },
  { id: "dddddddd-dddd-dddd-dddd-dddddddddddd", judul: "AI Chatbot & Conversational AI", kategori_slug: "data-science-machine-learning", freelancer: "Novi Andriani", rating: 4.7, reviews: 67, harga: 7500000 },

  // Cybersecurity & Testing
  { id: "e1111111-1111-1111-1111-111111111111", judul: "Penetration Testing & Security Audit", kategori_slug: "cybersecurity-testing", freelancer: "Agus Setiawan", rating: 5.0, reviews: 52, harga: 7000000 },
  { id: "e2222222-2222-2222-2222-222222222222", judul: "Vulnerability Assessment Website & Aplikasi", kategori_slug: "cybersecurity-testing", freelancer: "Desi Ratnasari", rating: 4.9, reviews: 41, harga: 4000000 },
  { id: "e3333333-3333-3333-3333-333333333333", judul: "QA Testing & Automation Testing", kategori_slug: "cybersecurity-testing", freelancer: "Irfan Hakim", rating: 4.8, reviews: 63, harga: 3000000 },
  { id: "e4444444-4444-4444-4444-444444444444", judul: "Security Monitoring & Incident Response", kategori_slug: "cybersecurity-testing", freelancer: "Nurul Hidayah", rating: 5.0, reviews: 35, harga: 6000000 },
  { id: "e5555555-5555-5555-5555-555555555555", judul: "Web Application Security Testing (OWASP)", kategori_slug: "cybersecurity-testing", freelancer: "Budi Santoso", rating: 4.9, reviews: 48, harga: 5000000 },
  { id: "e6666666-6666-6666-6666-666666666666", judul: "Mobile App Security Assessment", kategori_slug: "cybersecurity-testing", freelancer: "Dewi Anggraini", rating: 5.0, reviews: 37, harga: 5500000 },
  { id: "e7777777-7777-7777-7777-777777777777", judul: "Network Security & Firewall Configuration", kategori_slug: "cybersecurity-testing", freelancer: "Yoga Pratama", rating: 4.8, reviews: 44, harga: 4500000 },
  { id: "e8888888-8888-8888-8888-888888888888", judul: "Secure Code Review & Analysis", kategori_slug: "cybersecurity-testing", freelancer: "Rina Kusuma", rating: 4.9, reviews: 56, harga: 3500000 },
  { id: "e9999999-9999-9999-9999-999999999999", judul: "API Security Testing & Documentation", kategori_slug: "cybersecurity-testing", freelancer: "Farhan Ahmad", rating: 5.0, reviews: 42, harga: 4000000 },
  { id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee", judul: "Cloud Security Assessment (AWS/Azure/GCP)", kategori_slug: "cybersecurity-testing", freelancer: "Siti Rahayu", rating: 4.7, reviews: 33, harga: 6500000 },

  // Copy Writing
  { id: "f1111111-1111-1111-1111-111111111111", judul: "Penulisan Konten Website & Blog SEO Friendly", kategori_slug: "copy-writing", freelancer: "Dewi Lestari", rating: 5.0, reviews: 186, harga: 500000 },
  { id: "f2222222-2222-2222-2222-222222222222", judul: "Copywriting untuk Iklan & Marketing Campaign", kategori_slug: "copy-writing", freelancer: "Tono Sugiarto", rating: 4.9, reviews: 142, harga: 750000 },
  { id: "f3333333-3333-3333-3333-333333333333", judul: "Content Writing untuk Social Media", kategori_slug: "copy-writing", freelancer: "Ayu Lestari", rating: 4.8, reviews: 203, harga: 400000 },
  { id: "f4444444-4444-4444-4444-444444444444", judul: "Technical Writing & Documentation", kategori_slug: "copy-writing", freelancer: "Fahmi Hidayat", rating: 5.0, reviews: 78, harga: 1000000 },
  { id: "f5555555-5555-5555-5555-555555555555", judul: "Email Marketing Copywriting & Campaign", kategori_slug: "copy-writing", freelancer: "Rina Anggraini", rating: 4.9, reviews: 124, harga: 650000 },
  { id: "f6666666-6666-6666-6666-666666666666", judul: "Product Description & E-Commerce Content", kategori_slug: "copy-writing", freelancer: "Joko Widodo", rating: 4.8, reviews: 167, harga: 450000 },
  { id: "f7777777-7777-7777-7777-777777777777", judul: "Landing Page Copywriting High Converting", kategori_slug: "copy-writing", freelancer: "Nina Kusuma", rating: 5.0, reviews: 95, harga: 800000 },
  { id: "f8888888-8888-8888-8888-888888888888", judul: "Press Release & Media Relations Writing", kategori_slug: "copy-writing", freelancer: "Andi Setiawan", rating: 4.9, reviews: 82, harga: 700000 },
  { id: "f9999999-9999-9999-9999-999999999999", judul: "Script Writing untuk Video & Podcast", kategori_slug: "copy-writing", freelancer: "Putri Maharani", rating: 4.7, reviews: 139, harga: 600000 },
  { id: "ffffffff-ffff-ffff-ffff-ffffffffffff", judul: "Brand Storytelling & Company Profile", kategori_slug: "copy-writing", freelancer: "Hendra Gunawan", rating: 5.0, reviews: 101, harga: 900000 }
];

// Helper functions
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitName(fullName) {
  const parts = fullName.split(" ");
  return {
    nama_depan: parts[0],
    nama_belakang: parts.slice(1).join(" ") || parts[0]
  };
}

// Main seeder function
async function seedData() {
  try {
    await sequelize.authenticate();
    console.log("✓ Database connected");

    const hashedPassword = await bcrypt.hash("password123", 10);

    console.log("\n=== Creating Freelancers ===");
    const freelancerMap = {};

    for (const freelancer of mockFreelancers) {
      const { nama_depan, nama_belakang } = splitName(freelancer.nama);

      const [user] = await User.findOrCreate({
        where: { email: freelancer.email },
        defaults: {
          email: freelancer.email,
          password: hashedPassword,
          role: "freelancer",
          nama_depan,
          nama_belakang,
          bio: "Freelancer profesional " + freelancer.nama + " dengan pengalaman bertahun-tahun",
          is_active: true,
          is_verified: true
        }
      });

      freelancerMap[freelancer.nama] = user.id;
      console.log("✓ " + freelancer.nama + " (" + user.email + ")");
    }

    console.log("\n=== Creating Categories ===");
    const kategoriMap = {};

    for (const cat of mockCategories) {
      const [kategori] = await Kategori.findOrCreate({
        where: { slug: cat.slug },
        defaults: {
          nama: cat.nama,
          slug: cat.slug,
          deskripsi: cat.deskripsi,
          is_active: true
        }
      });

      kategoriMap[cat.slug] = kategori.id;
      console.log("✓ " + cat.nama + " (" + cat.slug + ")");
    }

    console.log("\n=== Creating Services ===");
    let created = 0;
    let skipped = 0;

    for (const service of mockServices) {
      const freelancerId = freelancerMap[service.freelancer];
      const kategoriId = kategoriMap[service.kategori_slug];

      if (!freelancerId || !kategoriId) {
        console.log("✗ " + service.judul + " - Missing freelancer or category");
        skipped++;
        continue;
      }

      const [layanan, wasCreated] = await Layanan.findOrCreate({
        where: { id: service.id },
        defaults: {
          id: service.id,
          freelancer_id: freelancerId,
          kategori_id: kategoriId,
          judul: service.judul,
          slug: createSlug(service.judul),
          deskripsi: service.judul + ". Layanan profesional dengan kualitas terbaik dan harga kompetitif. Pengalaman bertahun-tahun melayani klien dari berbagai industri.",
          harga: service.harga,
          waktu_pengerjaan: 7,
          batas_revisi: 2,
          rating_rata_rata: service.rating,
          jumlah_rating: service.reviews,
          total_pesanan: service.reviews,
          jumlah_dilihat: Math.floor(service.reviews * 2.5),
          status: "aktif",
          thumbnail: null,
          gambar: null
        }
      });

      if (wasCreated) {
        created++;
        console.log("✓ " + service.judul);
      } else {
        skipped++;
        console.log("⊘ " + service.judul + " (already exists)");
      }
    }

    console.log("\n=== Summary ===");
    console.log("Freelancers: " + Object.keys(freelancerMap).length);
    console.log("Categories: " + Object.keys(kategoriMap).length);
    console.log("Services Created: " + created);
    console.log("Services Skipped: " + skipped);
    console.log("\n✓ Seeding completed!");

  } catch (error) {
    console.error("✗ Error seeding data:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run seeder
seedData()
  .then(() => {
    console.log("\n✓ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n✗ Failed:", error);
    process.exit(1);
  });
