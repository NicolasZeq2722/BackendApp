@echo off
REM ============================================================
REM SCRIPT DE RECUPERACIÓN: EXPO SDK 54 + POLYFILL HERMES
REM ============================================================

echo.
echo ============================================================
echo PASO 1: Navegando a carpeta frontend
echo ============================================================
cd /d "c:\Users\user\Desktop\mobile workable\BackendApp\frontend"

echo.
echo ============================================================
echo PASO 2: Verificando instalación de dependencias
echo ============================================================
npm install --legacy-peer-deps

echo.
echo ============================================================
echo PASO 3: Ejecutando expo install --fix para alinear versiones
echo ============================================================
npx expo install --fix

echo.
echo ============================================================
echo PASO 4: Limpiando caché de Metro Bundler
echo ============================================================
if exist .expo rmdir /s /q .expo

echo.
echo ============================================================
echo ✓ RECUPERACIÓN COMPLETADA
echo ============================================================
echo.
echo Próximo paso: Ejecutar "npm start" o "expo start"
echo.
pause
