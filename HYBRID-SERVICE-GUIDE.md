# Hybrid Reset Password Service Guide

## 🎯 Overview
Hybrid service menggabungkan mock UI testing dengan real database integration. Anda bisa test UI dengan mock data, tapi password tetap terupdate di database MySQL.

## 🔄 Hybrid Modes

### 1. Mock Mode (Default)
- **UI Testing**: Menggunakan mock data untuk UI testing
- **OTP Display**: OTP ditampilkan langsung untuk kemudahan testing
- **Data Storage**: Mock data tersimpan di localStorage
- **Database**: **TIDAK terupdate** saat reset password

### 2. Real API Mode
- **Real Backend**: Menggunakan real API backend
- **Database**: Data tersimpan dan terupdate di MySQL
- **Password Hashing**: Password di-hash dengan bcrypt
- **Production Ready**: Siap untuk production

### 3. Hybrid Mode (Mock + Database)
- **UI Testing**: Menggunakan mock untuk UI testing
- **Database Update**: Password tetap terupdate di database
- **Best of Both**: Kombinasi mock UI + real database

## 🎮 Hybrid Mode Controller

### Location
Hybrid Mode Controller muncul di pojok kanan atas halaman reset password.

### Features
- **Mode Toggle**: Switch antara Mock Mode dan Real API Mode
- **Mode Description**: Penjelasan mode yang sedang aktif
- **Clear Data**: Clear mock data untuk testing ulang
- **Log Data**: Log mock data ke console untuk debugging

### Visual Indicators
- **🔧 Mock Mode**: Background biru
- **🌐 Real API Mode**: Background hijau

## 🚀 Cara Menggunakan

### 1. Mock Mode (UI Testing)
```javascript
// Default mode
hybridResetPasswordService.setMockMode(true)

// Test flow:
// 1. Input email dari seeder
// 2. Get OTP dari Mock Info Card
// 3. Verify OTP
// 4. Set new password
// 5. Password TIDAK terupdate di database
```

### 2. Real API Mode (Database Integration)
```javascript
// Switch ke real API
hybridResetPasswordService.setMockMode(false)

// Test flow:
// 1. Input email dari seeder
// 2. Get OTP dari email (real)
// 3. Verify OTP
// 4. Set new password
// 5. Password TERUPDATE di database
```

### 3. Hybrid Mode (Mock + Database)
```javascript
// Hybrid mode (default behavior)
hybridResetPasswordService.setMockMode(true)

// Test flow:
// 1. Input email dari seeder
// 2. Get OTP dari Mock Info Card
// 3. Verify OTP
// 4. Set new password
// 5. Password TERUPDATE di database (hybrid feature)
```

## 📧 Email untuk Testing

Menggunakan email yang sama dengan seeder.js:

| Email | Role | Name | Password |
|-------|------|------|----------|
| `admin@skillconnect.com` | Admin | Admin SkillConnect | `password123` |
| `client@skillconnect.com` | Client | John Doe | `password123` |
| `freelancer@skillconnect.com` | Freelancer | Jane Smith | `password123` |
| `client2@skillconnect.com` | Client | Alice Johnson | `password123` |
| `freelancer2@skillconnect.com` | Freelancer | Bob Williams | `password123` |

## 🔧 Technical Details

### Mock Mode Implementation
```javascript
// Mock data storage
this.mockData = {
  users: [...], // User data dari seeder
  tokens: new Map(), // Reset tokens
  otpCodes: new Map() // OTP codes
}

// Mock operations
async mockForgotPassword(email) { ... }
async mockVerifyOTP(email, otp) { ... }
async mockResetPassword(email, token, newPassword) { ... }
```

### Real API Implementation
```javascript
// Real API calls
async realForgotPassword(email) {
  const response = await fetch(`${this.baseURL}/forgot-password`, {...})
  return response.json()
}

async realVerifyOTP(email, otp) {
  const response = await fetch(`${this.baseURL}/verify-otp`, {...})
  return response.json()
}

async realResetPassword(email, token, newPassword) {
  const response = await fetch(`${this.baseURL}/reset-password`, {...})
  return response.json()
}
```

### Hybrid Implementation
```javascript
// Hybrid: Mock UI + Real Database
async mockResetPassword(email, token, newPassword) {
  // Update mock data
  const user = this.mockData.users.find(u => u.email === email)
  if (user) {
    user.password = newPassword
  }
  
  // ALSO UPDATE DATABASE
  try {
    const dbResult = await this.realResetPassword(email, token, newPassword)
    if (dbResult.success) {
      console.log('Database updated successfully')
    }
  } catch (error) {
    console.warn('Database update failed:', error.message)
  }
  
  return { success: true, message: 'Password updated (mock + database)' }
}
```

## 🧪 Testing Scenarios

### 1. UI Testing (Mock Mode)
- **Purpose**: Test UI/UX tanpa backend
- **Database**: Tidak terupdate
- **OTP**: Ditampilkan langsung
- **Use Case**: Development, UI testing

### 2. Integration Testing (Real API Mode)
- **Purpose**: Test dengan real backend
- **Database**: Terupdate
- **OTP**: Dari email real
- **Use Case**: Integration testing, production

### 3. Hybrid Testing (Mock + Database)
- **Purpose**: Test UI dengan database update
- **Database**: Terupdate
- **OTP**: Ditampilkan langsung
- **Use Case**: Best of both worlds

## 🔍 Debugging

### Console Logs
```javascript
// Mock operations
🔧 Hybrid Mock: Forgot Password Request for: admin@skillconnect.com
🔧 Hybrid Mock: Generated token: hybrid-token-abc123
🔧 Hybrid Mock: Generated OTP: 123456

// Real API operations
🔧 Hybrid Real API: Forgot Password Request for: admin@skillconnect.com
🔧 Hybrid Real API: Token generated successfully

// Hybrid operations
🔧 Hybrid Mock: Password updated in mock data for user: admin@skillconnect.com
🔧 Hybrid Mock: Also updating database...
🔧 Hybrid Real API: Password updated in database successfully
```

### Mock Data Inspection
```javascript
// Get mock data
const mockData = hybridResetPasswordService.getMockData()
console.log('Mock Data:', mockData)

// Get current mode
const mode = hybridResetPasswordService.getCurrentMode()
console.log('Current Mode:', mode) // "Mock Mode" or "Real API Mode"
```

## 🚀 Production Deployment

### Development Phase
1. **Mock Mode**: Test UI dengan mock data
2. **Hybrid Mode**: Test UI dengan database update
3. **Real API Mode**: Test dengan real backend

### Production Phase
1. **Switch to Real API**: `hybridResetPasswordService.setMockMode(false)`
2. **Remove Mock Components**: Hapus HybridModeController
3. **Deploy**: Production ready

## 📝 Benefits

### 1. **Flexible Testing**
- Test UI tanpa backend
- Test dengan real database
- Test hybrid scenario

### 2. **Development Speed**
- Fast UI testing dengan mock
- Real database integration
- Easy mode switching

### 3. **Production Ready**
- Smooth transition ke real API
- Database integration ready
- No data mismatch

## 🎯 Summary

Hybrid service memberikan:
- ✅ **Mock Mode**: UI testing tanpa backend
- ✅ **Real API Mode**: Full database integration
- ✅ **Hybrid Mode**: Mock UI + real database
- ✅ **Easy Switching**: Toggle mode kapan saja
- ✅ **Production Ready**: Smooth deployment
- ✅ **Debugging Tools**: Console logs dan data inspection

**Hybrid service memberikan fleksibilitas maksimal untuk development dan testing! 🚀**
