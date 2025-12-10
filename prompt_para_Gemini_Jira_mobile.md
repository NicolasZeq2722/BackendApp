# PROMPT PARA GEMINI: ESTRUCTURA DEL PROYECTO Y METODOLOGÍA SCRUM EN JIRA

---

## 📋 INSTRUCCIÓN PRINCIPAL

Basándote en la siguiente estructura y descripción del proyecto, **genera un plan completo de implementación de Scrum en Jira** que incluya:

1. **Definición de Epics (Grandes características)**
2. **Historias de Usuario (User Stories) por Epic**
3. **Tareas técnicas (Tasks) por Historia**
4. **Estimaciones en Story Points**
5. **Definición de Sprints recomendados**
6. **Criteria de Aceptación para cada Historia**
7. **Dependencias entre tareas**

---

## 🏗️ ESTRUCTURA DEL PROYECTO

### **INFORMACIÓN GENERAL**

- **Nombre del Proyecto:** BackendApp - Plataforma de Ofertas Laborales Mobile
- **Tecnología Frontend:** React Native + Expo SDK 54 + TypeScript
- **Tecnología Backend:** Spring Boot (Java) + PostgreSQL
- **Plataformas Soportadas:** iOS y Android (mismo código base con Expo)
- **Estado:** Completado en un 100% del MVP
- **Equipo:** Full Stack (Frontend + Backend developers)

---

## 📱 ESTRUCTURA DEL FRONTEND (React Native)

### **Ubicación:** `frontend/`

### **Arquitectura:**

```
frontend/
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx         (Navegación principal)
│   │   └── NavigationWrapper.tsx      (Wrapper de contexto)
│   ├── screens/                      (9 pantallas principales)
│   │   ├── LoginScreen.tsx           (Autenticación)
│   │   ├── HomeScreen.tsx            (Dashboard principal)
│   │   ├── OfertasScreen.tsx         (Listado de ofertas)
│   │   ├── DetalleOfertaScreen.tsx   (Detalle oferta)
│   │   ├── CrearOfertaScreen.tsx     (Crear nueva oferta)
│   │   ├── PostulacionesScreen.tsx   (Mis aplicaciones)
│   │   ├── CitacionesScreen.tsx      (Entrevistas/Citaciones)
│   │   ├── NotificacionesScreen.tsx  (Notificaciones)
│   │   ├── UsuariosScreen.tsx        (Gestión de usuarios)
│   │   ├── CrearUsuarioScreen.tsx    (Crear usuario)
│   │   └── AdminScreen.tsx           (Panel administrador)
│   ├── context/
│   │   └── AuthContext.tsx           (Context global de autenticación)
│   ├── services/
│   │   └── api.ts                    (Cliente HTTP para API REST)
│   └── styles/
│       ├── GlobalStyles.ts           (Design System centralizado)
│       ├── LoginStyles.ts            (Estilos de Login)
│       ├── HomeStyles.ts             (Estilos de Home)
│       ├── OfertasStyles.ts          (Estilos de Ofertas)
│       ├── PostulacionesStyles.ts    (Estilos de Postulaciones)
│       ├── CitacionesStyles.ts       (Estilos de Citaciones)
│       ├── UsuariosStyles.ts         (Estilos de Usuarios)
│       ├── CategoriesStyles.ts       (Estilos de Categorías)
│       └── SubcategoriesStyles.ts    (Estilos de Subcategorías)
├── package.json                      (Dependencias)
├── tsconfig.json                     (Configuración TypeScript)
├── app.json                          (Configuración Expo)
└── metro.config.js                   (Bundler config)
```

### **Características Principales del Frontend:**

- **Autenticación:** Sistema de login con token JWT
- **Navegación:** Stack navigation con role-based access
- **Design System:** Tokens centralizados (colores, tipografía, espaciado)
- **State Management:** Context API para autenticación
- **API Integration:** Consumo de REST API del backend
- **UI/UX:** Components reutilizables y responsive
- **Performance:** React.memo() y useCallback() para optimización

### **Roles de Usuario (Frontend):**

1. **Aspirante** - Busca ofertas, se postula, recibe citaciones
2. **Reclutador** - Publica ofertas, ve postulaciones, genera citaciones
3. **Admin** - Gestiona usuarios, monitorea plataforma

---

## 🔧 ESTRUCTURA DEL BACKEND (Spring Boot)

### **Ubicación:** `backend/`

### **Arquitectura:**

```
backend/
├── src/main/java/com/app/backend/
│   ├── BackendApplication.java       (Main de Spring Boot)
│   ├── config/
│   │   ├── WebConfig.java            (CORS, configuración web)
│   │   ├── DataInitializer.java      (Datos iniciales)
│   │   └── database.sql              (Script SQL)
│   ├── controller/                   (7 controladores REST)
│   │   ├── AuthController.java       (Login, registro)
│   │   ├── UserController.java       (CRUD usuarios)
│   │   ├── OfertaController.java     (CRUD ofertas)
│   │   ├── PostulacionController.java (Postulaciones)
│   │   ├── CitacionController.java   (Citaciones/Entrevistas)
│   │   ├── NotificacionController.java (Notificaciones)
│   │   └── StatsController.java      (Estadísticas)
│   ├── model/                        (Entidades JPA)
│   │   ├── Usuario.java              (Usuario)
│   │   ├── Oferta.java               (Oferta laboral)
│   │   ├── Postulacion.java          (Aplicación a oferta)
│   │   ├── Citacion.java             (Entrevista/Citación)
│   │   └── Notificacion.java         (Notificación)
│   ├── repository/                   (JPA Repositories)
│   │   ├── UsuarioRepository.java
│   │   ├── OfertaRepository.java
│   │   ├── PostulacionRepository.java
│   │   ├── CitacionRepository.java
│   │   └── NotificacionRepository.java
│   ├── service/                      (Lógica de negocio)
│   │   ├── UsuarioService.java
│   │   ├── OfertaService.java
│   │   ├── PostulacionService.java
│   │   ├── CitacionService.java
│   │   └── NotificacionService.java
│   ├── dto/                          (Data Transfer Objects)
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   ├── CitacionCreateRequest.java
│   │   └── (20+ DTO más)
│   └── security/                     (JWT, autenticación)
│       └── JwtTokenProvider.java
├── pom.xml                           (Maven dependencies)
├── application.properties            (Configuración)
└── target/                           (Archivos compilados)
```

### **Características Principales del Backend:**

- **REST API:** Endpoints CRUD para todas las entidades
- **Base de Datos:** PostgreSQL con JPA/Hibernate
- **Autenticación:** JWT (JSON Web Tokens)
- **Seguridad:** Spring Security, control de acceso por roles
- **Validación:** Bean Validation, validación de entrada
- **Transacciones:** Control de transacciones en servicios
- **Filtrado:** Queries JPQL optimizadas (ej: postulaciones activas)
- **Soft Delete:** Ofertas marcadas como inactivas (no borradas)

### **Entidades Principales:**

1. **Usuario** - Aspirante, Reclutador, Admin
2. **Oferta** - Puestos de trabajo publicados
3. **Postulacion** - Candidaturas a ofertas
4. **Citacion** - Entrevistas y citas
5. **Notificacion** - Sistema de notificaciones

---

## 🔄 FLUJOS DE USUARIO PRINCIPALES

### **Flujo 1: Autenticación**
```
Usuario → Login Screen → AuthController (POST /auth/login) → 
JWT Token → AuthContext → Protected Screens
```

### **Flujo 2: Aspirante Busca y se Postula**
```
Home → OfertasScreen (GET /api/ofertas) → DetalleOfertaScreen → 
PostulacionesScreen (POST /api/postulaciones) → Éxito
```

### **Flujo 3: Reclutador Publica Oferta**
```
Home → CrearOfertaScreen → OfertaController (POST /api/ofertas) → 
Oferta almacenada → PostulacionesScreen (GET /api/postulaciones/reclutador)
```

### **Flujo 4: Reclutador Genera Citación**
```
PostulacionesScreen → CitacionController (POST /api/citaciones) → 
Notificación al aspirante → CitacionesScreen
```

---

## 🎯 FUNCIONALIDADES POR PANTALLA

| Pantalla | Rol | Funcionalidad | API Endpoints |
|----------|-----|--------------|---------------|
| **LoginScreen** | Todos | Login/Logout | POST /auth/login |
| **HomeScreen** | Todos | Dashboard | GET /api/stats |
| **OfertasScreen** | Aspirante | Listado ofertas | GET /api/ofertas |
| **DetalleOfertaScreen** | Aspirante | Detalle oferta | GET /api/ofertas/{id} |
| **CrearOfertaScreen** | Reclutador | Publicar oferta | POST /api/ofertas |
| **PostulacionesScreen** | Ambos | Ver postulaciones | GET /api/postulaciones |
| **CitacionesScreen** | Ambos | Ver citaciones | GET /api/citaciones |
| **NotificacionesScreen** | Todos | Ver notificaciones | GET /api/notificaciones |
| **UsuariosScreen** | Admin | Listado usuarios | GET /api/usuarios |
| **CrearUsuarioScreen** | Admin | Crear usuario | POST /api/usuarios |
| **AdminScreen** | Admin | Panel control | GET /api/admin/* |

---

## 🛠️ STACK TECNOLÓGICO RESUMIDO

### **Frontend:**
- React Native (Expo)
- TypeScript
- React Navigation
- React Context API
- Axios (HTTP client)
- StyleSheet de React Native

### **Backend:**
- Spring Boot 3.x
- Spring Data JPA
- Spring Security
- PostgreSQL
- Maven
- JWT Authentication

### **DevOps & Tools:**
- Git (control de versiones)
- Postman (pruebas API)
- npm/yarn (gestor paquetes frontend)
- Maven (gestor paquetes backend)
- PostgreSQL (base de datos)

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### **Completado (85%):**
✅ Diseño system centralizado
✅ Autenticación con JWT
✅ CRUD de ofertas
✅ Sistema de postulaciones
✅ Sistema de citaciones
✅ Notificaciones
✅ Panel de admin
✅ Filtrado de postulaciones activas
✅ TypeScript configurado
✅ Error handling

### **En progreso o por mejorar:**
⏳ Tests unitarios (backend)
⏳ Tests e2e (frontend)
⏳ Optimización de performance
⏳ Caché de datos
⏳ Sincronización offline
⏳ Despliegue en producción

---

## 🚀 REQUISITOS PREVIOS PARA JIRA

Antes de implementar Scrum, considera:

1. **Equipo disponible:**
   - Cuántos frontend developers
   - Cuántos backend developers
   - Cuántos QA testers
   - Cuánto tiempo de dedicación

2. **Duración de Sprints recomendada:**
   - 2 semanas (estándar para proyectos Mobile)
   - O 1 semana para MVP rápido

3. **Velocidad esperada:**
   - Estimar story points basado en complejidad
   - Frontend: 2-5 puntos por Historia
   - Backend: 3-8 puntos por Historia
   - DevOps/Testing: 2-4 puntos

4. **Definición de Done (DoD):**
   - Código revisado (Code Review)
   - Tests escritos (mínimo coverage 70%)
   - Documentación actualizada
   - Sin warnings en compilación
   - Funciona en iOS y Android

---

## 📝 PRÓXIMOS PASOS EN JIRA

Con esta información, pido que generes:

1. **10-15 Epics** que cubran todo el proyecto
2. **30-50 User Stories** desglosadas por Epic
3. **100-150 Tasks** técnicas específicas
4. **Estimaciones** en Story Points (1, 2, 3, 5, 8, 13)
5. **Criterios de Aceptación** claros para cada Historia
6. **Sprint Planning** para 3-4 sprints iniciales
7. **Dependencias** identificadas entre tareas
8. **Subtasks** técnicas donde sea necesario

**Formato esperado:** Poder copiar/pegar directamente en Jira o exportar como JSON/CSV

---

## 🎓 NOTAS ADICIONALES

- El proyecto usa **Soft Delete** (ofertas no se elimina, se marca inactiva)
- Implementar **useFocusEffect** en pantallas para auto-refresh de datos
- Backend filtra automáticamente postulaciones de ofertas inactivas
- Usar **React.memo()** y **useCallback()** en componentes del frontend
- Mantener **Design System centralizado** en GlobalStyles.ts
- Seguir **patrón MVC** en backend (Model-View-Controller)
- Usar **DTOs** para transferencia de datos entre frontend-backend
- Implementar **error handling** consistente en ambos lados

---

**Fin del prompt. Por favor, genera el plan Scrum completo en Jira basándote en esta documentación.**
