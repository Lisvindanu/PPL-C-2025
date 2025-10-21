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

### 3. Button.jsx
Komponen tombol dengan berbagai variant dan ukuran.

**Props:**
- `children`: Konten tombol
- `variant`: Variant styling - "primary", "secondary", "outline", "danger" (default: "primary")
- `size`: Ukuran - "sm", "md", "lg" (default: "md")
- `disabled`: Status disabled
- `onClick`: Handler klik
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Simpan
</Button>
```

### 4. Icon.jsx
Komponen untuk menampilkan icon SVG dengan berbagai ukuran.

**Props:**
- `name`: Nama icon - "edit", "camera", "check", "share", "plus"
- `size`: Ukuran icon - "sm", "md", "lg", "xl" (default: "md")
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<Icon name="edit" size="sm" />
```

### 5. Input.jsx
Komponen input field dasar dengan styling yang konsisten.

**Props:**
- `type`: Tipe input (default: "text")
- `value`: Nilai input
- `onChange`: Handler perubahan nilai
- `placeholder`: Placeholder text
- `disabled`: Status disabled
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<Input 
  type="text"
  value={name} 
  onChange={(e) => setName(e.target.value)} 
  placeholder="Masukkan nama"
/>
```

### 6. Label.jsx
Komponen label untuk form dengan styling yang konsisten.

**Props:**
- `children`: Konten label
- `htmlFor`: ID elemen yang terkait
- `required`: Status required (menampilkan asterisk)
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<Label htmlFor="name" required>
  Nama Lengkap
</Label>
```

### 7. Logo.jsx
Komponen logo dengan berbagai ukuran.

**Props:**
- `size`: Ukuran logo - "sm", "md", "lg", "xl" (default: "md")
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<Logo size="lg" />
```

### 8. PasswordInput.jsx
Komponen input password dengan fitur show/hide.

**Props:**
- `value`: Nilai input
- `onChange`: Handler perubahan nilai
- `placeholder`: Placeholder text
- `disabled`: Status disabled
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<PasswordInput 
  value={password} 
  onChange={(e) => setPassword(e.target.value)} 
  placeholder="Masukkan password"
/>
```

### 9. Select.jsx
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

### 10. Spinner.jsx
Komponen loading spinner dengan berbagai ukuran.

**Props:**
- `size`: Ukuran spinner - "sm", "md", "lg" (default: "md")
- `color`: Warna spinner - "primary", "secondary", "white" (default: "primary")
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<Spinner size="md" color="primary" />
```

### 11. Text.jsx
Komponen text dengan berbagai variant typography.

**Props:**
- `children`: Konten text
- `variant`: Variant typography - "h1", "h2", "h3", "body", "caption" (default: "body")
- `className`: CSS class tambahan

**Contoh Penggunaan:**
```jsx
<Text variant="h1">Judul</Text>
<Text variant="body">Paragraf text</Text>
```

### 12. TextArea.jsx
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

### 13. TextField.jsx
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

## Keuntungan Atomic Design

1. **Reusability**: Komponen dapat digunakan kembali di halaman lain
2. **Consistency**: Styling yang konsisten di seluruh aplikasi
3. **Maintainability**: Mudah untuk di-maintain dan di-update
4. **Testability**: Setiap komponen dapat di-test secara terpisah
5. **Scalability**: Mudah untuk menambah komponen baru
