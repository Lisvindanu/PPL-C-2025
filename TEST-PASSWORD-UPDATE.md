# 🧪 Test Password Update - Step by Step

## 🎯 Goal
Test bahwa password benar-benar terupdate di database setelah reset password.

## 📋 Prerequisites
- Backend server running: `http://localhost:5000`
- Frontend server running: `http://localhost:5173`
- Database MySQL connected
- Seeder data loaded

## 🚀 Testing Steps

### Step 1: Verify Initial State
```bash
# Check current password in database
# Login dengan password lama harus berhasil
```

**Test Login dengan Password Lama:**
1. Buka: `http://localhost:5173/login`
2. Email: `admin@skillconnect.com`
3. Password: `password123`
4. **Expected**: Login berhasil ✅

### Step 2: Reset Password
1. **Klik**: "Lupa kata sandi Anda?"
2. **Input Email**: `admin@skillconnect.com`
3. **Klik**: "Kirim"
4. **Copy OTP** dari Mock Info Card (contoh: `123456`)
5. **Paste OTP** ke input field
6. **Klik**: "Kirim"
7. **Input Password Baru**: `newpassword123`
8. **Klik**: "Kirim"
9. **Expected**: "Password berhasil diubah" ✅

### Step 3: Verify Password Update
**Test Login dengan Password Lama (Should Fail):**
1. Buka: `http://localhost:5173/login`
2. Email: `admin@skillconnect.com`
3. Password: `password123` (lama)
4. **Expected**: Login gagal ❌

**Test Login dengan Password Baru (Should Success):**
1. Email: `admin@skillconnect.com`
2. Password: `newpassword123` (baru)
3. **Expected**: Login berhasil ✅

## 🔍 Console Logs to Check

### Frontend Console
```javascript
🔧 Hybrid Mock: Reset password for: admin@skillconnect.com
🔧 Hybrid Mock: Password updated in mock data for user: admin@skillconnect.com
🔧 Hybrid Mock: Updating database directly...
🔧 Hybrid Direct: Updating password for: admin@skillconnect.com
🔧 Hybrid Direct: Password updated in database successfully
🔧 Hybrid Mock: Database updated successfully
```

### Backend Console
```javascript
✅ Password updated for user: admin@skillconnect.com
```

## 🚨 Troubleshooting

### Problem: Password lama masih bisa login
**Cause**: Database tidak terupdate
**Solution**: 
1. Check backend server running
2. Check console logs for errors
3. Verify database connection

### Problem: "Database update failed"
**Cause**: Backend tidak berjalan
**Solution**:
```bash
cd backend
npm start
```

### Problem: "User not found"
**Cause**: Email tidak ada di database
**Solution**:
```bash
cd backend
npm run seed
```

## 📊 Expected Results

| Test Case | Password | Expected Result |
|-----------|----------|-----------------|
| Login dengan password lama | `password123` | ❌ Login gagal |
| Login dengan password baru | `newpassword123` | ✅ Login berhasil |
| Database password hash | - | ✅ Berubah |

## 🎯 Success Criteria

- [ ] Password lama tidak bisa login
- [ ] Password baru bisa login
- [ ] Console logs menunjukkan database update
- [ ] Backend logs menunjukkan password updated
- [ ] Database password hash berubah

## 🔄 Reset for Next Test

### Clear Mock Data
```javascript
// In browser console
hybridResetPasswordService.clearMockData()
```

### Reset Password in Database
```bash
cd backend
npm run seed
```

## 📝 Test Report Template

```
Test Date: ___________
Tester: ___________

Initial State:
- [ ] Backend running
- [ ] Frontend running
- [ ] Database connected
- [ ] Login with old password works

Reset Password Test:
- [ ] Reset password flow completed
- [ ] Console logs show database update
- [ ] Backend logs show password updated

Verification:
- [ ] Old password login fails
- [ ] New password login succeeds
- [ ] Database password hash changed

Result: PASS / FAIL
Notes: ___________
```

## 🎉 Success!

Jika semua test case berhasil, maka password update sudah bekerja dengan benar:
- ✅ Password lama tidak bisa login
- ✅ Password baru bisa login  
- ✅ Database terupdate dengan benar
- ✅ Hybrid service berfungsi dengan baik
