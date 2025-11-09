# PPL-C-2025 VPS Migration Checklist

Generated: 2025-11-06

## 📦 Backup Contents

Semua file backup ada di folder `migration-backup/`:
- ✅ Database export: `database-backup-*.sql`
- ✅ Backend .env: `backend.env`
- ✅ WhatsApp Notifier .env: `wa-notif.env`
- ✅ Nginx configs: `nginx/`
- ✅ PM2 process list: `pm2-process-list.txt` & `pm2-dump.pm2`

## 🔑 Credentials & Keys Summary

### Database
- **User**: root
- **Password**: password
- **Database Name**: PPL_2025_C
- **Port**: 3306

### Midtrans Payment Gateway
- **Merchant ID**: G799521996
- **Server Key**: SB-Mid-server-5FHTcUDCpZq1g8TIgjgbas-4
- **Client Key**: SB-Mid-client-sySq1i7cCIQnCtxH
- **Mode**: Sandbox (MIDTRANS_IS_PRODUCTION=false)

### WhatsApp Notifier (Fonnte API)
- **API Token**: pw3smKppdEZFwcZTaVoH
- **Webhook Secret**: inisecretkeyrahasia
- **Target Groups**:
  - 120363421494549669@g.us (Role: Backend)
  - 120363402755881445@g.us (Role: Frontend)

### GitHub Webhook
- **Repository**: Lisvindanu/PPL-C-2025
- **Target Branch**: dev
- **Webhook URL**: https://api-ppl.vinmedia.my.id/webhook/github

### JWT & Security
- **JWT Secret**: your-super-secret-jwt-key-change-this-in-production-please-make-it-very-long-and-random
- **JWT Expiration**: 7d
- **Refresh Token Expiration**: 30d

## 🌐 Domain Configuration

### Frontend
- **Domain**: ppl.vinmedia.my.id
- **Port**: 3000 (local)
- **URL**: https://ppl.vinmedia.my.id/

### Backend API
- **Domain**: api-ppl.vinmedia.my.id
- **Port**: 5001 (local)
- **URL**: https://api-ppl.vinmedia.my.id/

### WhatsApp Notifier
- **Port**: 3002 (local, proxied through backend)
- **Webhook URL**: https://api-ppl.vinmedia.my.id/webhook/github

## 📝 Pre-Migration Checklist

- [ ] Copy folder `PPL-C-2025/` ke server baru
- [ ] Copy folder `wa-notif/` ke server baru
- [ ] Simpan backup `migration-backup/` di tempat aman

## 🚀 Server Baru - Installation Steps

### 1. System Requirements
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y curl git build-essential
```

### 2. Install Node.js 18.x
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v18.x
npm --version
```

### 3. Install MySQL 8.0
```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

### 4. Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Install PM2
```bash
sudo npm install -g pm2
pm2 startup
```

## 💾 Database Migration

### 1. Create Database
```bash
sudo mysql -u root -p
```
```sql
CREATE DATABASE PPL_2025_C CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON PPL_2025_C.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Import Database
```bash
mysql -u root -p'password' PPL_2025_C < /var/www/PPL-C-2025/migration-backup/database-backup-*.sql
```

### 3. Verify Import
```bash
mysql -u root -p'password' -e "USE PPL_2025_C; SHOW TABLES;"
```

## 🔧 Backend Setup

### 1. Copy Project
```bash
sudo mkdir -p /var/www
sudo cp -r PPL-C-2025 /var/www/
cd /var/www/PPL-C-2025/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Copy Environment Variables
```bash
cp /path/to/migration-backup/backend.env /var/www/PPL-C-2025/backend/.env
```

### 4. Run Migrations
```bash
npm run migrate
```

### 5. Start with PM2
```bash
pm2 start src/server.js --name ppl-backend-5001 --cwd /var/www/PPL-C-2025/backend
pm2 save
```

## 🎨 Frontend Setup

### 1. Navigate to Frontend
```bash
cd /var/www/PPL-C-2025/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build Production
```bash
npm run build
```

### 4. Start with PM2
```bash
pm2 start npm --name ppl-frontend-3000 -- run preview -- --port 3000 --host
pm2 save
```

## 📱 WhatsApp Notifier Setup

### 1. Copy Project
```bash
sudo cp -r wa-notif /var/www/
cd /var/www/wa-notif
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Copy Environment Variables
```bash
cp /path/to/migration-backup/wa-notif.env /var/www/wa-notif/.env
```

### 4. Start with PM2
```bash
pm2 start server.js --name wa-notif --cwd /var/www/wa-notif
pm2 save
```

## 🌐 Nginx Configuration

### 1. Backend API Config
```bash
sudo nano /etc/nginx/sites-available/api-ppl.vinmedia.my.id
```

Copy content from `migration-backup/nginx/api-ppl.vinmedia.my.id`

### 2. Frontend Config
```bash
sudo nano /etc/nginx/sites-available/ppl.vinmedia.my.id
```

Copy content from `migration-backup/nginx/ppl.vinmedia.my.id`

### 3. Enable Sites
```bash
sudo ln -s /etc/nginx/sites-available/api-ppl.vinmedia.my.id /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ppl.vinmedia.my.id /etc/nginx/sites-enabled/
```

### 4. Test & Reload
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## ☁️ Cloudflare Tunnel Setup

### 1. Install Cloudflared
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### 2. Authenticate
```bash
cloudflared tunnel login
```

### 3. Create Tunnel
```bash
cloudflared tunnel create ppl-tunnel
```

### 4. Configure Tunnel
```bash
nano ~/.cloudflared/config.yml
```

Add configuration:
```yaml
tunnel: <TUNNEL-ID>
credentials-file: /root/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: api-ppl.vinmedia.my.id
    service: http://localhost:5001
  - hostname: ppl.vinmedia.my.id
    service: http://localhost:3000
  - service: http_status:404
```

### 5. Route DNS
```bash
cloudflared tunnel route dns ppl-tunnel api-ppl.vinmedia.my.id
cloudflared tunnel route dns ppl-tunnel ppl.vinmedia.my.id
```

### 6. Run Tunnel
```bash
cloudflared tunnel run ppl-tunnel
```

### 7. Install as Service
```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

## 🔍 Verification Steps

### 1. Check PM2 Services
```bash
pm2 status
```
Pastikan semua service running:
- ppl-backend-5001
- ppl-frontend-3000
- wa-notif

### 2. Check Backend Health
```bash
curl http://localhost:5001/health
```

### 3. Check Frontend
```bash
curl http://localhost:3000
```

### 4. Check Database Connection
```bash
mysql -u root -p'password' -e "USE PPL_2025_C; SELECT COUNT(*) FROM users;"
```

### 5. Test API Endpoints
```bash
# Health check
curl https://api-ppl.vinmedia.my.id/health

# API docs
curl https://api-ppl.vinmedia.my.id/api-docs
```

### 6. Test WhatsApp Webhook
```bash
curl -X POST https://api-ppl.vinmedia.my.id/test/notification \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 📊 GitHub Webhook Configuration

1. Go to: https://github.com/Lisvindanu/PPL-C-2025/settings/hooks
2. Add webhook:
   - **Payload URL**: `https://api-ppl.vinmedia.my.id/webhook/github`
   - **Content type**: `application/json`
   - **Secret**: `inisecretkeyrahasia`
   - **Events**: Just the push event
   - **Branch filter**: `dev`

## 🔒 Security Checklist

- [ ] Change database password jika perlu
- [ ] Update JWT_SECRET dengan value baru yang random
- [ ] Update GITHUB_WEBHOOK_SECRET jika perlu
- [ ] Setup firewall (ufw)
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```
- [ ] Setup fail2ban
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 🔄 Post-Migration Tasks

- [ ] Update GitHub webhook URL jika berbeda
- [ ] Test semua endpoint API
- [ ] Test payment flow (Midtrans sandbox)
- [ ] Test WhatsApp notifications
- [ ] Monitor logs untuk error
- [ ] Update DNS records jika IP berubah
- [ ] Setup backup cron job untuk database

## 📝 Monitoring Commands

### View Logs
```bash
# Backend logs
pm2 logs ppl-backend-5001

# Frontend logs
pm2 logs ppl-frontend-3000

# WhatsApp notifier logs
pm2 logs wa-notif

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Restart Services
```bash
# Restart backend
pm2 restart ppl-backend-5001

# Restart frontend
pm2 restart ppl-frontend-3000

# Restart wa-notif
pm2 restart wa-notif

# Reload nginx
sudo systemctl reload nginx
```

## 🆘 Troubleshooting

### Backend tidak start
1. Check logs: `pm2 logs ppl-backend-5001 --err --lines 50`
2. Check database connection di .env
3. Cek apakah port 5001 sudah dipakai: `sudo lsof -i :5001`

### Frontend tidak start
1. Check logs: `pm2 logs ppl-frontend-3000 --err --lines 50`
2. Pastikan build sudah selesai: `npm run build`
3. Cek apakah port 3000 sudah dipakai: `sudo lsof -i :3000`

### WhatsApp tidak kirim
1. Check logs: `pm2 logs wa-notif`
2. Verify Fonnte API token masih valid
3. Test manual: `curl -X POST http://localhost:3002/test/notification`

### 502 Bad Gateway
1. Check backend running: `pm2 status`
2. Check nginx config: `sudo nginx -t`
3. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`

## 📞 Important Links

- **Repository**: https://github.com/Lisvindanu/PPL-C-2025
- **Deployment Docs**: /var/www/PPL-C-2025/DEPLOYMENT.md
- **Midtrans Dashboard**: https://dashboard.midtrans.com
- **Fonnte Dashboard**: https://fonnte.com

---

**Note**: Simpan file ini dan semua credentials dengan aman. Jangan commit ke git!
