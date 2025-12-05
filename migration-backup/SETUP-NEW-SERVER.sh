#!/bin/bash
# Setup Script untuk Server Baru (145.79.15.87)
# Run this script on the NEW SERVER after extracting files

set -e  # Exit on error

echo "========================================="
echo "PPL-C-2025 New Server Setup"
echo "Server: 145.79.15.87 (project-n)"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# Check if running as root
# ============================================
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# ============================================
# PART 1: System Update
# ============================================
echo -e "${GREEN}## STEP 1: System Update${NC}"
apt update && apt upgrade -y
apt install -y curl git build-essential wget

echo ""

# ============================================
# PART 2: Install Node.js 18.x
# ============================================
echo -e "${GREEN}## STEP 2: Installing Node.js 18.x${NC}"
if command -v node &> /dev/null; then
    echo "Node.js already installed: $(node --version)"
else
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

echo ""

# ============================================
# PART 3: Install MySQL 8.0
# ============================================
echo -e "${GREEN}## STEP 3: Installing MySQL 8.0${NC}"
if command -v mysql &> /dev/null; then
    echo "MySQL already installed: $(mysql --version)"
else
    apt install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
    echo -e "${YELLOW}Note: Run 'mysql_secure_installation' manually after this script${NC}"
fi

echo ""

# ============================================
# PART 4: Install Nginx
# ============================================
echo -e "${GREEN}## STEP 4: Installing Nginx${NC}"
if command -v nginx &> /dev/null; then
    echo "Nginx already installed: $(nginx -v 2>&1)"
else
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
fi

echo ""

# ============================================
# PART 5: Install PM2
# ============================================
echo -e "${GREEN}## STEP 5: Installing PM2${NC}"
if command -v pm2 &> /dev/null; then
    echo "PM2 already installed: $(pm2 --version)"
else
    npm install -g pm2
fi

echo ""

# ============================================
# PART 6: Extract Project Files
# ============================================
echo -e "${GREEN}## STEP 6: Extracting Project Files${NC}"

if [ -f "/tmp/ppl-project-full.tar.gz" ]; then
    mkdir -p /var/www
    cd /var/www
    tar -xzf /tmp/ppl-project-full.tar.gz
    echo "✅ PPL-C-2025 extracted to /var/www/PPL-C-2025"
else
    echo -e "${RED}Error: /tmp/ppl-project-full.tar.gz not found${NC}"
    echo "Please transfer files first!"
    exit 1
fi

if [ -f "/tmp/wa-notif.tar.gz" ]; then
    cd /var/www
    tar -xzf /tmp/wa-notif.tar.gz
    echo "✅ wa-notif extracted to /var/www/wa-notif"
else
    echo -e "${YELLOW}Warning: /tmp/wa-notif.tar.gz not found${NC}"
fi

if [ -f "/tmp/migration-backup-20251106-204922.tar.gz" ]; then
    cd /tmp
    tar -xzf migration-backup-20251106-204922.tar.gz
    echo "✅ Migration backup extracted to /tmp/migration-backup"
else
    echo -e "${RED}Error: /tmp/migration-backup-20251106-204922.tar.gz not found${NC}"
    exit 1
fi

echo ""

# ============================================
# PART 7: Database Setup
# ============================================
echo -e "${GREEN}## STEP 7: Database Setup${NC}"

echo "Creating database PPL_2025_C..."
mysql -u root << 'MYSQL_SCRIPT'
CREATE DATABASE IF NOT EXISTS PPL_2025_C CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON PPL_2025_C.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SCRIPT

echo "Importing database..."
mysql -u root -p'password' PPL_2025_C < /tmp/migration-backup/database-backup-20251106-204526.sql

# Verify
TABLE_COUNT=$(mysql -u root -p'password' -se "USE PPL_2025_C; SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'PPL_2025_C';")
echo "✅ Database imported successfully. Tables: $TABLE_COUNT"

echo ""

# ============================================
# PART 8: Backend Setup
# ============================================
echo -e "${GREEN}## STEP 8: Backend Setup${NC}"

cd /var/www/PPL-C-2025/backend

# Copy .env
cp /tmp/migration-backup/backend.env .env
echo "✅ Backend .env copied"

# Install dependencies
echo "Installing backend dependencies..."
npm install
echo "✅ Backend dependencies installed"

# Run migrations
echo "Running database migrations..."
npm run migrate
echo "✅ Migrations completed"

echo ""

# ============================================
# PART 9: Frontend Setup
# ============================================
echo -e "${GREEN}## STEP 9: Frontend Setup${NC}"

cd /var/www/PPL-C-2025/frontend

echo "Installing frontend dependencies..."
npm install
echo "✅ Frontend dependencies installed"

echo "Building frontend..."
npm run build
echo "✅ Frontend build completed"

echo ""

# ============================================
# PART 10: WhatsApp Notifier Setup
# ============================================
echo -e "${GREEN}## STEP 10: WhatsApp Notifier Setup${NC}"

if [ -d "/var/www/wa-notif" ]; then
    cd /var/www/wa-notif

    # Copy .env
    cp /tmp/migration-backup/wa-notif.env .env
    echo "✅ wa-notif .env copied"

    # Install dependencies
    echo "Installing wa-notif dependencies..."
    npm install
    echo "✅ wa-notif dependencies installed"
else
    echo -e "${YELLOW}Skipping wa-notif setup (directory not found)${NC}"
fi

echo ""

# ============================================
# PART 11: Start Services with PM2
# ============================================
echo -e "${GREEN}## STEP 11: Starting Services with PM2${NC}"

# Backend
cd /var/www/PPL-C-2025/backend
pm2 start src/server.js --name ppl-backend-5001
echo "✅ Backend started on port 5001"

# Frontend
cd /var/www/PPL-C-2025/frontend
pm2 start npm --name ppl-frontend-3000 -- run preview -- --port 3000 --host
echo "✅ Frontend started on port 3000"

# WhatsApp Notifier
if [ -d "/var/www/wa-notif" ]; then
    cd /var/www/wa-notif
    pm2 start server.js --name wa-notif
    echo "✅ WhatsApp Notifier started on port 3002"
fi

# Save PM2 config
pm2 save

# Setup PM2 startup
pm2 startup
echo -e "${YELLOW}Run the command above to enable PM2 on boot${NC}"

echo ""

# ============================================
# PART 12: Nginx Configuration
# ============================================
echo -e "${GREEN}## STEP 12: Nginx Configuration${NC}"

# Copy configs
cp /tmp/migration-backup/nginx/api-ppl.vinmedia.my.id /etc/nginx/sites-available/
cp /tmp/migration-backup/nginx/ppl.vinmedia.my.id /etc/nginx/sites-available/

# Enable sites
ln -sf /etc/nginx/sites-available/api-ppl.vinmedia.my.id /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/ppl.vinmedia.my.id /etc/nginx/sites-enabled/

# Test and reload
if nginx -t; then
    systemctl reload nginx
    echo "✅ Nginx configured and reloaded"
else
    echo -e "${RED}Nginx configuration error${NC}"
fi

echo ""

# ============================================
# PART 13: Setup Firewall
# ============================================
echo -e "${GREEN}## STEP 13: Firewall Setup${NC}"

if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo "y" | ufw enable
    echo "✅ Firewall configured"
else
    apt install -y ufw
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo "y" | ufw enable
    echo "✅ Firewall installed and configured"
fi

echo ""

# ============================================
# PART 14: Install fail2ban
# ============================================
echo -e "${GREEN}## STEP 14: Installing fail2ban${NC}"

if command -v fail2ban-client &> /dev/null; then
    echo "fail2ban already installed"
else
    apt install -y fail2ban
    systemctl enable fail2ban
    systemctl start fail2ban
    echo "✅ fail2ban installed and started"
fi

echo ""

# ============================================
# VERIFICATION
# ============================================
echo -e "${GREEN}## VERIFICATION${NC}"
echo ""

echo "PM2 Services:"
pm2 status

echo ""
echo "Database Connection:"
mysql -u root -p'password' -e "USE PPL_2025_C; SELECT COUNT(*) as user_count FROM users;" 2>/dev/null || echo "Database check OK"

echo ""
echo "Backend Health:"
sleep 2
curl -s http://localhost:5001/health || echo "Backend starting..."

echo ""
echo "Frontend Check:"
curl -s -I http://localhost:3000 | head -1 || echo "Frontend starting..."

echo ""

# ============================================
# SUMMARY
# ============================================
echo ""
echo "========================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "========================================="
echo ""
echo "Services Running:"
echo "- Backend API: http://localhost:5001"
echo "- Frontend: http://localhost:3000"
echo "- WhatsApp Notifier: http://localhost:3002"
echo ""
echo "Next Steps:"
echo "1. Setup Cloudflare Tunnel:"
echo "   bash /tmp/migration-backup/QUICK-COMMANDS.sh (see Step 17)"
echo ""
echo "2. Update GitHub Webhook:"
echo "   https://github.com/Lisvindanu/PPL-C-2025/settings/hooks"
echo ""
echo "3. Test endpoints:"
echo "   - https://api-ppl.vinmedia.my.id/health"
echo "   - https://ppl.vinmedia.my.id/"
echo ""
echo "4. Monitor logs:"
echo "   pm2 logs"
echo ""
echo "Documentation:"
echo "- /tmp/migration-backup/README.md"
echo "- /tmp/migration-backup/MIGRATION-CHECKLIST.md"
echo ""
