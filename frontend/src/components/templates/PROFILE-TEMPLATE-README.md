# Profile Page Template

Template yang dibuat untuk ProfilePage menggunakan atomic design pattern.

## Komponen yang Dibuat

### 1. AuthLayout.jsx
Template untuk halaman autentikasi (login/register).

**Props:**
- `children`: Content halaman
- `title`: Judul halaman
- `subtitle`: Subtitle halaman

**Fitur:**
- Background gradient
- Card container dengan shadow
- Logo dan branding
- Responsive design

### 2. DashboardLayout.jsx
Template untuk halaman dashboard Admin dengan sidebar.

**Props:**
- `children`: Content halaman
- `user`: Data user
- `activeItem`: Item navigasi yang aktif

**Fitur:**
- Header dengan navigasi
- Sidebar dengan menu
- Main content area
- Responsive design

### 3. ProfileLayout.jsx
Template utama untuk halaman profile yang menggabungkan semua organisms.

**Props:**
- `profile`: Data profile user
- `isEditing`: Status editing mode
- `loading`: Status loading
- `onEdit`: Handler untuk masuk edit mode
- `onSave`: Handler untuk menyimpan perubahan
- `onCancel`: Handler untuk membatalkan edit
- `onLogout`: Handler untuk logout
- `onProfileChange`: Handler untuk perubahan data profile

**Struktur Layout:**
```
ProfileLayout
├── ProfileHeader (molecules)
├── InfoCard (molecules)
└── Main Content
    ├── ProfileInfo (organisms)
    ├── SkillsSection (organisms)
    ├── PortfolioSection (organisms)
    └── EditForm (organisms)
```

**Fitur:**
- Layout responsif dengan grid system
- Background dan spacing yang konsisten
- Container dengan max-width untuk desktop
- Loading overlay terpisah

### 4. ProtectedRoute.jsx
Template wrapper untuk route yang memerlukan autentikasi.

**Props:**
- `children`: Content yang dilindungi
- `redirectTo`: Route redirect jika tidak authenticated

**Fitur:**
- Cek status autentikasi
- Redirect ke login jika tidak authenticated
- Loading state saat cek auth

## Struktur Atomic Design

Template ini menggabungkan semua organisms:
- **ProfileHeader**: Header dengan navigasi dan tombol aksi
- **InfoCard**: Kartu informasi utama profile
- **ProfileInfo**: Informasi detail profile
- **SkillsSection**: Section untuk skills dan informasi tambahan
- **PortfolioSection**: Section untuk portfolio
- **EditForm**: Form untuk aksi edit

## Keuntungan

1. **Page Structure**: Mendefinisikan struktur halaman yang konsisten
2. **Layout Management**: Mengelola layout dan spacing
3. **Component Composition**: Menggabungkan organisms menjadi halaman lengkap
4. **Responsive Design**: Layout yang responsif untuk berbagai ukuran layar
5. **Reusability**: Template dapat digunakan untuk halaman profile yang berbeda
6. **Maintainability**: Mudah untuk di-maintain karena terstruktur dengan baik

## Penggunaan

Template ini digunakan di ProfilePage.jsx sebagai komponen utama yang menggantikan semua JSX yang sebelumnya inline.

```jsx
<ProfileLayout 
  profile={profile}
  isEditing={isEditing}
  loading={loading}
  onEdit={() => setIsEditing(true)}
  onSave={handleSave}
  onCancel={handleCancel}
  onLogout={handleLogout}
  onProfileChange={handleProfileChange}
/>
```
