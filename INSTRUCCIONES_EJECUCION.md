# 🚀 INSTRUCCIONES DE EJECUCIÓN - WORKABLE

## 📋 REQUISITOS PREVIOS

✅ Node.js v18+ instalado
✅ npm instalado
✅ Git instalado
✅ Backend Spring Boot corriendo en http://localhost:8080

---

## 🎯 PASO 1: INSTALAR DEPENDENCIAS DEL FRONTEND

```bash
cd frontend
npm install
```

**Esto instalará:**
- Expo SDK 54
- React 19
- React Native 0.81
- React Navigation
- Axios para consumir API REST
- Todas las dependencias necesarias

---

## 📱 PASO 2: EJECUTAR EL FRONTEND

### Opción A: Ejecutar en desarrollo (recomendado)
```bash
npm start
```

Esto abrirá el **Expo Development Server** en tu navegador con opciones para:
- 📲 Abrir en Android (necesita Android Emulator)
- 🍎 Abrir en iOS (necesita Mac + Xcode)
- 🌐 Abrir en Web (browser)

### Opción B: Ejecutar específicamente para Android
```bash
npm run android
```

### Opción C: Ejecutar específicamente para iOS (solo en Mac)
```bash
npm run ios
```

### Opción D: Ejecutar en Web
```bash
npm run web
```

---

## 🔐 CREDENCIALES DE PRUEBA

Una vez que inicie la aplicación, puede usar estas credenciales:

| Rol | Usuario | Contraseña |
|-----|---------|-----------|
| Admin | `admin` | `admin123` |
| Reclutador | `reclutador` | `reclu123` |
| Aspirante | `aspirante` | `aspi123` |

---

## ⚙️ CONFIGURACIÓN DEL BACKEND

Asegúrate de que el backend esté ejecutándose:

```bash
cd backend
mvn spring-boot:run
```

El backend debe estar disponible en: `http://localhost:8080`

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot determine the project's Expo SDK version"
```bash
npm install
```

### Error: "Module not found: react-native"
```bash
npm install react-native
npm start
```

### Limpiar caché y reinstalar
```bash
npm run clean
```

Este comando ejecuta:
```bash
rm -rf node_modules package-lock.json .expo && npm install
```

### Si siguen habiendo problemas
```bash
# Eliminar manual
rm -rf node_modules
rm package-lock.json

# Reinstalar
npm install
npm start
```

---

## 📊 ESTRUCTURA DEL PROYECTO

```
frontend/
├── src/
│   ├── screens/          (9 pantallas principales)
│   ├── navigation/       (React Navigation)
│   ├── context/          (Auth Context)
│   ├── services/         (API REST)
│   └── styles/           (Design System)
├── package.json          (Dependencias)
├── tsconfig.json         (TypeScript config)
├── app.json              (Expo config)
└── metro.config.js       (Metro bundler config)
```

---

## ✅ CHECKLIST ANTES DE EJECUTAR

- [ ] Backend ejecutándose en http://localhost:8080
- [ ] Node.js v18+ instalado
- [ ] npm install completado
- [ ] TypeScript sin errores (0 errores)
- [ ] Archivo .env configurado (si es necesario)

---

## 🎨 CARACTERÍSTICAS IMPLEMENTADAS

✅ Autenticación con JWT
✅ 9 Pantallas funcionales
✅ Design System centralizado
✅ Navegación por roles (Admin, Reclutador, Aspirante)
✅ Consumo de API REST
✅ Estilos responsive
✅ TypeScript tipado
✅ Performance optimizado

---

## 📞 CONTACTO Y SOPORTE

Para reportar errores o sugerencias:
1. Verifica que todas las dependencias estén instaladas
2. Limpia caché: `npm run clean`
3. Revisa los logs en la consola

---

**Versión:** 1.0.0
**Estado:** ✅ LISTO PARA DESARROLLO
**Última actualización:** Diciembre 2025
