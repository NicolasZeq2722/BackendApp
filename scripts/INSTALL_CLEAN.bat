@echo off
REM Script para instalación limpia de dependencias
REM Workable App - Frontend

echo.
echo ============================================================
echo         INSTALACIÓN LIMPIA DE DEPENDENCIAS
echo              Workable App - Expo SDK 54
echo ============================================================
echo.

setlocal enabledelayedexpansion

REM Verificar que estamos en /frontend
if not exist package.json (
    echo ERROR: package.json no encontrado
    echo Asegúrate de estar en la carpeta /frontend
    pause
    exit /b 1
)

echo [PASO 1/4] Limpiando instalación anterior...
if exist node_modules (
    echo   Eliminando node_modules...
    rmdir /s /q node_modules >nul 2>&1
    echo   ✓ node_modules eliminado
) else (
    echo   ✓ node_modules no existía
)

if exist package-lock.json (
    echo   Eliminando package-lock.json...
    del package-lock.json >nul 2>&1
    echo   ✓ package-lock.json eliminado
) else (
    echo   ✓ package-lock.json no existía
)

echo.
echo [PASO 2/4] Verificando npm...
call npm --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ERROR: npm no está instalado o no es accesible
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do (
        echo   ✓ npm versión: %%i
    )
)

echo.
echo [PASO 3/4] Instalando dependencias (esto puede tardar 2-5 minutos)...
echo   Usando: npm install --legacy-peer-deps
echo.

call npm install --legacy-peer-deps --no-audit --no-fund

if !errorlevel! neq 0 (
    echo.
    echo ERROR: npm install falló
    echo Intenta de nuevo o consulta CHEATSHEET.md
    pause
    exit /b 1
)

echo.
echo [PASO 4/4] Verificando instalación...

if exist node_modules (
    echo   ✓ node_modules creado
    for /f "tokens=*" %%i in ('dir /b node_modules ^| find /c "."') do (
        echo   ✓ Paquetes instalados: %%i
    )
) else (
    echo   ✗ ERROR: node_modules no se creó
    pause
    exit /b 1
)

if exist package-lock.json (
    echo   ✓ package-lock.json creado
) else (
    echo   ✗ ADVERTENCIA: package-lock.json no se creó
)

echo.
echo ============================================================
echo                 ✓ INSTALACIÓN COMPLETADA
echo.
echo  Próximo paso: npm start
echo ============================================================
echo.
pause
