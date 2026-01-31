# Test Backend Environment Variables
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Testing Backend Environment Configuration    " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "📋 Checking required variables:" -ForegroundColor Yellow
    Write-Host ""
    
    $envContent = Get-Content ".env" -Raw
    
    # Check FRONTEND_URL
    if ($envContent -match "FRONTEND_URL=(.+)") {
        $frontendUrl = $Matches[1].Trim()
        Write-Host "✅ FRONTEND_URL: $frontendUrl" -ForegroundColor Green
    } else {
        Write-Host "❌ FRONTEND_URL: NOT FOUND" -ForegroundColor Red
    }
    
    # Check GOOGLE_CLIENT_ID
    if ($envContent -match "GOOGLE_CLIENT_ID=(.+)") {
        $clientId = $Matches[1].Trim()
        $clientIdShort = $clientId.Substring(0, [Math]::Min(30, $clientId.Length)) + "..."
        Write-Host "✅ GOOGLE_CLIENT_ID: $clientIdShort" -ForegroundColor Green
    } else {
        Write-Host "❌ GOOGLE_CLIENT_ID: NOT FOUND" -ForegroundColor Red
    }
    
    # Check GOOGLE_CLIENT_SECRET
    if ($envContent -match "GOOGLE_CLIENT_SECRET=(.+)") {
        $clientSecret = $Matches[1].Trim()
        if ($clientSecret -like "*****" -or $clientSecret.Length -lt 20) {
            Write-Host "⚠️  GOOGLE_CLIENT_SECRET: PLACEHOLDER (needs to be replaced)" -ForegroundColor Yellow
            Write-Host "   Current value: $clientSecret" -ForegroundColor Gray
            Write-Host "   Please update with your actual secret from Google Cloud Console" -ForegroundColor Yellow
        } else {
            $secretShort = $clientSecret.Substring(0, [Math]::Min(15, $clientSecret.Length)) + "..."
            Write-Host "✅ GOOGLE_CLIENT_SECRET: $secretShort" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ GOOGLE_CLIENT_SECRET: NOT FOUND" -ForegroundColor Red
    }
    
    # Check GOOGLE_REDIRECT_URI
    if ($envContent -match "GOOGLE_REDIRECT_URI=(.+)") {
        $redirectUri = $Matches[1].Trim()
        Write-Host "✅ GOOGLE_REDIRECT_URI: $redirectUri" -ForegroundColor Green
    } else {
        Write-Host "❌ GOOGLE_REDIRECT_URI: NOT FOUND" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "   Next Steps                                  " -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if secret needs to be updated
    if ($envContent -match "GOOGLE_CLIENT_SECRET=(.+)") {
        $clientSecret = $Matches[1].Trim()
        if ($clientSecret -like "*****" -or $clientSecret.Length -lt 20) {
            Write-Host "⚠️  ACTION REQUIRED:" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "1. Go to: https://console.cloud.google.com/apis/credentials" -ForegroundColor White
            Write-Host "2. Find your OAuth 2.0 Client" -ForegroundColor White
            Write-Host "3. Copy the Client Secret (starts with GOCSPX-)" -ForegroundColor White
            Write-Host "4. Update .env file:" -ForegroundColor White
            Write-Host "   GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-secret" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "5. Then restart the backend server" -ForegroundColor White
            Write-Host ""
        } else {
            Write-Host "✅ All environment variables are configured!" -ForegroundColor Green
            Write-Host ""
            Write-Host "You can now:" -ForegroundColor White
            Write-Host "1. Start the backend: npx tsx src/index.ts" -ForegroundColor Cyan
            Write-Host "2. Start the frontend: npm run dev" -ForegroundColor Cyan
            Write-Host "3. Test Google OAuth: http://localhost:5001/auth/login" -ForegroundColor Cyan
            Write-Host ""
        }
    }
    
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file in the project root" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "For detailed setup instructions, see: GOOGLE_OAUTH_FIX.md" -ForegroundColor Gray
Write-Host ""
