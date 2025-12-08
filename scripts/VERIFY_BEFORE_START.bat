@echo off
REM Verification script before running npm start
REM Verifica que todo está listo para ejecutar la app en Expo Go v54

setlocal enabledelayedexpansion

echo.
echo ====================================================================
echo                  PRE-LAUNCH VERIFICATION
echo              Workable App - Expo SDK 54 + Hermes Polyfill
echo ====================================================================
echo.

set ERROR_COUNT=0

REM Check 1: node_modules exists
echo [1/8] Checking node_modules...
if exist node_modules (
    echo     ✓ node_modules found
) else (
    echo     ✗ ERROR: node_modules not found. Run 'npm install' first.
    set /a ERROR_COUNT+=1
)

REM Check 2: app directory structure
echo [2/8] Checking app directory...
if exist app\_layout.tsx (
    echo     ✓ app/_layout.tsx exists
) else (
    echo     ✗ ERROR: app/_layout.tsx missing
    set /a ERROR_COUNT+=1
)

REM Check 3: Polyfill in index.ts
echo [3/8] Checking Hermes polyfill...
findstr /C:"defineProperty(Event" index.ts >nul 2>&1
if !errorlevel! equ 0 (
    echo     ✓ Hermes polyfill found in index.ts
) else (
    echo     ✗ ERROR: Polyfill not found. This will cause issues!
    set /a ERROR_COUNT+=1
)

REM Check 4: App.tsx exists
echo [4/8] Checking App.tsx...
if exist App.tsx (
    echo     ✓ App.tsx exists
) else (
    echo     ✗ ERROR: App.tsx not found
    set /a ERROR_COUNT+=1
)

REM Check 5: AuthContext exists
echo [5/8] Checking AuthContext...
if exist src\context\AuthContext.tsx (
    echo     ✓ AuthContext.tsx exists
) else (
    echo     ✗ ERROR: AuthContext.tsx not found
    set /a ERROR_COUNT+=1
)

REM Check 6: Route files in (app)
echo [6/8] Checking app routes...
if exist "app\(app)\_layout.tsx" (
    echo     ✓ app/(app)/_layout.tsx exists
) else (
    echo     ✗ ERROR: Protected routes layout missing
    set /a ERROR_COUNT+=1
)

REM Check 7: babel.config.js has expo-router
echo [7/8] Checking Babel configuration...
findstr /C:"expo-router/babel" babel.config.js >nul 2>&1
if !errorlevel! equ 0 (
    echo     ✓ expo-router plugin found in babel.config.js
) else (
    echo     ✗ WARNING: expo-router plugin not found in babel
    set /a ERROR_COUNT+=1
)

REM Check 8: package.json version compatibility
echo [8/8] Checking version compatibility...
findstr /C:"expo.*52" package.json >nul 2>&1 && (
    echo     ✓ Expo SDK 54 (52.0.0) detected
) || (
    echo     ✗ ERROR: Wrong Expo version
    set /a ERROR_COUNT+=1
)

echo.
echo ====================================================================

if !ERROR_COUNT! equ 0 (
    echo                    ✓ ALL CHECKS PASSED
    echo.
    echo   Ready to run: npm start
    echo   Then scan QR code in Expo Go v54
    echo.
) else (
    echo           ✗ ERRORS FOUND: !ERROR_COUNT!
    echo.
    echo   Fix issues above before running npm start
    echo.
)

echo ====================================================================
echo.
pause
