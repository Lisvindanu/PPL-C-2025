# 🚀 PPL-C-2025 Deployment Guide

Dokumentasi lengkap untuk setup project PPL-C-2025 di fresh server.

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Initial Server Setup](#initial-server-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [WhatsApp Notifier Setup](#whatsapp-notifier-setup)
7. [Nginx Configuration](#nginx-configuration)
8. [Cloudflare Tunnel Setup](#cloudflare-tunnel-setup)
9. [PM2 Process Manager](#pm2-process-manager)
10. [GitHub Webhook Setup](#github-webhook-setup)
11. [Verification & Testing](#verification--testing)

---

## 🖥️ System Requirements

### Minimum Specifications:
- **OS**: Ubuntu 20.04 LTS or later
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 20GB minimum
- **CPU**: 2 cores minimum

### Required Software:
- Node.js 18.x or later
- MySQL 8.0 or later
- Nginx
- PM2
- Git

---

## 🔧 Initial Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js 18.x
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Verify: v18.x.x
npm --version   # Verify: 9.x.x
```

### 3. Install MySQL
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

**MySQL Configuration:**
- Root password: Set a strong password
- Remove anonymous users: Yes
- Disallow root login remotely: Yes
- Remove test database: Yes
- Reload privilege tables: Yes

### 4. Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 5. Install PM2
```bash
sudo npm install -g pm2
pm2 startup  # Follow the instructions
```

### 6. Install Git
```bash
sudo apt install -y git
git --version  # Verify installation
```

---

## 🗄️ Database Setup

### 1. Create Database
```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE PPL_2025_C CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ppl_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON PPL_2025_C.* TO 'ppl_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Test Database Connection
```bash
mysql -u ppl_user -p PPL_2025_C
```

---

## 🔙 Backend Setup

### 1. Clone Repository
```bash
cd /var/www
git clone https://github.com/Lisvindanu/PPL-C-2025.git
cd PPL-C-2025/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
nano .env
```

**Required .env Configuration:**
```env
# Server Configuration
NODE_ENV=production
PORT=5001

# Database MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=PPL_2025_C
DB_USER=ppl_user
DB_PASSWORD=strong_password_here
DB_DIALECT=mysql

# Connection Pool
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=https://ppl.vinmedia.my.id

# Payment Gateway - Midtrans
MIDTRANS_MERCHANT_ID=your_merchant_id
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_IS_PRODUCTION=false

# Email Service (Optional)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@skillconnect.com

# File Storage (Optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=skillconnect-uploads

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 4. Run Database Migrations
```bash
# If using Sequelize migrations
npm run migrate

# Or manually import schema
mysql -u ppl_user -p PPL_2025_C < database/schema.sql
```

### 5. Test Backend
```bash
npm start
# Should see: SkillConnect Server Started on Port 5001
```

### 6. Setup with PM2
```bash
pm2 start src/server.js --name ppl-backend-5001
pm2 save
```

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend
```bash
cd /var/www/PPL-C-2025/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
nano .env
```

**Required .env Configuration:**
```env
VITE_API_URL=https://api-ppl.vinmedia.my.id
VITE_APP_NAME=SkillConnect
```

### 4. Build Frontend (Production)
```bash
npm run build
```

### 5. Setup with PM2 (Development Server)
```bash
pm2 start "npm run dev" --name ppl-frontend-3000
pm2 save
```

**For Production (Serve with Nginx):**
- Build files will be in `dist/` directory
- Configure Nginx to serve static files (see Nginx section)

---

## 📱 WhatsApp Notifier Setup

### 1. Clone wa-notif Repository
```bash
cd /var/www
git clone https://github.com/Lisvindanu/wa-notif.git
cd wa-notif
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
nano .env
```

**Required .env Configuration:**
```env
# Server Configuration
PORT=3002

# GitHub Webhook Secret (Must match GitHub webhook settings)
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here

# WhatsApp Configuration (Fonnte)
FONNTE_API_TOKEN=your_fonnte_token

# Target WhatsApp Groups/Numbers
# For groups: use Group ID from Fonnte (format: 120363xxxxx@g.us)
# For personal: use phone number (format: 628123456789)
WHATSAPP_TARGETS=120363421494549669@g.us,120363402755881445@g.us

# Repository Info
REPO_OWNER=Lisvindanu
REPO_NAME=PPL-C-2025
TARGET_BRANCH=dev
```

### 4. Setup Fonnte
1. Register at [Fonnte.com](https://fonnte.com)
2. Connect your WhatsApp number
3. Get API Token from dashboard
4. Join the WhatsApp groups you want to send notifications to
5. Get Group IDs from Fonnte dashboard

### 5. Test wa-notif
```bash
npm start
# Test endpoint: curl http://localhost:3002/
```

### 6. Setup with PM2
```bash
pm2 start server.js --name wa-notif
pm2 save
```

---

## 🌐 Nginx Configuration

### 1. Create Frontend Config
```bash
sudo nano /etc/nginx/sites-available/ppl.vinmedia.my.id
```

**Content:**
```nginx
server {
    listen 80;
    server_name ppl.vinmedia.my.id;

    # Mock payment static files - route to backend
    location /mock-payment {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API routes - route to backend
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Everything else - route to frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Create Backend API Config
```bash
sudo nano /etc/nginx/sites-available/api-ppl.vinmedia.my.id
```

**Content:**
```nginx
server {
    listen 80;
    server_name api-ppl.vinmedia.my.id;

    # GitHub Webhook for WA Notifier
    location /webhook/github {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # GitHub webhook specific headers
        proxy_set_header X-GitHub-Event $http_x_github_event;
        proxy_set_header X-Hub-Signature-256 $http_x_hub_signature_256;
    }

    # Test notification endpoint
    location /test/notification {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API routes - route to backend
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }

    # API Docs (Swagger)
    location /api-docs {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Health check
    location = /webhook/health {
        proxy_pass http://localhost:3002/;
        proxy_http_version 1.1;
    }

    # Default
    location / {
        return 200 '{"status":"active","service":"PPL-C-2025 API Server"}\n';
        add_header Content-Type application/json;
    }
}
```

### 3. Enable Sites
```bash
sudo ln -s /etc/nginx/sites-available/ppl.vinmedia.my.id /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api-ppl.vinmedia.my.id /etc/nginx/sites-enabled/
```

### 4. Test & Reload Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## ☁️ Cloudflare Tunnel Setup

### 1. Install Cloudflare Tunnel
```bash
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb
```

### 2. Login to Cloudflare
```bash
cloudflared tunnel login
```

### 3. Create Tunnel
```bash
cloudflared tunnel create ppl-tunnel
```

### 4. Configure Tunnel
```bash
mkdir -p /root/.cloudflared
nano /root/.cloudflared/ppl-config.yml
```

**Content:**
```yaml
tunnel: <your-tunnel-id>
credentials-file: /root/.cloudflared/<your-tunnel-id>.json

ingress:
  # Frontend
  - hostname: ppl.vinmedia.my.id
    service: http://localhost:5001

  # Backend API
  - hostname: api-ppl.vinmedia.my.id
    service: http://localhost:5001

  # Catch-all
  - service: http_status:404
```

### 5. Configure DNS in Cloudflare Dashboard
```bash
cloudflared tunnel route dns ppl-tunnel ppl.vinmedia.my.id
cloudflared tunnel route dns ppl-tunnel api-ppl.vinmedia.my.id
```

### 6. Run Tunnel as Service
```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

**Or with custom config:**
```bash
cloudflared tunnel --config /root/.cloudflared/ppl-config.yml run
```

---

## 🔄 PM2 Process Manager

### 1. Check All Services
```bash
pm2 list
```

### 2. Expected Running Services
- `ppl-backend-5001` - Backend API
- `ppl-frontend-3000` - Frontend Dev Server
- `wa-notif` - WhatsApp Notifier

### 3. PM2 Commands
```bash
# Restart service
pm2 restart ppl-backend-5001

# View logs
pm2 logs ppl-backend-5001

# Stop service
pm2 stop ppl-backend-5001

# Delete service
pm2 delete ppl-backend-5001

# Save current processes
pm2 save

# Auto-start on reboot
pm2 startup
```

### 4. Monitor Resources
```bash
pm2 monit
```

---

## 🪝 GitHub Webhook Setup

### 1. Generate Webhook Secret
```bash
openssl rand -hex 32
# Save this for .env and GitHub settings
```

### 2. Configure in GitHub
1. Go to: `https://github.com/Lisvindanu/PPL-C-2025/settings/hooks`
2. Click **"Add webhook"**
3. Configure:
   - **Payload URL**: `https://api-ppl.vinmedia.my.id/webhook/github`
   - **Content type**: `application/json`
   - **Secret**: Your generated webhook secret
   - **Which events**: Just the push event
   - **Active**: ✅ Checked
4. Click **"Add webhook"**

### 3. Test Webhook
```bash
# Push to dev branch
git push origin dev

# Check logs
pm2 logs wa-notif
```

---

## ✅ Verification & Testing

### 1. Backend Health Check
```bash
curl http://localhost:5001/health
# Expected: {"status":"healthy","database":"connected"}
```

### 2. Frontend Check
```bash
curl http://localhost:3000/
# Expected: HTML content
```

### 3. wa-notif Check
```bash
curl http://localhost:3002/
# Expected: {"status":"active","message":"GitHub WhatsApp Notifier is running"}
```

### 4. Test Notification
```bash
curl -X POST http://localhost:3002/test/notification
# Expected: {"status":"success","message":"Test notification sent"}
# Check WhatsApp groups for test message
```

### 5. Domain Check
```bash
curl https://ppl.vinmedia.my.id
curl https://api-ppl.vinmedia.my.id
curl https://api-ppl.vinmedia.my.id/api-docs
```

### 6. Database Check
```bash
mysql -u ppl_user -p PPL_2025_C -e "SHOW TABLES;"
```

### 7. PM2 Status
```bash
pm2 status
# All services should show "online"
```

---

## 🔐 Security Recommendations

### 1. Firewall Setup
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Fail2Ban (Optional)
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 3. Regular Updates
```bash
sudo apt update && sudo apt upgrade -y
```

### 4. Backup Database
```bash
# Create backup script
nano /root/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u ppl_user -p'password' PPL_2025_C > /backup/ppl_db_$DATE.sql
find /backup -name "ppl_db_*.sql" -mtime +7 -delete
```

```bash
chmod +x /root/backup-db.sh
# Add to crontab for daily backup
crontab -e
# Add: 0 2 * * * /root/backup-db.sh
```

---

## 📝 Environment Variables Summary

### Backend (.env)
- `NODE_ENV`, `PORT`
- `DB_*` - Database credentials
- `JWT_SECRET` - Authentication
- `MIDTRANS_*` - Payment gateway
- `FRONTEND_URL` - CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

### wa-notif (.env)
- `PORT`, `GITHUB_WEBHOOK_SECRET`
- `FONNTE_API_TOKEN` - WhatsApp API
- `WHATSAPP_TARGETS` - Group IDs
- `REPO_OWNER`, `REPO_NAME`, `TARGET_BRANCH`

---

## 🆘 Troubleshooting

### Backend Not Starting
```bash
pm2 logs ppl-backend-5001
# Check for database connection errors
# Verify .env configuration
```

### Database Connection Failed
```bash
mysql -u ppl_user -p
# Verify credentials
# Check MySQL service: sudo systemctl status mysql
```

### Webhook Not Working
```bash
pm2 logs wa-notif
# Check GitHub webhook deliveries
# Verify secret key matches
```

### Nginx Issues
```bash
sudo nginx -t
# Check configuration syntax
sudo systemctl status nginx
# View error logs: sudo tail -f /var/log/nginx/error.log
```

---

## 📚 Additional Resources

- **Backend API Docs**: `https://api-ppl.vinmedia.my.id/api-docs`
- **GitHub Repository**: `https://github.com/Lisvindanu/PPL-C-2025`
- **Fonnte Dashboard**: `https://fonnte.com`
- **Cloudflare Dashboard**: `https://dash.cloudflare.com`

---

## 📞 Support

For issues or questions, contact the development team or create an issue on GitHub.

---

**Last Updated**: 2025-11-04
**Version**: 1.0.0
