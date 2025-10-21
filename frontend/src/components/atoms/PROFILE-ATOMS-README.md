# Profile Page Atoms

Komponen atoms yang dibuat khusus untuk ProfilePage menggunakan atomic design pattern.

## Komponen yang Dibuat

### 1. Avatar.jsx
Komponen untuk menampilkan foto profil dengan berbagai ukuran.

**Props:**
- `src`: URL gambar avatar
- `alt`: Text alternatif untuk gambar (default: "Avatar")
- `size`: Ukuran avatar - "sm", "md", "lg", "xl" (default: "md")
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<Avatar src="/path/to/image.jpg" size="lg" alt="User Avatar" />
```

### 2. Badge.jsx
Komponen untuk menampilkan badge dengan berbagai variant warna.

**Props:**
- `children`: Konten badge
- `variant`: Variant warna - "default", "primary", "success", "warning", "error" (default: "default")
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<Badge variant="success">Terverifikasi</Badge>
```

### 3. Icon.jsx
Komponen untuk menampilkan icon SVG dengan berbagai ukuran.

**Props:**
- `name`: Nama icon - "edit", "camera", "check", "share", "plus"
- `size`: Ukuran icon - "sm", "md", "lg", "xl" (default: "md")
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<Icon name="edit" size="sm" />
```

### 4. TextField.jsx
Komponen input text dengan berbagai variant styling.

**Props:**
- `value`: Nilai input
- `onChange`: Handler perubahan nilai
- `placeholder`: Placeholder text
- `type`: Tipe input (default: "text")
- `variant`: Variant styling - "default", "filled" (default: "default")
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<TextField 
  value={name} 
  onChange={(e) => setName(e.target.value)} 
  placeholder="Masukkan nama"
  variant="filled"
/>
```

### 5. TextArea.jsx
Komponen textarea dengan styling yang konsisten.

**Props:**
- `value`: Nilai textarea
- `onChange`: Handler perubahan nilai
- `placeholder`: Placeholder text
- `rows`: Jumlah baris (default: 4)
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<TextArea 
  value={bio} 
  onChange={(e) => setBio(e.target.value)} 
  rows={6}
  placeholder="Masukkan bio"
/>
```

### 6. Select.jsx
Komponen select dropdown dengan styling yang konsisten.

**Props:**
- `value`: Nilai yang dipilih
- `onChange`: Handler perubahan nilai
- `options`: Array objek dengan format `{value, label}`
- `placeholder`: Placeholder text (default: "Pilih...")
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<Select 
  value={role} 
  onChange={(e) => setRole(e.target.value)} 
  options={[
    {value: 'client', label: 'Client'},
    {value: 'freelancer', label: 'Freelancer'}
  ]}
/>
```

## Keuntungan Atomic Design

1. **Reusability**: Komponen dapat digunakan kembali di halaman lain
2. **Consistency**: Styling yang konsisten di seluruh aplikasi
3. **Maintainability**: Mudah untuk di-maintain dan di-update
4. **Testability**: Setiap komponen dapat di-test secara terpisah
5. **Scalability**: Mudah untuk menambah komponen baru
