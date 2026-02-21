# EC2 Deployment Script for Frontend (PowerShell)
# This script prepares the build for EC2 deployment

$ErrorActionPreference = "Stop"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "EC2 Frontend Deployment - Build Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean previous builds
Write-Host "[1/6] Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "deploy-package") {
    Remove-Item -Recurse -Force deploy-package
}
New-Item -ItemType Directory -Path "deploy-package" | Out-Null

# Step 2: Run npm install
Write-Host "[2/6] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}

# Step 3: Run build
Write-Host "[3/6] Building Next.js application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Step 4: Copy standalone build
Write-Host "[4/6] Copying standalone build..." -ForegroundColor Yellow
Copy-Item -Path ".next\standalone\*" -Destination "deploy-package" -Recurse -Force

# Step 5: Copy static assets
Write-Host "[5/6] Copying static assets..." -ForegroundColor Yellow
if (Test-Path ".next\static") {
    New-Item -ItemType Directory -Path "deploy-package\.next" -Force | Out-Null
    Copy-Item -Path ".next\static" -Destination "deploy-package\.next\static" -Recurse -Force
}
if (Test-Path "public") {
    Copy-Item -Path "public" -Destination "deploy-package\public" -Recurse -Force
}

# Step 6: Create ecosystem.config.js for PM2
Write-Host "[6/6] Creating PM2 configuration..." -ForegroundColor Yellow
$pm2Config = @"
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
"@
Set-Content -Path "deploy-package\ecosystem.config.js" -Value $pm2Config

# Create logs directory
New-Item -ItemType Directory -Path "deploy-package\logs" -Force | Out-Null

# Create deployment README
$deployReadme = @"
# Deployment Instructions

## Files Included:
- server.js - Next.js production server
- .next/ - Built application
- public/ - Static assets
- node_modules/ - Production dependencies
- ecosystem.config.js - PM2 configuration
- .env.production - Environment variables

## Deploy to EC2:

### 1. ZIP the package (Windows):
Compress-Archive -Path deploy-package\* -DestinationPath frontend-deploy.zip

### 2. Upload to EC2:
scp frontend-deploy.zip ubuntu@YOUR_EC2_IP:/home/ubuntu/

### 3. SSH to EC2:
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

### 4. Extract and setup:
unzip frontend-deploy.zip -d mf-frontend
cd mf-frontend

Install PM2 globally (if not installed)
sudo npm install -g pm2

Start the application
pm2 start ecosystem.config.js

Save PM2 configuration
pm2 save

Setup PM2 to start on boot
pm2 startup

### 5. Configure Nginx (Optional):
Create /etc/nginx/sites-available/mf-frontend with proxy settings

## PM2 Commands:
- View logs: pm2 logs mf-frontend
- Restart: pm2 restart mf-frontend
- Stop: pm2 stop mf-frontend
- Status: pm2 status
- Monitoring: pm2 monit

## Environment Variables:
Make sure to update .env.production with your EC2 backend URL before deploying!
"@
Set-Content -Path "deploy-package\DEPLOY_README.md" -Value $deployReadme

Write-Host ""
Write-Host "Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Deployment package ready in: .\deploy-package" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create zip: Compress-Archive -Path deploy-package\* -DestinationPath frontend-deploy.zip" -ForegroundColor White
Write-Host "2. Upload to EC2: scp frontend-deploy.zip ubuntu@YOUR-IP:/home/ubuntu/" -ForegroundColor White
Write-Host "3. See DEPLOY_README.md in package for instructions" -ForegroundColor White
Write-Host ""
