# Setup Node.js v20 - Untuk Semua Tim

**Untuk:** Semua anggota yang baru clone project
**Dibutuhkan:** Node.js v20 untuk menjalankan project backend (Backend, Frontend, Database, Tester)

---

## 🔍 Cek Versi Node.js Kamu

Buka terminal/command prompt, ketik:

```bash
node --version
```

atau

```bash
node -v
```

**Output yang diharapkan:**
```
v20.x.x
```

Kalau keluar versi lain (misal v16, v18) atau command not found, ikuti panduan di bawah.

---

## 🪟 Windows (Laragon atau Standalone)

### Opsi 1: Install via NVM (Node Version Manager) - RECOMMENDED

**Kenapa NVM?** Bisa ganti-ganti versi Node.js dengan mudah.

1. **Download NVM for Windows:**
   - https://github.com/coreybutler/nvm-windows/releases
   - Download file `nvm-setup.exe`

2. **Install NVM:**
   - Jalankan `nvm-setup.exe`
   - Next → Next → Install
   - Buka terminal baru (Command Prompt atau PowerShell)

3. **Install Node.js v20:**
   ```bash
   # List versi yang tersedia
   nvm list available

   # Install Node.js v20 (pilih versi LTS terbaru, misal 20.11.0)
   nvm install 20.11.0

   # Set sebagai default
   nvm use 20.11.0
   ```

4. **Verifikasi:**
   ```bash
   node --version
   # Output: v20.11.0

   npm --version
   # Output: 10.x.x
   ```

### Opsi 2: Install Langsung dari Nodejs.org

1. **Download Node.js v20:**
   - https://nodejs.org/en/download
   - Pilih **LTS** (Long Term Support)
   - Download Windows Installer (.msi) - 64-bit

2. **Install:**
   - Jalankan file installer
   - Next → Accept → Next → Install
   - Restart terminal/command prompt

3. **Verifikasi:**
   ```bash
   node --version
   npm --version
   ```

### Opsi 3: Pakai Laragon

Kalau pakai Laragon:

1. Buka Laragon
2. Menu → Tools → Quick Add → Node.js
3. Pilih versi 20.x
4. Laragon akan download & install otomatis
5. Restart Laragon
6. Buka terminal Laragon (klik icon terminal di Laragon)
7. Cek: `node --version`

---

## 🍎 macOS

### Opsi 1: Install via Homebrew (RECOMMENDED)

1. **Install Homebrew dulu** (kalau belum ada):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js v20:**
   ```bash
   brew install node@20
   ```

3. **Link Node.js v20:**
   ```bash
   brew link node@20
   ```

4. **Verifikasi:**
   ```bash
   node --version
   npm --version
   ```

### Opsi 2: Install via NVM

1. **Install NVM:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```

2. **Restart terminal**, lalu:
   ```bash
   # Install Node.js v20
   nvm install 20

   # Set sebagai default
   nvm use 20
   nvm alias default 20
   ```

3. **Verifikasi:**
   ```bash
   node --version
   npm --version
   ```

---

## 🐧 Linux (Ubuntu/Debian)

### Opsi 1: Install via NVM (RECOMMENDED)

1. **Install NVM:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```

2. **Restart terminal**, lalu:
   ```bash
   # Install Node.js v20
   nvm install 20

   # Set sebagai default
   nvm use 20
   nvm alias default 20
   ```

3. **Verifikasi:**
   ```bash
   node --version
   npm --version
   ```

### Opsi 2: Install via Package Manager

```bash
# Update package list
sudo apt update

# Install Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verifikasi
node --version
npm --version
```

---

## ✅ Setelah Install Node.js v20

### 1. Install Sequelize CLI Global

```bash
npm install -g sequelize-cli
```

Verifikasi:
```bash
sequelize --version
```

### 2. Install Dependencies Project

```bash
# Masuk ke folder backend
cd /path/ke/project/backend

# Install semua dependencies (termasuk Sequelize)
npm install
```

---

## 🔧 Troubleshooting

### Error: "command not found: node"

**Windows:**
- Restart terminal/command prompt
- Atau restart komputer
- Cek PATH environment variable (cari "Environment Variables" di Windows)

**Mac/Linux:**
- Restart terminal
- Atau jalankan:
  ```bash
  source ~/.bashrc
  # atau
  source ~/.zshrc
  ```

### Error: "permission denied"

**Mac/Linux:**
```bash
# Pakai sudo
sudo npm install -g sequelize-cli
```

### Ganti Versi Node.js (kalau pakai NVM)

```bash
# List versi yang terinstall
nvm list

# Ganti ke versi 20
nvm use 20

# Set default
nvm alias default 20
```

---

## 📞 Butuh Bantuan?

Kalau ada masalah instalasi, tanya:
- **Backend Lead (Lisvindanu)** - 223040038
- **PM (Lisvindanu)**
- Atau Google: "install node.js v20 [OS kamu]"

---

**Next Step:**
- **Tim Database:** Lanjut ke `PANDUAN-TIM-DATABASE.md` untuk bikin migration & seeder
- **Tim Backend/Frontend:** Lanjut `npm install` di folder masing-masing
- **Tim Tester:** Setup tools testing (Postman, etc)

🚀
