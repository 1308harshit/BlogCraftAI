@echo off
REM BlogCraft AI - Production Setup Script for Windows

echo 🚀 Setting up BlogCraft AI for production...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install dependencies
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

REM Install script dependencies
echo Installing automation script dependencies...
cd scripts
call npm install
cd ..
if %errorlevel% neq 0 (
    echo ❌ Failed to install script dependencies
    pause
    exit /b 1
)
echo ✅ Script dependencies installed successfully

REM Check environment variables
echo Checking environment configuration...
if not exist ".env.local" (
    echo ⚠️  .env.local not found. Creating from template...
    copy .env.local.example .env.local
    echo 📝 Please edit .env.local with your API keys before continuing
) else (
    echo ✅ Environment file found
)

REM Build the application
echo Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check your configuration.
    pause
    exit /b 1
)
echo ✅ Application built successfully

REM Setup complete
echo.
echo 🎉 BlogCraft AI setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your API keys
echo 2. Set up your Supabase database (run scripts/setup-database.sql)
echo 3. Configure Stripe products (node scripts/setup-stripe-products.js)
echo 4. Deploy to Vercel (vercel --prod)
echo 5. Start lead generation (cd scripts ^&^& npm run scrape-leads)
echo.
echo For detailed instructions, see deployment-guide.md
echo.
pause