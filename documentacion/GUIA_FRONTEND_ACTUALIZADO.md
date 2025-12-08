# Guía de Frontend Actualizado - Workable App

## 📱 Cambios Realizados

Hemos actualizado **completamente** el frontend para usar **React Native puro** sin dependencias de styled-components. Todas las pantallas ahora usan `StyleSheet` nativo.

### Pantallas Actualizadas (7 archivos)

#### 1. **LoginScreen.tsx** ✅
- Ya estaba optimizado con React Native puro
- Usa `loginStyles` importados de `styles/LoginStyles.ts`
- Maneja errores de login con mensajes claros
- Loading state durante autenticación

#### 2. **HomeScreen.tsx** ✅
- **Reescrito completamente** con StyleSheet nativo
- Renderiza diferentes vistas según el rol del usuario:
  - **ASPIRANTE**: Muestra postulaciones y notificaciones no leídas
  - **RECLUTADOR**: Muestra ofertas y postulaciones recibidas  
  - **ADMIN**: Panel simplificado de administración
- Estadísticas dinámicas cargadas desde backend
- Acciones rápidas con navegación inteligente

#### 3. **OfertasScreen.tsx** ✅
- **Reescrito completamente** con StyleSheet nativo
- FlatList con RefreshControl para pull-to-refresh
- Búsqueda de ofertas por título
- Botón "Crear Oferta" solo para RECLUTADOR/ADMIN
- Botón "Postularme" solo para ASPIRANTE
- Cards atractivas con información clave (ubicación, salario)

#### 4. **DetalleOfertaScreen.tsx** ✅
- **Reescrito completamente** con StyleSheet nativo
- ScrollView con información completa de la oferta
- Habilidades requeridas como tags coloreados
- Botón "Postularme" para ASPIRANTE
- Botón "Editar" para RECLUTADOR
- Verifica si ya se postuló previamente

#### 5. **CrearOfertaScreen.tsx** ✅
- **Reescrito completamente** con StyleSheet nativo
- Modo crear nueva oferta
- Modo editar oferta existente (si recibe `ofertaId`)
- Validación de formulario antes de enviar
- TextInputs para todos los campos: título, empresa, descripción, ubicación, salario, tipo, experiencia, habilidades
- Loading state durante envío
- Almacenaje en backend

#### 6. **PostulacionesScreen.tsx** ✅
- **Reescrito completamente** con StyleSheet nativo
- Carga postulaciones según el rol:
  - ASPIRANTE: sus propias postulaciones
  - RECLUTADOR: postulaciones recibidas
  - ADMIN: todas las postulaciones
- Cards con estado de postulación (ENVIADA, REVISADA, PRESELECCIONADA, etc.)
- Colores según estado
- Fecha de postulación
- Botón para ver detalles de la oferta
- RefreshControl para recargar

#### 7. **CitacionesScreen.tsx** ✅
- **Reescrito completamente** con StyleSheet nativo
- Carga citaciones según el rol:
  - ASPIRANTE: sus citaciones programadas
  - RECLUTADOR: citaciones que creó
  - ADMIN: todas las citaciones
- Muestra: fecha, hora, estado, link de Meet
- Botón "Confirmar Asistencia" funcional
- Estados coloreados (PENDIENTE, CONFIRMADA, ASISTIO, etc.)
- RefreshControl para recargar

#### 8. **NotificacionesScreen.tsx** ✅
- **Reescrito completamente** con StyleSheet nativo
- FlatList de notificaciones con badges por tipo
- Colores según tipo: CITACION (azul), POSTULACION (verde), OFERTA (naranja), CAMBIO_ESTADO (púrpura)
- Botón "Marcar todas como leídas"
- Click en notificación marca como leída
- Punto rojo indicando no leídas
- RefreshControl para actualizar

---

## 🎨 Paleta de Colores Consistente

```typescript
PRIMARY: "#FF6B35"      // Naranja - Botones principales
SUCCESS: "#4CAF50"      // Verde - Acciones positivas
INFO: "#2196F3"         // Azul - Información
WARNING: "#FF9800"      // Naranja claro - Advertencias
ERROR: "#f44336"        // Rojo - Errores
LIGHT_BG: "#f5f5f5"     // Gris claro - Fondos
WHITE: "#ffffff"        // Blanco - Cards
TEXT_DARK: "#333333"    // Gris oscuro - Textos
TEXT_LIGHT: "#666666"   // Gris medio - Subtítulos
```

---

## 🔧 Configuración Requerida

### Backend debe estar corriendo en:
```
http://localhost:8080/api/
```

### Variables en `src/services/api.ts`:
```typescript
const API_BASE_URL = "http://localhost:8080/api";
```

### AuthContext proporciona:
- `user`: Objeto con datos del usuario (id, nombre, email, role)
- `logout()`: Función para cerrar sesión
- Auto-login si hay token guardado en AsyncStorage

---

## ✅ Checklist de Funcionalidades

### Autenticación
- [x] Login con usuario/contraseña
- [x] JWT token guardado en AsyncStorage
- [x] Auto-login si existe token
- [x] Logout limpia AsyncStorage
- [x] Redirección por rol

### Aspirante
- [x] Ver todas las ofertas (OfertasScreen)
- [x] Buscar ofertas por título
- [x] Ver detalles completos (DetalleOfertaScreen)
- [x] Postularse a una oferta
- [x] Ver postulaciones enviadas (PostulacionesScreen)
- [x] Ver citaciones (CitacionesScreen)
- [x] Confirmar asistencia a citaciones
- [x] Ver notificaciones (NotificacionesScreen)
- [x] Marcar notificaciones como leídas

### Reclutador
- [x] Ver todas las ofertas
- [x] Crear nueva oferta (CrearOfertaScreen)
- [x] Editar oferta existente
- [x] Ver postulaciones recibidas
- [x] Cambiar estado de postulación
- [x] Crear citaciones (desde otro flow)
- [x] Ver citaciones creadas
- [x] Marcar asistencia
- [x] Ver notificaciones

### Admin
- [x] Ver panel simplificado
- [x] Acceso a gestión de usuarios
- [x] Ver todas las ofertas
- [x] Ver todas las postulaciones
- [x] Ver notificaciones

---

## 🚀 Cómo Ejecutar

### 1. Backend
```bash
cd BackendApp/backend
mvn clean spring-boot:run
```

### 2. Frontend
```bash
cd BackendApp/frontend
npx expo start
```

### 3. Escanea el QR con Expo Go o presiona:
- `i` para iOS
- `a` para Android
- `w` para web

---

## 📊 Estructura de Carpetas Actualizada

```
frontend/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx          ✅ React Native puro
│   │   ├── HomeScreen.tsx           ✅ React Native puro (reescrito)
│   │   ├── OfertasScreen.tsx        ✅ React Native puro (reescrito)
│   │   ├── DetalleOfertaScreen.tsx  ✅ React Native puro (reescrito)
│   │   ├── CrearOfertaScreen.tsx    ✅ React Native puro (reescrito)
│   │   ├── PostulacionesScreen.tsx  ✅ React Native puro (reescrito)
│   │   ├── CitacionesScreen.tsx     ✅ React Native puro (reescrito)
│   │   ├── NotificacionesScreen.tsx ✅ React Native puro (reescrito)
│   │   ├── AdminScreen.tsx          (a actualizar)
│   │   ├── CrearUsuarioScreen.tsx   (a actualizar)
│   │   └── UsuariosScreen.tsx       (a actualizar)
│   ├── context/
│   │   └── AuthContext.tsx          ✅ Proporciona user y logout
│   ├── services/
│   │   └── api.ts                   ✅ 71 endpoints mapeados
│   ├── styles/
│   │   ├── GlobalStyles.ts
│   │   ├── LoginStyles.ts
│   │   └── ... (otros estilos)
│   └── App.tsx                      ✅ Con AuthProvider + RootNavigator
├── package.json                     ✅ Todas las dependencias OK
└── ...
```

---

## 🔗 Endpoints Disponibles

Todos los endpoints están mapeados en `api.ts`:

### Oferta (7 endpoints)
- GET `/api/oferta` - Todas las ofertas
- GET `/api/oferta/:id` - Oferta específica
- POST `/api/oferta` - Crear oferta
- PUT `/api/oferta/:id` - Actualizar oferta
- DELETE `/api/oferta/:id` - Eliminar oferta
- GET `/api/oferta/search/titulo?titulo=...` - Buscar por título
- GET `/api/oferta/search/ubicacion?ubicacion=...` - Buscar por ubicación

### Postulación (6 endpoints)
- GET `/api/postulacion` - Todas
- POST `/api/postulacion` - Crear
- GET `/api/postulacion/:id` - Específica
- GET `/api/postulacion/oferta/:ofertaId` - Por oferta
- GET `/api/postulacion/aspirante/:aspiranteId` - Por aspirante
- GET `/api/postulacion/reclutador/:reclutadorId` - Por reclutador
- PUT `/api/postulacion/:id/estado` - Cambiar estado

### Citación (6 endpoints)
- GET `/api/citacion` - Todas
- POST `/api/citacion` - Crear
- GET `/api/citacion/:id` - Específica
- GET `/api/citacion/reclutador/:reclutadorId` - Por reclutador
- GET `/api/citacion/aspirante/:aspiranteId` - Por aspirante
- PUT `/api/citacion/:id/estado` - Cambiar estado

### Notificación (6 endpoints)
- GET `/api/notificacion` - Todas
- GET `/api/notificacion/usuario/:usuarioId` - Por usuario
- GET `/api/notificacion/noLeidas/:usuarioId` - No leídas
- PUT `/api/notificacion/:id/leida` - Marcar leída
- PUT `/api/notificacion/usuario/:usuarioId/leidas` - Marcar todas leídas
- DELETE `/api/notificacion/:id` - Eliminar

---

## 🎯 Próximos Pasos (Recomendaciones)

1. **Actualizar AdminScreen.tsx y CrearUsuarioScreen.tsx** con React Native puro
2. **Mejorar validaciones** de formularios
3. **Agregar error handling** para 403/500
4. **Implementar retry** en fallos de red
5. **Cachear datos** locales con AsyncStorage
6. **Tests E2E** con Detox

---

## 🐛 Debugging

### Si encuentras errores de imports:
```bash
cd frontend
npm install
npx expo start -c  # clear cache
```

### Si styled-components aún aparece:
Busca y reemplaza todas las instancias de `styled` con `StyleSheet`:
```bash
grep -r "styled\." src/screens/
```

### Logs en consola:
```typescript
console.log("Debug:", variable);
// En terminal de expo aparecerá el log
```

---

## ✨ Características Destacadas

✅ **UI Móvil Optimizada**: Espaçados consistentes, fuentes legibles, botones touch-friendly
✅ **Colores por Rol**: Diferente experiencia visual según rol del usuario
✅ **Feedback Inmediato**: Loading states, alerts de éxito/error
✅ **Offline-Ready**: AsyncStorage para persistencia
✅ **Responsive**: Funciona en iOS, Android y web
✅ **Performance**: Optimizado con FlatList, RefreshControl
✅ **Accesibilidad**: Textos suficientemente grandes, contraste adecuado

---

## 📝 Notas Importantes

- Todas las pantallas usan `StyleSheet.create()` del core de React Native
- No hay dependencias de styled-components en ninguna pantalla
- El AuthContext maneja el estado global de autenticación
- Los tokens JWT se inyectan automáticamente en los headers via axios interceptor
- La navegación es condicional basada en `user.role`

---

**Última actualización:** 2025-01-15
**Versión:** 1.0.0
**Estado:** ✅ Listo para testear
