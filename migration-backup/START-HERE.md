# 🚀 Start Here - PPL-C-2025 Migration

**Server Lama (current)**: nobarwithus
**Server Baru**: 145.79.15.87 (project-n)
**Generated**: 2025-11-06 20:45 WIB

---

## 📋 Quick Overview

Ada **2 cara** untuk migrasi:

### 🔥 Cara 1: Otomatis (Recommended)
Menggunakan script yang sudah disediakan:
1. **Di server lama**: Jalankan transfer script
2. **Di server baru**: Jalankan setup script
3. **Selesai!**

### 📝 Cara 2: Manual
Ikuti step-by-step guide dari dokumentasi lengkap.

---

## 🔥 Cara 1: Migrasi Otomatis (Easy Mode)

### Step 1: Di Server Lama (Current Server)

```bash
# Jalankan script transfer
cd /var/www/PPL-C-2025/migration-backup
bash TRANSFER-TO-NEW-SERVER.sh
```

Script ini akan:
- ✅ Create archive PPL-C-2025 project
- ✅ Create archive wa-notif
- ✅ Create archive migration backup
- ✅ Transfer semua file ke 145.79.15.87:/tmp/

**Time**: ~2-5 menit (tergantung internet)

---

### Step 2: Di Server Baru (145.79.15.87)

```bash
# SSH ke server baru
ssh root@145.79.15.87

# Jalankan setup script
cd /tmp
tar -xzf migration-backup-20251106-204922.tar.gz
bash migration-backup/SETUP-NEW-SERVER.sh
```

Script ini akan install & configure **SEMUA**:
- ✅ System update
- ✅ Node.js 18.x
- ✅ MySQL 8.0
- ✅ Nginx
- ✅ PM2
- ✅ Extract semua files
- ✅ Create database & import data
- ✅ Install dependencies (backend, frontend, wa-notif)
- ✅ Build frontend
- ✅ Start services dengan PM2
- ✅ Configure Nginx
- ✅ Setup firewall (ufw)
- ✅ Install fail2ban

**Time**: ~10-15 menit

---

### Step 3: Setup Cloudflare Tunnel (Manual)

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Login ke Cloudflare
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create ppl-tunnel

# List tunnel (copy TUNNEL-ID)
cloudflared tunnel list

# Create config
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Paste config ini (ganti `TUNNEL-ID`):
```yaml
tunnel: TUNNEL-ID
credentials-file: /root/.cloudflared/TUNNEL-ID.json

ingress:
  - hostname: api-ppl.vinmedia.my.id
    service: http://localhost:5001
  - hostname: ppl.vinmedia.my.id
    service: http://localhost:3000
  - service: http_status:404
```

Save, lalu:
```bash
# Route DNS
cloudflared tunnel route dns ppl-tunnel api-ppl.vinmedia.my.id
cloudflared tunnel route dns ppl-tunnel ppl.vinmedia.my.id

# Test tunnel
cloudflared tunnel run ppl-tunnel

# Jika OK, install as service
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

**Time**: ~5 menit

---

### Step 4: Verification

```bash
# Check PM2
pm2 status

# Check backend
curl http://localhost:5001/health
curl https://api-ppl.vinmedia.my.id/health

# Check frontend
curl http://localhost:3000
curl https://ppl.vinmedia.my.id/

# Test webhook
curl -X POST https://api-ppl.vinmedia.my.id/test/notification \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check logs
pm2 logs
```

---

### Step 5: Update GitHub Webhook

Go to: https://github.com/Lisvindanu/PPL-C-2025/settings/hooks

Webhook seharusnya sudah ada. Jika perlu update:
- **Payload URL**: `https://api-ppl.vinmedia.my.id/webhook/github`
- **Secret**: `inisecretkeyrahasia`
- **Content type**: `application/json`
- **Events**: Just the push event

Test webhook dengan push ke branch `dev`!

---

## 📝 Cara 2: Migrasi Manual

Jika mau manual step-by-step, gunakan file dokumentasi:

### 1. Quick Commands (Copy-Paste)
```bash
bash /tmp/migration-backup/QUICK-COMMANDS.sh
```
Akan print semua command yang perlu di-run.

### 2. Complete Guide (Detailed)
```bash
cat /tmp/migration-backup/MIGRATION-CHECKLIST.md
```
Step-by-step lengkap dengan penjelasan.

### 3. Backup Overview
```bash
cat /tmp/migration-backup/README.md
```
Overview isi backup dan credentials.

---

## 📁 File Structure Reference

```
migration-backup/
├── START-HERE.md                    ← You are here
├── README.md                        ← Overview & quick start
├── MIGRATION-CHECKLIST.md          ← Complete detailed guide
├── QUICK-COMMANDS.sh               ← All commands (copy-paste)
├── TRANSFER-TO-NEW-SERVER.sh       ← Auto transfer script
├── SETUP-NEW-SERVER.sh             ← Auto setup script (NEW!)
├── backend.env                      ← Backend environment variables
├── wa-notif.env                     ← WhatsApp notifier config
├── database-backup-*.sql            ← MySQL database export
├── pm2-dump.pm2                     ← PM2 configuration
├── pm2-process-list.txt             ← PM2 status
└── nginx/
    ├── api-ppl.vinmedia.my.id       ← Backend API nginx config
    └── ppl.vinmedia.my.id           ← Frontend nginx config
```

---

## 🔑 Important Credentials

### Database
```
User: root
Password: password
Database: PPL_2025_C
```

### Midtrans (Sandbox)
```
Merchant ID: G799521996
Server Key: SB-Mid-server-5FHTcUDCpZq1g8TIgjgbas-4
Client Key: SB-Mid-client-sySq1i7cCIQnCtxH
```

### Fonnte API (WhatsApp)
```
API Token: pw3smKppdEZFwcZTaVoH
```

### GitHub Webhook
```
Secret: inisecretkeyrahasia
```

**All credentials** ada di file `.env`

---

## ✅ Checklist Progress

**Di Server Lama:**
- [ ] Run `TRANSFER-TO-NEW-SERVER.sh`
- [ ] Verify files transferred (check file sizes)

**Di Server Baru:**
- [ ] Extract migration backup
- [ ] Run `SETUP-NEW-SERVER.sh`
- [ ] Setup Cloudflare Tunnel
- [ ] Test all endpoints
- [ ] Update GitHub webhook (if needed)
- [ ] Monitor logs untuk errors

**Post-Migration:**
- [ ] Test payment flow (Midtrans sandbox)
- [ ] Test WhatsApp notifications (push to dev branch)
- [ ] Setup cron job untuk database backup
- [ ] Update dokumentasi internal

---

## 🆘 Troubleshooting

### Backend tidak start?
```bash
pm2 logs ppl-backend-5001 --err --lines 50
```

### Database error?
```bash
mysql -u root -p'password' -e "USE PPL_2025_C; SHOW TABLES;"
```

### Frontend 502 error?
```bash
pm2 restart ppl-frontend-3000
curl http://localhost:3000
```

### Nginx error?
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### WhatsApp tidak kirim notifikasi?
```bash
pm2 logs wa-notif
curl -X POST http://localhost:3002/test/notification
```

---

## 📞 Support & Documentation

- **Repository**: https://github.com/Lisvindanu/PPL-C-2025
- **Main Deployment Guide**: /var/www/PPL-C-2025/DEPLOYMENT.md
- **Migration Checklist**: /tmp/migration-backup/MIGRATION-CHECKLIST.md

---

## 🎯 TL;DR - Super Quick

**Di server lama:**
```bash
cd /var/www/PPL-C-2025/migration-backup
bash TRANSFER-TO-NEW-SERVER.sh
```

**Di server baru:**
```bash
ssh root@145.79.15.87
cd /tmp
tar -xzf migration-backup-20251106-204922.tar.gz
bash migration-backup/SETUP-NEW-SERVER.sh
```

**Setup Cloudflare Tunnel** (manual, ~5 menit)

**Done!** 🎉

---

**Last Updated**: 2025-11-06 20:55 WIB
