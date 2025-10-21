# Profile Page Molecules

Komponen molecules yang dibuat khusus untuk ProfilePage menggunakan atomic design pattern.

## Komponen yang Dibuat

### 1. FormGroup.jsx
Komponen wrapper untuk form field dengan label dan input.

**Props:**
- `label`: Text label
- `children`: Input component
- `required`: Status required (menampilkan asterisk)
- `error`: Error message
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<FormGroup label="Nama Lengkap" required>
  <Input value={name} onChange={handleChange} />
</FormGroup>
```

### 2. InfoCard.jsx
Kartu informasi dengan layout yang terstruktur.

**Props:**
- `title`: Judul kartu
- `subtitle`: Subtitle kartu
- `children`: Konten kartu
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<InfoCard title="Informasi Pribadi" subtitle="Data diri Anda">
  <p>Konten informasi...</p>
</InfoCard>
```

### 3. LanguageItem.jsx
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

### 4. NavItem.jsx
Komponen item navigasi dengan icon dan label.

**Props:**
- `icon`: Icon component
- `label`: Text label
- `active`: Status aktif
- `onClick`: Handler klik

**Contoh Penggunaan:**
```jsx
<NavItem 
  icon={<Icon name="home" />} 
  label="Dashboard" 
  active={true}
  onClick={handleClick}
/>
```

### 5. ProfileHeader.jsx
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

### 6. RoleCard.jsx
Komponen kartu untuk memilih role (client/freelancer).

**Props:**
- `role`: Role yang dipilih
- `title`: Judul role
- `description`: Deskripsi role
- `icon`: Icon role
- `selected`: Status terpilih
- `onClick`: Handler klik

**Contoh Penggunaan:**
```jsx
<RoleCard 
  role="freelancer"
  title="Freelancer"
  description="Tawarkan jasa Anda"
  selected={true}
  onClick={handleSelect}
/>
```

### 7. SkillTag.jsx
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

### 8. StatCard.jsx
Komponen kartu statistik dengan icon dan nilai.

**Props:**
- `title`: Judul statistik
- `value`: Nilai statistik
- `icon`: Icon component
- `bgColor`: Background color
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<StatCard 
  title="Total Pekerjaan"
  value="25"
  icon={<Icon name="work" />}
  bgColor="bg-blue-500"
/>
```

### 9. VerificationBadge.jsx
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
