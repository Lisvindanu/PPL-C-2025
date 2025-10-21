# Profile Page Organisms

Komponen organisms yang dibuat khusus untuk ProfilePage menggunakan atomic design pattern.

## Komponen yang Dibuat

### 1. AuthCard.jsx
Organism untuk kartu autentikasi dengan form login/register.

**Props:**
- `title`: Judul kartu
- `subtitle`: Subtitle kartu
- `children`: Form content
- `footer`: Footer content
- `className`: CSS class tambahan

**Fitur:**
- Layout kartu dengan header dan footer
- Styling yang konsisten
- Responsive design

### 2. EditForm.jsx
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

### 3. Header.jsx
Organism untuk header navigasi dengan logo dan menu.

**Props:**
- `user`: Data user yang login
- `onLogout`: Handler logout
- `className`: CSS class tambahan

**Fitur:**
- Logo dan navigasi
- User menu dengan dropdown
- Responsive design

### 4. LoadingOverlay.jsx
Organism untuk menampilkan loading overlay.

**Props:**
- `loading`: Status loading
- `message`: Pesan loading
- `className`: CSS class tambahan

**Fitur:**
- Overlay full screen
- Modal loading dengan pesan
- Hanya muncul saat loading

### 5. OrderChart.jsx
Organism untuk menampilkan chart analytics pesanan.

**Props:**
- `data`: Data chart
- `className`: CSS class tambahan

**Fitur:**
- Line chart untuk trend pesanan
- Format bulan Indonesia
- Data dari database

### 6. PortfolioSection.jsx
Organism untuk menampilkan portfolio dengan grid layout dan pagination.

**Props:**
- `isEditing`: Status editing mode
- `portfolio`: Data portfolio
- `onAdd`: Handler tambah portfolio
- `onEdit`: Handler edit portfolio
- `onDelete`: Handler hapus portfolio

**Fitur:**
- Grid layout untuk portfolio items
- Hover effect dengan overlay
- Tombol tambah portfolio (mode edit)
- Pagination controls

### 7. ProfileInfo.jsx
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

### 8. ProfileLoadingOverlay.jsx
Organism untuk menampilkan loading overlay khusus profile.

**Props:**
- `loading`: Status loading
- `message`: Pesan loading

**Fitur:**
- Overlay full screen
- Modal loading dengan pesan
- Hanya muncul saat loading

### 9. Sidebar.jsx
Organism untuk sidebar navigasi.

**Props:**
- `user`: Data user
- `activeItem`: Item yang aktif
- `onItemClick`: Handler klik item
- `className`: CSS class tambahan

**Fitur:**
- Menu navigasi
- User info
- Responsive design

### 10. SkillsSection.jsx
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

### 11. StatsGrid.jsx
Organism untuk menampilkan grid statistik.

**Props:**
- `stats`: Data statistik
- `className`: CSS class tambahan

**Fitur:**
- Grid layout untuk statistik
- Card statistik dengan icon
- Responsive design

### 12. ToastProvider.jsx
Organism untuk provider toast notification.

**Props:**
- `children`: Child components

**Fitur:**
- Context provider untuk toast
- Toast container
- Auto dismiss

### 13. UserChart.jsx
Organism untuk menampilkan chart analytics user.

**Props:**
- `data`: Data chart
- `className`: CSS class tambahan

**Fitur:**
- Pie chart untuk distribusi user
- Data dari database
- Legend dan stats

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
