# Reset Password - Atomic Design Components

## Atoms

### ResetPasswordInput.jsx
Komponen input khusus untuk form reset password dengan styling yang konsisten dengan UI design yang diberikan.

**Props:**
- `className`: String untuk custom styling
- `...props`: Semua props HTML input lainnya

### ResetPasswordButton.jsx
Komponen button khusus untuk form reset password dengan styling yang sesuai dengan design.

**Props:**
- `children`: Konten button
- `type`: Tipe button (default: 'button')
- `className`: String untuk custom styling
- `...props`: Semua props HTML button lainnya

### ResetPasswordLabel.jsx
Komponen label khusus untuk form reset password dengan styling yang konsisten.

**Props:**
- `children`: Konten label
- `className`: String untuk custom styling
- `...props`: Semua props HTML label lainnya

## Molecules

### ResetPasswordFormGroup.jsx
Komponen yang menggabungkan label dan input untuk form reset password.

**Props:**
- `label`: String untuk label
- `name`: String untuk name attribute
- `type`: String untuk tipe input (default: 'text')
- `value`: String untuk value input
- `onChange`: Function untuk handle perubahan
- `placeholder`: String untuk placeholder
- `error`: String untuk pesan error

## Organisms

### ResetPasswordCard.jsx
Komponen card untuk menampilkan form reset password.

**Props:**
- `title`: String untuk judul card
- `children`: Konten card
- `footer`: Komponen footer

### ResetPasswordLayout.jsx
Layout khusus untuk halaman reset password dengan header Skill Connect.

**Props:**
- `children`: Konten utama
- `bottom`: Komponen bottom
- `title`: String untuk judul
- `showCorner`: Boolean untuk menampilkan corner (default: true)

### OTPConfirmHeader.jsx
Header khusus untuk halaman konfirmasi OTP dengan background abu-abu.

### NewPasswordHeader.jsx
Header khusus untuk halaman password baru dengan background abu-abu.

## Pages

### ForgotPasswordPage.jsx
Halaman untuk meminta reset password dengan input email.

**Fitur:**
- Validasi email
- Integrasi dengan API backend
- Navigasi ke halaman OTP
- Toast notification

### OTPConfirmPage.jsx
Halaman untuk konfirmasi kode OTP.

**Fitur:**
- Validasi OTP
- Integrasi dengan API backend
- Navigasi ke halaman password baru
- Toast notification

### NewPasswordPage.jsx
Halaman untuk membuat password baru.

**Fitur:**
- Validasi password
- Integrasi dengan API backend
- Navigasi ke halaman login
- Toast notification

## Flow Reset Password

1. **Forgot Password**: User memasukkan email → API mengirim token
2. **OTP Confirm**: User memasukkan token sebagai OTP → API memverifikasi
3. **New Password**: User memasukkan password baru → API mengupdate password

## Styling

Semua komponen menggunakan warna yang konsisten dengan design system:
- Background: `#cdd5ae` (light green)
- Card background: `white`
- Button: `#B3B3B3` (light gray)
- Text: `#2E2A28` (dark)
- Header: `#696969` (gray)
