@echo off
echo 🚀 Adding dummy shipping method to Saleor...
echo.

REM Set Saleor API configuration
REM Update these values to match your Saleor instance
set SALEOR_API_URL=http://localhost:8000/graphql/
set SALEOR_AUTH_TOKEN=

echo 📋 Configuration:
echo    API URL: %SALEOR_API_URL%
echo    Auth Token: %SALEOR_AUTH_TOKEN%
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Run the shipping script
echo 🏃 Running add-dummy-shipping script...
node scripts\add-dummy-shipping.js

echo.
echo ✅ Script completed!
pause
