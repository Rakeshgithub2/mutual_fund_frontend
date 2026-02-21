#!/bin/bash
# EC2 Deployment Script for Frontend
# This script prepares the build for EC2 deployment

set -e

echo "======================================"
echo "EC2 Frontend Deployment - Build Script"
echo "======================================"

# Step 1: Clean previous builds
echo "[1/6] Cleaning previous builds..."
rm -rf deploy-package
mkdir -p deploy-package

# Step 2: Run npm install
echo "[2/6] Installing dependencies..."
npm install

# Step 3: Run build
echo "[3/6] Building Next.js application..."
npm run build

# Step 4: Copy standalone build
echo "[4/6] Copying standalone build..."
cp -r .next/standalone/* deploy-package/

# Step 5: Copy static assets
echo "[5/6] Copying static assets..."
mkdir -p deploy-package/.next
cp -r .next/static deploy-package/.next/static
cp -r public deploy-package/public

# Step 6: Create ecosystem.config.js for PM2
echo "[6/6] Creating PM2 configuration..."
cat > deploy-package/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'mf-frontend',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p deploy-package/logs

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Deployment package ready in: ./deploy-package"
echo ""
echo "Next steps:"
echo "1. Create a zip file: tar -czf frontend-deploy.tar.gz -C deploy-package ."
echo "2. Upload to EC2: scp frontend-deploy.tar.gz user@ec2-ip:/home/ubuntu/"
echo "3. SSH to EC2 and extract: tar -xzf frontend-deploy.tar.gz"
echo "4. Run with PM2: pm2 start ecosystem.config.js"
echo ""
