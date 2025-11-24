#!/bin/bash
# Transfer ke Server Baru: 145.79.15.87
# PPL-C-2025 Migration Transfer Script

NEW_SERVER_IP="145.79.15.87"
NEW_SERVER_USER="root"

echo "========================================="
echo "Transfer PPL-C-2025 ke Server Baru"
echo "Server: ${NEW_SERVER_USER}@${NEW_SERVER_IP}"
echo "========================================="
echo ""

# ============================================
# STEP 1: Create Archives
# ============================================

echo "## STEP 1: Creating archives..."

# Backup archive (sudah ada)
if [ -f "/var/www/PPL-C-2025/migration-backup-20251106-204922.tar.gz" ]; then
    echo "✅ Migration backup archive already exists"
else
    echo "Creating migration backup archive..."
    cd /var/www/PPL-C-2025
    tar -czf migration-backup-20251106-204922.tar.gz migration-backup/
fi

# Project archive (exclude node_modules untuk hemat size)
echo "Creating PPL-C-2025 project archive (excluding node_modules)..."
cd /var/www
tar -czf ppl-project-full.tar.gz \
    --exclude='PPL-C-2025/node_modules' \
    --exclude='PPL-C-2025/backend/node_modules' \
    --exclude='PPL-C-2025/frontend/node_modules' \
    --exclude='PPL-C-2025/frontend/dist' \
    --exclude='PPL-C-2025/migration-backup-*.tar.gz' \
    PPL-C-2025/

echo "Creating wa-notif archive (excluding node_modules)..."
tar -czf wa-notif.tar.gz \
    --exclude='wa-notif/node_modules' \
    wa-notif/

echo ""
echo "Archives created:"
ls -lh /var/www/ppl-project-full.tar.gz
ls -lh /var/www/wa-notif.tar.gz
ls -lh /var/www/PPL-C-2025/migration-backup-20251106-204922.tar.gz
echo ""

# ============================================
# STEP 2: Transfer Files
# ============================================

echo "## STEP 2: Transferring files to ${NEW_SERVER_IP}..."
echo ""

echo "Transfer 1/3: Project files..."
scp /var/www/ppl-project-full.tar.gz ${NEW_SERVER_USER}@${NEW_SERVER_IP}:/tmp/

echo "Transfer 2/3: WhatsApp Notifier..."
scp /var/www/wa-notif.tar.gz ${NEW_SERVER_USER}@${NEW_SERVER_IP}:/tmp/

echo "Transfer 3/3: Migration backup..."
scp /var/www/PPL-C-2025/migration-backup-20251106-204922.tar.gz ${NEW_SERVER_USER}@${NEW_SERVER_IP}:/tmp/

echo ""
echo "========================================="
echo "Transfer Complete!"
echo "========================================="
echo ""
echo "Files transferred to ${NEW_SERVER_IP}:/tmp/"
echo "- ppl-project-full.tar.gz"
echo "- wa-notif.tar.gz"
echo "- migration-backup-20251106-204922.tar.gz"
echo ""
echo "Next steps (on NEW SERVER ${NEW_SERVER_IP}):"
echo ""
echo "1. SSH to new server:"
echo "   ssh ${NEW_SERVER_USER}@${NEW_SERVER_IP}"
echo ""
echo "2. Extract files:"
echo "   cd /tmp"
echo "   tar -xzf migration-backup-20251106-204922.tar.gz"
echo "   sudo mkdir -p /var/www"
echo "   cd /var/www"
echo "   sudo tar -xzf /tmp/ppl-project-full.tar.gz"
echo "   sudo tar -xzf /tmp/wa-notif.tar.gz"
echo ""
echo "3. Follow migration guide:"
echo "   cat /tmp/migration-backup/README.md"
echo "   cat /tmp/migration-backup/MIGRATION-CHECKLIST.md"
echo ""
echo "4. Or use quick commands:"
echo "   bash /tmp/migration-backup/QUICK-COMMANDS.sh"
echo ""
