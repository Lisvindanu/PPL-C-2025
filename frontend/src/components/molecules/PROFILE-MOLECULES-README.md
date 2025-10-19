# Profile Page Molecules

Komponen molecules yang dibuat khusus untuk ProfilePage menggunakan atomic design pattern.

## Komponen yang Dibuat

### 1. ProfileHeader.jsx
Header komponen untuk halaman profile dengan navigasi dan tombol aksi.

**Props:**
- `profile`: Data profile user
- `isEditing`: Status editing mode
- `onEdit`: Handler untuk masuk edit mode
- `onSave`: Handler untuk menyimpan perubahan
- `onLogout`: Handler untuk logout
- `loading`: Status loading

**Fitur:**
- Logo dan navigasi ke dashboard
- Tombol edit/save
- Tombol logout
- Responsive design

### 2. InfoCard.jsx
Kartu informasi utama profile dengan foto, nama, dan lokasi.

**Props:**
- `profile`: Data profile user
- `isEditing`: Status editing mode
- `onProfileChange`: Handler untuk perubahan data profile

**Fitur:**
- Foto profil dengan tombol edit
- Input nama yang dapat diedit
- Input lokasi yang dapat diedit
- Tombol share dan sewa

### 3. SkillTag.jsx
Komponen untuk menampilkan dan mengedit skill dalam bentuk tag.

**Props:**
- `skill`: Nama skill
- `isEditing`: Status editing mode
- `onSkillChange`: Handler untuk perubahan skill
- `onRemove`: Handler untuk menghapus skill

**Fitur:**
- Mode tampilan: tag dengan background biru
- Mode edit: input field dengan tombol hapus
- Styling yang konsisten

### 4. LanguageItem.jsx
Komponen untuk menampilkan dan mengedit item bahasa dengan level kemahiran.

**Props:**
- `language`: Objek bahasa dengan `name` dan `level`
- `isEditing`: Status editing mode
- `onLanguageChange`: Handler untuk perubahan bahasa
- `onRemove`: Handler untuk menghapus bahasa

**Fitur:**
- Mode tampilan: nama bahasa dan level
- Mode edit: input nama + select level + tombol hapus
- Level options: Dasar, Menengah, Fasih, Native

### 5. VerificationBadge.jsx
Komponen untuk menampilkan status verifikasi dengan icon.

**Props:**
- `type`: Tipe verifikasi - "id" atau "phone"
- `isVerified`: Status verifikasi (default: false)

**Fitur:**
- Label otomatis berdasarkan tipe
- Icon check untuk status terverifikasi
- Warna yang berbeda untuk status terverifikasi/belum

## Struktur Atomic Design

Molecules ini dibangun dari atoms:
- **ProfileHeader**: Avatar, Button, Icon
- **InfoCard**: Avatar, Button, Icon, TextField
- **SkillTag**: TextField
- **LanguageItem**: TextField, Select
- **VerificationBadge**: Icon

## Keuntungan

1. **Composition**: Menggabungkan atoms menjadi komponen yang lebih kompleks
2. **Logic**: Mengandung logic untuk interaksi user
3. **Reusability**: Dapat digunakan di halaman lain yang membutuhkan komponen serupa
4. **Maintainability**: Mudah untuk di-maintain karena terstruktur dengan baik
