// Mock data untuk testing Service & Create Order flow

export const mockServices = [
  {
    id: 'service-001',
    freelancer_id: 'user-freelancer-001',
    kategori_id: 'cat-001',
    judul: 'Desain Logo Profesional & Modern',
    slug: 'desain-logo-profesional-modern',
    deskripsi: 'Saya akan membuat desain logo yang modern, minimalis, dan profesional untuk brand Anda. Termasuk 3 konsep desain, unlimited revisi, dan file dalam berbagai format (PNG, JPG, SVG, AI).',
    harga: 500000,
    waktu_pengerjaan: 7,
    batas_revisi: 3,
    thumbnail: 'https://placehold.co/600x400/3b82f6/ffffff?text=Logo+Design',
    rating_rata_rata: 4.8,
    jumlah_rating: 45,
    total_pesanan: 120,
    status: 'aktif',
    kategori: {
      id: 'cat-001',
      nama: 'Desain Grafis',
      slug: 'desain-grafis'
    },
    freelancer: {
      id: 'user-freelancer-001',
      nama_depan: 'Andi',
      nama_belakang: 'Wijaya',
      email: 'andi.wijaya@email.com',
      avatar: null,
      rating: 4.9,
      total_pekerjaan: 150
    },
    paket_layanan: [
      {
        id: 'paket-001-basic',
        tipe: 'basic',
        nama: 'Basic',
        deskripsi: '1 konsep logo, 2 revisi, file PNG & JPG',
        harga: 300000,
        waktu_pengerjaan: 5,
        batas_revisi: 2,
        fitur: [
          '1 konsep desain',
          '2 kali revisi',
          'Format PNG & JPG',
          'Resolusi standar'
        ]
      },
      {
        id: 'paket-001-standard',
        tipe: 'standard',
        nama: 'Standard',
        deskripsi: '2 konsep logo, 5 revisi, file PNG, JPG & SVG',
        harga: 500000,
        waktu_pengerjaan: 7,
        batas_revisi: 5,
        fitur: [
          '2 konsep desain',
          '5 kali revisi',
          'Format PNG, JPG & SVG',
          'Resolusi tinggi',
          'Source file'
        ]
      },
      {
        id: 'paket-001-premium',
        tipe: 'premium',
        nama: 'Premium',
        deskripsi: '3 konsep logo, unlimited revisi, semua format',
        harga: 800000,
        waktu_pengerjaan: 10,
        batas_revisi: 99,
        fitur: [
          '3 konsep desain',
          'Unlimited revisi',
          'Semua format (PNG, JPG, SVG, AI, EPS)',
          'Resolusi ultra HD',
          'Source file',
          'Brand guideline'
        ]
      }
    ]
  },
  {
    id: 'service-002',
    freelancer_id: 'user-freelancer-002',
    kategori_id: 'cat-002',
    judul: 'Website Landing Page Modern',
    slug: 'website-landing-page-modern',
    deskripsi: 'Pembuatan landing page yang responsive, modern, dan SEO-friendly. Menggunakan teknologi terkini (React, Tailwind CSS) dengan performa loading yang cepat.',
    harga: 2500000,
    waktu_pengerjaan: 14,
    batas_revisi: 3,
    thumbnail: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Web+Design',
    rating_rata_rata: 4.9,
    jumlah_rating: 32,
    total_pesanan: 85,
    status: 'aktif',
    kategori: {
      id: 'cat-002',
      nama: 'Web Development',
      slug: 'web-development'
    },
    freelancer: {
      id: 'user-freelancer-002',
      nama_depan: 'Siti',
      nama_belakang: 'Rahmawati',
      email: 'siti.rahmawati@email.com',
      avatar: null,
      rating: 4.9,
      total_pekerjaan: 95
    },
    paket_layanan: [
      {
        id: 'paket-002-basic',
        tipe: 'basic',
        nama: 'Basic',
        deskripsi: 'Landing page 1 halaman, responsive',
        harga: 1500000,
        waktu_pengerjaan: 10,
        batas_revisi: 2,
        fitur: [
          '1 halaman landing page',
          'Responsive design',
          'Basic SEO',
          '2 revisi'
        ]
      },
      {
        id: 'paket-002-standard',
        tipe: 'standard',
        nama: 'Standard',
        deskripsi: 'Landing page dengan animasi & form',
        harga: 2500000,
        waktu_pengerjaan: 14,
        batas_revisi: 3,
        fitur: [
          '1-2 halaman',
          'Animasi interaktif',
          'Contact form',
          'SEO optimized',
          '3 revisi'
        ]
      },
      {
        id: 'paket-002-premium',
        tipe: 'premium',
        nama: 'Premium',
        deskripsi: 'Multi-page website dengan CMS',
        harga: 5000000,
        waktu_pengerjaan: 21,
        batas_revisi: 5,
        fitur: [
          'Hingga 5 halaman',
          'CMS integration',
          'Advanced animations',
          'Analytics setup',
          'Full SEO',
          '5 revisi',
          '3 bulan support'
        ]
      }
    ]
  },
  {
    id: 'service-003',
    freelancer_id: 'user-freelancer-003',
    kategori_id: 'cat-003',
    judul: 'Ilustrasi Digital Custom',
    slug: 'ilustrasi-digital-custom',
    deskripsi: 'Membuat ilustrasi digital custom sesuai kebutuhan Anda. Cocok untuk konten sosial media, buku, game, atau branding. Style: anime, semi-realism, cartoon.',
    harga: 300000,
    waktu_pengerjaan: 5,
    batas_revisi: 2,
    thumbnail: 'https://placehold.co/600x400/f59e0b/ffffff?text=Illustration',
    rating_rata_rata: 4.7,
    jumlah_rating: 67,
    total_pesanan: 180,
    status: 'aktif',
    kategori: {
      id: 'cat-003',
      nama: 'Ilustrasi',
      slug: 'ilustrasi'
    },
    freelancer: {
      id: 'user-freelancer-003',
      nama_depan: 'Dimas',
      nama_belakang: 'Prasetyo',
      email: 'dimas.prasetyo@email.com',
      avatar: null,
      rating: 4.8,
      total_pekerjaan: 200
    },
    paket_layanan: [
      {
        id: 'paket-003-basic',
        tipe: 'basic',
        nama: 'Basic',
        deskripsi: '1 karakter simple, background polos',
        harga: 300000,
        waktu_pengerjaan: 5,
        batas_revisi: 2,
        fitur: [
          '1 karakter',
          'Background polos',
          '1 pose',
          'Format PNG',
          '2 revisi'
        ]
      },
      {
        id: 'paket-003-standard',
        tipe: 'standard',
        nama: 'Standard',
        deskripsi: '1 karakter detail dengan background',
        harga: 500000,
        waktu_pengerjaan: 7,
        batas_revisi: 3,
        fitur: [
          '1 karakter detail',
          'Background custom',
          '2 pose',
          'Format PNG & PSD',
          '3 revisi'
        ]
      },
      {
        id: 'paket-003-premium',
        tipe: 'premium',
        nama: 'Premium',
        deskripsi: 'Multiple karakter dengan scene lengkap',
        harga: 1000000,
        waktu_pengerjaan: 10,
        batas_revisi: 5,
        fitur: [
          'Hingga 3 karakter',
          'Background scene lengkap',
          'Multiple pose',
          'Commercial use',
          'Semua format',
          '5 revisi'
        ]
      }
    ]
  },
  {
    id: 'service-004',
    freelancer_id: 'user-freelancer-004',
    kategori_id: 'cat-004',
    judul: 'Video Editing Profesional',
    slug: 'video-editing-profesional',
    deskripsi: 'Jasa editing video untuk YouTube, Instagram, TikTok, atau keperluan bisnis. Termasuk color grading, motion graphics, subtitle, dan sound design.',
    harga: 800000,
    waktu_pengerjaan: 5,
    batas_revisi: 2,
    thumbnail: 'https://placehold.co/600x400/ef4444/ffffff?text=Video+Editing',
    rating_rata_rata: 4.6,
    jumlah_rating: 28,
    total_pesanan: 95,
    status: 'aktif',
    kategori: {
      id: 'cat-004',
      nama: 'Video Editing',
      slug: 'video-editing'
    },
    freelancer: {
      id: 'user-freelancer-004',
      nama_depan: 'Rina',
      nama_belakang: 'Permata',
      email: 'rina.permata@email.com',
      avatar: null,
      rating: 4.7,
      total_pekerjaan: 110
    },
    paket_layanan: [
      {
        id: 'paket-004-basic',
        tipe: 'basic',
        nama: 'Basic',
        deskripsi: 'Video pendek hingga 5 menit',
        harga: 500000,
        waktu_pengerjaan: 3,
        batas_revisi: 1,
        fitur: [
          'Durasi hingga 5 menit',
          'Basic color correction',
          'Simple transitions',
          '1 revisi'
        ]
      },
      {
        id: 'paket-004-standard',
        tipe: 'standard',
        nama: 'Standard',
        deskripsi: 'Video hingga 15 menit dengan motion graphics',
        harga: 800000,
        waktu_pengerjaan: 5,
        batas_revisi: 2,
        fitur: [
          'Durasi hingga 15 menit',
          'Color grading',
          'Motion graphics',
          'Subtitle',
          '2 revisi'
        ]
      },
      {
        id: 'paket-004-premium',
        tipe: 'premium',
        nama: 'Premium',
        deskripsi: 'Video panjang dengan advanced effects',
        harga: 1500000,
        waktu_pengerjaan: 7,
        batas_revisi: 3,
        fitur: [
          'Durasi hingga 30 menit',
          'Advanced color grading',
          'Complex motion graphics',
          'Sound design',
          'Subtitle multi-bahasa',
          '3 revisi'
        ]
      }
    ]
  }
]

// Helper function to get service by ID
export const getServiceById = (id) => {
  return mockServices.find(service => service.id === id)
}

// Helper function to get services by category
export const getServicesByCategory = (categoryId) => {
  if (!categoryId) return mockServices
  return mockServices.filter(service => service.kategori_id === categoryId)
}

// Mock categories
export const mockCategories = [
  { id: 'cat-001', nama: 'Desain Grafis', slug: 'desain-grafis', icon: '🎨' },
  { id: 'cat-002', nama: 'Web Development', slug: 'web-development', icon: '💻' },
  { id: 'cat-003', nama: 'Ilustrasi', slug: 'ilustrasi', icon: '✏️' },
  { id: 'cat-004', nama: 'Video Editing', slug: 'video-editing', icon: '🎬' },
  { id: 'cat-005', nama: 'Copywriting', slug: 'copywriting', icon: '📝' },
  { id: 'cat-006', nama: 'Mobile App', slug: 'mobile-app', icon: '📱' }
]
