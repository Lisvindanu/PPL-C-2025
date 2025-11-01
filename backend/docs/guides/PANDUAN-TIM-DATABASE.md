# Panduan Membuat Migration & Seeder - Tim Database

**Untuk:** Semua Anggota Tim Database (Modul 1-7)
**Target:** Membuat Migration & Seeder untuk Modul Masing-Masing

---

## 📋 Prerequisites

1. ✅ Sudah install Node.js v20 (lihat `SETUP-NODE-V20.md`)
2. ✅ Sudah clone project dari GitHub
3. ✅ Sudah install dependencies backend (`npm install`)
4. ✅ Sudah tahu nama modul kamu (contoh: `payment`, `auth`, `order`, `product`, dll)

---

## 🌿 Step 0: Buat Branch untuk Modul Kamu

### 0.1 Cek Branch yang Ada

```bash
# Cek branch lokal
git branch

# Cek semua branch (termasuk remote)
git branch -a
```

### 0.2 Buat Branch Backend untuk Modul Kamu

```bash
# Format: be-(nama-modul) - SEMUA HURUF KECIL
# Contoh untuk modul payment:
git checkout -b be-payment

# Contoh untuk modul lain:
git checkout -b be-auth
git checkout -b be-order
git checkout -b be-product
git checkout -b be-admin
git checkout -b be-profile
git checkout -b be-notification
```

**PENTING:**
- Semua huruf KECIL
- Format: `be-(nama-modul)`
- Jangan ada spasi atau underscore
- Jangan ada huruf besar

### 0.3 Verifikasi Branch Kamu

```bash
# Cek branch yang sedang aktif (ada tanda bintang *)
git branch
```

Output yang benar:
```
* be-payment
  dev
  main
```

---

## 🚀 Step 1: Generate File Migration

### 1.1 Masuk ke Folder Backend

```bash
cd backend
```

### 1.2 Generate Migration untuk Tabel Modul Kamu

**Format Command:**
```bash
npx sequelize-cli migration:generate --name create-[nama-tabel]-table
```

**Contoh untuk Modul Payment:**
```bash
# Tabel payments
npx sequelize-cli migration:generate --name create-payments-table

# Tabel payment_methods
npx sequelize-cli migration:generate --name create-payment-methods-table
```

**Contoh untuk Modul Lain:**
```bash
# Modul Auth
npx sequelize-cli migration:generate --name create-users-table
npx sequelize-cli migration:generate --name create-user-sessions-table

# Modul Order
npx sequelize-cli migration:generate --name create-orders-table
npx sequelize-cli migration:generate --name create-order-items-table

# Modul Product
npx sequelize-cli migration:generate --name create-products-table
npx sequelize-cli migration:generate --name create-categories-table
```

**Output:**
```
migrations/XXXXXX-create-[nama-tabel]-table.js created
```

File migration akan dibuat di folder `src/shared/database/migrations/` dengan format nama:
```
[timestamp]-create-[nama-tabel]-table.js
```

---

## 📝 Step 2: Isi File Migration

### 2.1 Cari File Migration Kamu

Buka file `XXXXXX-create-[nama-tabel]-table.js` di folder:
```
backend/src/shared/database/migrations/
```

### 2.2 Template Migration

Copy template ini dan sesuaikan dengan schema tabel kamu:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('[nama_tabel]', {
      // Primary Key (pilih salah satu)

      // Opsi 1: UUID (untuk tabel yang butuh unique ID global)
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        comment: 'Primary key UUID'
      },

      // Opsi 2: Integer Auto Increment (untuk tabel master/konfigurasi)
      // id: {
      //   type: Sequelize.INTEGER,
      //   primaryKey: true,
      //   autoIncrement: true,
      //   allowNull: false
      // },

      // Contoh kolom string
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Nama/judul'
      },

      // Contoh kolom text panjang
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Deskripsi detail'
      },

      // Contoh kolom angka desimal (untuk harga, total, dll)
      price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Harga dalam Rupiah'
      },

      // Contoh kolom boolean
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Status aktif/nonaktif'
      },

      // Contoh kolom ENUM
      status: {
        type: Sequelize.ENUM('pending', 'active', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Status data'
      },

      // Contoh kolom JSON
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Data tambahan dalam format JSON'
      },

      // Contoh Foreign Key (relasi ke tabel lain)
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',  // nama tabel yang direferensi
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'Foreign key ke tabel users'
      },

      // Timestamp (WAJIB ada di setiap tabel)
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

    // Buat index untuk kolom yang sering di-query (opsional tapi recommended)
    await queryInterface.addIndex('[nama_tabel]', ['user_id']);
    await queryInterface.addIndex('[nama_tabel]', ['status']);
    await queryInterface.addIndex('[nama_tabel]', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus tabel saat rollback
    await queryInterface.dropTable('[nama_tabel]');
  }
};
```

### 2.3 Tipe Data Sequelize yang Sering Dipakai

| Tipe Data | Kegunaan | Contoh |
|-----------|----------|--------|
| `UUID` | ID unik global | `id`, `user_id`, `order_id` |
| `INTEGER` | Angka bulat | `quantity`, `stock`, `count` |
| `DECIMAL(15,2)` | Angka desimal (uang) | `price`, `total`, `discount` |
| `STRING(N)` | Text pendek max N karakter | `name`, `email`, `phone` |
| `TEXT` | Text panjang | `description`, `address`, `notes` |
| `BOOLEAN` | True/False | `is_active`, `is_verified`, `is_deleted` |
| `ENUM(...)` | Pilihan terbatas | `status`, `role`, `type` |
| `JSON` | Data JSON | `metadata`, `settings`, `attributes` |
| `DATE` | Tanggal & waktu | `created_at`, `updated_at`, `expired_at` |

### 2.4 Aturan Foreign Key (Relasi Antar Tabel)

```javascript
// Contoh: tabel orders punya relasi ke users
user_id: {
  type: Sequelize.UUID,
  allowNull: false,
  references: {
    model: 'users',  // nama tabel yang direferensi
    key: 'id'        // kolom di tabel users
  },
  onUpdate: 'CASCADE',  // kalau id di tabel users berubah, ikut berubah
  onDelete: 'RESTRICT', // kalau user dihapus, order TIDAK BOLEH dihapus
  comment: 'Foreign key ke tabel users'
}
```

**Pilihan `onDelete`:**
- `RESTRICT`: Tidak boleh hapus parent kalau ada child (paling aman)
- `CASCADE`: Hapus parent otomatis hapus child (hati-hati!)
- `SET NULL`: Kalau parent dihapus, foreign key jadi NULL

**Pilihan `onUpdate`:**
- `CASCADE`: Kalau ID parent berubah, foreign key ikut berubah (biasanya pakai ini)

---

## 🌱 Step 3: Generate File Seeder

### 3.1 Generate Seeder untuk Tabel Master/Konfigurasi

**Format Command:**
```bash
npx sequelize-cli seed:generate --name seed-[nama-tabel]
```

**Contoh:**
```bash
# Modul Payment
npx sequelize-cli seed:generate --name seed-payment-methods

# Modul Auth
npx sequelize-cli seed:generate --name seed-roles

# Modul Product
npx sequelize-cli seed:generate --name seed-categories
```

**CATATAN:**
- Seeder biasanya hanya untuk tabel **master/konfigurasi** (payment methods, roles, categories, dll)
- **TIDAK** perlu seeder untuk tabel **transaksional** (orders, payments, user_sessions, dll)

### 3.2 Template Seeder

Buka file `XXXXXX-seed-[nama-tabel].js`, lalu isi:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('[nama_tabel]', [
      {
        id: 1,
        name: 'Data 1',
        description: 'Deskripsi data 1',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Data 2',
        description: 'Deskripsi data 2',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // ... tambahkan data lainnya
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('[nama_tabel]', null, {});
  }
};
```

---

## 📤 Step 4: Push ke GitHub

### 4.1 Cek File yang Dibuat

```bash
git status
```

Akan muncul file baru di:
- `src/shared/database/migrations/XXXXXX-create-[nama-tabel]-table.js`
- `src/shared/database/seeders/XXXXXX-seed-[nama-tabel].js` (kalau ada)

### 4.2 Add File Migration & Seeder

**JANGAN pakai `git add .` - terlalu berbahaya!**

Pakai command ini:
```bash
# Add folder migrations dan seeders
git add src/shared/database/migrations/
git add src/shared/database/seeders/
```

### 4.3 Commit dengan Pesan yang Jelas

```bash
git commit -m "feat(database): add migration and seeder for [nama-modul] module

- Add migration for [nama_tabel_1] table
- Add migration for [nama_tabel_2] table
- Add seeder for [nama_tabel_master]

Dibuat oleh: [Nama Kamu] ([NIM])"
```

**Contoh untuk Modul Payment:**
```bash
git commit -m "feat(database): add migration and seeder for payment module

- Add migration for payments table with 15 columns
- Add migration for payment_methods table with 15 columns
- Add seeder for 12 payment methods (E-Wallet, VA, QRIS, Credit Card)

Dibuat oleh: Anin Denin Nadia (223040109)"
```

### 4.4 Push ke Branch Backend Modul Kamu

```bash
# Format: git push origin be-(nama-modul)
# PASTIKAN push ke branch yang benar, BUKAN ke dev atau main!

# Contoh untuk modul payment:
git push origin be-payment

# Contoh untuk modul lain:
git push origin be-auth
git push origin be-order
git push origin be-product
```

**PENTING:**
- ✅ Push ke `be-(nama-modul)` - untuk migration & seeder database
- ✅ Push ke `fe-(nama-modul)` - kalau kamu juga ngerjain frontend
- ❌ **JANGAN** push langsung ke `dev` atau `main`

### 4.5 Cek di GitHub

1. Buka GitHub repository
2. Klik dropdown branch (biasanya ada tulisan `main`)
3. Cari branch kamu: `be-(nama-modul)`
4. Pastikan file migration & seeder kamu ada di sana

---

## 🔄 Git Command Reference

### Ganti Branch

```bash
# Pindah ke branch lain
git checkout dev
git checkout be-payment

# Buat branch baru dan langsung pindah
git checkout -b be-newmodule
```

### Cek Branch yang Aktif

```bash
# Cek branch lokal
git branch

# Cek semua branch
git branch -a
```

### Update dari Branch Dev

```bash
# Pindah ke dev dulu
git checkout dev

# Pull update terbaru
git pull origin dev

# Pindah balik ke branch modul kamu
git checkout be-payment

# Merge update dari dev ke branch kamu
git merge dev
```

### Hapus Branch Lokal (Kalau Salah Buat)

```bash
# Pindah dulu ke branch lain
git checkout dev

# Hapus branch
git branch -d be-payment

# Paksa hapus (kalau ada warning)
git branch -D be-payment
```

---

## ⚠️ PENTING: Jangan Run Migration/Seeder Sekarang!

**JANGAN** jalankan command ini:
```bash
# ❌ JANGAN RUN DULU
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

**Kenapa?**
- Migration & seeder akan dijalankan setelah **review & approve** oleh Backend Dev
- Backend Lead yang akan run di server development
- Kalau run sekarang, database lokal kamu bisa bentrok dengan tim lain

---

## 📖 Reference Command Sequelize CLI

### Cek Status Migration

```bash
# Cek migration mana yang sudah dijalankan
npx sequelize-cli db:migrate:status
```

### Run Migration (Nanti Setelah Approval)

```bash
# Run semua migration yang belum dijalankan
npx sequelize-cli db:migrate

# Run migration tertentu
npx sequelize-cli db:migrate --to XXXXXX-create-[nama-tabel]-table.js
```

### Rollback Migration (Kalau Ada Error)

```bash
# Rollback migration terakhir
npx sequelize-cli db:migrate:undo

# Rollback semua migration
npx sequelize-cli db:migrate:undo:all

# Rollback sampai migration tertentu
npx sequelize-cli db:migrate:undo:to XXXXXX-create-[nama-tabel]-table.js
```

### Run Seeder (Nanti Setelah Approval)

```bash
# Run semua seeder
npx sequelize-cli db:seed:all

# Run seeder tertentu
npx sequelize-cli db:seed --seed XXXXXX-seed-[nama-tabel].js
```

### Rollback Seeder (Kalau Ada Error)

```bash
# Rollback seeder terakhir
npx sequelize-cli db:seed:undo

# Rollback semua seeder
npx sequelize-cli db:seed:undo:all
```

---

## ✅ Checklist Task Database

**Untuk Setiap Tabel di Modul Kamu:**

- [ ] Buat branch `be-(nama-modul)` dengan huruf kecil semua
- [ ] Masuk ke folder backend (`cd backend`)
- [ ] Generate file migration untuk setiap tabel
- [ ] Isi kode migration sesuai schema database
- [ ] Generate file seeder untuk tabel master/konfigurasi (kalau ada)
- [ ] Isi kode seeder dengan data awal
- [ ] Cek dengan `git status` (pastikan hanya file migration/seeder)
- [ ] Add file dengan `git add src/shared/database/migrations/ src/shared/database/seeders/`
- [ ] Commit dengan pesan yang jelas
- [ ] Push ke branch `be-(nama-modul)` (BUKAN ke `dev` atau `main`)
- [ ] Cek di GitHub apakah file sudah muncul di branch kamu
- [ ] Koordinasi dengan Backend Dev untuk review & merge

---

## 📞 Butuh Bantuan?

Kalau ada yang kurang jelas:
- **Backend Lead (Lisvindanu)** - 223040038
- **PM (Lisvindanu)**
- Atau tanya di grup WhatsApp tim

---

## 📚 Contoh Schema untuk Referensi

Lihat schema modul lain di:
```
backend/DATABASE-SCHEMA.md
```

Di sana ada contoh lengkap untuk 8 modul:
1. Modul 1: Authentication & Authorization
2. Modul 2: Profile & Settings
3. Modul 3: Product Catalog
4. Modul 4: Payment Gateway
5. Modul 5: Order Management
6. Modul 6: Notification
7. Modul 7: Admin & Reports
8. Modul 8: RECOMMENDATION & PERSONALIZATION  


---

**Good luck! 🚀**

Ikuti step by step, jangan skip. Kalau ada error screenshot dan tanya langsung ke Backend Lead!
