# Deployment Guide - API Documentation

## 🚀 Deploy API Documentation ke Production

Ikuti langkah-langkah berikut untuk deploy API documentation ke production server.

## 📝 Step-by-Step Deployment

### 1. Commit & Push Changes

Di local machine:

```bash
# Pastikan di directory root project
cd /var/www/PPL-C-2025

# Add semua perubahan
git add .

# Commit dengan pesan yang jelas
git commit -m "Add Swagger API Documentation - Auto-generated API docs similar to Laravel Scramble

- Install swagger-jsdoc & swagger-ui-express
- Create OpenAPI 3.0 configuration
- Add JSDoc annotations to all routes (Users, Admin, Payments)
- Setup Swagger UI at /api-docs endpoint
- Configure helmet CSP for Swagger UI assets
- Add comprehensive API documentation guide"

# Push ke remote repository
git push origin dev  # atau branch yang sesuai
```

### 2. Pull Changes di Production Server

SSH ke production server:

```bash
# SSH ke server
ssh user@ppl.vinmedia.my.id

# Navigasi ke backend directory
cd /var/www/PPL-C-2025/backend

# Pull latest changes
git pull origin dev  # atau branch yang sesuai

# Install dependencies baru (swagger packages)
npm install
```

### 3. Restart Backend Service

Pilih salah satu metode sesuai setup production:

#### Option A: PM2 (Recommended)
```bash
# Restart dengan PM2
pm2 restart skillconnect-backend

# Atau restart semua
pm2 restart all

# Check status
pm2 status

# Check logs
pm2 logs skillconnect-backend --lines 50
```

#### Option B: systemd service
```bash
# Restart service
sudo systemctl restart skillconnect-backend

# Check status
sudo systemctl status skillconnect-backend

# Check logs
sudo journalctl -u skillconnect-backend -n 50 -f
```

#### Option C: Manual restart (jika menggunakan screen/tmux)
```bash
# Kill existing process
pkill -f "node src/server.js"

# Start server
npm start
# atau
npm run dev
```

### 4. Verify Deployment

Setelah restart, verify bahwa API docs bisa diakses:

```bash
# Test dari server (optional)
curl http://localhost:5000/api-docs

# Test health check
curl http://localhost:5000/health

# Test dari browser
# Buka: https://ppl.vinmedia.my.id/api-docs
```

## 🔍 Troubleshooting

### Issue: 502 Bad Gateway
```bash
# Check apakah backend running
pm2 list
# atau
ps aux | grep node

# Check logs
pm2 logs
# atau
sudo journalctl -xe
```

### Issue: Cannot GET /api-docs
```bash
# Verify swagger packages installed
npm list | grep swagger

# Should show:
# ├── swagger-jsdoc@x.x.x
# └── swagger-ui-express@x.x.x

# If not installed:
npm install
```

### Issue: Swagger UI tidak muncul (blank page)
```bash
# Check CSP headers di browser Console
# Seharusnya tidak ada CSP errors

# Verify helmet configuration di server.js
grep -A 10 "helmet({" src/server.js
```

### Issue: 404 di production tapi works di local
```bash
# Check nginx configuration
sudo nano /etc/nginx/sites-available/ppl.vinmedia.my.id

# Pastikan ada proxy pass ke backend
location /api/ {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

location /api-docs {
    proxy_pass http://localhost:5000/api-docs;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}

# Reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

## 📊 Post-Deployment Checklist

- [ ] Backend service running (check PM2/systemd status)
- [ ] API docs accessible at `https://ppl.vinmedia.my.id/api-docs`
- [ ] Swagger UI displays properly (no blank page)
- [ ] "Try it out" button works
- [ ] Authorization button works
- [ ] All endpoints visible
- [ ] Health check working: `https://ppl.vinmedia.my.id/health`

## 🎯 Quick Deploy Script (Optional)

Buat script untuk otomasi deployment:

```bash
# File: deploy-api-docs.sh
#!/bin/bash

echo "🚀 Deploying API Documentation..."

# Pull changes
echo "📥 Pulling latest changes..."
git pull origin dev

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Restart service
echo "🔄 Restarting backend service..."
pm2 restart skillconnect-backend

# Wait for service to start
echo "⏳ Waiting for service..."
sleep 3

# Check status
echo "✅ Checking status..."
pm2 status

# Test endpoint
echo "🧪 Testing API docs endpoint..."
curl -I http://localhost:5000/api-docs

echo "✨ Deployment complete!"
echo "📚 Access docs at: https://ppl.vinmedia.my.id/api-docs"
```

Gunakan script:
```bash
chmod +x deploy-api-docs.sh
./deploy-api-docs.sh
```

## 🔗 URLs Post-Deployment

- **API Docs UI**: https://ppl.vinmedia.my.id/api-docs
- **OpenAPI JSON**: https://ppl.vinmedia.my.id/api-docs.json
- **Health Check**: https://ppl.vinmedia.my.id/health
- **API Root**: https://ppl.vinmedia.my.id/

---

**Good luck with deployment!** 🎉
