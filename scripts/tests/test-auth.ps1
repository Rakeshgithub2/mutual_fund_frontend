# 🚀 Authentication Quick Start Test

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Authentication Integration Quick Test        " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Function to test if port is available
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
    return $connection
}

# Check if backend is running
Write-Host "Checking backend server (port 3002)..." -ForegroundColor Yellow
if (Test-Port -Port 3002) {
    Write-Host "✅ Backend server is running on http://localhost:3002" -ForegroundColor Green
} else {
    Write-Host "❌ Backend server is NOT running!" -ForegroundColor Red
    Write-Host "   Please start backend server first:" -ForegroundColor Yellow
    Write-Host "   npx tsx src/server-simple.ts" -ForegroundColor White
    Write-Host ""
}

# Check if frontend is running
Write-Host "Checking frontend server (port 5001)..." -ForegroundColor Yellow
if (Test-Port -Port 5001) {
    Write-Host "✅ Frontend server is running on http://localhost:5001" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend server is NOT running!" -ForegroundColor Red
    Write-Host "   Please start frontend server first:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Test URLs                                    " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "📝 Registration Page:" -ForegroundColor Yellow
Write-Host "   http://localhost:5001/auth/register" -ForegroundColor White
Write-Host ""

Write-Host "🔐 Login Page:" -ForegroundColor Yellow
Write-Host "   http://localhost:5001/auth/login" -ForegroundColor White
Write-Host ""

Write-Host "🏠 Home Page:" -ForegroundColor Yellow
Write-Host "   http://localhost:5001/" -ForegroundColor White
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Quick Test Instructions                      " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  Test Registration:" -ForegroundColor Green
Write-Host "   • Open: http://localhost:5001/auth/register" -ForegroundColor White
Write-Host "   • Fill: Name, Email, Password (min 8 chars)" -ForegroundColor White
Write-Host "   • Click: Create Account" -ForegroundColor White
Write-Host "   • Expected: Redirect to home page" -ForegroundColor Yellow
Write-Host "   • Verify: User avatar shows in header" -ForegroundColor Yellow
Write-Host ""

Write-Host "2️⃣  Test Login:" -ForegroundColor Green
Write-Host "   • Open: http://localhost:5001/auth/login" -ForegroundColor White
Write-Host "   • Enter: Email and Password" -ForegroundColor White
Write-Host "   • Click: Sign In" -ForegroundColor White
Write-Host "   • Expected: Redirect to home page" -ForegroundColor Yellow
Write-Host "   • Verify: User avatar shows in header" -ForegroundColor Yellow
Write-Host ""

Write-Host "3️⃣  Test Google OAuth:" -ForegroundColor Green
Write-Host "   • Open: http://localhost:5001/auth/login" -ForegroundColor White
Write-Host "   • Click: Sign in with Google button" -ForegroundColor White
Write-Host "   • Select: Gmail account" -ForegroundColor White
Write-Host "   • Expected: Redirect to home page" -ForegroundColor Yellow
Write-Host "   • Verify: Google profile picture shows" -ForegroundColor Yellow
Write-Host ""

Write-Host "4️⃣  Test Error Handling:" -ForegroundColor Green
Write-Host "   • Try: Wrong password" -ForegroundColor White
Write-Host "   • Expected: Error message displays" -ForegroundColor Yellow
Write-Host "   • Message: 'Invalid email or password...'" -ForegroundColor Yellow
Write-Host ""

Write-Host "5️⃣  Test Logout:" -ForegroundColor Green
Write-Host "   • Click: User avatar in header" -ForegroundColor White
Write-Host "   • Click: Logout button" -ForegroundColor White
Write-Host "   • Expected: Sign In button appears" -ForegroundColor Yellow
Write-Host "   • Verify: User data cleared" -ForegroundColor Yellow
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Debugging Tips                               " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔍 Browser Console (F12):" -ForegroundColor Yellow
Write-Host "   localStorage.getItem('accessToken')" -ForegroundColor White
Write-Host "   localStorage.getItem('user')" -ForegroundColor White
Write-Host ""

Write-Host "🔍 Check API Response:" -ForegroundColor Yellow
Write-Host "   Network Tab → Filter: 'auth'" -ForegroundColor White
Write-Host "   Look for: 200 (Success) or 401 (Failed)" -ForegroundColor White
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Environment Configuration                    " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check .env file
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match "NEXT_PUBLIC_API_URL") {
        $apiUrl = ($envContent -split "`n" | Select-String "NEXT_PUBLIC_API_URL").ToString().Split("=")[1].Trim()
        Write-Host "   API URL: $apiUrl" -ForegroundColor White
    }
    
    if ($envContent -match "NEXT_PUBLIC_GOOGLE_CLIENT_ID") {
        Write-Host "   ✅ Google Client ID configured" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Google Client ID missing!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Documentation                                " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 Full Testing Guide:" -ForegroundColor Yellow
Write-Host "   AUTH_TESTING_GUIDE.md" -ForegroundColor White
Write-Host ""

Write-Host "📚 Implementation Summary:" -ForegroundColor Yellow
Write-Host "   AUTH_INTEGRATION_SUMMARY.md" -ForegroundColor White
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Ready to Test! 🚀                            " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to open test URLs
$response = Read-Host "Open test URLs in browser? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "Opening URLs..." -ForegroundColor Yellow
    Start-Process "http://localhost:5001"
    Start-Sleep -Seconds 1
    Start-Process "http://localhost:5001/auth/login"
    Start-Sleep -Seconds 1
    Start-Process "http://localhost:5001/auth/register"
    Write-Host "✅ URLs opened in browser!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Happy testing! 🎉" -ForegroundColor Green
Write-Host ""
