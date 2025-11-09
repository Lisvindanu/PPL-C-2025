#!/bin/bash
# PPL-C-2025 Migration Quick Commands
# Copy & paste commands untuk migrasi ke VPS baru

echo "==================================="
echo "PPL-C-2025 VPS Migration Commands"
echo "==================================="
echo ""

# ============================================
# PART 1: TRANSFER FILES (Di Server Lama)
# ============================================

echo "## STEP 1: Prepare Backup Archive (Server Lama)"
echo "cd /var/www/PPL-C-2025"
echo "tar -czf migration-backup.tar.gz migration-backup/"
echo ""

echo "## STEP 2: Create Project Archives (Server Lama)"
echo "cd /var/www"
echo "tar -czf ppl-project.tar.gz PPL-C-2025/ --exclude='PPL-C-2025/node_modules' --exclude='PPL-C-2025/frontend/node_modules' --exclude='PPL-C-2025/backend/node_modules'"
echo "tar -czf wa-notif.tar.gz wa-notif/ --exclude='wa-notif/node_modules'"
echo ""

echo "## STEP 3: Transfer to New Server"
echo "# Ganti NEW_SERVER_IP dengan IP server baru"
echo "scp /var/www/PPL-C-2025/migration-backup.tar.gz root@NEW_SERVER_IP:/tmp/"
echo "scp /var/www/ppl-project.tar.gz root@NEW_SERVER_IP:/tmp/"
echo "scp /var/www/wa-notif.tar.gz root@NEW_SERVER_IP:/tmp/"
echo ""

# ============================================
# PART 2: INSTALL REQUIREMENTS (Server Baru)
# ============================================

echo "## STEP 4: System Update (Server Baru)"
cat << 'EOF'
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential
EOF
echo ""

echo "## STEP 5: Install Node.js 18.x"
cat << 'EOF'
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
EOF
echo ""

echo "## STEP 6: Install MySQL 8.0"
cat << 'EOF'
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation
EOF
echo ""

echo "## STEP 7: Install Nginx"
cat << 'EOF'
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
EOF
echo ""

echo "## STEP 8: Install PM2"
cat << 'EOF'
sudo npm install -g pm2
pm2 startup
# Copy & paste command yang ditampilkan
EOF
echo ""

# ============================================
# PART 3: EXTRACT & SETUP (Server Baru)
# ============================================

echo "## STEP 9: Extract Files"
cat << 'EOF'
cd /tmp
tar -xzf migration-backup.tar.gz

sudo mkdir -p /var/www
cd /var/www
sudo tar -xzf /tmp/ppl-project.tar.gz
sudo tar -xzf /tmp/wa-notif.tar.gz
EOF
echo ""

# ============================================
# PART 4: DATABASE SETUP
# ============================================

echo "## STEP 10: Create Database"
cat << 'EOF'
sudo mysql -u root -p << 'MYSQL_SCRIPT'
CREATE DATABASE PPL_2025_C CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON PPL_2025_C.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
MYSQL_SCRIPT
EOF
echo ""

echo "## STEP 11: Import Database"
cat << 'EOF'
mysql -u root -p'password' PPL_2025_C < /tmp/migration-backup/database-backup-20251106-204526.sql

# Verify
mysql -u root -p'password' -e "USE PPL_2025_C; SHOW TABLES;"
EOF
echo ""

# ============================================
# PART 5: BACKEND SETUP
# ============================================

echo "## STEP 12: Backend Setup"
cat << 'EOF'
cd /var/www/PPL-C-2025/backend

# Copy environment file
cp /tmp/migration-backup/backend.env .env

# Install dependencies
npm install

# Run migrations
npm run migrate

# Test backend
npm start
# Ctrl+C setelah verify OK
EOF
echo ""

echo "## STEP 13: Start Backend with PM2"
cat << 'EOF'
cd /var/www/PPL-C-2025/backend
pm2 start src/server.js --name ppl-backend-5001
pm2 save
EOF
echo ""

# ============================================
# PART 6: FRONTEND SETUP
# ============================================

echo "## STEP 14: Frontend Setup"
cat << 'EOF'
cd /var/www/PPL-C-2025/frontend

# Install dependencies
npm install

# Build production
npm run build

# Start with PM2
pm2 start npm --name ppl-frontend-3000 -- run preview -- --port 3000 --host
pm2 save
EOF
echo ""

# ============================================
# PART 7: WA-NOTIF SETUP
# ============================================

echo "## STEP 15: WhatsApp Notifier Setup"
cat << 'EOF'
cd /var/www/wa-notif

# Copy environment file
cp /tmp/migration-backup/wa-notif.env .env

# Install dependencies
npm install

# Start with PM2
pm2 start server.js --name wa-notif
pm2 save
EOF
echo ""

# ============================================
# PART 8: NGINX SETUP
# ============================================

echo "## STEP 16: Nginx Configuration"
cat << 'EOF'
# Copy configs
sudo cp /tmp/migration-backup/nginx/api-ppl.vinmedia.my.id /etc/nginx/sites-available/
sudo cp /tmp/migration-backup/nginx/ppl.vinmedia.my.id /etc/nginx/sites-available/

# Enable sites
sudo ln -s /etc/nginx/sites-available/api-ppl.vinmedia.my.id /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ppl.vinmedia.my.id /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
EOF
echo ""

# ============================================
# PART 9: CLOUDFLARE TUNNEL
# ============================================

echo "## STEP 17: Cloudflare Tunnel Setup"
cat << 'EOF'
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create ppl-tunnel

# Get tunnel ID
cloudflared tunnel list

# Create config
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
EOF
echo ""

echo "Paste this config (ganti TUNNEL-ID):"
cat << 'EOF'
tunnel: TUNNEL-ID
credentials-file: /root/.cloudflared/TUNNEL-ID.json

ingress:
  - hostname: api-ppl.vinmedia.my.id
    service: http://localhost:5001
  - hostname: ppl.vinmedia.my.id
    service: http://localhost:3000
  - service: http_status:404
EOF
echo ""

echo "Then run:"
cat << 'EOF'
# Route DNS
cloudflared tunnel route dns ppl-tunnel api-ppl.vinmedia.my.id
cloudflared tunnel route dns ppl-tunnel ppl.vinmedia.my.id

# Test tunnel
cloudflared tunnel run ppl-tunnel

# Install as service (jika OK)
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
EOF
echo ""

# ============================================
# PART 10: VERIFICATION
# ============================================

echo "## STEP 18: Verification"
cat << 'EOF'
# Check PM2 services
pm2 status

# Check backend health
curl http://localhost:5001/health

# Check frontend
curl http://localhost:3000

# Check database
mysql -u root -p'password' -e "USE PPL_2025_C; SELECT COUNT(*) FROM users;"

# Check public URLs (after cloudflare tunnel running)
curl https://api-ppl.vinmedia.my.id/health
curl https://ppl.vinmedia.my.id/

# Test webhook
curl -X POST https://api-ppl.vinmedia.my.id/test/notification \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
EOF
echo ""

# ============================================
# PART 11: SECURITY
# ============================================

echo "## STEP 19: Security Setup"
cat << 'EOF'
# Setup firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Install fail2ban
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
EOF
echo ""

# ============================================
# PART 12: POST-MIGRATION
# ============================================

echo "## STEP 20: Update GitHub Webhook"
echo "Go to: https://github.com/Lisvindanu/PPL-C-2025/settings/hooks"
echo "Update webhook URL jika perlu"
echo ""

echo "## STEP 21: Monitor Logs"
cat << 'EOF'
# Backend logs
pm2 logs ppl-backend-5001

# Frontend logs
pm2 logs ppl-frontend-3000

# WhatsApp notifier logs
pm2 logs wa-notif

# All logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log
EOF
echo ""

echo "==================================="
echo "Migration Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Test all API endpoints"
echo "2. Test payment flow (Midtrans)"
echo "3. Test WhatsApp notifications"
echo "4. Setup cron job untuk database backup"
echo "5. Monitor logs untuk errors"
echo ""
echo "Documentation:"
echo "- Full guide: /var/www/PPL-C-2025/DEPLOYMENT.md"
echo "- Migration checklist: /var/www/PPL-C-2025/migration-backup/MIGRATION-CHECKLIST.md"
echo "- This file: /var/www/PPL-C-2025/migration-backup/QUICK-COMMANDS.sh"
echo ""
