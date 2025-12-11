# 🛠️ UTILIDADES COMPLETAS - Guía de Referencia Rápida

## 📋 Índice
1. [Validaciones](#validaciones)
2. [Constantes](#constantes)
3. [Hooks Personalizados](#hooks)
4. [Utilidades de API](#api-utils)
5. [Configuración de Axios](#axios)
6. [Ejemplos Prácticos](#ejemplos)

---

## Validaciones

### Importar
```typescript
import { validaciones, mensajesError, formatos } from '@/utils';
```

### Métodos disponibles

| Método | Parámetros | Retorna | Descripción |
|--------|-----------|---------|-------------|
| `esEmailValido()` | email: string | boolean | Valida formato de email |
| `esTelefonoValido()` | telefono: string | boolean | Valida teléfono Colombia (10-11 dígitos) |
| `esPasswordSeguro()` | password: string | boolean | Mínimo 8 caracteres |
| `noEstaVacio()` | valor: string | boolean | Verifica que no esté vacío o solo espacios |
| `esNumeroPositivo()` | valor: string | boolean | Verifica número > 0 |
| `esNumeroMayorQueMini()` | valor: string, mínimo: number | boolean | Verifica número >= mínimo |
| `esFechaValida()` | fecha: string | boolean | Formato YYYY-MM-DD |
| `esFechaFutura()` | fecha: string | boolean | Verifica que sea posterior a hoy |
| `esURLValida()` | url: string | boolean | Valida URL |
| `esLongitudValida()` | texto, min, max | boolean | Longitud entre min-max |

### Mensajes de error estandarizados

```typescript
mensajesError.requerido                    // "Este campo es requerido"
mensajesError.emailInvalido                // "Email no es válido"
mensajesError.passwordInseguro             // "La contraseña debe tener al menos 8 caracteres"
mensajesError.telefonoInvalido             // "Teléfono no es válido"
mensajesError.numeroInvalido               // "Debe ser un número válido"
mensajesError.numeroMayorCero              // "Debe ser mayor a 0"
mensajesError.fechaInvalida                // "La fecha no es válida (usa formato YYYY-MM-DD)"
mensajesError.fechaNoFutura                // "La fecha debe ser posterior a hoy"
mensajesError.urlInvalida                  // "La URL no es válida"
mensajesError.longitudMinima(n)            // "Mínimo n caracteres"
mensajesError.longitudMaxima(n)            // "Máximo n caracteres"
```

### Formatos para mostrar datos

```typescript
formatos.formatearPeso(50000)              // "COP 50.000"
formatos.formatearTelefono('3105555555')   // "573105555555"
formatos.formatearFecha('2024-12-31')      // "31/12/2024"
formatos.formatearFechaISO(new Date())     // "2024-12-31"
formatos.truncar('Texto largo', 10)        // "Texto lar..."
formatos.capitalizarPrimera('hola')        // "Hola"
formatos.enumToLabel('TIEMPO_COMPLETO')    // "Tiempo Completo"
```

---

## Constantes

### Importar
```typescript
import { ROLES, ESTADOS_OFERTA, COLORES, NAVEGACION } from '@/utils';
```

### Disponibles

| Constante | Tipo | Valores |
|-----------|------|---------|
| `API_BASE_URL` | string | 'http://192.168.1.11:8080/api' |
| `ROLES` | object | ADMIN, EMPRESA, RECLUTADOR, ASPIRANTE |
| `ESTADOS_OFERTA` | object | ABIERTA, CERRADA, PAUSADA |
| `MODALIDADES` | object | PRESENCIAL, REMOTO, HIBRIDO |
| `TIPOS_CONTRATO` | object | TIEMPO_COMPLETO, MEDIO_TIEMPO, TEMPORAL, PRESTACION_SERVICIOS, PRACTICAS |
| `NIVELES_EXPERIENCIA` | object | SIN_EXPERIENCIA, BASICO, INTERMEDIO, AVANZADO, EXPERTO |
| `COLORES` | object | PRIMARY (#6366f1), SECONDARY, SUCCESS, ERROR, WARNING, etc |
| `TAMAÑOS_FUENTE` | object | XS (12), SM (14), BASE (16), LG (18), XL (20), XXL (24) |
| `ESPACIADOS` | object | XS (4), SM (8), BASE (12), MD (16), LG (20), XL (24), XXL (32) |
| `RADIOS` | object | SM (4), BASE (8), MD (12), LG (16), XL (20), FULL (9999) |

---

## Hooks Personalizados

### Importar
```typescript
import {
  useCarga, useAlmacenamiento, useFormulario, useDebounce,
  usePaginacion, useRefresh, useModal, useAlerta
} from '@/utils';
```

### useCarga
Maneja estado de operaciones asíncronas
```typescript
const { cargando, error, ejecutar } = useCarga(miFunction);
const resultado = await ejecutar();
```

### useAlmacenamiento
Persistencia local con AsyncStorage
```typescript
const { valor, cargando, guardar, limpiar } = useAlmacenamiento('clave', valorInicial);
await guardar(nuevoValor);
await limpiar();
```

### useFormulario
Manejo de formularios con validación
```typescript
const { valores, errores, manejarCambio, establecerError, resetear } = useFormulario({
  nombre: '', email: '', etc: ''
});
manejarCambio('nombre', 'Juan');
```

### useDebounce
Debouncing de valores (esperar a que el usuario pare de escribir)
```typescript
const [busqueda, setBusqueda] = useState('');
const busquedaDebounce = useDebounce(busqueda, 500);
// Espera 500ms sin cambios antes de usar busquedaDebounce
```

### usePaginacion
Control de paginación
```typescript
const { paginaActual, totalPaginas, itemsVisibles, irALaSiguiente } = usePaginacion(10);
```

### useRefresh
Control de refresh/recargar
```typescript
const { refrescando, onRefresh } = useRefresh();
await onRefresh(async () => { /* cargar datos */ });
```

### useModal
Control de modales
```typescript
const { visible, abrir, cerrar, alternar } = useModal();
```

### useAlerta
Mostrar alertas nativas
```typescript
const { mostrarExito, mostrarError, mostrarConfirmacion } = useAlerta();
mostrarExito('Guardado', 'Success message');
mostrarError('Error', 'Error message');
mostrarConfirmacion('¿Eliminar?', '...', () => { /* aceptar */ });
```

### useTimeout / useIntervalo
Control de timeouts e intervalos
```typescript
useTimeout(() => { console.log('ejecutado'); }, 2000);
useIntervalo(() => { console.log('cada 2s'); }, 2000, true);
```

### usePrevio
Obtener valor anterior de una variable
```typescript
const valorAnterior = usePrevio(valor);
```

---

## Utilidades de API

### Importar
```typescript
import {
  mapearErrorAPI, reintentar, conTimeout, validarEstructura,
  formatearParams, esErrorAutenticacion, esErrorConexion
} from '@/utils';
```

### Funciones principales

| Función | Uso |
|---------|-----|
| `mapearErrorAPI(error)` | Convierte errores HTTP a mensajes amigables |
| `reintentar(fn, 3, 1000)` | Reintenta una función N veces |
| `conTimeout(promesa, 5000)` | Agrega timeout a promesa |
| `validarEstructura(obj, ['id', 'nombre'])` | Valida que tenga campos requeridos |
| `formatearParams(obj)` | Limpia parámetros (remove nulls, empties) |
| `esErrorAutenticacion(error)` | Detecta si es error 401/403 |
| `esErrorConexion(error)` | Detecta si es error de red |
| `construirURL(base, ruta, params)` | Construye URL con query params |
| `parsearErroresValidacion(error)` | Extrae errores de validación |
| `transformarRespuesta(resp)` | Normaliza estructura de respuesta |

---

## Configuración de Axios

### Importar
```typescript
import {
  axiosInstance,
  guardarTokens, obtenerToken, limpiarTokens,
  tieneTokenValido, estaTokenExpirado,
  obtenerUsuarioDelToken
} from '@/utils';
```

### Características automáticas
✅ Agregar JWT Bearer token automáticamente
✅ Normalizar rutas
✅ Manejar errores globalmente
✅ Intentar refrescar token si expira (si backend lo soporta)
✅ Loguear calls en desarrollo

### Funciones disponibles

```typescript
// Autenticación
await guardarTokens(token, refreshToken);
const token = await obtenerToken();
await limpiarTokens();  // logout
const valido = await tieneTokenValido();

// JWT
const expirado = estaTokenExpirado(token);
const usuario = await obtenerUsuarioDelToken();

// Requests con reintentos
const datos = await requestConReintentos('get', '/oferta', null, 3);
```

---

## 📚 Ejemplos Prácticos

### Ejemplo 1: Pantalla de Login

```typescript
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useFormulario, useAlerta, validaciones, mensajesError, mapearErrorAPI } from '@/utils';
import { authService } from '@/services/api';

export const LoginScreen = ({ navigation }: any) => {
  const { valores, errores, manejarCambio, establecerError } = useFormulario({
    email: '',
    password: '',
  });
  const { mostrarError, mostrarExito } = useAlerta();
  const [cargando, setCargando] = useState(false);

  const validar = () => {
    if (!validaciones.esEmailValido(valores.email)) {
      establecerError('email', mensajesError.emailInvalido);
      return false;
    }
    if (!validaciones.esPasswordSeguro(valores.password)) {
      establecerError('password', mensajesError.passwordInseguro);
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validar()) return;

    setCargando(true);
    try {
      await authService.login(valores.email, valores.password);
      mostrarExito('Bienvenido', 'Iniciaste sesión exitosamente');
      navigation.replace('Home');
    } catch (error) {
      mostrarError('Error de login', mapearErrorAPI(error));
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={valores.email}
        onChangeText={(t) => manejarCambio('email', t)}
        placeholder="Email"
        keyboardType="email-address"
      />
      {errores.email && <Text style={{ color: 'red' }}>{errores.email}</Text>}

      <TextInput
        value={valores.password}
        onChangeText={(t) => manejarCambio('password', t)}
        placeholder="Contraseña"
        secureTextEntry
      />
      {errores.password && <Text style={{ color: 'red' }}>{errores.password}</Text>}

      <TouchableOpacity onPress={handleLogin} disabled={cargando}>
        <Text>{cargando ? 'Iniciando...' : 'Iniciar sesión'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Ejemplo 2: Lista con búsqueda y paginación

```typescript
import { useState, useEffect } from 'react';
import { FlatList, TextInput, View, RefreshControl } from 'react-native';
import { useDebounce, useRefresh, usePaginacion } from '@/utils';
import { ofertaService } from '@/services/api';

export const OfertasListScreen = () => {
  const [ofertas, setOfertas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const busquedaDebounce = useDebounce(busqueda, 500);
  const { refrescando, onRefresh } = useRefresh();
  const { paginaActual, itemsVisibles, irALaSiguiente, irALaAnterior } = usePaginacion(10);

  const cargar = async () => {
    try {
      const datos = await onRefresh(async () => {
        if (busquedaDebounce) {
          return await ofertaService.search(busquedaDebounce);
        } else {
          return await ofertaService.getAll();
        }
      });
      setOfertas(datos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargar();
  }, [busquedaDebounce]);

  return (
    <View>
      <TextInput
        value={busqueda}
        onChangeText={setBusqueda}
        placeholder="Buscar ofertas..."
      />

      <FlatList
        data={itemsVisibles}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={cargar} />}
        renderItem={({ item }) => <OfertaCard oferta={item} />}
      />

      {/* Paginación */}
    </View>
  );
};
```

### Ejemplo 3: Formulario con validación completa

```typescript
import { useState } from 'react';
import { View, TextInput, Picker, TouchableOpacity, Text } from 'react-native';
import {
  useFormulario,
  useAlerta,
  validaciones,
  mensajesError,
  TIPOS_CONTRATO,
  mapearErrorAPI,
} from '@/utils';
import { ofertaService } from '@/services/api';

export const CrearOfertaForm = () => {
  const { valores, errores, manejarCambio, establecerError, resetear } = useFormulario({
    titulo: '',
    salario: '',
    tipoContrato: TIPOS_CONTRATO.TIEMPO_COMPLETO,
  });
  const { mostrarExito, mostrarError } = useAlerta();
  const [cargando, setCargando] = useState(false);

  const validarFormulario = () => {
    let valido = true;

    if (!validaciones.noEstaVacio(valores.titulo)) {
      establecerError('titulo', mensajesError.requerido);
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

    setCargando(true);
    try {
      await ofertaService.create(valores);
      mostrarExito('Éxito', 'Oferta creada correctamente');
      resetear();
    } catch (error) {
      mostrarError('Error', mapearErrorAPI(error));
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={valores.titulo}
        onChangeText={(t) => manejarCambio('titulo', t)}
        placeholder="Título de la oferta"
      />
      {errores.titulo && <Text style={{ color: 'red' }}>{errores.titulo}</Text>}

      <TextInput
        value={valores.salario}
        onChangeText={(t) => manejarCambio('salario', t)}
        placeholder="Salario"
        keyboardType="numeric"
      />
      {errores.salario && <Text style={{ color: 'red' }}>{errores.salario}</Text>}

      <Picker
        selectedValue={valores.tipoContrato}
        onValueChange={(v) => manejarCambio('tipoContrato', v)}
      >
        {Object.values(TIPOS_CONTRATO).map((tipo) => (
          <Picker.Item key={tipo} label={tipo} value={tipo} />
        ))}
      </Picker>

      <TouchableOpacity onPress={handleGuardar} disabled={cargando}>
        <Text>{cargando ? 'Guardando...' : 'Guardar'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

## ✅ Checklist de implementación

Antes de usar las utilidades:

- [ ] Importar desde `@/utils`
- [ ] Configurar path alias `@` en tsconfig.json
- [ ] Revisar los tipos TypeScript
- [ ] Testear en el emulador
- [ ] Verificar errores en consola
- [ ] Validar con datos reales del backend

---

## 🔗 Referencias

- [Validaciones](./validaciones.ts)
- [Constantes](./constantes.ts)
- [Hooks](./hooks.ts)
- [API Utils](./apiUtils.ts)
- [Axios Config](./axiosConfig.ts)
- [README completo](./README.md)

---

**Última actualización**: Diciembre 2024
