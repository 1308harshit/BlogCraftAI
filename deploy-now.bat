@echo off
echo 🚀 Deploying BlogCraft AI to Production...
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

echo ✅ Vercel CLI ready

REM Build the application
echo 📦 Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check for errors.
    pause
    exit /b 1
)

echo ✅ Build successful

REM Deploy to Vercel
echo 🚀 Deploying to production...
vercel --prod

if %errorlevel% eq 0 (
    echo.
    echo 🎉 BlogCraft AI deployed successfully!
    echo.
    echo Next steps:
    echo 1. Set environment variables in Vercel dashboard
    echo 2. Test the live application
    echo 3. Start lead generation
    echo 4. Begin email outreach
    echo 5. Get your first customer!
    echo.
    echo Your BlogCraft AI startup is now LIVE! 🚀
) else (
    echo ❌ Deployment failed. Please check the errors above.
)

echo.
pause