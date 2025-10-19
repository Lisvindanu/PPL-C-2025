# Profile Page Organisms

Komponen organisms yang dibuat khusus untuk ProfilePage menggunakan atomic design pattern.

## Komponen yang Dibuat

### 1. ProfileInfo.jsx
Organism untuk menampilkan informasi utama profile (job title, rate, about, verification, services).

**Props:**
- `profile`: Data profile user
- `isEditing`: Status editing mode
- `onProfileChange`: Handler untuk perubahan data profile

**Fitur:**
- Total pekerjaan
- Job title dan rate yang dapat diedit
- Select role (client/freelancer)
- Textarea untuk bio/about
- Status verifikasi dengan badge
- Daftar layanan

**Komponen yang Digunakan:**
- TextField, TextArea, Select, Icon, VerificationBadge

### 2. SkillsSection.jsx
Organism untuk menampilkan dan mengelola skills, bahasa, lisensi, pendidikan, dan asosiasi.

**Props:**
- `profile`: Data profile user
- `isEditing`: Status editing mode
- `onProfileChange`: Handler untuk perubahan data profile

**Fitur:**
- **Bahasa**: Daftar bahasa dengan level kemahiran
- **Lisensi**: Input lisensi/sertifikasi
- **Pendidikan**: Input riwayat pendidikan
- **Keahlian**: Tags keahlian yang dapat ditambah/dihapus
- **Asosiasi**: Input asosiasi/organisasi

**Komponen yang Digunakan:**
- TextField, Icon, SkillTag, LanguageItem

### 3. PortfolioSection.jsx
Organism untuk menampilkan portfolio dengan grid layout dan pagination.

**Props:**
- `isEditing`: Status editing mode

**Fitur:**
- Grid layout untuk portfolio items
- Hover effect dengan overlay
- Tombol tambah portfolio (mode edit)
- Pagination controls

### 4. EditForm.jsx
Organism untuk tombol aksi edit (batal/simpan).

**Props:**
- `isEditing`: Status editing mode
- `loading`: Status loading
- `onSave`: Handler untuk menyimpan
- `onCancel`: Handler untuk membatalkan

**Fitur:**
- Tombol Batal dan Simpan
- Loading state pada tombol simpan
- Hanya muncul saat mode editing

### 5. ProfileLoadingOverlay.jsx
Organism untuk menampilkan loading overlay.

**Props:**
- `loading`: Status loading

**Fitur:**
- Overlay full screen
- Modal loading dengan pesan
- Hanya muncul saat loading

## Struktur Atomic Design

Organisms ini dibangun dari molecules dan atoms:

- **ProfileInfo**: TextField, TextArea, Select, Icon, VerificationBadge
- **SkillsSection**: TextField, Icon, SkillTag, LanguageItem
- **PortfolioSection**: Icon
- **EditForm**: Button
- **ProfileLoadingOverlay**: (standalone)

## Keuntungan

1. **Complex Logic**: Mengandung logic yang lebih kompleks untuk mengelola state
2. **Data Management**: Mengelola data dan state untuk section tertentu
3. **User Interaction**: Menangani interaksi user yang kompleks
4. **Reusability**: Dapat digunakan di halaman lain dengan data yang berbeda
5. **Maintainability**: Mudah untuk di-maintain karena terstruktur dengan baik
