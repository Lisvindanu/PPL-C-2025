# Reset Password Feature - User Guide

## Overview
Fitur reset password memungkinkan pengguna untuk mengatur ulang kata sandi mereka jika lupa. Fitur ini menggunakan 3 tahap dengan UI yang sesuai dengan design yang diberikan.

## Flow Reset Password

### 1. Tahap 1: Atur Ulang Kata Sandi
- **URL**: `/forgot-password`
- **Fungsi**: User memasukkan email untuk meminta reset password
- **UI**: Card putih dengan input email dan button "Kirim"
- **Backend**: Mengirim token reset password ke email (untuk development, token dikembalikan dalam response)

### 2. Tahap 2: Kode OTP
- **URL**: `/reset-password/otp`
- **Fungsi**: User memasukkan kode OTP untuk verifikasi
- **UI**: Header abu-abu "OTP Confirm" + card putih dengan input OTP
- **Backend**: Memverifikasi token dan membuat token baru untuk reset password

### 3. Tahap 3: Kata Sandi Baru
- **URL**: `/reset-password/new-password`
- **Fungsi**: User memasukkan password baru
- **UI**: Header abu-abu "New Password" + card putih dengan input password
- **Backend**: Mengupdate password di database

## Cara Menggunakan

### Untuk User:
1. Di halaman login, klik "Lupa kata sandi Anda?"
2. Masukkan email yang terdaftar
3. Klik "Kirim" - sistem akan mengirim kode OTP
4. Masukkan kode OTP yang diterima
5. Klik "Kirim" untuk verifikasi
6. Masukkan password baru
7. Klik "Kirim" untuk menyimpan password baru
8. Kembali ke halaman login dengan password baru

### Untuk Developer:
1. Pastikan backend server berjalan di `http://localhost:5000`
2. Pastikan database sudah ter-setup dengan tabel `user_tokens`
3. Jalankan frontend dengan `npm run dev`
4. Test flow reset password dengan user yang sudah terdaftar

## Komponen yang Dibuat

### Atoms (Komponen Dasar)
- `ResetPasswordInput.jsx` - Input field khusus
- `ResetPasswordButton.jsx` - Button khusus
- `ResetPasswordLabel.jsx` - Label khusus

### Molecules (Gabungan Atoms)
- `ResetPasswordFormGroup.jsx` - Gabungan label + input

### Organisms (Komponen Kompleks)
- `ResetPasswordCard.jsx` - Card untuk form
- `ResetPasswordLayout.jsx` - Layout halaman
- `OTPConfirmHeader.jsx` - Header untuk OTP
- `NewPasswordHeader.jsx` - Header untuk password baru

### Pages (Halaman Lengkap)
- `ForgotPasswordPage.jsx` - Halaman request reset
- `OTPConfirmPage.jsx` - Halaman verifikasi OTP
- `NewPasswordPage.jsx` - Halaman password baru

## API Endpoints

### Backend Routes
- `POST /api/users/forgot-password` - Request reset password
- `POST /api/users/verify-otp` - Verifikasi OTP
- `POST /api/users/reset-password` - Update password

### Frontend Routes
- `/forgot-password` - Halaman request reset
- `/reset-password/otp` - Halaman verifikasi OTP
- `/reset-password/new-password` - Halaman password baru

## Styling

Semua komponen menggunakan warna yang konsisten:
- **Background**: `#cdd5ae` (light green)
- **Card**: `white`
- **Button**: `#B3B3B3` (light gray)
- **Text**: `#2E2A28` (dark)
- **Header**: `#696969` (gray)

## Security Features

1. **Token Expiry**: Token memiliki waktu kadaluarsa (1 jam untuk request, 30 menit untuk verified)
2. **One-time Use**: Token hanya bisa digunakan sekali
3. **Email Validation**: Memverifikasi email user
4. **Password Hashing**: Password dienkripsi sebelum disimpan
5. **Token Types**: Menggunakan tipe token yang berbeda untuk setiap tahap

## Testing

### Manual Testing:
1. Daftar user baru atau gunakan user yang sudah ada
2. Coba reset password dengan email yang valid
3. Verifikasi flow dari tahap 1 sampai 3
4. Test dengan email yang tidak valid
5. Test dengan token yang expired

### Development Notes:
- Token dikembalikan dalam response untuk kemudahan testing
- Di production, token seharusnya dikirim via email
- OTP menggunakan token UUID untuk kemudahan testing
- Semua error handling sudah diimplementasikan

## Troubleshooting

### Common Issues:
1. **Token expired**: Request reset password lagi
2. **Invalid OTP**: Pastikan menggunakan token yang benar
3. **User not found**: Pastikan email sudah terdaftar
4. **Network error**: Pastikan backend server berjalan

### Debug Tips:
1. Check browser console untuk error
2. Check network tab untuk API calls
3. Check backend logs untuk error details
4. Pastikan database connection berjalan
