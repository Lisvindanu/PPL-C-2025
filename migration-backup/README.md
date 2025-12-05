# Migration Backup - PPL-C-2025

**Created**: 2025-11-06 20:45 WIB
**Purpose**: Complete backup untuk migrasi ke VPS baru

## 📦 Isi Backup

### 1. Database
- `database-backup-20251106-204526.sql` (68 KB)
  - Full export database PPL_2025_C
  - Include schema + data semua tabel
  - Database: PPL_2025_C
  - User: root
  - Password: password

### 2. Environment Variables
- `backend.env` (1.7 KB)
  - Semua konfigurasi backend
  - Database credentials
  - JWT secrets
  - Midtrans payment gateway keys
  - Email settings

- `wa-notif.env` (475 bytes)
  - Fonnte API token
  - GitHub webhook secret
  - WhatsApp group targets
  - Repository settings

### 3. Nginx Configurations
- `nginx/api-ppl.vinmedia.my.id`
  - Backend API nginx config
  - Port 5001
  - Webhook proxy config

- `nginx/ppl.vinmedia.my.id`
  - Frontend nginx config
  - Port 3000
  - Static file serving

### 4. PM2 Configuration
- `pm2-process-list.txt` (2.9 KB)
  - Current PM2 process status
  - List semua service yang running

- `pm2-dump.pm2` (58 KB)
  - PM2 dump file
  - Bisa di-restore dengan `pm2 resurrect`

### 5. Documentation
- `MIGRATION-CHECKLIST.md` (9.2 KB)
  - Complete step-by-step migration guide
  - Installation instructions
  - Configuration details
  - Troubleshooting guide

## 🚀 Quick Start - Migrasi ke VPS Baru

### Step 1: Copy Files
```bash
# Di server lama
cd /var/www/PPL-C-2025
tar -czf migration-backup.tar.gz migration-backup/

# Transfer ke server baru (gunakan scp/rsync)
scp migration-backup.tar.gz user@new-server:/tmp/

# Di server baru
cd /tmp
tar -xzf migration-backup.tar.gz
```

### Step 2: Copy Project Code
```bash
# Di server lama
cd /var/www
tar -czf ppl-project.tar.gz PPL-C-2025/
tar -czf wa-notif.tar.gz wa-notif/

# Transfer ke server baru
scp ppl-project.tar.gz user@new-server:/tmp/
scp wa-notif.tar.gz user@new-server:/tmp/

# Di server baru
cd /var/www
sudo tar -xzf /tmp/ppl-project.tar.gz
sudo tar -xzf /tmp/wa-notif.tar.gz
```

### Step 3: Follow Migration Checklist
Buka file `MIGRATION-CHECKLIST.md` dan ikuti semua langkah secara berurutan.

## 🔑 Credentials Summary

### Database
```
Host: localhost
Port: 3306
User: root
Password: password
Database: PPL_2025_C
```

### JWT
```
JWT_SECRET: your-super-secret-jwt-key-change-this-in-production-please-make-it-very-long-and-random
JWT_EXPIRATION: 7d
JWT_REFRESH_EXPIRATION: 30d
```

### Midtrans (Sandbox)
```
Merchant ID: G799521996
Server Key: SB-Mid-server-5FHTcUDCpZq1g8TIgjgbas-4
Client Key: SB-Mid-client-sySq1i7cCIQnCtxH
```

### Fonnte API
```
API Token: pw3smKppdEZFwcZTaVoH
```

### GitHub Webhook
```
Secret: inisecretkeyrahasia
Repo: Lisvindanu/PPL-C-2025
Branch: dev
```

## 📂 File Structure Needed

```
/var/www/
├── PPL-C-2025/
│   ├── backend/
│   │   ├── .env (copy dari backend.env)
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   ├── frontend/
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   └── DEPLOYMENT.md
│
└── wa-notif/
    ├── .env (copy dari wa-notif.env)
    ├── server.js
    ├── package.json
    └── ...
```

## ⚡ Quick Restore Commands

### Import Database
```bash
mysql -u root -p'password' PPL_2025_C < database-backup-20251106-204526.sql
```

### Restore PM2 (if needed)
```bash
cp pm2-dump.pm2 /root/.pm2/dump.pm2
pm2 resurrect
```

### Copy Environment Files
```bash
cp backend.env /var/www/PPL-C-2025/backend/.env
cp wa-notif.env /var/www/wa-notif/.env
```

### Copy Nginx Configs
```bash
sudo cp nginx/api-ppl.vinmedia.my.id /etc/nginx/sites-available/
sudo cp nginx/ppl.vinmedia.my.id /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/api-ppl.vinmedia.my.id /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ppl.vinmedia.my.id /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## ✅ Verification After Migration

1. **Check PM2 Services**
   ```bash
   pm2 status
   # Should show: ppl-backend-5001, ppl-frontend-3000, wa-notif
   ```

2. **Check Backend**
   ```bash
   curl http://localhost:5001/health
   ```

3. **Check Database**
   ```bash
   mysql -u root -p'password' -e "USE PPL_2025_C; SHOW TABLES;"
   ```

4. **Check Frontend**
   ```bash
   curl http://localhost:3000
   ```

5. **Check Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

## 📋 System Requirements

- **OS**: Ubuntu 20.04+ LTS
- **Node.js**: 18.x
- **MySQL**: 8.0+
- **Nginx**: Latest stable
- **PM2**: Latest
- **RAM**: Minimal 2GB (recommended 4GB+)
- **Storage**: Minimal 20GB free

## 🔒 Security Notes

1. **Change sensitive credentials** setelah migration:
   - Database password
   - JWT_SECRET
   - GITHUB_WEBHOOK_SECRET (optional)

2. **Setup firewall**:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. **Install fail2ban**:
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   ```

## 📞 Support

- **Repository**: https://github.com/Lisvindanu/PPL-C-2025
- **Main Docs**: /var/www/PPL-C-2025/DEPLOYMENT.md
- **Migration Guide**: /var/www/PPL-C-2025/migration-backup/MIGRATION-CHECKLIST.md

## ⚠️ Important Notes

1. **Database backup** menggunakan mysqldump dengan character set utf8mb4
2. **Environment files** berisi sensitive data - jangan commit ke git!
3. **Nginx configs** mungkin perlu disesuaikan jika IP/domain berubah
4. **PM2 dump** berisi semua process configurations
5. **Cloudflare Tunnel** perlu di-setup ulang di server baru

## 🔄 Next Steps After Migration

1. ✅ Install system requirements (Node.js, MySQL, Nginx, PM2)
2. ✅ Copy project files (PPL-C-2025, wa-notif)
3. ✅ Restore database
4. ✅ Copy environment files
5. ✅ Install npm dependencies
6. ✅ Run migrations
7. ✅ Start services with PM2
8. ✅ Setup Nginx
9. ✅ Setup Cloudflare Tunnel
10. ✅ Update GitHub webhook URL
11. ✅ Test all endpoints
12. ✅ Setup monitoring & backups

---

**Backup Created**: 2025-11-06 20:45 WIB
**Total Size**: ~150 KB (compressed: 22 KB)
**Valid Until**: No expiration (archive untuk reference)
