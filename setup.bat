@echo off
echo =========================================
echo HRIS Application Setup
echo =========================================

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo Node.js version:
node -v

if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
)

echo.
echo Installing dependencies...
call npm install

echo.
echo Generating Prisma client...
call npx prisma generate

echo.
echo Testing dependencies...
node test_connection.js

echo.
echo =========================================
echo Setup complete!
echo.
echo Next steps:
echo   Option 1 - Docker (recommended):
echo     docker-compose up -d
echo.
echo   Option 2 - Local development:
echo     1. Start PostgreSQL locally
echo     2. Update DATABASE_URL in .env
echo     3. npm run db:push
echo     4. npm run db:seed
echo     5. npm run dev
echo.
echo Access: http://localhost:3000
echo =========================================
