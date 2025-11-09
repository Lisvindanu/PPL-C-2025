# 🤖 Fresh Install Prompt for Claude Code

Prompt ini untuk memandu Claude Code melakukan fresh installation di server baru.

---

## 📋 Prompt untuk Claude Code

```
Hi Claude, saya ingin setup project PPL-C-2025 di fresh server.
Tolong bantu saya install dari awal dengan membaca file-file berikut secara berurutan:

1. DEPLOYMENT.md - Main deployment guide
2. backend/.env.example - Untuk setup environment variables backend
3. frontend/.env.example - Untuk setup environment variables frontend
4. wa-notif/.env (dari /var/www/wa-notif/.env di server lama) - Config WhatsApp notifier
5. PPL_2025_C_backup_20251104_150634.sql.gz - Database backup untuk restore

Setelah membaca semua file tersebut, tolong:
- Install semua dependencies (Node.js, MySQL, Nginx, PM2)
- Setup database dan restore dari backup
- Setup backend service di port 5001
- Setup frontend service di port 3000
- Setup wa-notif service di port 3002
- Configure Nginx untuk reverse proxy
- Setup PM2 untuk auto-restart services
- Verify semua services berjalan dengan baik

Gunakan informasi dari DEPLOYMENT.md sebagai panduan utama.
```

---

## 📁 File yang Wajib Dibaca (Urutan Prioritas)

### 1. **DEPLOYMENT.md**
   - **Lokasi**: `/var/www/PPL-C-2025/DEPLOYMENT.md`
   - **Isi**: Panduan lengkap deployment dari awal
   - **Penting untuk**:
     - System requirements
     - Installation steps
     - Configuration details
     - Troubleshooting

### 2. **Backend Configuration**
   - **File**: `backend/.env.example` atau `backend/.env`
   - **Lokasi**: `/var/www/PPL-C-2025/backend/.env`
   - **Penting untuk**:
     - Database credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
     - JWT Secret
     - Port configuration (5001)
     - Midtrans payment gateway keys
     - Frontend URL for CORS

### 3. **Frontend Configuration**
   - **File**: `frontend/.env.example` atau `frontend/.env`
   - **Lokasi**: `/var/www/PPL-C-2025/frontend/.env`
   - **Penting untuk**:
     - Backend API URL (VITE_API_URL)
     - App configuration

### 4. **WhatsApp Notifier Configuration**
   - **File**: `/var/www/wa-notif/.env`
   - **Penting untuk**:
     - GitHub webhook secret
     - Fonnte API token
     - WhatsApp target groups
     - Repository info
     - Port (3002)

### 5. **Database Backup**
   - **File**: `PPL_2025_C_backup_20251104_150634.sql.gz`
   - **Lokasi**: `/var/www/PPL-C-2025/PPL_2025_C_backup_20251104_150634.sql.gz`
   - **Penting untuk**: Restore database dengan 24 tables

### 6. **Server Configuration Files** (Opsional)
   - `backend/src/server.js` - Untuk lihat struktur routes dan middleware
   - `package.json` (backend & frontend) - Dependencies list

---

## 🔄 Step-by-Step Installation Flow

### Phase 1: Persiapan Server
1. Read: `DEPLOYMENT.md` → Section "System Requirements" & "Initial Server Setup"
2. Install: Node.js, MySQL, Nginx, PM2, Git

### Phase 2: Database Setup
1. Read: `DEPLOYMENT.md` → Section "Database Setup"
2. Read: `backend/.env` → Get DB credentials
3. Create database: `PPL_2025_C`
4. Restore backup: `PPL_2025_C_backup_20251104_150634.sql.gz`

### Phase 3: Backend Setup
1. Read: `DEPLOYMENT.md` → Section "Backend Setup"
2. Read: `backend/.env` → Configure all variables
3. Clone repo & install dependencies
4. Setup PM2: `ppl-backend-5001`

### Phase 4: Frontend Setup
1. Read: `DEPLOYMENT.md` → Section "Frontend Setup"
2. Read: `frontend/.env` → Configure API URL
3. Install dependencies & build
4. Setup PM2: `ppl-frontend-3000`

### Phase 5: WhatsApp Notifier Setup
1. Read: `DEPLOYMENT.md` → Section "WhatsApp Notifier Setup"
2. Read: `/var/www/wa-notif/.env` → Get all credentials
3. Clone wa-notif repo
4. Setup PM2: `wa-notif`

### Phase 6: Infrastructure
1. Read: `DEPLOYMENT.md` → Section "Nginx Configuration"
2. Configure Nginx for:
   - Frontend: `ppl.vinmedia.my.id`
   - Backend API: `api-ppl.vinmedia.my.id`
   - Webhook proxy: `/webhook/github`

### Phase 7: Verification
1. Read: `DEPLOYMENT.md` → Section "Verification & Testing"
2. Test all endpoints
3. Verify PM2 status
4. Test webhook notification

---

## 🔑 Critical Information Checklist

Pastikan Claude membaca dan extract informasi berikut:

### Database
- [ ] DB_NAME: PPL_2025_C
- [ ] DB_USER: (from backend/.env)
- [ ] DB_PASSWORD: (from backend/.env)
- [ ] DB_HOST: localhost
- [ ] DB_PORT: 3306

### Backend
- [ ] PORT: 5001
- [ ] JWT_SECRET: (from backend/.env)
- [ ] MIDTRANS_* credentials: (from backend/.env)
- [ ] FRONTEND_URL: https://ppl.vinmedia.my.id

### Frontend
- [ ] VITE_API_URL: https://api-ppl.vinmedia.my.id
- [ ] PORT: 3000

### WhatsApp Notifier
- [ ] PORT: 3002
- [ ] GITHUB_WEBHOOK_SECRET: (from wa-notif/.env)
- [ ] FONNTE_API_TOKEN: (from wa-notif/.env)
- [ ] WHATSAPP_TARGETS: (Group IDs from wa-notif/.env)
- [ ] TARGET_BRANCH: dev

### Nginx Routes
- [ ] Frontend domain: ppl.vinmedia.my.id → localhost:3000
- [ ] API domain: api-ppl.vinmedia.my.id → localhost:5001
- [ ] Webhook: api-ppl.vinmedia.my.id/webhook/github → localhost:3002

---

## 📝 Command Examples for Claude

### Read All Required Files
```bash
# Claude should read these files:
Read: /var/www/PPL-C-2025/DEPLOYMENT.md
Read: /var/www/PPL-C-2025/backend/.env
Read: /var/www/PPL-C-2025/frontend/.env
Read: /var/www/wa-notif/.env
Read: /var/www/PPL-C-2025/backend/src/server.js (optional, untuk context)
```

### Restore Database
```bash
# Extract and restore
gunzip -c PPL_2025_C_backup_20251104_150634.sql.gz | mysql -u ppl_user -p PPL_2025_C
```

### Verify Installation
```bash
# Check all services
pm2 list
curl http://localhost:5001/health
curl http://localhost:3000/
curl http://localhost:3002/
```

---

## 🚨 Important Notes

1. **Environment Variables**:
   - JANGAN hardcode di prompt
   - Claude harus baca dari file .env yang ada
   - Untuk production, generate JWT_SECRET dan WEBHOOK_SECRET baru

2. **Security**:
   - Update semua passwords di production
   - Generate new JWT_SECRET
   - Generate new GITHUB_WEBHOOK_SECRET
   - Update Midtrans keys untuk production

3. **Domain Configuration**:
   - Pastikan DNS sudah pointing ke server baru
   - Setup Cloudflare Tunnel jika diperlukan

4. **Services Order**:
   - Start MySQL first
   - Then Backend
   - Then Frontend
   - Finally wa-notif

---

## 📞 Quick Start Prompt (Copy-Paste Ready)

```
Claude, tolong setup PPL-C-2025 di fresh server dengan membaca file-file ini:

1. DEPLOYMENT.md - ikuti semua langkah
2. backend/.env - untuk config backend
3. frontend/.env - untuk config frontend
4. /var/www/wa-notif/.env - untuk config wa-notif
5. PPL_2025_C_backup_20251104_150634.sql.gz - restore database ini

Install semua (Node.js, MySQL, Nginx, PM2), setup services di port:
- Backend: 5001
- Frontend: 3000
- wa-notif: 3002

Configure Nginx reverse proxy dan verify semua services running.
```

---

**Created**: 2025-11-04
**Last Updated**: 2025-11-04
**Version**: 1.0.0
