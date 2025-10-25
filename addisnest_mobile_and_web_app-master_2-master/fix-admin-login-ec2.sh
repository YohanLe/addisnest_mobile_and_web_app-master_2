#!/bin/bash

# Fix Admin Login on EC2
set -e

echo "🔧 Fixing admin login issue..."

APP_DIR=~/addisnest_mobile_and_web_app-master_2/addisnest_mobile_and_web_app-master_2-master/addisnest_mobile_and_web_app-master

# 1. Backup and fix AdminLoginPage.jsx
echo "1️⃣ Fixing hardcoded localhost in AdminLoginPage.jsx..."
cd "$APP_DIR"
cp src/components/admin/AdminLoginPage.jsx src/components/admin/AdminLoginPage.jsx.backup
sed -i "s|const API_BASE_URL = 'http://localhost:7002';|const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://addisnest.com';|g" src/components/admin/AdminLoginPage.jsx
echo "✅ Fixed AdminLoginPage.jsx"

# 2. Create .env.production
echo ""
echo "2️⃣ Creating .env.production file..."
cat > .env.production << 'EOF'
VITE_API_BASE_URL=https://addisnest.com
NODE_ENV=production
EOF
echo "✅ Created .env.production"

# 3. Rebuild frontend
echo ""
echo "3️⃣ Rebuilding frontend..."
npm run build
echo "✅ Frontend rebuilt"

# 4. Restart PM2 services
echo ""
echo "4️⃣ Restarting services..."
pm2 restart all
echo "✅ Services restarted"

echo ""
echo "🎉 Admin login fix complete!"
echo ""
echo "Test at: https://addisnest.com/admin/login"
