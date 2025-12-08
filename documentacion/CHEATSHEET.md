# ⚡ CHEATSHEET - Workable App Commands

## 🚀 Inicio

```bash
# Opción 1: Click and run (Windows)
START.bat

# Opción 2: Línea de comando
npm start

# Opción 3: Limpiar Metro Bundler
npm start -- --clear

# Opción 4: Verbose/Debug
npm start -- --verbose
```

---

## 🔧 Instalación & Dependencias

```bash
# Instalar dependencias
npm install

# Con legacy peer deps
npm install --legacy-peer-deps

# Reinstalar todo
rm -rf node_modules && npm install

# Alinear versiones de Expo
npx expo install --fix

# Verificar que todo está OK
call VERIFY_BEFORE_START.bat
```

---

## 📱 Ejecutar en Dispositivos

```bash
# Android (requiere Android Studio/Emulator)
expo start --android

# iOS (requiere Xcode)
expo start --ios

# Web
expo start --web

# Escanear QR en Expo Go (la opción principal)
expo start
# Luego: Abre Expo Go v54 y escanea el QR
```

---

## 🧪 Testing & Debugging

```bash
# Ver logs en tiempo real
npm start -- --verbose

# Limpiar cache completo
npm start -- --clear

# Reset total (nuclear option)
expo start --clear

# Mostrar URL del servidor
expo start
# Aparecerá: Server ready at http://192.168.x.x:8081
```

---

## 📦 Build para Producción

```bash
# Build automático (EAS)
eas build --platform android

eas build --platform ios

eas build --platform all

# Build local (requiere Android SDK/Xcode)
expo export --platform android
expo export --platform ios
```

---

## 🔄 Git & Versiones

```bash
# Ver cambios
git status

# Commit cambios
git add .
git commit -m "message"

# Push
git push

# Ver historial
git log --oneline

# Volver a commit anterior
git reset --hard <commit-hash>
```

---

## 🧹 Limpieza

```bash
# Limpiar node_modules
rm -rf node_modules

# Limpiar package-lock.json
rm package-lock.json

# Limpiar Metro cache
expo start --clear

# Limpiar Expo cache
expo start --clear
expo prebuild --clean

# Todo a la vez
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📋 Verificaciones

```bash
# Que Express esté corriendo
npm start

# Que TypeScript compile
npx tsc --noEmit

# Ver estructura de archivos
tree /F frontend

# Buscar polyfill
findstr /C:"defineProperty(Event" index.ts

# Verificar Expo versión
expo --version

# Verificar Node versión
node --version

# Verificar npm versión
npm --version
```

---

## 🔗 URLs Útiles (Local)

Cuando `npm start` corre, accede a:

```
Metro Bundler: http://localhost:8081
React DevTools: http://localhost:8081/debugger-ui
Expo Dashboard: http://localhost:8081
```

---

## ⚙️ Configuración Importante

| Archivo | Propósito |
|---------|-----------|
| `index.ts` | 🔑 Polyfill Hermes (CRÍTICO) |
| `package.json` | Dependencias (SDK 54) |
| `babel.config.js` | Transformación de código |
| `tsconfig.json` | TypeScript config |
| `app.json` | Config de Expo |
| `metro.config.js` | Metro Bundler settings |

---

## 🎯 Rutas Principales

| Ruta | Descripción |
|------|-------------|
| `/` | index.ts - Entrada |
| `/index.ts` | ✨ Polyfill Hermes |
| `/App.tsx` | Componente raíz |
| `/app/_layout.tsx` | Root layout + Auth |
| `/app/login.tsx` | Pantalla login |
| `/app/(app)/_layout.tsx` | Stack navigator |
| `/app/(app)/index.tsx` | Home (protegida) |
| `/src/screens/*.tsx` | Componentes de pantalla |
| `/src/context/AuthContext.tsx` | Lógica autenticación |

---

## 🚨 Problemas Comunes & Soluciones

### Metro no inicia
```bash
npm start -- --clear
```

### "Module not found"
```bash
npm install
npx expo install --fix
```

### "Cannot find metro bundler"
```bash
npm install -g expo-cli
expo start
```

### App se cuelga en splash
```bash
npm start -- --clear
```

### Error Hermes "Cannot assign to read-only property"
✅ Ya solucionado con polyfill en `index.ts`

Si aún aparece:
1. Verifica que `index.ts` tenga el polyfill (líneas 1-27)
2. Reinicia Expo Go completamente
3. Ejecuta `npm start -- --clear`

### TypeScript errors
```bash
npx tsc --noEmit
```

### Memory issues
```bash
# Increase Node memory
set NODE_OPTIONS=--max_old_space_size=4096
npm start
```

---

## 📞 Ayuda Rápida

```bash
# Ver ayuda de npm
npm help

# Ver ayuda de Expo
expo --help

# Ver logs de Expo
expo logs

# Contactar soporte
expo help
```

---

## 🔑 Comandos Críticos

**Recuerda estos 3:**

1. **Instalar dependencias:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Iniciar desarrollo:**
   ```bash
   npm start
   ```

3. **Limpiar todo si falla:**
   ```bash
   rm -rf node_modules && npm install && npm start -- --clear
   ```

---

*Última actualización: 6 Diciembre 2024*
*Workable App - Expo SDK 54*
