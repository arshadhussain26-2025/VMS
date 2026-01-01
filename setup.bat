@echo off
REM =====================================================
REM Visitor Management System - Windows Setup Script
REM =====================================================

color 0B
cls

echo ========================================
echo   VISITOR MANAGEMENT SYSTEM
echo   Setup Wizard for Windows
echo ========================================
echo.

REM Step 1: Check Node.js
echo [Step 1/7] Checking Prerequisites...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from https://nodejs.org
    echo Download the LTS version ^(18.x or higher^)
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js is installed: %NODE_VERSION%

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm is installed: v%NPM_VERSION%
echo.

REM Step 2: Install dependencies
echo [Step 2/7] Installing Dependencies...
echo.
echo Installing npm packages... Please wait...
echo.

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully
echo.

REM Step 3: Supabase configuration
echo [Step 3/7] Supabase Configuration
echo.
echo You need to create a Supabase project to continue.
echo Visit: https://app.supabase.com
echo.
set /p SUPABASE_CREATED="Have you created a Supabase project? (y/n): "

if /i "%SUPABASE_CREATED%" NEQ "y" (
    echo.
    echo Please create a Supabase project first:
    echo 1. Go to https://app.supabase.com
    echo 2. Click 'New Project'
    echo 3. Fill in project details
    echo 4. Wait for project to be created
    echo 5. Run this script again
    echo.
    pause
    exit /b 0
)

echo.
echo Please enter your Supabase credentials
echo You can find these in: Supabase Dashboard -^> Settings -^> API
echo.

set /p PROJECT_ID="Enter your Supabase Project ID: "
set /p ANON_KEY="Enter your Supabase Anon Key: "

if "%PROJECT_ID%"=="" (
    echo [ERROR] Project ID is required
    pause
    exit /b 1
)

if "%ANON_KEY%"=="" (
    echo [ERROR] Anon Key is required
    pause
    exit /b 1
)

REM Update configuration
echo.
echo Updating configuration...

if not exist "utils\supabase" mkdir utils\supabase

(
echo export const projectId = '%PROJECT_ID%';
echo export const publicAnonKey = '%ANON_KEY%';
) > utils\supabase\info.tsx

echo [OK] Configuration updated
echo.

REM Step 4: Database setup
echo [Step 4/7] Database Setup
echo.
echo Next, you need to run the database schema in Supabase.
echo.
echo Instructions:
echo 1. Open Supabase Dashboard -^> SQL Editor
echo 2. Click 'New query'
echo 3. Open file: database\schema.sql
echo 4. Copy ALL contents
echo 5. Paste into SQL editor
echo 6. Click 'Run'
echo.
set /p DB_SETUP="Have you run the database schema? (y/n): "

if /i "%DB_SETUP%" NEQ "y" (
    echo.
    echo Please run the database schema before continuing
    echo The schema file is located at: database\schema.sql
    echo.
    pause
    exit /b 0
)

echo [OK] Database schema confirmed
echo.

REM Step 5: Edge Function deployment
echo [Step 5/7] Backend Deployment
echo.
echo You need to deploy the Edge Function to Supabase.
echo.
echo Choose deployment method:
echo 1. Supabase CLI ^(recommended^)
echo 2. Manual upload via Dashboard
echo.
set /p DEPLOY_METHOD="Enter choice (1 or 2): "

if "%DEPLOY_METHOD%"=="1" (
    where supabase >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [WARNING] Supabase CLI is not installed
        echo Install with: npm install -g supabase
        echo Then run this script again
        echo.
        pause
        exit /b 0
    )
    
    echo.
    echo Logging into Supabase...
    call supabase login
    
    echo Linking project...
    call supabase link --project-ref %PROJECT_ID%
    
    echo Deploying Edge Function...
    call supabase functions deploy make-server-c8ca2e45
    
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Edge Function deployed successfully
    ) else (
        echo [ERROR] Failed to deploy Edge Function
        pause
        exit /b 1
    )
) else (
    echo.
    echo Manual deployment instructions:
    echo 1. Go to Supabase Dashboard -^> Edge Functions
    echo 2. Click 'Deploy a new function'
    echo 3. Name: make-server-c8ca2e45
    echo 4. Copy code from: supabase\functions\server\index.tsx
    echo 5. Paste and deploy
    echo.
    pause
)

echo.

REM Step 6: Environment variables
echo [Step 6/7] Setting Environment Variables
echo.
echo You need to set environment variables in Supabase Edge Function.
echo.
echo Go to: Supabase Dashboard -^> Edge Functions -^> Settings
echo Add these secrets:
echo.
echo SUPABASE_URL = https://%PROJECT_ID%.supabase.co
echo SUPABASE_ANON_KEY = %ANON_KEY%
echo.
set /p SERVICE_KEY="Enter your Supabase Service Role Key: "
echo SUPABASE_SERVICE_ROLE_KEY = %SERVICE_KEY%
echo.
set /p ENV_SET="Have you set the environment variables? (y/n): "

if /i "%ENV_SET%" NEQ "y" (
    echo [WARNING] Please set environment variables before testing
)

echo.

REM Step 7: Build project
echo [Step 7/7] Building Project
echo.
echo Building for production...
echo.

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo [OK] Build completed successfully
echo.

REM Final message
cls
color 0A
echo ========================================
echo   SETUP COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Create your first admin user:
echo    - Run: npm run dev
echo    - Go to http://localhost:5173
echo    - Click 'Sign Up'
echo    - Fill in details with role 'Admin'
echo.
echo 2. Configure company settings:
echo    - Login as admin
echo    - Go to Settings tab
echo    - Add company info and logo
echo.
echo 3. Create user accounts:
echo    - Go to Users tab
echo    - Add staff members with roles
echo.
echo 4. Start checking in visitors!
echo.
echo Quick commands:
echo   npm run dev      - Start development server
echo   npm run build    - Build for production
echo   npm run preview  - Preview production build
echo.
echo Documentation:
echo   README.md                - Project overview
echo   INSTALLATION_GUIDE.md    - Installation guide
echo   DEPLOYMENT_GUIDE.md      - Deployment guide
echo.
echo.
echo Your Visitor Management System is ready!
echo.
pause

REM Ask to start dev server
echo.
set /p START_DEV="Would you like to start the development server now? (y/n): "

if /i "%START_DEV%"=="y" (
    echo.
    echo Starting development server...
    echo The app will open at http://localhost:5173
    echo Press Ctrl+C to stop the server
    echo.
    start http://localhost:5173
    call npm run dev
)

exit /b 0
