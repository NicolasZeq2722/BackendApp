# 📝 Editar Oferta - Código Completo Implementado

## 1. OfertasScreen.tsx - Botón Editar Implementado

**Ubicación:** Lines 201-211 en OfertasScreen.tsx

### Código Anterior (Sin Funcionalidad)
```typescript
<TouchableOpacity
  style={[styles.adminButton, styles.editButton]}
  onPress={() =>
    Alert.alert(
      "Editar",
      "Funcionalidad de edición no implementada aún"
    )
  }
>
  <Text style={styles.adminButtonText}>✏️ Editar</Text>
</TouchableOpacity>
```

### Código Nuevo (Funcionalidad Implementada)
```typescript
<TouchableOpacity
  style={[styles.adminButton, styles.editButton]}
  onPress={() => {
    console.log("✏️ Editando oferta:", item.id);
    navigation.navigate('CrearOferta', { 
      ofertaId: item.id
    });
  }}
>
  <Text style={styles.adminButtonText}>✏️ Editar</Text>
</TouchableOpacity>
```

---

## 2. CrearOfertaScreen.tsx - Ya Soporta Edición

El componente `CrearOfertaScreen` **ya estaba implementado** para soportar edición. Veamos cómo funciona:

### 2.1 Recibir el parámetro ofertaId

```typescript
const CrearOfertaScreen = ({ route, navigation }: any) => {
  const { ofertaId } = route.params || {};  // ✅ Recibe el ID de la oferta a editar
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    cargarUsuario();
    if (ofertaId) {
      cargarOferta();  // ✅ Carga datos si ofertaId existe
    }
  }, []);
```

### 2.2 Cargar datos de la oferta

```typescript
const cargarOferta = async () => {
  try {
    setLoading(true);
    // ✅ GET /api/oferta/{ofertaId}
    const response = await ofertaService.getById(ofertaId);
    const oferta = response.data;

    // ✅ Pre-llenar todos los campos
    setTitulo(oferta.titulo);
    setDescripcion(oferta.descripcion);
    setEmpresa(oferta.empresa);
    setSalario(oferta.salario.toString());
    setUbicacion(oferta.ubicacion);
    setTipoContrato(oferta.tipoContrato || "");
    setExperiencia(oferta.experienciaRequerida?.toString() || "");
    setHabilidades(oferta.habilidadesRequeridas || "");
    
    setIsEditMode(true);  // ✅ Activa modo edición
  } catch (err) {
    Alert.alert("Error", "No se pudo cargar la oferta");
    navigation.goBack();
  } finally {
    setLoading(false);
  }
};
```

### 2.3 Cambiar título según el modo

```typescript
<View style={styles.headerContainer}>
  <Text style={styles.headerTitle}>
    {isEditMode ? "Editar Oferta" : "Crear Nueva Oferta"}
    {/* ✅ Muestra "Editar Oferta" si isEditMode=true */}
  </Text>
</View>
```

### 2.4 Guardar cambios (Create vs Update)

```typescript
const handleGuardar = async () => {
  if (!validarFormulario() || !user) return;

  setLoading(true);
  try {
    const datosOferta = {
      titulo,
      descripcion,
      empresa,
      salario: Number(salario),
      ubicacion,
      tipoContrato,
      experienciaRequerida: experiencia ? Number(experiencia) : 0,
      habilidadesRequeridas: habilidades,
      reclutadorId: user.id,
      estado: "ACTIVA",
    };

    if (isEditMode && ofertaId) {
      // ✅ MODO EDICIÓN: PUT /api/oferta/{ofertaId}?reclutadorId={userId}
      await ofertaService.update(ofertaId, datosOferta, user.id);
      Alert.alert("Éxito", "Oferta actualizada correctamente");
    } else {
      // MODO CREAR: POST /api/oferta?reclutadorId={userId}
      await ofertaService.create(datosOferta, user.id);
      Alert.alert("Éxito", "Oferta creada correctamente");
    }

    navigation.goBack();  // ✅ Vuelve a OfertasScreen
  } catch (err: any) {
    Alert.alert("Error", err.response?.data?.message || "Error al guardar la oferta");
  } finally {
    setLoading(false);
  }
};
```

---

## 3. Flujo Completo de Edición

```
┌─────────────────────────────────────────────────────────┐
│ PASO 1: Usuario en OfertasScreen                        │
├─────────────────────────────────────────────────────────┤
│ Ver lista de ofertas                                    │
│ Ver botón "✏️ Editar" para ofertas propias              │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 2: Click en "✏️ Editar"                            │
├─────────────────────────────────────────────────────────┤
│ onPress={() => {                                        │
│   navigation.navigate('CrearOferta', {                  │
│     ofertaId: item.id                                   │
│   });                                                   │
│ }}                                                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 3: CrearOfertaScreen monta                         │
├─────────────────────────────────────────────────────────┤
│ route.params = { ofertaId: 123 }                        │
│ const { ofertaId } = route.params || {};               │
│ if (ofertaId) cargarOferta();                           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 4: Cargar datos del backend                        │
├─────────────────────────────────────────────────────────┤
│ GET /api/oferta/123                                     │
│ Response: { titulo: "Desarrollador Senior", ... }       │
│ Pre-llenar campos con datos                             │
│ setIsEditMode(true)                                     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 5: UI Actualizado                                  │
├─────────────────────────────────────────────────────────┤
│ Título: "Editar Oferta"                                │
│ Campos: Pre-llenos con datos actuales                  │
│ Botón: "Guardar" (en lugar de "Crear")                 │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 6: Usuario modifica campos                         │
├─────────────────────────────────────────────────────────┤
│ setTitulo("Nuevo título")                              │
│ setSalario("6000")                                      │
│ ... más cambios                                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 7: Click en "Guardar"                              │
├─────────────────────────────────────────────────────────┤
│ if (isEditMode && ofertaId) {                          │
│   await ofertaService.update(                           │
│     ofertaId,                                           │
│     datosOferta,                                        │
│     user.id                                             │
│   );                                                    │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 8: Backend procesa actualización                   │
├─────────────────────────────────────────────────────────┤
│ PUT /api/oferta/123?reclutadorId=456                    │
│ Validar: reclutador == propietario OR ADMIN             │
│ Actualizar en base de datos                             │
│ Retornar oferta actualizada                             │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 9: Confirmación y regreso                          │
├─────────────────────────────────────────────────────────┤
│ Alert: "Éxito - Oferta actualizada correctamente"      │
│ navigation.goBack()                                     │
│ Vuelve a OfertasScreen                                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ PASO 10: Sincronización de datos                        │
├─────────────────────────────────────────────────────────┤
│ useFocusEffect en OfertasScreen                         │
│ cargarOfertas() se ejecuta automáticamente              │
│ FlatList se actualiza con nuevos datos                  │
│ Usuario ve los cambios en tiempo real                   │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Casos de Uso

### Caso 1: Reclutador edita su propia oferta
```
✅ Usuario: Reclutador (ID: 456)
✅ Oferta: Creada por Reclutador (ID: 456)
✅ Permiso: canEditDelete = true (mismo usuario)
✅ Botón Editar: VISIBLE
✅ Backend: Valida exitosamente
✅ Resultado: Oferta actualizada
```

### Caso 2: Admin edita oferta de otro reclutador
```
✅ Usuario: Admin
✅ Oferta: Creada por Reclutador (ID: 789)
✅ Permiso: canEditDelete = true (rol ADMIN)
✅ Botón Editar: VISIBLE
✅ Backend: Valida exitosamente (ADMIN)
✅ Resultado: Oferta actualizada
```

### Caso 3: Reclutador intenta editar oferta de otro
```
❌ Usuario: Reclutador_A (ID: 123)
❌ Oferta: Creada por Reclutador_B (ID: 789)
❌ Permiso: canEditDelete = false (diferentes usuarios)
❌ Botón Editar: OCULTO
❌ No puede acceder a la funcionalidad
```

---

## 5. Validaciones de Seguridad

### Frontend
```typescript
const canEditDelete =
  user?.role === "ADMIN" ||
  (user?.role === "RECLUTADOR" && user?.id === item.reclutadorId);

// ✅ Solo muestra botón si cumple condiciones
{canEditDelete && (
  <TouchableOpacity onPress={() => ...}>
    <Text>✏️ Editar</Text>
  </TouchableOpacity>
)}
```

### Backend
```java
// En OfertaService.java
public OfertaResponse actualizarOferta(Long id, OfertaCreateRequest request, Long reclutadorId) {
    Oferta oferta = ofertaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
    
    // ✅ Validación: Solo propietario o ADMIN
    if (!oferta.getReclutador().getId().equals(reclutadorId) && 
        !reclutador.getRole().equals(User.Role.ADMIN)) {
        throw new RuntimeException("No tienes permiso para editar esta oferta");
    }
    
    // Proceder con la actualización
    ...
}
```

---

## 6. Testing Manual

### Setup
```
1. [ ] Iniciar backend: mvn spring-boot:run
2. [ ] Iniciar frontend: npx expo start
3. [ ] Escanear QR en Expo Go v54
4. [ ] Login como Reclutador
```

### Test Editar Oferta
```
1. [ ] Ir a pantalla Ofertas
2. [ ] Hacer scroll y encontrar oferta propia
3. [ ] Click botón "✏️ Editar"
4. [ ] Verificar que navega a CrearOfertaScreen
5. [ ] Verificar que título dice "Editar Oferta"
6. [ ] Verificar que campos están pre-llenos
7. [ ] Cambiar título: "Ingeniero Senior" → "Ingeniero Master"
8. [ ] Cambiar salario: "5000" → "8000"
9. [ ] Click "Guardar"
10. [ ] Verificar alert: "Éxito - Oferta actualizada correctamente"
11. [ ] Verificar que vuelve a OfertasScreen
12. [ ] Verificar que lista muestra cambios
```

### Test Permisos
```
1. [ ] Login como Reclutador_A
2. [ ] Crear una oferta
3. [ ] Logout y Login como Reclutador_B
4. [ ] Ir a Ofertas
5. [ ] Buscar oferta de Reclutador_A
6. [ ] Verificar que botón "✏️ Editar" está OCULTO
7. [ ] Login como Admin
8. [ ] Ir a Ofertas
9. [ ] Buscar oferta de Reclutador_A
10. [ ] Verificar que botón "✏️ Editar" está VISIBLE
11. [ ] Editar exitosamente como Admin
```

---

## 7. Logs Esperados

### En React Native Console
```
✏️ Editando oferta: 123
Navigation: OfertasScreen → CrearOferta (ofertaId: 123)
```

### En Backend (Spring Boot)
```
GET /api/oferta/123 - Status: 200 OK
Response: { id: 123, titulo: "Desarrollador Senior", ... }

PUT /api/oferta/123?reclutadorId=456 - Status: 200 OK
Response: { id: 123, titulo: "Ingeniero Master", salario: 8000, ... }
```

### En Frontend (después de volver)
```
🔄 OfertasScreen en foco - Recargando datos...
⏳ Iniciando carga de ofertas...
📦 Ofertas recibidas del Backend: X
✅ Ofertas cargadas exitosamente: X
Título actualizado en lista: "Ingeniero Master"
Salario actualizado en lista: $8000
```

---

## ✅ Checklist de Implementación

- ✅ OfertasScreen.tsx: Botón "Editar" implementado con navegación
- ✅ CrearOfertaScreen.tsx: Soporta modo edición (carga datos y actualiza)
- ✅ Backend: Validaciones de permisos en OfertaService
- ✅ API: Endpoint PUT /api/oferta/{id} funcional
- ✅ UI: Botón visible solo para propietario o Admin
- ✅ UX: Pre-llenar campos, cambiar título, auto-sincronizar datos
- ✅ Seguridad: Validaciones en frontend y backend
- ✅ Error Handling: Alerts en caso de error

---

**Funcionalidad de Editar Oferta: ✅ COMPLETAMENTE IMPLEMENTADA**
