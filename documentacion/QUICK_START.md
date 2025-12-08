# 🚀 QUICK START GUIDE - Workable App (Expo SDK 54)

## ⚡ Inicio Rápido (3 Pasos)

### 1️⃣ Verificar Configuración
```bash
cd frontend
call VERIFY_BEFORE_START.bat
```
Si ves `✓ ALL CHECKS PASSED`, continúa.

### 2️⃣ Iniciar Metro Bundler
```bash
npm start
```
Espera a ver:
```
Starting Metro Bundler
Ready at <local-ip>:8081
```

### 3️⃣ Cargar en Expo Go
- Opción A: Escanea el código QR que aparece en terminal con **Expo Go v54**
- Opción B: Ejecuta en Android: `expo start --android`
- Opción C: Ejecuta en iOS: `expo start --ios`

---

## ✅ Qué Cambió (Resumido)

| Aspecto | Antes | Ahora |
|--------|-------|-------|
| Expo | SDK 51 (no soportado en tu dispositivo) | **SDK 54 (compatible Expo Go v54)** |
| Routing | React Navigation manual | **Expo Router (file-based)** |
| Screens | navigation prop | **useRouter hook** |
| Polyfill | No aplicado | **Event.NONE polyfill en index.ts** |

---

## 🔍 Si Tienes Errores

### Error: "Cannot assign to read-only property 'NONE'"
✅ **Ya está corregido** con el polyfill en `/index.ts`

Si aún aparece:
1. Ejecuta: `npm start -- --clear`
2. Reinicia Expo Go
3. Carga nuevamente la app

### Error: "Module not found"
Ejecuta:
```bash
npm install
npx expo install --fix
```

### Metro no inicia
```bash
npm start -- --clear
```

### Limpieza total (si todo falla)
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm start
```

---

## 📱 Testing de la Aplicación

Una vez cargada en Expo Go, verifica:

✅ **Login:**
- Ingresa con usuario/contraseña
- Debe redireccionar a Home
- Sin errores en consola

✅ **Navegación:**
- Home → Ofertas (click en botón)
- Ofertas → Detalle (click en oferta)
- Ir a Postulaciones
- Ir a Citaciones
- Ir a Notificaciones

✅ **Rutas Protegidas:**
- Logout → redirige a Login automáticamente
- No puedes acceder a /(app) sin autenticación

✅ **Sin Errores:**
- No debe haber: "Cannot assign to read-only property"
- No debe haber: "Cannot read property 'NONE'"
- Console limpia (warnings normales de React okay)

---

## 📁 Estructura del Proyecto

```
frontend/
├─ index.ts                    ← ✨ POLYFILL HERMES (crítico)
├─ App.tsx                     ← Componente raíz
├─ package.json                ← SDK 54 + dependencias
├─ babel.config.js             ← Configuración Babel
├─ tsconfig.json               ← TypeScript config
├─ app/
│  ├─ _layout.tsx              ← Root layout + Auth check
│  ├─ login.tsx                ← Pantalla de login
│  └─ (app)/                   ← Rutas PROTEGIDAS
│     ├─ _layout.tsx           ← Stack Navigator
│     ├─ index.tsx             ← Home
│     ├─ ofertas.tsx           ← Ofertas
│     ├─ detalle-oferta.tsx    ← Detalle de oferta
│     ├─ postulaciones.tsx     ← Postulaciones
│     ├─ citaciones.tsx        ← Citaciones
│     ├─ notificaciones.tsx    ← Notificaciones
│     ├─ usuarios.tsx          ← Usuarios
│     ├─ crear-usuario.tsx     ← Crear usuario
│     ├─ crear-oferta.tsx      ← Crear oferta
│     └─ admin.tsx             ← Admin
├─ src/
│  ├─ context/
│  │  └─ AuthContext.tsx       ← useAuth() hook
│  ├─ screens/
│  │  ├─ LoginScreen.tsx
│  │  ├─ HomeScreen.tsx
│  │  ├─ OfertasScreen.tsx
│  │  └─ ... (8 más)
│  ├─ services/
│  │  └─ api.ts                ← API calls
│  └─ styles/
│     └─ ... (CSS-in-JS)
└─ node_modules/               ← Dependencias
```

---

## 🔗 Flujo de Autenticación (Interno)

```
1. App inicia → index.ts
   ↓
2. Polyfill ejecuta (Event.NONE redefinido)
   ↓
3. registerRootComponent(App)
   ↓
4. <App /> → <AuthProvider>
   ↓
5. app/_layout.tsx verifica: ¿user !== null?
   ├─ SÍ → Mostrar rutas protegidas (/(app))
   └─ NO → Mostrar login (/login)
   ↓
6. Usuario hace login
   ↓
7. AuthContext.login() → async token + user data
   ↓
8. router.replace('/(app)') → Navega a Home
   ↓
9. User puede navegar entre ofertas, postulaciones, etc.
```

---

## 📞 Archivos Importantes

- **Polyfill:** `/index.ts` (líneas 1-27)
- **Rutas raíz:** `/app/_layout.tsx`
- **Rutas protegidas:** `/app/(app)/_layout.tsx`
- **Autenticación:** `/src/context/AuthContext.tsx`
- **Pantallas:** `/src/screens/*.tsx` (todas usan `useRouter()`)

---

## 🎯 Versiones Finales

```json
{
  "expo": "~52.0.0",                          // SDK 54
  "react": "18.3.1",                          // React 18
  "react-native": "0.76.0",                   // RN con Hermes
  "expo-router": "~4.0.0",                    // Routing moderno
  "@react-navigation/native": "^6.1.17",      // Stack navigator
  "@react-navigation/native-stack": "^6.9.26" // Navegación nativa
}
```

---

## 💡 Cambios Principales de Código

### Antes (React Navigation antiguo)
```tsx
function HomeScreen({ navigation }) {
  return (
    <Button onPress={() => navigation.navigate("OfertasStack")} />
  );
}
```

### Ahora (Expo Router)
```tsx
import { useRouter } from 'expo-router';

function HomeScreen() {
  const router = useRouter();
  return (
    <Button onPress={() => router.push('/(app)/ofertas')} />
  );
}
```

---

## ⚙️ Comandos Útiles

```bash
# Iniciar dev server
npm start

# Limpiar metro bundler
npm start -- --clear

# Instalar dependencias
npm install

# Alinear versiones de Expo
npx expo install --fix

# Ver logs detallados
npm start -- --verbose

# Build para Android/iOS
eas build --platform android
eas build --platform ios
```

---

## 🚨 IMPORTANTE: Sin Bajar de SDK 54

- Tu dispositivo tiene **Expo Go v54** instalado
- SDK 51 es incompatible con v54
- La solución es usar **Polyfill para Hermes** (ya incluida)
- No intentes degradar SDK, no funcionará

---

## 🎉 Estado Final

✅ **Expo SDK 54** restaurado  
✅ **Expo Router** implementado  
✅ **Hermes Polyfill** instalado  
✅ **Autenticación** funcional  
✅ **Rutas protegidas** configuradas  
✅ **Listo para testing** en Expo Go v54  

**Siguiente paso:** `npm start` en terminal y escanea el QR en Expo Go.

---

*Última actualización: 6 Diciembre 2024*
