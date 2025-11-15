// Mock data untuk testing Order Module
export const mockOrders = [
  {
    id: 'order-001',
    nomor_pesanan: 'ORD-2025-001',
    judul: 'Desain Logo Modern untuk Startup Tech',
    deskripsi: 'Saya membutuhkan desain logo yang modern dan minimalis untuk startup teknologi saya. Logo harus mencerminkan inovasi dan profesionalisme.',
    catatan_client: 'Tolong sertakan 3 variasi warna yang berbeda',
    harga: 500000,
    biaya_platform: 50000,
    total_bayar: 550000,
    waktu_pengerjaan: 7,
    tenggat_waktu: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'menunggu_pembayaran',
    client_id: 'user-client-001',
    freelancer_id: 'user-freelancer-001',
    created_at: new Date('2025-01-15T10:00:00').toISOString(),
    updated_at: new Date('2025-01-15T10:00:00').toISOString(),
    client: {
      id: 'user-client-001',
      nama_depan: 'Budi',
      nama_belakang: 'Santoso',
      email: 'budi.santoso@email.com',
      avatar: null
    },
    freelancer: {
      id: 'user-freelancer-001',
      nama_depan: 'Andi',
      nama_belakang: 'Wijaya',
      email: 'andi.wijaya@email.com',
      avatar: null
    },
    lampiran_client: [
      { name: 'brand-guideline.pdf', url: '#', size: '2.5 MB' },
      { name: 'reference-design.jpg', url: '#', size: '1.2 MB' }
    ],
    statusHistory: [
      {
        from: null,
        to: 'menunggu_pembayaran',
        changedAt: new Date('2025-01-15T10:00:00').toISOString(),
        note: 'Order berhasil dibuat'
      }
    ]
  },
  {
    id: 'order-002',
    nomor_pesanan: 'ORD-2025-002',
    judul: 'Website Company Profile',
    deskripsi: 'Pembuatan website company profile dengan 5 halaman utama (Home, About, Services, Portfolio, Contact)',
    catatan_client: 'Ingin desain yang clean dan profesional, dengan warna biru sebagai warna utama',
    harga: 2500000,
    biaya_platform: 250000,
    total_bayar: 2750000,
    waktu_pengerjaan: 14,
    tenggat_waktu: new Date('2025-02-05T23:59:59').toISOString(),
    status: 'dikerjakan',
    client_id: 'user-client-001',
    freelancer_id: 'user-freelancer-002',
    created_at: new Date('2025-01-10T14:30:00').toISOString(),
    updated_at: new Date('2025-01-22T09:15:00').toISOString(),
    client: {
      id: 'user-client-001',
      nama_depan: 'Budi',
      nama_belakang: 'Santoso',
      email: 'budi.santoso@email.com',
      avatar: null
    },
    freelancer: {
      id: 'user-freelancer-002',
      nama_depan: 'Siti',
      nama_belakang: 'Rahmawati',
      email: 'siti.rahmawati@email.com',
      avatar: null
    },
    lampiran_client: [
      { name: 'company-profile.pdf', url: '#', size: '5.8 MB' },
      { name: 'logo.png', url: '#', size: '256 KB' }
    ],
    statusHistory: [
      {
        from: null,
        to: 'menunggu_pembayaran',
        changedAt: new Date('2025-01-10T14:30:00').toISOString(),
        note: 'Order berhasil dibuat'
      },
      {
        from: 'menunggu_pembayaran',
        to: 'dibayar',
        changedAt: new Date('2025-01-12T16:20:00').toISOString(),
        note: 'Pembayaran berhasil dikonfirmasi'
      },
      {
        from: 'dibayar',
        to: 'dikerjakan',
        changedAt: new Date('2025-01-13T09:00:00').toISOString(),
        note: 'Freelancer mulai mengerjakan project'
      }
    ]
  },
  {
    id: 'order-003',
    nomor_pesanan: 'ORD-2025-003',
    judul: 'Ilustrasi Karakter untuk Game Mobile',
    deskripsi: 'Butuh 5 karakter ilustrasi untuk game mobile RPG. Setiap karakter harus memiliki 3 pose berbeda.',
    catatan_client: 'Style anime/manga, resolusi tinggi untuk game mobile',
    harga: 1500000,
    biaya_platform: 150000,
    total_bayar: 1650000,
    waktu_pengerjaan: 10,
    tenggat_waktu: new Date('2025-01-08T23:59:59').toISOString(),
    status: 'selesai',
    client_id: 'user-client-001',
    freelancer_id: 'user-freelancer-003',
    created_at: new Date('2024-12-20T11:00:00').toISOString(),
    updated_at: new Date('2025-01-08T15:30:00').toISOString(),
    dikirim_pada: new Date('2025-01-08T15:30:00').toISOString(),
    selesai_pada: new Date('2025-01-09T10:00:00').toISOString(),
    client: {
      id: 'user-client-001',
      nama_depan: 'Budi',
      nama_belakang: 'Santoso',
      email: 'budi.santoso@email.com',
      avatar: null
    },
    freelancer: {
      id: 'user-freelancer-003',
      nama_depan: 'Dimas',
      nama_belakang: 'Prasetyo',
      email: 'dimas.prasetyo@email.com',
      avatar: null
    },
    lampiran_client: [
      { name: 'character-references.zip', url: '#', size: '12.5 MB' }
    ],
    lampiran_freelancer: [
      { name: 'character-final-all.zip', url: '#', size: '45.8 MB' },
      { name: 'source-files.psd', url: '#', size: '125.3 MB' }
    ],
    statusHistory: [
      {
        from: null,
        to: 'menunggu_pembayaran',
        changedAt: new Date('2024-12-20T11:00:00').toISOString(),
        note: 'Order berhasil dibuat'
      },
      {
        from: 'menunggu_pembayaran',
        to: 'dibayar',
        changedAt: new Date('2024-12-22T10:15:00').toISOString(),
        note: 'Pembayaran berhasil dikonfirmasi'
      },
      {
        from: 'dibayar',
        to: 'dikerjakan',
        changedAt: new Date('2024-12-23T08:00:00').toISOString(),
        note: 'Freelancer mulai mengerjakan project'
      },
      {
        from: 'dikerjakan',
        to: 'menunggu_review',
        changedAt: new Date('2025-01-08T15:30:00').toISOString(),
        note: 'Pekerjaan selesai, menunggu review dari client'
      },
      {
        from: 'menunggu_review',
        to: 'selesai',
        changedAt: new Date('2025-01-09T10:00:00').toISOString(),
        note: 'Client approve hasil pekerjaan'
      }
    ]
  },
  {
    id: 'order-004',
    nomor_pesanan: 'ORD-2025-004',
    judul: 'Video Editing untuk YouTube',
    deskripsi: 'Editing video YouTube berdurasi 15 menit dengan motion graphics dan color grading',
    catatan_client: 'Sertakan subtitle bahasa Indonesia dan Inggris',
    harga: 800000,
    biaya_platform: 80000,
    total_bayar: 880000,
    waktu_pengerjaan: 5,
    tenggat_waktu: new Date('2025-01-25T23:59:59').toISOString(),
    status: 'dibayar',
    client_id: 'user-client-001',
    freelancer_id: 'user-freelancer-004',
    created_at: new Date('2025-01-18T13:45:00').toISOString(),
    updated_at: new Date('2025-01-20T11:30:00').toISOString(),
    client: {
      id: 'user-client-001',
      nama_depan: 'Budi',
      nama_belakang: 'Santoso',
      email: 'budi.santoso@email.com',
      avatar: null
    },
    freelancer: {
      id: 'user-freelancer-004',
      nama_depan: 'Rina',
      nama_belakang: 'Permata',
      email: 'rina.permata@email.com',
      avatar: null
    },
    lampiran_client: [
      { name: 'raw-footage.mp4', url: '#', size: '2.5 GB' },
      { name: 'audio-background.mp3', url: '#', size: '8.5 MB' }
    ],
    statusHistory: [
      {
        from: null,
        to: 'menunggu_pembayaran',
        changedAt: new Date('2025-01-18T13:45:00').toISOString(),
        note: 'Order berhasil dibuat'
      },
      {
        from: 'menunggu_pembayaran',
        to: 'dibayar',
        changedAt: new Date('2025-01-20T11:30:00').toISOString(),
        note: 'Pembayaran berhasil dikonfirmasi'
      }
    ]
  },
  {
    id: 'order-005',
    nomor_pesanan: 'ORD-2025-005',
    judul: 'Konten Instagram (10 Post)',
    deskripsi: 'Desain 10 post Instagram dengan tema fashion dan lifestyle',
    catatan_client: 'Gunakan palet warna pastel, format square 1080x1080px',
    harga: 600000,
    biaya_platform: 60000,
    total_bayar: 660000,
    waktu_pengerjaan: 3,
    tenggat_waktu: new Date('2025-01-23T23:59:59').toISOString(),
    status: 'dibatalkan',
    client_id: 'user-client-001',
    freelancer_id: 'user-freelancer-001',
    created_at: new Date('2025-01-16T09:00:00').toISOString(),
    updated_at: new Date('2025-01-17T14:20:00').toISOString(),
    client: {
      id: 'user-client-001',
      nama_depan: 'Budi',
      nama_belakang: 'Santoso',
      email: 'budi.santoso@email.com',
      avatar: null
    },
    freelancer: {
      id: 'user-freelancer-001',
      nama_depan: 'Andi',
      nama_belakang: 'Wijaya',
      email: 'andi.wijaya@email.com',
      avatar: null
    },
    lampiran_client: [],
    statusHistory: [
      {
        from: null,
        to: 'menunggu_pembayaran',
        changedAt: new Date('2025-01-16T09:00:00').toISOString(),
        note: 'Order berhasil dibuat'
      },
      {
        from: 'menunggu_pembayaran',
        to: 'dibatalkan',
        changedAt: new Date('2025-01-17T14:20:00').toISOString(),
        note: 'Client membatalkan order karena perubahan kebutuhan'
      }
    ]
  },
  {
    id: 'order-006',
    nomor_pesanan: 'ORD-2025-006',
    judul: 'Aplikasi Mobile To-Do List',
    deskripsi: 'Pembuatan aplikasi mobile to-do list sederhana untuk Android menggunakan React Native',
    catatan_client: 'Fitur: tambah task, edit, delete, mark as complete, filter by status',
    harga: 3500000,
    biaya_platform: 350000,
    total_bayar: 3850000,
    waktu_pengerjaan: 21,
    tenggat_waktu: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'menunggu_review',
    client_id: 'user-client-001',
    freelancer_id: 'user-freelancer-005',
    created_at: new Date('2024-12-28T10:00:00').toISOString(),
    updated_at: new Date('2025-01-20T16:45:00').toISOString(),
    dikirim_pada: new Date('2025-01-20T16:45:00').toISOString(),
    client: {
      id: 'user-client-001',
      nama_depan: 'Budi',
      nama_belakang: 'Santoso',
      email: 'budi.santoso@email.com',
      avatar: null
    },
    freelancer: {
      id: 'user-freelancer-005',
      nama_depan: 'Farhan',
      nama_belakang: 'Ramadhan',
      email: 'farhan.ramadhan@email.com',
      avatar: null
    },
    lampiran_client: [
      { name: 'app-requirements.docx', url: '#', size: '125 KB' },
      { name: 'ui-mockup.fig', url: '#', size: '3.2 MB' }
    ],
    lampiran_freelancer: [
      { name: 'app-apk-file.apk', url: '#', size: '15.8 MB' },
      { name: 'source-code.zip', url: '#', size: '85.5 MB' },
      { name: 'documentation.pdf', url: '#', size: '2.1 MB' }
    ],
    statusHistory: [
      {
        from: null,
        to: 'menunggu_pembayaran',
        changedAt: new Date('2024-12-28T10:00:00').toISOString(),
        note: 'Order berhasil dibuat'
      },
      {
        from: 'menunggu_pembayaran',
        to: 'dibayar',
        changedAt: new Date('2024-12-30T14:15:00').toISOString(),
        note: 'Pembayaran berhasil dikonfirmasi'
      },
      {
        from: 'dibayar',
        to: 'dikerjakan',
        changedAt: new Date('2024-12-31T08:00:00').toISOString(),
        note: 'Freelancer mulai mengerjakan project'
      },
      {
        from: 'dikerjakan',
        to: 'revisi',
        changedAt: new Date('2025-01-15T10:30:00').toISOString(),
        note: 'Client request revisi pada tampilan UI'
      },
      {
        from: 'revisi',
        to: 'dikerjakan',
        changedAt: new Date('2025-01-16T09:00:00').toISOString(),
        note: 'Freelancer mulai mengerjakan revisi'
      },
      {
        from: 'dikerjakan',
        to: 'menunggu_review',
        changedAt: new Date('2025-01-20T16:45:00').toISOString(),
        note: 'Revisi selesai, menunggu approval client'
      }
    ]
  }
]

// Mock single order detail
export const mockOrderDetail = mockOrders[0]

// Mock pagination data
export const mockPaginationData = {
  items: mockOrders,
  pagination: {
    page: 1,
    limit: 10,
    total: 6,
    totalPages: 1
  }
}

// Helper function untuk filter orders by status
export const filterOrdersByStatus = (status) => {
  if (!status || status === 'all') return mockOrders
  return mockOrders.filter(order => order.status === status)
}

// Helper function untuk get order by ID
export const getOrderById = (id) => {
  return mockOrders.find(order => order.id === id)
}
