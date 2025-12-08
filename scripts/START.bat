@echo off
REM One-click launcher for Workable App on Expo SDK 54
REM Verificación + Inicio rápido

setlocal enabledelayedexpansion

echo.
echo ====================================================================
echo                 WORKABLE APP - QUICK LAUNCHER
echo                    Expo SDK 54 + Hermes Polyfill
echo ====================================================================
echo.

cd /d "%~dp0"

REM 1. Quick checks
echo [PASO 1/3] Verificando dependencias...
if not exist node_modules (
    echo   ⚠ node_modules no encontrado. Instalando...
    call npm install --legacy-peer-deps
    if !errorlevel! neq 0 (
        echo   ✗ Error en npm install
        pause
        exit /b 1
    )
)
echo   ✓ Dependencias OK

REM 2. Verify critical files
echo [PASO 2/3] Verificando archivos críticos...
set READY=1

if not exist index.ts (
    echo   ✗ index.ts no encontrado
    set READY=0
)

if not exist "app\_layout.tsx" (
    echo   ✗ app/_layout.tsx no encontrado
    set READY=0
)

findstr /C:"defineProperty(Event" index.ts >nul 2>&1 || (
    echo   ✗ Polyfill no encontrado en index.ts
    set READY=0
)

if "!READY!"=="1" (
    echo   ✓ Archivos críticos OK
) else (
    echo   ✗ Faltan archivos críticos
    pause
    exit /b 1
)

REM 3. Start Metro
echo [PASO 3/3] Iniciando Metro Bundler...
echo.
echo   Cuando veas "Ready at ...:8081"
echo   Abre Expo Go v54 en tu dispositivo y escanea el QR
echo.
echo ====================================================================
echo.

npm start

REM If npm start fails
if !errorlevel! neq 0 (
    echo.
    echo ✗ Error al iniciar Metro Bundler
    echo Intenta limpiar con: npm start -- --clear
    pause
    exit /b 1
)
