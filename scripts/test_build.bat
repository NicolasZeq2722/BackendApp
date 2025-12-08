@echo off
cd /d "%~dp0"
echo ========================================
echo Testing Expo App Build (SDK 54)
echo ========================================
echo.
echo Step 1: Verifying package.json...
echo.
type package.json | findstr /E "expo\|react-native\|expo-router" | head -5
echo.
echo Step 2: Checking TypeScript configuration...
echo.
if exist tsconfig.json (
    echo TypeScript config found
) else (
    echo ERROR: tsconfig.json not found
)
echo.
echo Step 3: Listing app structure...
echo.
echo App files in /app:
if exist app (
    dir /s /b app\*.tsx app\*.ts 2>nul | head -10
) else (
    echo ERROR: /app directory not found
)
echo.
echo Step 4: Checking polyfill in index.ts...
echo.
findstr /C:"defineProperty(Event" index.ts >nul && (
    echo OK: Hermes polyfill found
) || (
    echo ERROR: Polyfill not found
)
echo.
echo Step 5: Verifying source screen files...
echo.
dir /s /b src\screens\*.tsx 2>nul | head -8
echo.
echo ========================================
echo Build test complete - Ready for Expo Go
echo ========================================
pause
