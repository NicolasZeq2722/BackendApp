# Workable - Sistema de Empleo Móvil

## Resumen de la Implementación

Se ha completado exitosamente una aplicación móvil de gestión de empleo con las siguientes características:

### Backend (Spring Boot)

#### Nuevos Modelos JPA:
- **Oferta**: Gestión de ofertas de trabajo
- **Postulacion**: Aplicaciones de aspirantes a ofertas
- **Citacion**: Entrevistas y citaciones
- **Notificacion**: Sistema de notificaciones internas

#### Nuevos Repositorios:
- `OfertaRepository`
- `PostulacionRepository`
- `CitacionRepository`
- `NotificacionRepository`

#### Nuevos Services:
- `OfertaService`: Lógica de ofertas con CRUD y búsqueda
- `PostulacionService`: Gestión de postulaciones y cambio de estado
- `CitacionService`: Creación y gestión de citaciones con envío de emails
- `NotificacionService`: Gestión de notificaciones
- `EmailService`: Envío de correos (opcional, con fallback)

#### Nuevos Controllers REST:
- `OfertaController`: `/api/oferta/*`
- `PostulacionController`: `/api/postulacion/*`
- `CitacionController`: `/api/citacion/*`
- `NotificacionController`: `/api/notificacion/*`

#### Seguridad Mejorada:
- SecurityConfig actualizado con rutas públicas y protegidas por rol
- Roles soportados: `ADMIN`, `RECLUTADOR`, `ASPIRANTE`, `ADSO`
- Endpoints con validación de permisos mediante `@PreAuthorize`

### Frontend (React Native + TypeScript)

#### Pantallas Nuevas:
- **OfertasScreen**: Listado de ofertas con búsqueda y filtros
- **DetalleOfertaScreen**: Detalle completo de una oferta
- **CrearOfertaScreen**: Formulario para crear ofertas (reclutadores)
- **AdminScreen**: Panel de administración con CRUD de usuarios
- **CrearUsuarioScreen**: Formulario para crear/editar usuarios
- **NotificacionesScreen**: Centro de notificaciones

#### Servicios API Actualizados:
- `ofertaService`: CRUD completo de ofertas
- `postulacionService`: Gestión de postulaciones
- `citacionService`: Gestión de citaciones
- `notificacionService`: Gestión de notificaciones
- `usuarioService`: CRUD de usuarios (admin)

#### Navegación por Rol:
- **Aspirante**: Home → Ofertas → Postulaciones → Citaciones → Notificaciones
- **Reclutador**: Home → Mis Ofertas → Postulaciones → Citaciones → Notificaciones
- **Admin**: Home → Gestión → Ofertas → Usuarios → Notificaciones

#### Contexto de Autenticación:
- `AuthContext`: Manejo centralizado de autenticación
- Persistencia de JWT en AsyncStorage
- Auto-login en app reload

---

## Estructura del Proyecto

```
BackendApp/
├── backend/
│   ├── src/main/java/com/app/backend/
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── OfertaController.java (NUEVO)
│   │   │   ├── PostulacionController.java (NUEVO)
│   │   │   ├── CitacionController.java (NUEVO)
│   │   │   └── NotificacionController.java (NUEVO)
│   │   ├── model/
│   │   │   ├── User.java (ACTUALIZADO)
│   │   │   ├── Oferta.java (NUEVO)
│   │   │   ├── Postulacion.java (NUEVO)
│   │   │   ├── Citacion.java (NUEVO)
│   │   │   └── Notificacion.java (NUEVO)
│   │   ├── service/
│   │   │   ├── OfertaService.java (NUEVO)
│   │   │   ├── PostulacionService.java (NUEVO)
│   │   │   ├── CitacionService.java (NUEVO)
│   │   │   ├── NotificacionService.java (NUEVO)
│   │   │   └── EmailService.java (NUEVO)
│   │   ├── repository/
│   │   │   ├── OfertaRepository.java (NUEVO)
│   │   │   ├── PostulacionRepository.java (NUEVO)
│   │   │   ├── CitacionRepository.java (NUEVO)
│   │   │   └── NotificacionRepository.java (NUEVO)
│   │   ├── dto/
│   │   │   ├── OfertaCreateRequest.java (NUEVO)
│   │   │   ├── OfertaResponse.java (NUEVO)
│   │   │   ├── PostulacionResponse.java (NUEVO)
│   │   │   ├── CitacionCreateRequest.java (NUEVO)
│   │   │   ├── CitacionResponse.java (NUEVO)
│   │   │   └── NotificacionResponse.java (NUEVO)
│   │   └── security/
│   │       └── SecurityConfig.java (ACTUALIZADO)
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── OfertasScreen.tsx (NUEVO)
│   │   │   ├── DetalleOfertaScreen.tsx (NUEVO)
│   │   │   ├── CrearOfertaScreen.tsx (NUEVO)
│   │   │   ├── PostulacionesScreen.tsx
│   │   │   ├── CitacionesScreen.tsx
│   │   │   ├── NotificacionesScreen.tsx (NUEVO)
│   │   │   ├── AdminScreen.tsx (NUEVO)
│   │   │   ├── UsuariosScreen.tsx (ACTUALIZADO)
│   │   │   └── CrearUsuarioScreen.tsx (NUEVO)
│   │   ├── services/
│   │   │   └── api.ts (ACTUALIZADO)
│   │   ├── context/
│   │   │   └── AuthContext.tsx (NUEVO)
│   │   ├── navigation/
│   │   │   └── RootNavigator.tsx (NUEVO)
│   │   └── styles/
│   ├── App.tsx (ACTUALIZADO)
│   └── package.json
```

---

## Endpoints Disponibles

### Autenticación
```
POST   /api/auth/login         - Iniciar sesión
POST   /api/auth/register      - Registrarse (si existe)
```

### Ofertas
```
GET    /api/oferta             - Listar todas las ofertas
GET    /api/oferta/{id}        - Obtener oferta por ID
GET    /api/oferta/reclutador/{id}  - Ofertas de un reclutador
GET    /api/oferta/buscar/titulo    - Buscar por título
GET    /api/oferta/buscar/ubicacion - Buscar por ubicación
POST   /api/oferta?reclutadorId=X   - Crear oferta (RECLUTADOR, ADMIN)
PUT    /api/oferta/{id}?reclutadorId=X  - Editar oferta
DELETE /api/oferta/{id}?reclutadorId=X  - Eliminar oferta (soft delete)
```

### Postulaciones
```
GET    /api/postulacion/{id}              - Obtener postulación
GET    /api/postulacion/oferta/{ofertaId} - Postulaciones por oferta
GET    /api/postulacion/aspirante/{aspiranteId} - Postulaciones de aspirante
GET    /api/postulacion/reclutador/{reclutadorId} - Postulaciones recibidas
POST   /api/postulacion?ofertaId=X&aspiranteId=Y - Crear postulación
PUT    /api/postulacion/{id}/estado?estado=X&reclutadorId=Y - Cambiar estado
DELETE /api/postulacion/{id}?aspiranteId=X - Eliminar postulación
```

### Citaciones
```
GET    /api/citacion/{id}?usuarioId=X           - Obtener citación
GET    /api/citacion/reclutador/{id}            - Citaciones de reclutador
GET    /api/citacion/aspirante/{id}             - Citaciones de aspirante
POST   /api/citacion?reclutadorId=X             - Crear citación
PUT    /api/citacion/{id}/estado?estado=X&reclutadorId=Y - Cambiar estado
DELETE /api/citacion/{id}?reclutadorId=X        - Eliminar citación (soft delete)
```

### Notificaciones
```
GET    /api/notificacion/usuario/{usuarioId}              - Todas las notificaciones
GET    /api/notificacion/usuario/{usuarioId}/no-leidas    - Solo no leídas
GET    /api/notificacion/usuario/{usuarioId}/contar       - Contar no leídas
PUT    /api/notificacion/{id}/leida                       - Marcar como leída
PUT    /api/notificacion/usuario/{usuarioId}/todas-leidas - Marcar todas leídas
DELETE /api/notificacion/{id}                             - Eliminar notificación
```

### Usuarios (Admin)
```
GET    /api/usuario                - Listar todos los usuarios (ADMIN)
GET    /api/usuario/{id}           - Obtener usuario por ID
POST   /api/usuario                - Crear usuario (ADMIN)
PUT    /api/usuario/{id}           - Editar usuario (ADMIN)
DELETE /api/usuario/{id}           - Eliminar usuario (ADMIN)
```

---

## Cómo Ejecutar

### Backend

1. **Navega a la carpeta backend:**
   ```bash
   cd backend
   ```

2. **Compila y ejecuta:**
   ```bash
   mvn clean package
   mvn spring-boot:run
   ```

3. **El backend estará disponible en:**
   ```
   http://localhost:8080
   ```

### Frontend

1. **Navega a la carpeta frontend:**
   ```bash
   cd frontend
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecuta en desarrollo:**
   ```bash
   npm start
   # o para Expo
   expo start
   ```

4. **Configura la IP del backend** en `src/services/api.ts`:
   ```typescript
   const API_URL = "http://TU_IP:8080/api";
   ```

---

## Funcionalidades por Rol

### 👤 Aspirante
- ✅ Buscar ofertas de trabajo
- ✅ Ver detalles completos de ofertas
- ✅ Postularse a ofertas
- ✅ Ver historial de postulaciones
- ✅ Ver citaciones/entrevistas programadas
- ✅ Recibir notificaciones sobre postulaciones y citaciones
- ✅ Editar perfil personal

### 👔 Reclutador
- ✅ Crear nuevas ofertas
- ✅ Editar y eliminar ofertas propias
- ✅ Ver todas las postulaciones recibidas
- ✅ Cambiar estado de postulaciones
- ✅ Crear citaciones para candidatos
- ✅ Enviar notificaciones a candidatos
- ✅ Recibir notificaciones de nuevas postulaciones

### ⚙️ Administrador
- ✅ CRUD completo de usuarios
- ✅ Crear aspirantes, reclutadores y otros admins
- ✅ Ver todas las ofertas del sistema
- ✅ Gestionar todas las postulaciones
- ✅ Gestionar todas las citaciones
- ✅ Acceso a todas las notificaciones

---

## Variables de Entorno

### Backend (application.properties)
```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/workable
spring.datasource.username=root
spring.datasource.password=

# Email (opcional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# JWT
jwt.secret=tu-secret-key
jwt.expiration=86400000

# Server
server.port=8080
```

### Frontend
```typescript
// src/services/api.ts
const API_URL = "http://192.168.x.x:8080/api"; // Cambia con tu IP local
```

---

## Pruebas Rápidas con Postman

### 1. Login
```bash
POST http://localhost:8080/api/auth/login
Body: { "username": "aspirante1", "password": "password" }
Response: { "id": 1, "username": "aspirante1", "role": "ASPIRANTE", "token": "jwt-token" }
```

### 2. Listar Ofertas
```bash
GET http://localhost:8080/api/oferta
Authorization: Bearer {token}
```

### 3. Crear Oferta (como reclutador)
```bash
POST http://localhost:8080/api/oferta?reclutadorId=2
Authorization: Bearer {token}
Body: {
  "titulo": "Senior Developer",
  "descripcion": "Buscamos un senior developer con 5+ años de experiencia",
  "empresa": "Tech Company",
  "salario": 3500000,
  "ubicacion": "Medellín",
  "tipoContrato": "Indefinido",
  "experienciaRequerida": 5,
  "habilidadesRequeridas": "Java, Spring Boot, REST APIs"
}
```

### 4. Postularse a Oferta (como aspirante)
```bash
POST http://localhost:8080/api/postulacion?ofertaId=1&aspiranteId=1
Authorization: Bearer {token}
```

---

## Notas Importantes

1. **Base de Datos**: Se requiere MySQL 8.0+. Las tablas se crearán automáticamente con Hibernatpe.

2. **JWT**: El token expira por defecto en 24 horas. Configurable en `application.properties`.

3. **Email**: Si no está configurado, el sistema solo loguea el email (no genera errores).

4. **Soft Delete**: Los registros se marcan como `activa=false` en lugar de eliminarse.

5. **Notificaciones**: Se crean automáticamente en eventos como postulaciones y cambios de estado.

6. **CORS**: Habilitado para todas las rutas (`*`), cambiar en producción.

---

## Próximas Mejoras (Opcional)

- [ ] Autenticación con Google/GitHub
- [ ] Búsqueda avanzada con filtros
- [ ] Perfil de usuario con CV
- [ ] Calificaciones y reseñas
- [ ] Chat en tiempo real
- [ ] Notificaciones Push con Firebase
- [ ] Pruebas unitarias e integración
- [ ] CI/CD con GitHub Actions
- [ ] Documentación Swagger/OpenAPI

---

## Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.

**Última actualización**: Diciembre 2025
