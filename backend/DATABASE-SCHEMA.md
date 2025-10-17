# Database Schema - SkillConnect

Skema database untuk 8 modul dengan MySQL. Total **24 tables** (dengan Escrow & Dispute System).

---

## 📋 Daftar Tables (24 Total)

| # | Table | Modul |
|---|-------|-------|
| 1 | `users` | User Management |
| 2 | `user_tokens` | User Management |
| 3 | `profil_freelancer` | User Management |
| 4 | `kategori` | Service Listing |
| 5 | `layanan` | Service Listing |
| 6 | `paket_layanan` | Service Listing |
| 7 | `pesanan` | Order & Booking |
| 8 | `pembayaran` | Payment Gateway |
| 9 | `metode_pembayaran` | Payment Gateway |
| 10 | `escrow` | **Payment Gateway (NEW)** |
| 11 | `revisi` | **Order & Booking (NEW)** |
| 12 | `dispute` | **Order & Booking (NEW)** |
| 13 | `dispute_pesan` | **Order & Booking (NEW)** |
| 14 | `refund` | **Payment Gateway (NEW)** |
| 15 | `pencairan_dana` | **Payment Gateway (NEW)** |
| 16 | `ulasan` | Review & Rating |
| 17 | `percakapan` | Chat & Notification |
| 18 | `pesan` | Chat & Notification |
| 19 | `notifikasi` | Chat & Notification |
| 20 | `log_aktivitas_admin` | Admin Dashboard |
| 21 | `favorit` | Recommendation |
| 22 | `aktivitas_user` | Recommendation |
| 23 | `preferensi_user` | Recommendation |
| 24 | `rekomendasi_layanan` | Recommendation |

---

## Modul 1: User Management

### `users`

```sql
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('client', 'freelancer', 'admin') DEFAULT 'client',

  nama_depan VARCHAR(100),
  nama_belakang VARCHAR(100),
  no_telepon VARCHAR(20),
  avatar VARCHAR(255),
  bio TEXT,
  kota VARCHAR(100),
  provinsi VARCHAR(100),

  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  email_verified_at DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `user_tokens`

```sql
CREATE TABLE user_tokens (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  token VARCHAR(500) NOT NULL,
  type ENUM('email_verification', 'password_reset') NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `profil_freelancer`

```sql
CREATE TABLE profil_freelancer (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL UNIQUE,

  judul_profesi VARCHAR(255),
  keahlian JSON,
  portfolio_url VARCHAR(255),
  total_pekerjaan_selesai INT DEFAULT 0,
  rating_rata_rata DECIMAL(3, 2) DEFAULT 0,
  total_ulasan INT DEFAULT 0,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 2: Service Listing & Search

### `kategori`

```sql
CREATE TABLE kategori (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nama VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  deskripsi TEXT,
  icon VARCHAR(255),
  is_active BOOLEAN DEFAULT true,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `layanan`

```sql
CREATE TABLE layanan (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  freelancer_id CHAR(36) NOT NULL,
  kategori_id CHAR(36) NOT NULL,

  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  deskripsi TEXT NOT NULL,
  harga DECIMAL(10, 2) NOT NULL,
  waktu_pengerjaan INT NOT NULL,
  batas_revisi INT DEFAULT 1,

  thumbnail VARCHAR(255),
  gambar JSON,

  rating_rata_rata DECIMAL(3, 2) DEFAULT 0,
  jumlah_rating INT DEFAULT 0,
  total_pesanan INT DEFAULT 0,
  jumlah_dilihat INT DEFAULT 0,

  status ENUM('draft', 'aktif', 'nonaktif') DEFAULT 'draft',

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE RESTRICT,
  INDEX idx_freelancer_id (freelancer_id),
  INDEX idx_kategori_id (kategori_id),
  INDEX idx_status (status),
  FULLTEXT idx_search (judul, deskripsi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `paket_layanan`

```sql
CREATE TABLE paket_layanan (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  layanan_id CHAR(36) NOT NULL,

  tipe ENUM('basic', 'standard', 'premium') NOT NULL,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  harga DECIMAL(10, 2) NOT NULL,
  waktu_pengerjaan INT NOT NULL,
  batas_revisi INT DEFAULT 1,
  fitur JSON,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE CASCADE,
  UNIQUE KEY unique_layanan_paket (layanan_id, tipe)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 3: Order & Booking System

### `pesanan`

```sql
CREATE TABLE pesanan (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nomor_pesanan VARCHAR(50) NOT NULL UNIQUE,

  client_id CHAR(36) NOT NULL,
  freelancer_id CHAR(36) NOT NULL,
  layanan_id CHAR(36) NOT NULL,
  paket_id CHAR(36),

  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  catatan_client TEXT,

  harga DECIMAL(10, 2) NOT NULL,
  biaya_platform DECIMAL(10, 2) DEFAULT 0,
  total_bayar DECIMAL(10, 2) NOT NULL,

  waktu_pengerjaan INT NOT NULL,
  tenggat_waktu DATETIME,
  dikirim_pada DATETIME,
  selesai_pada DATETIME,

  status ENUM(
    'menunggu_pembayaran',
    'dibayar',
    'dikerjakan',
    'menunggu_review',
    'revisi',
    'selesai',
    'dispute',
    'dibatalkan',
    'refunded'
  ) DEFAULT 'menunggu_pembayaran',

  lampiran_client JSON,
  lampiran_freelancer JSON,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE RESTRICT,
  FOREIGN KEY (paket_id) REFERENCES paket_layanan(id) ON DELETE SET NULL,
  INDEX idx_nomor_pesanan (nomor_pesanan),
  INDEX idx_client_id (client_id),
  INDEX idx_freelancer_id (freelancer_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 4: Payment Gateway

### `pembayaran`

```sql
CREATE TABLE pembayaran (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  pesanan_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,

  transaction_id VARCHAR(255) NOT NULL UNIQUE,
  external_id VARCHAR(255),

  jumlah DECIMAL(10, 2) NOT NULL,
  biaya_platform DECIMAL(10, 2) DEFAULT 0,
  biaya_payment_gateway DECIMAL(10, 2) DEFAULT 0,
  total_bayar DECIMAL(10, 2) NOT NULL,

  metode_pembayaran ENUM(
    'transfer_bank',
    'e_wallet',
    'kartu_kredit',
    'qris',
    'virtual_account'
  ) NOT NULL,
  channel VARCHAR(100),

  payment_gateway ENUM('midtrans', 'xendit', 'manual') NOT NULL,
  payment_url TEXT,

  status ENUM('menunggu', 'berhasil', 'gagal', 'kadaluarsa') DEFAULT 'menunggu',

  callback_data JSON,
  callback_signature VARCHAR(500),

  nomor_invoice VARCHAR(50) UNIQUE,
  invoice_url VARCHAR(255),

  dibayar_pada DATETIME,
  kadaluarsa_pada DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_pesanan_id (pesanan_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `metode_pembayaran`

```sql
CREATE TABLE metode_pembayaran (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,

  tipe ENUM('rekening_bank', 'e_wallet', 'kartu_kredit') NOT NULL,
  provider VARCHAR(100) NOT NULL,

  nomor_rekening VARCHAR(50),
  nama_pemilik VARCHAR(255),
  empat_digit_terakhir VARCHAR(4),

  is_default BOOLEAN DEFAULT false,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `escrow`

**💡 Tabel baru untuk menahan dana (Escrow System)**

```sql
CREATE TABLE escrow (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  pembayaran_id CHAR(36) NOT NULL,
  pesanan_id CHAR(36) NOT NULL,

  jumlah_ditahan DECIMAL(10, 2) NOT NULL,
  biaya_platform DECIMAL(10, 2) DEFAULT 0,

  status ENUM('held', 'released', 'refunded', 'disputed', 'partial_released', 'completed') DEFAULT 'held',

  ditahan_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  akan_dirilis_pada DATETIME,
  dirilis_pada DATETIME,
  alasan TEXT,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (pembayaran_id) REFERENCES pembayaran(id) ON DELETE RESTRICT,
  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id) ON DELETE RESTRICT,
  INDEX idx_pembayaran_id (pembayaran_id),
  INDEX idx_pesanan_id (pesanan_id),
  INDEX idx_status (status),
  INDEX idx_akan_dirilis_pada (akan_dirilis_pada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `revisi`

**💡 Tabel baru untuk tracking request revisi**

```sql
CREATE TABLE revisi (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  pesanan_id CHAR(36) NOT NULL,

  ke_berapa INT NOT NULL,
  catatan TEXT NOT NULL,
  lampiran JSON,

  status ENUM('diminta', 'dikerjakan', 'selesai', 'ditolak') DEFAULT 'diminta',

  diminta_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  selesai_pada DATETIME,
  lampiran_revisi JSON,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id) ON DELETE CASCADE,
  INDEX idx_pesanan_id (pesanan_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `dispute`

**💡 Tabel baru untuk komplain/sengketa**

```sql
CREATE TABLE dispute (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  pesanan_id CHAR(36) NOT NULL,
  pembayaran_id CHAR(36) NOT NULL,
  escrow_id CHAR(36) NOT NULL,
  diajukan_oleh CHAR(36) NOT NULL,

  tipe ENUM('not_as_described', 'low_quality', 'late_delivery', 'communication_issue', 'other') NOT NULL,
  alasan TEXT NOT NULL,
  bukti JSON,

  status ENUM('open', 'under_review', 'resolved', 'closed') DEFAULT 'open',
  keputusan ENUM('client_win', 'freelancer_win', 'partial_refund', 'no_action'),
  alasan_keputusan TEXT,

  dibuka_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diputuskan_pada DATETIME,
  diputuskan_oleh CHAR(36),

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id) ON DELETE RESTRICT,
  FOREIGN KEY (pembayaran_id) REFERENCES pembayaran(id) ON DELETE RESTRICT,
  FOREIGN KEY (escrow_id) REFERENCES escrow(id) ON DELETE RESTRICT,
  FOREIGN KEY (diajukan_oleh) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (diputuskan_oleh) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_pesanan_id (pesanan_id),
  INDEX idx_status (status),
  INDEX idx_diajukan_oleh (diajukan_oleh),
  INDEX idx_diputuskan_oleh (diputuskan_oleh)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `dispute_pesan`

**💡 Chat/komunikasi dalam dispute**

```sql
CREATE TABLE dispute_pesan (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  dispute_id CHAR(36) NOT NULL,
  pengirim_id CHAR(36) NOT NULL,

  pesan TEXT NOT NULL,
  lampiran JSON,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (dispute_id) REFERENCES dispute(id) ON DELETE CASCADE,
  FOREIGN KEY (pengirim_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_dispute_id (dispute_id),
  INDEX idx_pengirim_id (pengirim_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `refund`

**💡 Tabel untuk pengembalian dana**

```sql
CREATE TABLE refund (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  pembayaran_id CHAR(36) NOT NULL,
  escrow_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,

  jumlah_refund DECIMAL(10, 2) NOT NULL,
  alasan TEXT NOT NULL,

  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  transaction_id VARCHAR(255),

  diproses_pada DATETIME,
  selesai_pada DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (pembayaran_id) REFERENCES pembayaran(id) ON DELETE RESTRICT,
  FOREIGN KEY (escrow_id) REFERENCES escrow(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_pembayaran_id (pembayaran_id),
  INDEX idx_escrow_id (escrow_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `pencairan_dana`

**💡 Withdrawal/pencairan dana freelancer**

```sql
CREATE TABLE pencairan_dana (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  escrow_id CHAR(36) NOT NULL,
  freelancer_id CHAR(36) NOT NULL,
  metode_pembayaran_id CHAR(36),

  jumlah DECIMAL(10, 2) NOT NULL,
  biaya_platform DECIMAL(10, 2) DEFAULT 0,
  jumlah_bersih DECIMAL(10, 2) NOT NULL,

  metode_pencairan ENUM('transfer_bank', 'e_wallet') NOT NULL,
  nomor_rekening VARCHAR(50),
  nama_pemilik VARCHAR(255),

  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  bukti_transfer VARCHAR(255),
  catatan TEXT,

  dicairkan_pada DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (escrow_id) REFERENCES escrow(id) ON DELETE RESTRICT,
  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (metode_pembayaran_id) REFERENCES metode_pembayaran(id) ON DELETE SET NULL,
  INDEX idx_escrow_id (escrow_id),
  INDEX idx_freelancer_id (freelancer_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 5: Review & Rating System

### `ulasan`

```sql
CREATE TABLE ulasan (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  pesanan_id CHAR(36) NOT NULL UNIQUE,
  layanan_id CHAR(36) NOT NULL,

  pemberi_ulasan_id CHAR(36) NOT NULL,
  penerima_ulasan_id CHAR(36) NOT NULL,

  rating INT NOT NULL,
  judul VARCHAR(255),
  komentar TEXT NOT NULL,
  gambar JSON,

  balasan TEXT,
  dibalas_pada DATETIME,

  is_approved BOOLEAN DEFAULT true,
  is_reported BOOLEAN DEFAULT false,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id) ON DELETE CASCADE,
  FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE CASCADE,
  FOREIGN KEY (pemberi_ulasan_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (penerima_ulasan_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_layanan_id (layanan_id),
  INDEX idx_rating (rating),

  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 6: Chat & Notification System

### `percakapan`

```sql
CREATE TABLE percakapan (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

  user1_id CHAR(36) NOT NULL,
  user2_id CHAR(36) NOT NULL,
  pesanan_id CHAR(36),

  pesan_terakhir TEXT,
  pesan_terakhir_pada DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id) ON DELETE SET NULL,
  UNIQUE KEY unique_conversation (user1_id, user2_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `pesan`

```sql
CREATE TABLE pesan (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  percakapan_id CHAR(36) NOT NULL,
  pengirim_id CHAR(36) NOT NULL,

  pesan TEXT NOT NULL,
  tipe ENUM('text', 'image', 'file') DEFAULT 'text',
  lampiran JSON,

  is_read BOOLEAN DEFAULT false,
  dibaca_pada DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (percakapan_id) REFERENCES percakapan(id) ON DELETE CASCADE,
  FOREIGN KEY (pengirim_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_percakapan_id (percakapan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `notifikasi`

```sql
CREATE TABLE notifikasi (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,

  tipe ENUM(
    'pesanan_baru',
    'pesanan_diterima',
    'pesanan_ditolak',
    'pesanan_selesai',
    'pembayaran_berhasil',
    'pesan_baru',
    'ulasan_baru'
  ) NOT NULL,

  judul VARCHAR(255) NOT NULL,
  pesan TEXT NOT NULL,

  related_id CHAR(36),
  related_type VARCHAR(50),

  is_read BOOLEAN DEFAULT false,
  dibaca_pada DATETIME,

  dikirim_via_email BOOLEAN DEFAULT false,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Modul 7: Admin Dashboard & Analytics

### `log_aktivitas_admin`

```sql
CREATE TABLE log_aktivitas_admin (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  admin_id CHAR(36) NOT NULL,

  aksi ENUM(
    'block_user',
    'unblock_user',
    'block_service',
    'unblock_service',
    'delete_review',
    'approve_withdrawal',
    'reject_withdrawal',
    'update_user',
    'export_report'
  ) NOT NULL,

  target_type ENUM('user', 'layanan', 'ulasan', 'pesanan', 'pembayaran', 'system') NOT NULL,
  target_id CHAR(36),

  detail JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_admin_id (admin_id),
  INDEX idx_aksi (aksi),
  INDEX idx_target (target_type, target_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Query Examples:**

```sql
-- Statistik user & order
SELECT COUNT(*) FROM users WHERE role = 'freelancer';
SELECT COUNT(*) FROM pesanan WHERE status = 'selesai';

-- Total pendapatan
SELECT SUM(biaya_platform) FROM pembayaran WHERE status = 'berhasil';

-- Blokir user/layanan
UPDATE users SET is_active = false WHERE id = ?;
UPDATE layanan SET status = 'nonaktif' WHERE id = ?;

-- Tren transaksi
SELECT DATE(created_at) as tanggal, COUNT(*), SUM(total_bayar)
FROM pembayaran
WHERE status = 'berhasil'
GROUP BY DATE(created_at);

-- Admin activity audit trail
SELECT a.*, u.email as admin_email
FROM log_aktivitas_admin a
JOIN users u ON a.admin_id = u.id
WHERE a.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY a.created_at DESC;
```

---

## Modul 8: Recommendation & Personalization

### `favorit`

```sql
CREATE TABLE favorit (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  layanan_id CHAR(36) NOT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_layanan (user_id, layanan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `aktivitas_user`

```sql
CREATE TABLE aktivitas_user (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,

  tipe_aktivitas ENUM('lihat_layanan', 'cari', 'tambah_favorit', 'buat_pesanan') NOT NULL,
  layanan_id CHAR(36),
  kata_kunci VARCHAR(255),

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `preferensi_user`

```sql
CREATE TABLE preferensi_user (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL UNIQUE,

  kategori_favorit JSON,
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `rekomendasi_layanan`

```sql
CREATE TABLE rekomendasi_layanan (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  layanan_id CHAR(36) NOT NULL,

  skor DECIMAL(5, 2) NOT NULL,
  alasan VARCHAR(255),

  sudah_ditampilkan BOOLEAN DEFAULT false,
  sudah_diklik BOOLEAN DEFAULT false,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  kadaluarsa_pada DATETIME,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MODUL 1: USER MANAGEMENT                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │      users       │
                    │ (PK: id)         │
                    │                  │
                    │ - email          │
                    │ - password       │
                    │ - role           │
                    │ - nama_depan     │
                    │ - nama_belakang  │
                    │ - no_telepon     │
                    │ - avatar         │
                    │ - is_active      │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        ┌───────▼──────┐          ┌──────▼──────────────┐
        │ user_tokens  │          │ profil_freelancer   │
        │ (PK: id)     │          │ (PK: id)            │
        │              │          │                     │
        │ FK: user_id  │          │ FK: user_id (UNIQUE)│
        │ - token      │          │ - judul_profesi     │
        │ - type       │          │ - keahlian (JSON)   │
        │ - expires_at │          │ - portfolio_url     │
        └──────────────┘          │ - rating_rata_rata  │
                                  │ - total_pekerjaan   │
                                  └─────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    MODUL 2: SERVICE LISTING & SEARCH                         │
└─────────────────────────────────────────────────────────────────────────────┘

        ┌──────────────┐
        │   kategori   │
        │  (PK: id)    │
        │              │
        │ - nama       │
        │ - slug       │
        │ - deskripsi  │
        │ - icon       │
        └──────┬───────┘
               │
               │ 1:N
               ▼
        ┌──────────────────┐
        │     layanan      │─────────┐
        │    (PK: id)      │         │
        │                  │         │
        │ FK: freelancer_id│◄────────┼──────── users (1 freelancer : N services)
        │ FK: kategori_id  │         │
        │                  │         │
        │ - judul          │         │
        │ - slug           │         │
        │ - deskripsi      │         │
        │ - harga          │         │
        │ - waktu_pengerjaan│        │
        │ - rating         │         │
        │ - status         │         │
        └────────┬─────────┘         │
                 │                   │
                 │ 1:N               │
                 ▼                   │
        ┌──────────────────┐         │
        │  paket_layanan   │         │
        │    (PK: id)      │         │
        │                  │         │
        │ FK: layanan_id   │         │
        │                  │         │
        │ - tipe (basic/   │         │
        │   standard/      │         │
        │   premium)       │         │
        │ - nama           │         │
        │ - harga          │         │
        │ - waktu          │         │
        │ - fitur (JSON)   │         │
        └──────────────────┘         │
                                     │
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MODUL 3: ORDER & BOOKING SYSTEM                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
                ▼                    ▼                    │
        ┌──────────────────┐  ┌──────────────┐          │
        │     pesanan      │  │   users      │          │
        │   (PK: id)       │  │  (client)    │          │
        │                  │  └──────────────┘          │
        │ FK: client_id    │◄────────────────────────────┘
        │ FK: freelancer_id│
        │ FK: layanan_id   │
        │ FK: paket_id     │
        │                  │
        │ - nomor_pesanan  │
        │ - judul          │
        │ - harga          │
        │ - total_bayar    │
        │ - status (menunggu/│
        │   diterima/ditolak/│
        │   dikerjakan/dikirim/│
        │   selesai/dibatalkan)│
        │ - tenggat_waktu  │
        │ - lampiran (JSON)│
        └────────┬─────────┘
                 │
         ┌───────┴───────┬────────────────┐
         │               │                │
         │ 1:1           │ 1:1            │ 1:1
         ▼               ▼                ▼

┌─────────────────────────────────────────────────────────────────────────────┐
│                       MODUL 4: PAYMENT GATEWAY                               │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────────┐   ┌───────────────────┐   ┌─────────────────────┐
  │   pembayaran     │   │ metode_pembayaran │   │       users         │
  │   (PK: id)       │   │    (PK: id)       │   └─────────────────────┘
  │                  │   │                   │            │
  │ FK: pesanan_id   │   │ FK: user_id       │◄───────────┘ 1:N
  │ FK: user_id      │   │                   │
  │                  │   │ - tipe (rekening_ │
  │ - transaction_id │   │   bank/e_wallet/  │
  │ - external_id    │   │   kartu_kredit)   │
  │ - jumlah         │   │ - provider        │
  │ - metode         │   │ - nomor_rekening  │
  │ - payment_gateway│   │ - nama_pemilik    │
  │ - status         │   │ - is_default      │
  │ - callback_data  │   └───────────────────┘
  │ - nomor_invoice  │
  └──────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      MODUL 5: REVIEW & RATING SYSTEM                         │
└─────────────────────────────────────────────────────────────────────────────┘

        ┌──────────────────┐
        │     ulasan       │
        │   (PK: id)       │
        │                  │
        │ FK: pesanan_id   │◄──── pesanan (1:1 unique)
        │ FK: layanan_id   │◄──── layanan (1:N)
        │ FK: pemberi_ulasan_id │◄─ users (pemberi, 1:N)
        │ FK: penerima_ulasan_id│◄─ users (penerima, 1:N)
        │                  │
        │ - rating (1-5)   │
        │ - judul          │
        │ - komentar       │
        │ - gambar (JSON)  │
        │ - balasan        │
        │ - is_approved    │
        └──────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                   MODUL 6: CHAT & NOTIFICATION SYSTEM                        │
└─────────────────────────────────────────────────────────────────────────────┘

        ┌──────────────────┐
        │   percakapan     │
        │   (PK: id)       │
        │                  │
        │ FK: user1_id     │◄──── users (N:N self-reference)
        │ FK: user2_id     │◄──── users
        │ FK: pesanan_id   │◄──── pesanan (optional)
        │                  │
        │ - pesan_terakhir │
        │ - pesan_terakhir_│
        │   pada           │
        └────────┬─────────┘
                 │
                 │ 1:N
                 ▼
        ┌──────────────────┐
        │      pesan       │
        │    (PK: id)      │
        │                  │
        │ FK: percakapan_id│
        │ FK: pengirim_id  │◄──── users
        │                  │
        │ - pesan          │
        │ - tipe (text/    │
        │   image/file)    │
        │ - lampiran (JSON)│
        │ - is_read        │
        └──────────────────┘

        ┌──────────────────┐
        │   notifikasi     │
        │    (PK: id)      │
        │                  │
        │ FK: user_id      │◄──── users (1:N)
        │                  │
        │ - tipe (pesanan_baru/│
        │   diterima/ditolak/│
        │   selesai/dll)   │
        │ - judul          │
        │ - pesan          │
        │ - related_id     │
        │ - related_type   │
        │ - is_read        │
        └──────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    MODUL 7: ADMIN DASHBOARD & ANALYTICS                      │
└─────────────────────────────────────────────────────────────────────────────┘

        ┌──────────────────────┐
        │ log_aktivitas_admin  │
        │     (PK: id)         │
        │                      │
        │ FK: admin_id         │◄──── users (admin, 1:N)
        │                      │
        │ - aksi (block_user/  │
        │   unblock_user/      │
        │   delete_review/dll) │
        │ - target_type        │
        │ - target_id          │
        │ - detail (JSON)      │
        │ - ip_address         │
        │ - user_agent         │
        └──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                 MODUL 8: RECOMMENDATION & PERSONALIZATION                    │
└─────────────────────────────────────────────────────────────────────────────┘

        ┌──────────────────┐
        │     favorit      │
        │    (PK: id)      │
        │                  │
        │ FK: user_id      │◄──── users (1:N)
        │ FK: layanan_id   │◄──── layanan (N:N)
        │                  │
        └──────────────────┘

        ┌──────────────────┐
        │ aktivitas_user   │
        │    (PK: id)      │
        │                  │
        │ FK: user_id      │◄──── users (1:N)
        │ FK: layanan_id   │◄──── layanan (optional)
        │                  │
        │ - tipe_aktivitas │
        │   (lihat_layanan/│
        │    cari/favorit/ │
        │    buat_pesanan) │
        │ - kata_kunci     │
        └──────────────────┘

        ┌──────────────────┐
        │ preferensi_user  │
        │    (PK: id)      │
        │                  │
        │ FK: user_id      │◄──── users (1:1 unique)
        │                  │
        │ - kategori_favorit│
        │   (JSON)         │
        │ - budget_min     │
        │ - budget_max     │
        └──────────────────┘

        ┌──────────────────┐
        │ rekomendasi_     │
        │    layanan       │
        │    (PK: id)      │
        │                  │
        │ FK: user_id      │◄──── users (1:N)
        │ FK: layanan_id   │◄──── layanan (N:N)
        │                  │
        │ - skor           │
        │ - alasan         │
        │ - sudah_ditampilkan│
        │ - sudah_diklik   │
        │ - kadaluarsa_pada│
        └──────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                             RINGKASAN RELASI                                 │
└─────────────────────────────────────────────────────────────────────────────┘

users (1) ─────────────> (N) user_tokens
users (1) ─────────────> (1) profil_freelancer
users (1) ─────────────> (N) layanan (as freelancer)
users (1) ─────────────> (N) pesanan (as client)
users (1) ─────────────> (N) pesanan (as freelancer)
users (1) ─────────────> (N) pembayaran
users (1) ─────────────> (N) metode_pembayaran
users (1) ─────────────> (N) ulasan (as pemberi)
users (1) ─────────────> (N) ulasan (as penerima)
users (N) <───────────> (N) percakapan (self M:M)
users (1) ─────────────> (N) pesan (as pengirim)
users (1) ─────────────> (N) notifikasi
users (1) ─────────────> (N) log_aktivitas_admin (as admin)
users (1) ─────────────> (N) favorit
users (1) ─────────────> (N) aktivitas_user
users (1) ─────────────> (1) preferensi_user
users (1) ─────────────> (N) rekomendasi_layanan

kategori (1) ──────────> (N) layanan

layanan (1) ───────────> (N) paket_layanan
layanan (1) ───────────> (N) pesanan
layanan (1) ───────────> (N) ulasan
layanan (1) ───────────> (N) favorit
layanan (1) ───────────> (N) aktivitas_user
layanan (1) ───────────> (N) rekomendasi_layanan

pesanan (1) ───────────> (1) pembayaran
pesanan (1) ───────────> (1) ulasan
pesanan (1) ───────────> (1) percakapan (optional)

percakapan (1) ────────> (N) pesan
```

---

## 🚀 Setup Database

```bash
# 1. Install MySQL
brew install mysql

# 2. Start MySQL
brew services start mysql

# 3. Create database
mysql -u root -p
CREATE DATABASE skillconnect;
USE skillconnect;

# 4. Run migrations (pakai Sequelize CLI)
npx sequelize-cli db:migrate
```

---

## 📝 Notes

- **Primary Key:** CHAR(36) UUID untuk semua table
- **Timestamps:** created_at, updated_at otomatis
- **Soft Delete:** Pakai status field, bukan DELETE
- **Indexes:** Sudah ada di foreign keys dan kolom yang sering di-query
- **Charset:** utf8mb4 untuk support emoji
- **Engine:** InnoDB untuk transaction support

---

**Total: 24 tables (18 core + 6 escrow/dispute system). Perfect untuk Capstone! 🎉**
