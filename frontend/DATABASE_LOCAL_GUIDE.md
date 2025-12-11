# 📱 GUÍA: BASE DE DATOS LOCAL SQLITE

## Descripción General

Esta aplicación móvil utiliza **SQLite** para almacenar datos locales en el dispositivo. Esto permite:

✅ **Funcionalidad offline** - La app funciona sin conexión a internet  
✅ **Caché de datos** - Mejora la velocidad de carga  
✅ **Persistencia de usuario** - El login se mantiene incluso después de cerrar la app  
✅ **Cola de sincronización** - Las operaciones se sincronizan cuando hay conexión  

## Arquitectura de Base de Datos

### 8 Tablas principales:

```
┌─────────────────────────────────────────┐
│          APLICACIÓN WORKABLE            │
├─────────────────────────────────────────┤
│  📊 app_config                          │
│  - Configuración de API                 │
│  - Versión de BD                        │
├─────────────────────────────────────────┤
│  👤 user_auth                           │
│  - Usuario autenticado                  │
│  - Token JWT                            │
│  - Datos del usuario                    │
├─────────────────────────────────────────┤
│  💼 cached_ofertas                      │
│  - Ofertas de trabajo cacheadas         │
│  - Información del reclutador           │
│  - Favoritos marcados                   │
├─────────────────────────────────────────┤
│  📋 cached_postulaciones                │
│  - Aplicaciones a ofertas               │
│  - Estado de cada postulación           │
├─────────────────────────────────────────┤
│  📅 cached_citaciones                   │
│  - Entrevistas programadas              │
│  - Hora y lugar                         │
├─────────────────────────────────────────┤
│  🔔 cached_notificaciones               │
│  - Notificaciones al usuario            │
│  - Estado de lectura                    │
├─────────────────────────────────────────┤
│  📝 app_logs                            │
│  - Logs locales de depuración           │
│  - Se borran después de 7 días          │
├─────────────────────────────────────────┤
│  📤 sync_queue                          │
│  - Operaciones pendientes de sincronizar│
│  - Se ejecutan cuando hay conexión      │
└─────────────────────────────────────────┘
```

## Servicios Disponibles

### 1. **database.ts** - Operaciones de BD Local

```typescript
// Inicializar la BD
import { initializeDatabase } from '@/services/database';
await initializeDatabase();

// Guardar usuario después de login
import { saveUserToDatabase } from '@/services/database';
await saveUserToDatabase(userData);

// Obtener usuario del caché
import { getUserFromDatabase } from '@/services/database';
const user = await getUserFromDatabase();

// Guardar ofertas en caché
import { cacheOfertas } from '@/services/database';
await cacheOfertas(ofertas);

// Obtener ofertas del caché
import { getCachedOfertas } from '@/services/database';
const ofertas = await getCachedOfertas();

// Marcar oferta como favorita
import { toggleOfertaFavorite } from '@/services/database';
await toggleOfertaFavorite(ofertaId, true);

// Limpiar BD local (al logout)
import { clearDatabase } from '@/services/database';
await clearDatabase();

// Obtener estadísticas de caché
import { getCacheStats } from '@/services/database';
const stats = await getCacheStats();
// { ofertas: 10, postulaciones: 5, citaciones: 3, notificaciones: 8 }
```

### 2. **DatabaseInitializer.ts** - Utilidades de Mantenimiento

```typescript
// Configurar BD al iniciar la app
import { setupDatabase } from '@/utils/DatabaseInitializer';
await setupDatabase();

// Crear backup de datos
import { backupDatabase } from '@/utils/DatabaseInitializer';
const backup = await backupDatabase();

// Limpiar logs antiguos (>7 días)
import { cleanOldLogs } from '@/utils/DatabaseInitializer';
await cleanOldLogs();

// Verificar integridad
import { verifyDatabaseIntegrity } from '@/utils/DatabaseInitializer';
const isValid = await verifyDatabaseIntegrity();
```

### 3. **SyncService.ts** - Sincronización con Servidor

```typescript
// Verificar conexión a internet
import { checkInternetConnection } from '@/services/SyncService';
const isConnected = await checkInternetConnection();

// Sincronizar operaciones pendientes manualmente
import { syncPendingOperations } from '@/services/SyncService';
const result = await syncPendingOperations(token);
// { synced: 5, failed: 0 }

// Agregar operación a la cola (cuando no hay conexión)
import { addToSyncQueue } from '@/services/SyncService';
await addToSyncQueue('/ofertas', 'POST', { titulo: 'Dev Senior' });

// Obtener número de operaciones pendientes
import { getPendingOperationCount } from '@/services/SyncService';
const pending = await getPendingOperationCount();

// Iniciar sincronización automática
import { startAutoSync } from '@/services/SyncService';
const stopSync = await startAutoSync(token, 30000); // Cada 30 segundos

// Detener sincronización automática
stopSync();
```

## Integración en AuthContext

La autenticación ahora integra la BD local:

```typescript
const login = async (username: string, password: string) => {
  try {
    // 1. Llamar API de autenticación
    const response = await authService.login(username, password);
    
    // 2. Guardar en AsyncStorage
    await AsyncStorage.setItem("token", response.token);
    
    // 3. Guardar en BD local para caché
    await saveUserToDatabase(userData);
    
    // 4. Actualizar estado
    setUser(userData);
    setToken(response.token);
  } catch (err) {
    // Manejo de error...
  }
};

const logout = async () => {
  // 1. Limpiar AsyncStorage
  await AsyncStorage.removeItem("token");
  
  // 2. Limpiar BD local
  await clearDatabase();
  
  // 3. Actualizar estado
  setUser(null);
  setToken(null);
};
```

## Integración en App.tsx

La BD se inicializa automáticamente al arrancar:

```typescript
export default function App() {
  useEffect(() => {
    console.log('🚀 Aplicación iniciando...');
    setupDatabase().then(() => {
      console.log('✅ Aplicación lista');
    });
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
```

## Flujo de Autenticación

```
┌──────────────┐
│ Usuario inicia│
│   sesión     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ Enviar a POST /auth/login│
│ { correo, password }     │
└──────┬───────────────────┘
       │
       ▼ (si 200 OK)
┌──────────────────────────┐
│ Guardar en AsyncStorage  │
│ - token                  │
│ - user data              │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Guardar en BD Local      │
│ (tabla user_auth)        │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Actualizar AuthContext   │
│ - user                   │
│ - token                  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Usuario puede navegar    │
│ la aplicación            │
└──────────────────────────┘
```

## Flujo de Caché de Datos

```
┌──────────────────────┐
│ Solicitar ofertas    │
│ GET /ofertas         │
└──────┬───────────────┘
       │
       ▼ (si hay conexión)
┌──────────────────────┐
│ Servidor responde    │
│ con lista de ofertas │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Guardar en caché     │
│ (tabla               │
│ cached_ofertas)      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Mostrar al usuario   │
│ desde BD local       │
└──────────────────────┘

Si NO hay conexión:
┌──────────────────────┐
│ GET /ofertas         │
│ (sin conexión)       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Cargar del caché     │
│ (tabla               │
│ cached_ofertas)      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Mostrar al usuario   │
│ (datos anteriores)   │
└──────────────────────┘
```

## Flujo de Sincronización Offline

```
┌──────────────────────┐
│ Usuario sin conexión │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────┐
│ Intentar operación       │
│ POST /postulaciones      │
└──────┬───────────────────┘
       │
       ▼ (no hay conexión)
┌──────────────────────────┐
│ Agregar a sync_queue     │
│ - endpoint               │
│ - method: POST           │
│ - payload                │
│ - status: PENDING        │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Mostrar al usuario:      │
│ "Se sincronizará luego"  │
└──────┬───────────────────┘
       │
       ▼ (usuario recupera conexión)
┌──────────────────────────┐
│ Auto-sync detecta        │
│ conexión disponible      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Procesar sync_queue      │
│ - Ejecutar operaciones   │
│ - Actualizar estado      │
│ - Mostrar resultado      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Sincronización completa  │
│ status: SYNCED           │
└──────────────────────────┘
```

## Mejores Prácticas

### ✅ Cuándo usar BD Local

1. **Caché de ofertas**: Guardar ofertas después de obtenerlas del servidor
2. **Usuario autenticado**: Mantener sesión iniciada offline
3. **Favoritos**: Guardar ofertas marcadas como favoritas
4. **Historial**: Almacenar histórico de búsquedas y postulaciones
5. **Cola de sincronización**: Operaciones pendientes cuando no hay conexión

### ❌ Cuándo NO usar BD Local

1. **Datos sensibles**: No guardar contraseñas (solo tokens JWT)
2. **Datos en tiempo real**: Cotizaciones, precios que cambian constantemente
3. **Datos muy grandes**: Videos, archivos pesados
4. **Datos privados**: PII (Personally Identifiable Information) sensible

## Troubleshooting

### BD no se inicializa

```typescript
// 1. Verificar que expo-sqlite está instalado
npx expo install expo-sqlite

// 2. Verificar que setupDatabase() se llama en App.tsx
// 3. Revisar logs en la consola para errores

// 4. Forzar reseteo de BD (para desarrollo)
import * as SQLite from 'expo-sqlite';
const db = await SQLite.openDatabaseAsync('workable.db');
await db.execAsync('DROP TABLE IF EXISTS user_auth;');
```

### La app no carga datos del caché

```typescript
// 1. Verificar que saveUserToDatabase() se llama en login
// 2. Verificar que getUserFromDatabase() se llama en cargarDatos()
// 3. Revisar que los nombres de tabla sean correctos

// 4. Limpiar y reintentar
await clearDatabase();
// Hacer login nuevamente
```

### Sincronización no funciona

```typescript
// 1. Verificar conexión a internet
import { checkInternetConnection } from '@/services/SyncService';
const connected = await checkInternetConnection();
console.log('Conectado:', connected);

// 2. Verificar operaciones pendientes
import { getPendingOperationCount } from '@/services/SyncService';
const pending = await getPendingOperationCount();
console.log('Pendientes:', pending);

// 3. Revisar última operación fallida
const failedOps = await db.getAllAsync(
  "SELECT * FROM sync_queue WHERE status = 'FAILED' LIMIT 1"
);
console.log('Error:', failedOps[0]?.last_error);
```

## Performance Tips

1. **Índices**: Ya están creados en las columnas más buscadas
2. **Paginación**: Usar `LIMIT` y `OFFSET` para grandes datasets
3. **Limpieza**: Los logs se eliminan automáticamente después de 7 días
4. **Caché**: Invalidar caché cada 24 horas para datos críticos

```typescript
// Verificar si caché está viejo
const lastSync = oferta.synced_at;
const ageInHours = (Date.now() - new Date(lastSync).getTime()) / (1000 * 60 * 60);
if (ageInHours > 24) {
  // Refrescar desde servidor
  await fetchOfertas();
}
```

## Próximos Pasos

1. ✅ BD SQLite creada
2. ✅ Servicios de BD creados (database.ts)
3. ✅ Inicializador de BD creado (DatabaseInitializer.ts)
4. ✅ Servicio de sincronización creado (SyncService.ts)
5. ✅ AuthContext actualizado para usar BD local
6. ✅ App.tsx configurado para inicializar BD
7. ⏳ **TODO**: Integrar sincronización automática en screens
8. ⏳ **TODO**: Crear UI para mostrar estado de sincronización
9. ⏳ **TODO**: Implementar backup/restore de datos

---

📧 **Preguntas**: Si necesitas ayuda con la BD local, revisa los logs en la consola para mensajes con emojis 🗄️, 📤, ✅, ❌
