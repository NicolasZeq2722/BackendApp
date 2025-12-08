# 📋 CitacionesScreen.tsx - Código Completo Corregido

## Cambio Realizado

**Línea 19:** Agregado `usuarioService` al import

```typescript
// ❌ ANTES (Causa ReferenceError):
import { citacionService, authService, postulacionService, ofertaService } from "../services/api";

// ✅ DESPUÉS (Resuelve el error):
import { citacionService, authService, postulacionService, ofertaService, usuarioService } from "../services/api";
```

---

## Código Completo del Import Corregido

```typescript
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { citacionService, authService, postulacionService, ofertaService, usuarioService } from "../services/api";
//                                                                                      ↑ AGREGADO

const CitacionesScreen = ({ navigation }: any) => {
  const [citaciones, setCitaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCitacion, setEditingCitacion] = useState<any>(null);
  const [aspirantes, setAspirantes] = useState<any[]>([]);
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [formData, setFormData] = useState({
    detallesCitacion: "",
    fechaCitacion: new Date(),
    horaCitacion: "09:00",
    enlaceVideoLlamada: "",
    empresa: "",
    aspiranteId: "",
    ofertaId: "",
  });

  // 🔄 Cargar datos al montar
  useEffect(() => {
    cargarUsuario();
    cargarAspirantes();  // ✅ Ahora funciona sin error
    cargarOfertas();
  }, []);

  // ... resto del código del archivo ...
```

---

## Función cargarAspirantes() - Ahora Funciona

```typescript
const cargarAspirantes = async () => {
  try {
    // ✅ CAMBIO: Usar getByRole en lugar de getAll
    // Evita error 403 (acceso denegado a getAll) y trae solo aspirantes
    console.log("👥 Cargando aspirantes desde /users/role/ASPIRANTE");
    
    // ✅ AHORA FUNCIONA: usuarioService está importado
    const response = await usuarioService.getByRole("ASPIRANTE");
    
    setAspirantes(response.data || []);
    console.log("✅ Aspirantes cargados:", response.data?.length || 0);
  } catch (error) {
    console.error("❌ Error cargando aspirantes:", error);
    Alert.alert("Error", "No se pudieron cargar los aspirantes");
  }
};
```

---

## Cómo Esto se Usa en la UI (Modal)

Cuando se abre el modal para crear/editar una citación, el Picker se llena con los aspirantes cargados:

```typescript
{/* Modal Picker de Aspirantes */}
<View style={styles.pickerContainer}>
  <Text style={styles.label}>Seleccionar Aspirante:</Text>
  <Picker
    selectedValue={formData.aspiranteId}
    onValueChange={(itemValue) =>
      setFormData({ ...formData, aspiranteId: itemValue })
    }
    style={styles.picker}
  >
    <Picker.Item label="-- Seleccione un aspirante --" value="" />
    {aspirantes.map((aspirante) => (
      <Picker.Item
        key={aspirante.id}
        label={`${aspirante.nombre} ${aspirante.apellido}`}
        value={aspirante.id.toString()}
      />
    ))}
  </Picker>
</View>
```

---

## Resumen del Fix

| Aspecto | Antes | Después |
|--------|-------|---------|
| Import | Falta usuarioService | ✅ Incluído |
| Error | ReferenceError: Property 'usuarioService' doesn't exist | ✅ Sin error |
| Función | cargarAspirantes() no funciona | ✅ Funciona correctamente |
| Resultado | App crash en CitacionesScreen | ✅ App funciona sin problemas |

---

## Validación

```typescript
// Este código ahora funciona sin errores:
const cargarAspirantes = async () => {
  const response = await usuarioService.getByRole("ASPIRANTE");  // ✅ Funciona
  setAspirantes(response.data || []);
};
```

---

## ✅ Listo para Usar

El archivo `CitacionesScreen.tsx` ahora:
- ✅ Importa correctamente `usuarioService`
- ✅ Carga aspirantes sin error
- ✅ Llena el Picker correctamente
- ✅ Permite crear/editar citaciones con aspirante seleccionado
