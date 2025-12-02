# 🚀 Quick Start - OTP Implementation

Panduan cepat untuk mengimplementasikan OTP dengan Gmail SMTP dan WhatsApp Cloud API.

## ⚡ Setup Cepat (5 Menit)

### 1. Install Dependencies

Dependencies sudah terinstall (nodemailer & axios sudah ada di package.json).

### 2. Konfigurasi Gmail SMTP

**a. Aktifkan 2-Step Verification**
- Buka: https://myaccount.google.com/security
- Aktifkan "2-Step Verification"

**b. Generate App Password**
- Buka: https://myaccount.google.com/apppasswords
- Pilih "Mail" > "Other" > Beri nama "SkillConnect"
- Copy password 16 karakter

**c. Update .env**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx
SMTP_FROM_EMAIL=noreply@skillconnect.com
```

### 3. Konfigurasi WhatsApp (Opsional)

**a. Buat WhatsApp Business App**
- Buka: https://developers.facebook.com/apps
- Create App > Business > Add WhatsApp

**b. Dapatkan Credentials**
- Copy "Phone number ID"
- Copy "Access Token"

**c. Update .env**
```env
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxx
WHATSAPP_API_VERSION=v18.0
```

### 4. Konfigurasi OTP

```env
OTP_EXPIRY_MINUTES=10
OTP_LENGTH=6
APP_NAME=SkillConnect
```

### 5. Testing

```bash
# Test semua fungsi OTP
node test-otp.js

# Atau test manual via API
curl -X POST http://localhost:5000/api/users/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "purpose": "password_reset",
    "channels": ["email"]
  }'
```

---

## 📱 Penggunaan API

### 1. Kirim OTP

**Endpoint:** `POST /api/users/send-otp`

```javascript
// Via Email saja
{
  "email": "user@example.com",
  "purpose": "password_reset",
  "channels": ["email"]
}

// Via WhatsApp saja
{
  "email": "user@example.com",
  "phoneNumber": "628123456789",
  "purpose": "verification",
  "channels": ["whatsapp"]
}

// Via Email + WhatsApp
{
  "email": "user@example.com",
  "phoneNumber": "628123456789",
  "purpose": "login",
  "channels": ["email", "whatsapp"]
}
```

**Purpose Options:**
- `password_reset` - Reset password
- `verification` - Verifikasi akun
- `login` - Login dengan OTP
- `transaction` - Verifikasi transaksi

### 2. Verifikasi OTP

**Endpoint:** `POST /api/users/verify-otp`

```javascript
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### 3. Reset Password (Complete Flow)

```javascript
// Step 1: Request OTP
POST /api/users/forgot-password
{
  "email": "user@example.com",
  "channels": ["email"]
}

// Step 2: Verify OTP
POST /api/users/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}
// Response: { token: "reset-token-uuid" }

// Step 3: Reset Password
POST /api/users/reset-password
{
  "email": "user@example.com",
  "token": "reset-token-uuid",
  "newPassword": "NewPassword123!"
}
```

---

## 🔧 Integrasi di Frontend

### React/Vue Example

```javascript
// 1. Request OTP
async function requestOTP(email) {
  const response = await fetch('/api/users/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      purpose: 'password_reset',
      channels: ['email']
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('OTP sent successfully');
    // Show OTP input form
  }
}

// 2. Verify OTP
async function verifyOTP(email, otp) {
  const response = await fetch('/api/users/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  
  const data = await response.json();
  
  if (data.success) {
    const resetToken = data.data.token;
    // Save token and show password reset form
    return resetToken;
  }
}

// 3. Reset Password
async function resetPassword(email, token, newPassword) {
  const response = await fetch('/api/users/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token, newPassword })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log('Password reset successful');
    // Redirect to login
  }
}
```

---

## 🎨 UI Flow Recommendation

### Password Reset Flow

```
1. [Forgot Password Page]
   - Input: Email
   - Button: "Send OTP"
   ↓
2. [OTP Verification Page]
   - Display: "OTP sent to your email"
   - Input: 6-digit OTP code
   - Timer: "Expires in 10:00"
   - Link: "Resend OTP"
   ↓
3. [New Password Page]
   - Input: New Password
   - Input: Confirm Password
   - Button: "Reset Password"
   ↓
4. [Success Page]
   - Message: "Password reset successful"
   - Button: "Login"
```

---

## 🔒 Security Best Practices

1. **Rate Limiting**
   - Built-in: 1 OTP per user per minute
   - Mencegah spam dan brute force

2. **OTP Expiry**
   - Default: 10 menit
   - Configurable via `OTP_EXPIRY_MINUTES`

3. **One-Time Use**
   - OTP otomatis invalid setelah digunakan
   - Tidak bisa digunakan ulang

4. **Secure Storage**
   - OTP di-hash di database
   - Tidak pernah di-log dalam production

5. **HTTPS Only**
   - Selalu gunakan HTTPS di production
   - Protect credentials dengan environment variables

---

## 📊 Monitoring

### Metrics to Track

1. **Delivery Rate**
   - Email delivery success rate
   - WhatsApp delivery success rate

2. **Verification Rate**
   - OTP verification success rate
   - Failed verification attempts

3. **Performance**
   - Average delivery time
   - API response time

### Logging

Service otomatis log:
- ✅ Successful deliveries
- ❌ Failed deliveries
- ⚠️ Configuration issues
- 🔒 Security events (rate limit violations)

---

## 🐛 Troubleshooting

### Email tidak terkirim?

1. **Check SMTP credentials**
   ```bash
   echo $SMTP_USER
   echo $SMTP_PASS
   ```

2. **Test SMTP connection**
   ```bash
   node test-otp.js
   ```

3. **Check Gmail settings**
   - 2-Step Verification aktif?
   - App Password sudah di-generate?
   - Less secure app access: OFF (gunakan App Password)

### WhatsApp tidak terkirim?

1. **Check credentials**
   ```bash
   echo $WHATSAPP_PHONE_NUMBER_ID
   echo $WHATSAPP_ACCESS_TOKEN
   ```

2. **Verify phone number format**
   - Format: 628123456789 (no +, no spaces)
   - Country code: 62 (Indonesia)

3. **Check WhatsApp Business status**
   - Phone number verified?
   - Access token valid?
   - API version correct?

### OTP expired?

- Default expiry: 10 menit
- Increase via `OTP_EXPIRY_MINUTES` di .env
- User bisa request OTP baru

---

## 📚 Dokumentasi Lengkap

Untuk dokumentasi lengkap, lihat:
- [OTP-IMPLEMENTATION-GUIDE.md](./OTP-IMPLEMENTATION-GUIDE.md) - Panduan lengkap
- [test-otp.js](./test-otp.js) - Testing script

---

## 🆘 Support

Butuh bantuan?
1. Check [OTP-IMPLEMENTATION-GUIDE.md](./OTP-IMPLEMENTATION-GUIDE.md)
2. Run `node test-otp.js` untuk diagnostic
3. Check logs di console

---

## ✅ Checklist Production

Sebelum deploy ke production:

- [ ] Gmail App Password sudah di-generate
- [ ] WhatsApp Business Account verified
- [ ] Environment variables sudah di-set
- [ ] Test email delivery berhasil
- [ ] Test WhatsApp delivery berhasil
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Monitoring setup
- [ ] Error logging configured
- [ ] Backup notification channel ready

---

**Happy Coding! 🚀**
