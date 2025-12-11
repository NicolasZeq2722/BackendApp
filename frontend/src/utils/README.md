# 📦 Carpeta Utils - Utilidades de React Native

Esta carpeta contiene todas las utilidades reutilizables para la aplicación. Está organizada en módulos específicos para mantener el código limpio y modular.

## 📂 Estructura

```
src/utils/
├── validaciones.ts      # Funciones de validación de datos
├── constantes.ts        # Constantes globales de la app
├── hooks.ts             # Hooks personalizados de React
├── apiUtils.ts          # Utilidades para manejo de API
└── README.md           # Este archivo
```

---

## 📝 Validaciones (`validaciones.ts`)

Colección de funciones para validar datos de entrada.

### Funciones disponibles:

```typescript
// Validación de email
validaciones.esEmailValido('user@example.com') // true

// Validación de teléfono (Colombia)
validaciones.esTelefonoValido('3105555555') // true
validaciones.esTelefonoValido('573105555555') // true

// Validación de contraseña (mín 8 caracteres)
validaciones.esPasswordSeguro('MiPassword123') // true

// Validación de texto no vacío
validaciones.noEstaVacio('texto') // true
validaciones.noEstaVacio('   ') // false

// Validación de números
validaciones.esNumeroPositivo('100') // true
validaciones.esNumeroPositivo('-50') // false
validaciones.esNumeroMayorQueMini('50', 10) // true

// Validación de fechas
validaciones.esFechaValida('2024-12-31') // true
validaciones.esFechaValida('31/12/2024') // false

// Validación de URLs
validaciones.esURLValida('https://ejemplo.com') // true

// Validación de longitud
validaciones.esLongitudValida('texto', 2, 10) // true (4 caracteres)
```

### Mensajes de error estandarizados:

```typescript
// Usar en validaciones de formularios
if (!validaciones.noEstaVacio(email)) {
  setError(mensajesError.requerido); // "Este campo es requerido"
}

if (!validaciones.esEmailValido(email)) {
  setError(mensajesError.emailInvalido); // "Email no es válido"
}

if (!validaciones.esPasswordSeguro(password)) {
  setError(mensajesError.passwordInseguro); // "La contraseña debe tener al menos 8 caracteres"
}
```

### Formatos para mostrar datos:

```typescript
// Moneda colombiana
formatos.formatearPeso(50000) // "COP 50.000"

// Teléfono
formatos.formatearTelefono('3105555555') // "573105555555"

// Fechas
formatos.formatearFecha('2024-12-31') // "31/12/2024"
formatos.formatearFechaISO(new Date()) // "2024-12-31"

// Truncar texto
formatos.truncar('Texto muy largo', 10) // "Texto muy..."

// Capitalizar
formatos.capitalizarPrimera('hola mundo') // "Hola mundo"

// Enums a labels
formatos.enumToLabel('TIEMPO_COMPLETO') // "Tiempo Completo"
```

---

## 🎨 Constantes (`constantes.ts`)

Constantes globales para evitar magic strings y números.

### Uso típico:

```typescript
import { API_BASE_URL, ROLES, ESTADOS_OFERTA, COLORES, NAVEGACION } from '@/utils/constantes';

// API
const url = `${API_BASE_URL}/oferta`;

// Roles
if (usuario.rol === ROLES.RECLUTADOR) {
  // mostrar pantalla de reclutador
}

// Estados
const estados = [
  ESTADOS_OFERTA.ABIERTA,
  ESTADOS_OFERTA.CERRADA,
  ESTADOS_OFERTA.PAUSADA,
];

// Colores
<View style={{ backgroundColor: COLORES.PRIMARY }}>

// Navegación
navigate(NAVEGACION.GESTION_OFERTAS);
```

### Valores disponibles:

- **API_BASE_URL**: URL base del servidor
- **NAVIGATION**: Rutas de navegación
- **ROLES**: Roles de usuario (ADMIN, EMPRESA, RECLUTADOR, ASPIRANTE)
- **ESTADOS_OFERTA**: Estados de ofertas de trabajo
- **MODALIDADES**: Tipos de modalidad (PRESENCIAL, REMOTO, HIBRIDO)
- **TIPOS_CONTRATO**: Tipos de contrato disponibles
- **NIVELES_EXPERIENCIA**: Niveles de experiencia requeridos
- **COLORES**: Paleta de colores de la app
- **TAMAÑOS_FUENTE**: Tamaños de fuente
- **ESPACIADOS**: Espacios entre elementos
- **RADIOS**: Radios de esquinas
- **DEFAULTS**: Valores por defecto
- **MENSAJES**: Mensajes genéricos

---

## 🔌 Hooks Personalizados (`hooks.ts`)

Hooks reutilizables para React Native.

### `useCarga` - Manejar estado de operaciones asíncronas

```typescript
const { cargando, error, ejecutar } = useCarga(async () => {
  return await miServicio.obtenerDatos();
});

const handleCargar = async () => {
  try {
    const datos = await ejecutar();
    console.log(datos);
  } catch (err) {
    console.error(err);
  }
};
```

### `useAlmacenamiento` - Persistencia local

```typescript
const { valor, cargando, guardar, limpiar } = useAlmacenamiento('mitoken', null);

// Guardar
await guardar('nuevo-token-123');

// Limpiar
await limpiar();
```

### `useFormulario` - Manejo de formularios

```typescript
const { valores, errores, manejarCambio, establecerError, resetear } = useFormulario({
  nombre: '',
  email: '',
  telefono: '',
});

// En un TextInput
<TextInput
  value={valores.nombre}
  onChangeText={(texto) => manejarCambio('nombre', texto)}
/>

// Validar
if (!validaciones.noEstaVacio(valores.nombre)) {
  establecerError('nombre', 'Nombre es requerido');
}

// Mostrar error
{errores.nombre && <Text style={styles.error}>{errores.nombre}</Text>}

// Resetear formulario
<TouchableOpacity onPress={resetear}>
  <Text>Limpiar</Text>
</TouchableOpacity>
```

### `useDebounce` - Debouncing de valores

```typescript
const [busqueda, setBusqueda] = useState('');
const busquedaDebounce = useDebounce(busqueda, 500);

useEffect(() => {
  // Ejecutar búsqueda después de 500ms sin cambios
  if (busquedaDebounce) {
    buscar(busquedaDebounce);
  }
}, [busquedaDebounce]);

<TextInput
  value={busqueda}
  onChangeText={setBusqueda}
  placeholder="Buscar..."
/>
```

### `usePaginacion` - Manejo de paginación

```typescript
const { paginaActual, totalPaginas, itemsVisibles, irALaSiguiente, irALaAnterior } =
  usePaginacion(10);

useEffect(() => {
  cargarItems(); // Cargar todos los items
}, []);

<FlatList
  data={itemsVisibles}
  renderItem={({ item }) => <OfertaCard oferta={item} />}
/>

<View style={styles.paginacion}>
  <Button title="← Anterior" onPress={irALaAnterior} />
  <Text>{paginaActual} de {totalPaginas}</Text>
  <Button title="Siguiente →" onPress={irALaSiguiente} />
</View>
```

### `useRefresh` - Control de refresh

```typescript
const { refrescando, onRefresh } = useRefresh();

const cargarDatos = async () => {
  await onRefresh(async () => {
    await miServicio.obtenerDatos();
  });
};

<FlatList
  data={ofertas}
  refreshControl={
    <RefreshControl refreshing={refrescando} onRefresh={cargarDatos} />
  }
/>
```

### `useModal` - Control de modales

```typescript
const { visible, abrir, cerrar } = useModal();

<TouchableOpacity onPress={abrir}>
  <Text>Abrir Modal</Text>
</TouchableOpacity>

<Modal visible={visible} animationType="slide">
  <TouchableOpacity onPress={cerrar}>
    <Text>Cerrar</Text>
  </TouchableOpacity>
</Modal>
```

### `useAlerta` - Mostrar alertas

```typescript
const { mostrarExito, mostrarError, mostrarConfirmacion } = useAlerta();

// Éxito
mostrarExito('Guardado', 'Los cambios se guardaron correctamente');

// Error
mostrarError('Error', 'No se pudieron guardar los cambios');

// Confirmación
mostrarConfirmacion(
  '¿Eliminar oferta?',
  'Esta acción no se puede deshacer',
  () => {
    // Ejecutar si acepta
    eliminarOferta();
  },
  () => {
    // Ejecutar si cancela (opcional)
  }
);
```

---

## 🌐 Utilidades de API (`apiUtils.ts`)

Funciones auxiliares para manejo de errores y requests de API.

### Mapeo de errores:

```typescript
import { mapearErrorAPI } from '@/utils/apiUtils';

try {
  await ofertaService.crear(datos);
} catch (error) {
  const mensaje = mapearErrorAPI(error);
  Alert.alert('Error', mensaje); // Error amigable para el usuario
}
```

### Reintentos automáticos:

```typescript
import { reintentar } from '@/utils/apiUtils';

const datos = await reintentar(
  () => ofertaService.obtenerOfertas(),
  3, // 3 reintentos
  1000 // 1 segundo entre reintentos
);
```

### Con timeout:

```typescript
import { conTimeout } from '@/utils/apiUtils';

try {
  const datos = await conTimeout(
    ofertaService.obtenerOfertas(),
    5000 // 5 segundos máximo
  );
} catch (error) {
  console.error('Timeout o error:', error);
}
```

### Validación de estructura:

```typescript
import { validarEstructura } from '@/utils/apiUtils';

const respuesta = await ofertaService.obtener(id);

if (validarEstructura<OfertaResponse>(respuesta, ['id', 'titulo'])) {
  // Procesar respuesta segura
} else {
  // Estructura inesperada
}
```

### Formatear parámetros de consulta:

```typescript
import { formatearParams } from '@/utils/apiUtils';

const params = formatearParams({
  busqueda: 'developer',
  estado: 'ABIERTA',
  ciudad: '', // Se omite porque está vacío
  filtro: null, // Se omite porque es null
});
// Resultado: { busqueda: 'developer', estado: 'ABIERTA' }
```

### Detectar tipo de error:

```typescript
import { esErrorAutenticacion, esErrorConexion } from '@/utils/apiUtils';

try {
  await operacion();
} catch (error) {
  if (esErrorAutenticacion(error)) {
    // Redirigir a login
    navigate('Login');
  } else if (esErrorConexion(error)) {
    // Mostrar aviso de conexión
    mostrarError('Sin conexión', 'Verifica tu internet');
  }
}
```

---

## 🚀 Ejemplos de uso integrado

### Pantalla con formulario y carga

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFormulario, useAlerta, useCarga } from '@/utils/hooks';
import { validaciones, mensajesError } from '@/utils/validaciones';
import { mapearErrorAPI } from '@/utils/apiUtils';
import { ofertaService } from '@/services/api';

export const CrearOfertaScreen = () => {
  const { valores, errores, manejarCambio, establecerError, resetear } = useFormulario({
    titulo: '',
    descripcion: '',
    salario: '',
  });

  const { mostrarExito, mostrarError } = useAlerta();
  const { cargando, ejecutar } = useCarga(ofertaService.crear);

  const validarFormulario = () => {
    let valido = true;

    if (!validaciones.noEstaVacio(valores.titulo)) {
      establecerError('titulo', mensajesError.requerido);
      valido = false;
    }

    if (!validaciones.esLongitudValida(valores.descripcion, 10, 500)) {
      establecerError('descripcion', 'Descripción entre 10 y 500 caracteres');
      valido = false;
    }

    if (!validaciones.esNumeroPositivo(valores.salario)) {
      establecerError('salario', 'Salario debe ser un número positivo');
      valido = false;
    }

    return valido;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) return;

    try {
      await ejecutar(valores);
      mostrarExito('Éxito', 'Oferta creada correctamente');
      resetear();
    } catch (error) {
      mostrarError('Error', mapearErrorAPI(error));
    }
  };

  return (
    <View>
      <TextInput
        value={valores.titulo}
        onChangeText={(t) => manejarCambio('titulo', t)}
        placeholder="Título de la oferta"
      />
      {errores.titulo && <Text style={{ color: 'red' }}>{errores.titulo}</Text>}

      <TextInput
        value={valores.descripcion}
        onChangeText={(t) => manejarCambio('descripcion', t)}
        placeholder="Descripción"
        multiline
      />
      {errores.descripcion && <Text style={{ color: 'red' }}>{errores.descripcion}</Text>}

      <TextInput
        value={valores.salario}
        onChangeText={(t) => manejarCambio('salario', t)}
        placeholder="Salario"
        keyboardType="numeric"
      />
      {errores.salario && <Text style={{ color: 'red' }}>{errores.salario}</Text>}

      <TouchableOpacity onPress={handleGuardar} disabled={cargando}>
        <Text>{cargando ? 'Guardando...' : 'Guardar'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

## 📚 Mejores prácticas

1. **Siempre usar constantes** en lugar de strings mágicos
2. **Validar en frontend** antes de enviar al servidor
3. **Mostrar mensajes amigables** usando `mensajesError`
4. **Reutilizar hooks** para reducir código duplicado
5. **Usar formatos** para mostrar datos consistentemente
6. **Mapear errores** para mejorar UX
7. **Implementar reintentos** para operaciones críticas

---

## 🔧 Extensión de utilidades

Para agregar nuevas utilidades:

1. Crear función en el archivo correspondiente
2. Exportarla correctamente
3. Documentar con JSDoc
4. Agregar ejemplo en este README

---

**Última actualización**: Diciembre 2024
