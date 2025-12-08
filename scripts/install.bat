@echo off
cd /d "%~dp0"
echo Limpiando node_modules...
if exist node_modules rmdir /s /q node_modules
echo Limpiando package-lock.json...
if exist package-lock.json del package-lock.json
echo Limpiando caché npm...
call npm cache clean --force
echo Instalando dependencias...
call npm install --legacy-peer-deps
echo.
echo Verificando instalación...
if exist node_modules\react-native-gesture-handler (
    echo ✓ react-native-gesture-handler instalado correctamente
) else (
    echo ✗ ERROR: react-native-gesture-handler NO está instalado
)
pause
