# Panduan Khusus: Migration & Seeder Modul Payment

**Untuk:** Anin Denin Nadia (223040109)
**Sprint:** 1 - Week 4-5
**Task:** Membuat Migration & Seeder untuk Modul Payment
**Branch:** `be-payment`

---

## 📋 Prerequisites

1. ✅ Sudah install Node.js v20 (lihat `SETUP-NODE-V20.md`)
2. ✅ Sudah clone project dari GitHub
3. ✅ Sudah install dependencies backend (`npm install`)

---

## 🌿 Step 0: Buat Branch `be-payment`

### 0.1 Pastikan di Folder Project

```bash
# Masuk ke folder project
cd /path/ke/project/PPL-C-2025-1
```

### 0.2 Buat Branch Backend Payment

```bash
# Buat branch be-payment (HURUF KECIL SEMUA)
git checkout -b be-payment
```

### 0.3 Verifikasi Branch

```bash
# Cek branch aktif (harus ada tanda bintang di be-payment)
git branch
```

Output yang benar:
```
* be-payment
  main
```

---

## 🚀 Step 1: Generate File Migration

### 1.1 Masuk ke Folder Backend

```bash
cd backend
```

### 1.2 Generate Migration untuk Tabel `payments`

```bash
npx sequelize-cli migration:generate --name create-payments-table
```

**Output:**
```
migrations/XXXXXX-create-payments-table.js created
```

### 1.3 Generate Migration untuk Tabel `payment_methods`

```bash
npx sequelize-cli migration:generate --name create-payment-methods-table
```

**Output:**
```
migrations/XXXXXX-create-payment-methods-table.js created
```

File akan dibuat di: `backend/src/shared/database/migrations/`

---

## 📝 Step 2: Isi File Migration

### 2.1 Edit File Migration `payments`

Buka file `XXXXXX-create-payments-table.js`, **hapus semua isinya**, lalu copy-paste kode ini:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID untuk payment'
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke tabel orders'
      },
      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Transaction ID dari payment gateway'
      },
      payment_method_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'payment_methods',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke payment_methods'
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Jumlah pembayaran dalam Rupiah'
      },
      admin_fee: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Biaya admin dari payment gateway'
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Total = amount + admin_fee'
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed', 'expired', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Status pembayaran'
      },
      payment_url: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'URL redirect ke payment gateway'
      },
      snap_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Snap token dari Midtrans'
      },
      paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu pembayaran berhasil'
      },
      expired_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Waktu payment link expire'
      },
      payment_metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Data tambahan dari webhook'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Buat index untuk optimasi query
    await queryInterface.addIndex('payments', ['order_id']);
    await queryInterface.addIndex('payments', ['transaction_id']);
    await queryInterface.addIndex('payments', ['status']);
    await queryInterface.addIndex('payments', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  }
};
```

**Penjelasan Kolom Tabel `payments`:**
- `id`: Primary key UUID (unique identifier)
- `order_id`: Relasi ke tabel orders (order mana yang dibayar)
- `transaction_id`: ID unik dari Midtrans/payment gateway
- `payment_method_id`: Metode pembayaran yang dipilih (GoPay, BCA VA, dll)
- `amount`: Jumlah yang harus dibayar
- `admin_fee`: Biaya admin payment gateway
- `total_amount`: Total = amount + admin_fee
- `status`: Status pembayaran (pending, success, failed, expired, cancelled)
- `payment_url`: Link redirect ke halaman Midtrans
- `snap_token`: Token untuk popup Midtrans Snap
- `paid_at`: Timestamp kapan dibayar
- `expired_at`: Kapan link payment expire (biasanya 24 jam)
- `payment_metadata`: Data JSON response dari webhook

### 2.2 Edit File Migration `payment_methods`

Buka file `XXXXXX-create-payment-methods-table.js`, **hapus semua isinya**, lalu copy-paste kode ini:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payment_methods', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Kode unik metode (gopay, ovo, bca_va, dll)'
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Nama yang ditampilkan (GoPay, BCA Virtual Account)'
      },
      type: {
        type: Sequelize.ENUM('bank_transfer', 'e_wallet', 'credit_card', 'qris', 'virtual_account'),
        allowNull: false,
        comment: 'Tipe/kategori metode'
      },
      provider: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Provider (GoPay, BCA, Mandiri, dll)'
      },
      icon_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'URL icon/logo'
      },
      admin_fee_type: {
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false,
        defaultValue: 'fixed',
        comment: 'Tipe fee: percentage atau fixed'
      },
      admin_fee_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Nilai fee (2.5 untuk 2.5% atau 4500 untuk Rp 4.500)'
      },
      min_transaction: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Minimum transaksi'
      },
      max_transaction: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Maximum transaksi'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Status aktif/nonaktif'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Deskripsi atau instruksi'
      },
      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Urutan tampilan (1 paling atas)'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Index
    await queryInterface.addIndex('payment_methods', ['code']);
    await queryInterface.addIndex('payment_methods', ['type']);
    await queryInterface.addIndex('payment_methods', ['is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payment_methods');
  }
};
```

**Penjelasan Kolom Tabel `payment_methods`:**
- `id`: Primary key auto increment
- `code`: Kode unik metode (gopay, ovo, bca_va, dll)
- `name`: Nama yang ditampilkan di UI
- `type`: Kategori metode (e_wallet, virtual_account, qris, dll)
- `provider`: Provider/bank (GoPay, BCA, Mandiri)
- `icon_url`: Path logo/icon metode
- `admin_fee_type`: Tipe fee (percentage atau fixed)
- `admin_fee_value`: Nilai fee (2.5 untuk 2.5% atau 4500 untuk Rp 4.500)
- `min_transaction`: Minimal transaksi
- `max_transaction`: Maksimal transaksi
- `is_active`: Status aktif/nonaktif
- `description`: Deskripsi atau instruksi pembayaran
- `display_order`: Urutan tampilan (1 = paling atas)

---

## 🌱 Step 3: Generate & Isi File Seeder

### 3.1 Generate Seeder untuk `payment_methods`

```bash
npx sequelize-cli seed:generate --name seed-payment-methods
```

**Output:**
```
seeders/XXXXXX-seed-payment-methods.js created
```

### 3.2 Edit File Seeder

Buka file `XXXXXX-seed-payment-methods.js`, **hapus semua isinya**, lalu copy-paste kode ini:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('payment_methods', [
      // E-Wallet
      {
        id: 1,
        code: 'gopay',
        name: 'GoPay',
        type: 'e_wallet',
        provider: 'GoPay',
        icon_url: '/assets/icons/gopay.svg',
        admin_fee_type: 'percentage',
        admin_fee_value: 2.00,
        min_transaction: 10000,
        max_transaction: 10000000,
        is_active: true,
        description: 'Bayar dengan GoPay - Gratis biaya admin',
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        code: 'ovo',
        name: 'OVO',
        type: 'e_wallet',
        provider: 'OVO',
        icon_url: '/assets/icons/ovo.svg',
        admin_fee_type: 'percentage',
        admin_fee_value: 2.00,
        min_transaction: 10000,
        max_transaction: 10000000,
        is_active: true,
        description: 'Bayar dengan OVO',
        display_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        code: 'dana',
        name: 'DANA',
        type: 'e_wallet',
        provider: 'DANA',
        icon_url: '/assets/icons/dana.svg',
        admin_fee_type: 'percentage',
        admin_fee_value: 2.00,
        min_transaction: 10000,
        max_transaction: 10000000,
        is_active: true,
        description: 'Bayar dengan DANA',
        display_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        code: 'shopeepay',
        name: 'ShopeePay',
        type: 'e_wallet',
        provider: 'ShopeePay',
        icon_url: '/assets/icons/shopeepay.svg',
        admin_fee_type: 'percentage',
        admin_fee_value: 2.00,
        min_transaction: 10000,
        max_transaction: 10000000,
        is_active: true,
        description: 'Bayar dengan ShopeePay',
        display_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      // QRIS
      {
        id: 5,
        code: 'qris',
        name: 'QRIS',
        type: 'qris',
        provider: 'QRIS',
        icon_url: '/assets/icons/qris.svg',
        admin_fee_type: 'percentage',
        admin_fee_value: 0.70,
        min_transaction: 1000,
        max_transaction: 10000000,
        is_active: true,
        description: 'Scan QRIS dengan aplikasi mobile banking',
        display_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Virtual Account
      {
        id: 6,
        code: 'bca_va',
        name: 'BCA Virtual Account',
        type: 'virtual_account',
        provider: 'BCA',
        icon_url: '/assets/icons/bca.svg',
        admin_fee_type: 'fixed',
        admin_fee_value: 4000,
        min_transaction: 10000,
        max_transaction: 50000000,
        is_active: true,
        description: 'Transfer ke Virtual Account BCA',
        display_order: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        code: 'bni_va',
        name: 'BNI Virtual Account',
        type: 'virtual_account',
        provider: 'BNI',
        icon_url: '/assets/icons/bni.svg',
        admin_fee_type: 'fixed',
        admin_fee_value: 4000,
        min_transaction: 10000,
        max_transaction: 50000000,
        is_active: true,
        description: 'Transfer ke Virtual Account BNI',
        display_order: 7,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        code: 'mandiri_va',
        name: 'Mandiri Virtual Account',
        type: 'virtual_account',
        provider: 'Mandiri',
        icon_url: '/assets/icons/mandiri.svg',
        admin_fee_type: 'fixed',
        admin_fee_value: 4000,
        min_transaction: 10000,
        max_transaction: 50000000,
        is_active: true,
        description: 'Transfer ke Virtual Account Mandiri',
        display_order: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 9,
        code: 'bri_va',
        name: 'BRI Virtual Account',
        type: 'virtual_account',
        provider: 'BRI',
        icon_url: '/assets/icons/bri.svg',
        admin_fee_type: 'fixed',
        admin_fee_value: 4000,
        min_transaction: 10000,
        max_transaction: 50000000,
        is_active: true,
        description: 'Transfer ke Virtual Account BRI',
        display_order: 9,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 10,
        code: 'permata_va',
        name: 'Permata Virtual Account',
        type: 'virtual_account',
        provider: 'Permata',
        icon_url: '/assets/icons/permata.svg',
        admin_fee_type: 'fixed',
        admin_fee_value: 4000,
        min_transaction: 10000,
        max_transaction: 50000000,
        is_active: true,
        description: 'Transfer ke Virtual Account Permata',
        display_order: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Bank Transfer
      {
        id: 11,
        code: 'bank_transfer',
        name: 'Transfer Bank Manual',
        type: 'bank_transfer',
        provider: null,
        icon_url: '/assets/icons/bank-transfer.svg',
        admin_fee_type: 'fixed',
        admin_fee_value: 0,
        min_transaction: 10000,
        max_transaction: 100000000,
        is_active: true,
        description: 'Transfer manual ke rekening - Upload bukti',
        display_order: 11,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Credit Card
      {
        id: 12,
        code: 'credit_card',
        name: 'Kartu Kredit/Debit',
        type: 'credit_card',
        provider: null,
        icon_url: '/assets/icons/credit-card.svg',
        admin_fee_type: 'percentage',
        admin_fee_value: 2.90,
        min_transaction: 10000,
        max_transaction: 100000000,
        is_active: true,
        description: 'Bayar dengan Kartu Kredit (Visa, Mastercard, JCB)',
        display_order: 12,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('payment_methods', null, {});
  }
};
```

**Data yang Di-seed:**
- 12 metode pembayaran
- 4 E-Wallet: GoPay, OVO, DANA, ShopeePay
- 1 QRIS
- 5 Virtual Account: BCA, BNI, Mandiri, BRI, Permata
- 1 Transfer Bank Manual
- 1 Kartu Kredit/Debit

---

## 📤 Step 4: Push ke GitHub

### 4.1 Cek File yang Dibuat

Keluar dari folder backend dulu:
```bash
cd ..
```

Cek status git:
```bash
git status
```

Akan muncul 3 file baru:
```
backend/src/shared/database/migrations/XXXXXX-create-payments-table.js
backend/src/shared/database/migrations/XXXXXX-create-payment-methods-table.js
backend/src/shared/database/seeders/XXXXXX-seed-payment-methods.js
```

### 4.2 Add File Migration & Seeder

**JANGAN pakai `git add .` karena berbahaya!**

Pakai command ini:
```bash
git add backend/src/shared/database/migrations/
git add backend/src/shared/database/seeders/
```

### 4.3 Commit

```bash
git commit -m "feat(database): add migration and seeder for payment module

- Add migration for payments table with 13 columns
- Add migration for payment_methods table with 15 columns
- Add seeder for 12 payment methods (E-Wallet, VA, QRIS, Credit Card)

Sprint 1 - Week 4
Dibuat oleh: Anin Denin Nadia (223040109)"
```

### 4.4 Push ke Branch `be-payment`

```bash
git push origin be-payment
```

**PENTING:** Push ke `be-payment`, **BUKAN** ke `dev` atau `main`!

### 4.5 Verifikasi di GitHub

1. Buka GitHub repository
2. Klik dropdown branch (ada tulisan `main`)
3. Pilih branch `be-payment`
4. Masuk ke folder `backend/src/shared/database/`
5. Pastikan ada folder `migrations/` dan `seeders/` dengan 3 file kamu

---

## ⚠️ PENTING: Jangan Run Migration/Seeder!

**JANGAN** jalankan command ini:
```bash
# ❌ JANGAN RUN DULU
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

**Kenapa?**
- Migration & seeder akan dijalankan di **Sprint 1 Week 5 Day 2**
- Backend Dev (Lisvindanu) yang akan run setelah review
- Kalau run sekarang bisa bentrok dengan tim lain

---

## ✅ Checklist Task Anin - Sprint 1

- [ ] Buat branch `be-payment`
- [ ] Generate migration `payments`
- [ ] Generate migration `payment_methods`
- [ ] Copy-paste kode migration `payments` (13 kolom)
- [ ] Copy-paste kode migration `payment_methods` (15 kolom)
- [ ] Generate seeder `payment_methods`
- [ ] Copy-paste kode seeder (12 metode pembayaran)
- [ ] Push ke branch `be-payment`
- [ ] Screenshot dan konfirmasi ke PM/Backend Lead

---

## 📞 Butuh Bantuan?

Kalau ada error atau bingung:
- **Backend Lead:** Lisvindanu (223040038)
- **PM:** Lisvindanu
- Screenshot error dan kirim ke WhatsApp grup

---

**Good luck, Anin! 🚀**

Ikuti step by step dari Step 0 sampai Step 4. Jangan skip langkah apapun!
