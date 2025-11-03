# Reset Password API Documentation

## Endpoints

### 1. POST /api/users/forgot-password
Meminta reset password dengan mengirim email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password reset token generated",
    "token": "uuid-token-here"
  }
}
```

### 2. POST /api/users/verify-otp
Memverifikasi kode OTP untuk reset password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "uuid-token-here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "OTP verified successfully",
    "token": "new-verified-token-here"
  }
}
```

### 3. POST /api/users/reset-password
Mengubah password dengan token yang sudah diverifikasi.

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "verified-token-here",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password updated"
  }
}
```

## Use Cases

### ForgotPassword.js
- Mencari user berdasarkan email
- Membuat token reset password dengan UUID
- Menyimpan token ke database dengan expiry 1 jam
- Mengembalikan token untuk keperluan development

### VerifyOTP.js
- Memverifikasi token OTP
- Membuat token baru untuk reset password yang sudah diverifikasi
- Token baru berlaku 30 menit

### ResetPassword.js
- Memverifikasi token yang sudah diverifikasi
- Mengenkripsi password baru
- Mengupdate password di database
- Menandai token sebagai sudah digunakan

## Database Schema

### UserTokenModel
- `id`: Primary key
- `user_id`: Foreign key ke users table
- `token`: UUID token
- `type`: 'password_reset' atau 'password_reset_verified'
- `expires_at`: Waktu kadaluarsa token
- `used_at`: Waktu token digunakan (nullable)
- `created_at`: Waktu pembuatan
- `updated_at`: Waktu update

## Security Features

1. **Token Expiry**: Token memiliki waktu kadaluarsa
2. **One-time Use**: Token hanya bisa digunakan sekali
3. **Email Validation**: Memverifikasi email user
4. **Password Hashing**: Password dienkripsi sebelum disimpan
5. **Token Types**: Menggunakan tipe token yang berbeda untuk setiap tahap

## Error Handling

- **400**: Invalid token, expired token, token already used
- **404**: User not found
- **500**: Internal server error

## Development Notes

- Untuk development, token dikembalikan dalam response
- Di production, token seharusnya dikirim via email
- OTP menggunakan token UUID untuk kemudahan testing
- Token disimpan di database untuk tracking dan security
