# 🧪 CHECKLIST DE PRUEBA - Ofertas y Postulaciones

## Pre-Requisitos
- [ ] Backend compilado exitosamente: `mvn clean compile`
- [ ] Frontend sin errores TypeScript: `npx tsc --noEmit`
- [ ] H2 Database inicializada con DataInitializer.java
- [ ] Tres usuarios creados: 1 Admin, 1 Reclutador, 1 Aspirante

---

## 📋 Test 1: Visibilidad de Ofertas - ADMIN

**Escenario:** Admin debe ver TODAS las ofertas creadas

```
[ ] 1. Login como Admin
[ ] 2. Navegar a pantalla Ofertas
[ ] 3. Verificar que la lista NO está vacía
[ ] 4. Verificar que ve ofertas de OTROS reclutadores (no solo las suyas)
[ ] 5. Verificar que aparecen botones ✏️ Editar y 🗑️ Eliminar
[ ] 6. Verificar en Console: "📦 Ofertas recibidas del Backend: X"
```

**Logs esperados:**
```
✅ 🔄 OfertasScreen en foco - Recargando datos...
✅ ⏳ Iniciando carga de ofertas...
✅ 📦 Ofertas recibidas del Backend: [número > 0]
✅ ✅ Ofertas cargadas exitosamente: [número]
```

**Error si aparece:**
```
❌ 📦 Ofertas recibidas del Backend: 0
❌ ⏳ Iniciando carga de ofertas...
❌ GET /api/oferta retorna lista vacía
```

---

## 📋 Test 2: Visibilidad de Ofertas - RECLUTADOR

**Escenario:** Reclutador debe ver SOLO sus propias ofertas

```
[ ] 1. Login como Reclutador_A
[ ] 2. Navegar a pantalla Ofertas
[ ] 3. Crear una nueva oferta (+ Nueva Oferta)
[ ] 4. Verificar que aparece en la lista
[ ] 5. Logout y login como Reclutador_B
[ ] 6. Navegar a pantalla Ofertas
[ ] 7. Verificar que NO ve la oferta de Reclutador_A
[ ] 8. Crear una oferta propia
[ ] 9. Verificar que ve SOLO su oferta
[ ] 10. Verificar botones ✏️ Editar y 🗑️ Eliminar visibles
```

**Logs esperados (Reclutador_B):**
```
✅ 🔄 OfertasScreen en foco - Recargando datos...
✅ 📦 Ofertas recibidas del Backend: 1  (SOLO SU OFERTA)
```

**Caso especial - Reclutador sin ofertas:**
```
[ ] 1. Login como nuevo Reclutador (sin ofertas creadas)
[ ] 2. Ir a Ofertas
[ ] 3. DEBE estar VACÍA (esto es correcto, NO es error)
[ ] 4. Crear una oferta
[ ] 5. Ahora DEBE mostrar en la lista
```

---

## 📋 Test 3: Visibilidad de Ofertas - ASPIRANTE

**Escenario:** Aspirante debe ver SOLO ofertas con estado=ACTIVA

**Setup previo:**
```
Crear 3 ofertas:
- Oferta_1: estado=ACTIVA, activa=true  ← VISIBLE
- Oferta_2: estado=INACTIVA, activa=true ← NO VISIBLE
- Oferta_3: estado=ACTIVA, activa=false ← NO VISIBLE
```

```
[ ] 1. Login como Aspirante
[ ] 2. Navegar a pantalla Ofertas
[ ] 3. Verificar que VE: Oferta_1 (ACTIVA y activa)
[ ] 4. Verificar que NO VE: Oferta_2 (estado inactivo)
[ ] 5. Verificar que NO VE: Oferta_3 (desactivada)
[ ] 6. Verificar que aparece botón "Postularme"
[ ] 7. Verificar que NO aparecen botones ✏️ Editar/🗑️ Eliminar
```

**Logs esperados:**
```
✅ 📦 Ofertas recibidas del Backend: 1  (SOLO ACTIVAS)
```

---

## 📋 Test 4: Navigación Postulaciones → Oferta

**Escenario:** Click en postulación debe navegar a DetalleOferta sin error

```
[ ] 1. Login como Aspirante
[ ] 2. Ir a pantalla Postulaciones
[ ] 3. Hacer click en una postulación
[ ] 4. DEBE navegar a DetalleOferta
[ ] 5. Ver detalles de la oferta sin error
[ ] 6. Ir atrás (back)
[ ] 7. Hacer click en otra postulación
[ ] 8. DEBE navegar sin error
```

**Logs esperados:**
```
✅ Navegación exitosa a DetalleOferta
❌ NO debe haber error: "Cannot navigate to DetalleOferta with undefined ofertaId"
```

**Si falta la oferta:**
```
[ ] 1. Simular postulación con ofertaId inválido
[ ] 2. Hacer click en ella
[ ] 3. DEBE mostrar alerta: "Los datos de la oferta no están disponibles"
[ ] 4. NO debe crashear la app
```

---

## 📋 Test 5: Edición y Eliminación de Ofertas

**Escenario:** Solo propietario o Admin puede editar/eliminar

```
[ ] 1. Login como Reclutador_A
[ ] 2. Crear una oferta
[ ] 3. Verificar que aparecen botones ✏️ Editar/🗑️ Eliminar
[ ] 4. Logout y login como Reclutador_B
[ ] 5. Ir a Ofertas
[ ] 6. Buscar la oferta de Reclutador_A
[ ] 7. Verificar que NO aparecen botones de editar/eliminar
[ ] 8. Login como Admin
[ ] 9. Ir a Ofertas
[ ] 10. Búsqueda: oferta de Reclutador_A
[ ] 11. Verificar que SÍ aparecen botones ✏️ Editar/🗑️ Eliminar
```

---

## 📋 Test 6: Postulación Flujo Completo

**Escenario:** Aspirante puede postularse a una oferta activa

```
[ ] 1. Crear Oferta (estado=ACTIVA, activa=true) como Reclutador
[ ] 2. Login como Aspirante
[ ] 3. Ir a Ofertas
[ ] 4. Ver la oferta recién creada
[ ] 5. Click en "Ver Detalles"
[ ] 6. Debe mostrar botón "Postularme"
[ ] 7. Click en "Postularme"
[ ] 8. Debe ir a DetalleOferta con canApply=true
[ ] 9. Postularse
[ ] 10. Ir a Postulaciones
[ ] 11. Debe aparecer la postulación creada
[ ] 12. Click en ella
[ ] 13. Debe navegar sin error a DetalleOferta
```

---

## 🔍 Verificación de Logs

### En Backend (Spring Boot console):

```
✅ DEBE VER:
- GET /api/oferta
- Extracting role from Authentication: ADMIN/RECLUTADOR/ASPIRANTE
- findByActivaTrue() / findByReclutadorUsername() / findByEstadoAndActivaTrue()

❌ NO DEBE VER:
- 403 Forbidden (acceso denegado)
- SELECT * FROM oferta (sin WHERE para filtrar)
- java.lang.NullPointerException en OfertaService
```

### En Frontend (React Native console):

```
✅ DEBE VER:
- 🔄 OfertasScreen en foco - Recargando datos...
- 📦 Ofertas recibidas del Backend: [X]
- ✅ Ofertas cargadas exitosamente: [X]

❌ NO DEBE VER:
- Cannot navigate to DetalleOferta with undefined ofertaId
- Error: OfertaId undefined
- JSON.parse error en PostulacionesScreen
```

---

## 📊 Tabla de resultados esperados

| Test | Rol | Acción | Resultado Esperado |
|------|-----|--------|-------------------|
| Test 1 | Admin | Ver Ofertas | Lista con TODAS las ofertas |
| Test 2 | Reclutador_A | Ver Ofertas | Solo ofertas creadas por Reclutador_A |
| Test 2 | Reclutador_B | Ver Ofertas | Solo ofertas creadas por Reclutador_B |
| Test 3 | Aspirante | Ver Ofertas | Solo ofertas con estado=ACTIVA |
| Test 4 | Aspirante | Click Postulación | Navega a DetalleOferta sin error |
| Test 5 | Reclutador_A | Sus ofertas | Botones Editar/Eliminar visibles |
| Test 5 | Reclutador_A | Ofertas de otros | Botones Editar/Eliminar NO visibles |
| Test 5 | Admin | Cualquier oferta | Botones Editar/Eliminar siempre visibles |
| Test 6 | Aspirante | Flujo postulación | Completo sin errores |

---

## ⚠️ Puntos críticos a verificar

### ✅ Si aparece este log → OK:
```
📦 Ofertas recibidas del Backend: 3
✅ Ofertas cargadas exitosamente: 3
```

### ❌ Si aparece este log → ERROR:
```
❌ Error al cargar ofertas: 403 Forbidden
❌ Error al cargar ofertas: 404 Not Found
❌ Cannot navigate to DetalleOferta with undefined ofertaId
```

---

## 📝 Documento de resolución

Si todos los tests pasan → **SOLUCIÓN COMPLETA ✅**

Si algún test falla → Documentar:
- [ ] Qué test falló
- [ ] Qué error específico viste
- [ ] En qué rol/contexto
- [ ] Logs exactos del error

