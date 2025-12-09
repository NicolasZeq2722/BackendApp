# 🎨 Sistema de Diseño Profesional - Workable

## Resumen General

Se ha implementado un **Sistema de Diseño Centralizado** basado en **Design Tokens** para la aplicación Workable. Esto asegura consistencia visual, facilita el mantenimiento y permite cambios globales de tema sin tocar el código de componentes.

---

## 📦 Estructura de Tokens

### **COLORS** - Paleta de Colores

```typescript
// Primarios (Azul)
primary: '#3B82F6'              // Azul principal
primaryDark: '#1D4ED8'          // Para gradientes y estados activos
primaryLight: '#DBEAFE'         // Para backgrounds suaves

// Secundarios (Ámbar)
secondary: '#F59E0B'            // Color ámbar
secondaryDark: '#D97706'        // Ámbar oscuro

// Éxito (Verde)
success: '#10B981'              // Verde para éxitos
successLight: '#D1FAE5'         // Verde claro

// Error (Rojo)
error: '#EF4444'                // Rojo para errores
errorLight: '#FEE2E2'           // Rojo claro

// Texto
textPrimary: '#0F172A'          // Navy (títulos, texto principal)
textSecondary: '#475569'        // Slate (subtítulos)
textLight: '#94A3B8'            // Gray claro (placeholders)

// Fondos
background: '#F8FAFC'           // Fondo general (gris cielo)
surface: '#FFFFFF'              // Tarjetas e inputs
```

### **FONTS** - Tipografía Escalable

```typescript
sizes: {
  hero: 32,          // Títulos muy grandes
  h1: 26,            // Títulos de sección
  h2: 20,            // Subtítulos
  h3: 18,            // Títulos de subsección
  body: 16,          // Texto normal
  small: 14,         // Detalles
  tiny: 12,          // Etiquetas
  caption: 11,       // Descripciones mínimas
}

weights: {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
}
```

### **SPACING** - Escala de Espaciado

```typescript
xs: 4px          // Gaps mínimos
sm: 8px          // Pequeños espacios
md: 16px         // Estándar (más usado)
lg: 24px         // Grande
xl: 32px         // Muy grande
2xl: 48px        // Extra grande
```

### **SIZES** - Tamaños de Componentes

```typescript
// Border Radius
radiusBtn: 10px          // Botones
radiusInput: 14px        // Campos de texto
radiusCard: 16px         // Tarjetas
radiusBadge: 50px        // Pills (redondas)

// Padding específico
cardPadding: 20px        // Interior de tarjetas
```

### **SHADOW_STYLES** - Sombras Multiplataforma

```typescript
// Sombra pequeña (tarjetas sutiles)
small: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 4,
  elevation: 2,          // Android
}

// Sombra estándar (tarjetas normales)
card: {                  // ← La más usada
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 12,
  elevation: 4,
}

// Sombra grande (modales)
large: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 8,
}
```

### **GRADIENTS** - Degradados para LinearGradient

```typescript
primary: ['#3B82F6', '#1D4ED8']      // Azul
secondary: ['#F59E0B', '#D97706']    // Ámbar
success: ['#10B981', '#34D399']      // Verde
error: ['#EF4444', '#DC2626']        // Rojo
```

---

## 🎯 Cómo Usar los Tokens

### En un Archivo de Estilos

```typescript
import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  SPACING,
  SIZES,
  SHADOW_STYLES,
} from './GlobalStyles';

export const myStyles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    ...SHADOW_STYLES.card,
  },

  title: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.card,
  },
});
```

### Con Gradientes (expo-linear-gradient)

```typescript
import LinearGradient from 'expo-linear-gradient';
import { GRADIENTS } from './GlobalStyles';

export default function MyComponent() {
  return (
    <LinearGradient
      colors={GRADIENTS.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 10, padding: 20 }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
        Botón con Gradiente
      </Text>
    </LinearGradient>
  );
}
```

---

## 📋 Archivos Refactorizados

| Archivo | Estado | Cambios |
|---------|--------|---------|
| `GlobalStyles.ts` | ✅ Refactorizado | Design Tokens completos + estilos globales |
| `LoginStyles.ts` | ✅ Refactorizado | Importa COLORS, FONTS, SPACING, SIZES, SHADOW_STYLES |
| `HomeStyles.ts` | ✅ Refactorizado | Header con gradiente, tarjetas de estadísticas |
| `OfertasStyles.ts` | ✅ Refactorizado | Tarjetas profesionales con sombras |
| `PostulacionesStyles.ts` | ✅ Refactorizado | Listados con Design Tokens |
| `CitacionesStyles.ts` | ✅ Refactorizado | Estados de citación (pending, confirmed) |
| `UsuariosStyles.ts` | ✅ Refactorizado | Formularios y controles de usuario |
| `CategoriesStyles.ts` | ✅ Refactorizado | Tarjetas de categorías |
| `SubcategoriesStyles.ts` | ✅ Refactorizado | Listados de subcategorías |

---

## 🎨 Paleta Visual Completa

### Colores Primarios
- **Azul**: `#3B82F6` (primary) → `#1D4ED8` (dark para gradientes)
- **Ámbar**: `#F59E0B` (secondary) → `#D97706` (dark)
- **Verde**: `#10B981` (success)
- **Rojo**: `#EF4444` (error)

### Colores Neutros
- **Navy**: `#0F172A` (textPrimary - títulos)
- **Slate**: `#475569` (textSecondary - descripción)
- **Gray Claro**: `#94A3B8` (textLight - placeholders)
- **Fondo**: `#F8FAFC` (Sky Gray muy claro)
- **Superficie**: `#FFFFFF` (blanco)

---

## 💡 Mejores Prácticas

### ✅ DO (Recomendado)

```typescript
// ✅ Usar tokens
backgroundColor: COLORS.primary
fontSize: FONTS.sizes.body
padding: SPACING.lg
borderRadius: SIZES.radiusCard
...SHADOW_STYLES.card

// ✅ Combinar múltiples tokens
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.lg,
    ...SHADOW_STYLES.card,
  },
});
```

### ❌ DON'T (No Recomendado)

```typescript
// ❌ Valores hardcodeados
backgroundColor: '#3B82F6'
fontSize: 16
padding: 24
borderRadius: 16
shadowColor: '#000'

// ❌ Incoherencia en espaciado
padding: 20  // Debería ser SPACING.lg (24)
marginBottom: 15  // Debería ser SPACING.md (16)
```

---

## 🔄 Cambiar el Tema Global

Para cambiar la paleta completa, solo edita `GlobalStyles.ts`:

```typescript
export const COLORS = {
  // Primarios - Cambiar aquí para tema oscuro
  primary: '#1E40AF',        // Azul oscuro
  primaryDark: '#0C2340',
  
  // Fondos - Para tema oscuro
  background: '#0F172A',
  surface: '#1E293B',
  // ... resto de colores
};
```

Todos los estilos se actualizarán automáticamente.

---

## 📐 Responsive Design

La escala de spacing y tamaños se adapta a diferentes dispositivos:

```typescript
// Para pantallas grandes (Tablet)
const isTablet = screenWidth > 768;
const padding = isTablet ? SPACING.xl : SPACING.lg;

// Usar siempre tokens, no valores absolutos
style={{
  padding: isTablet ? SPACING.xl : SPACING.lg,
  fontSize: isTablet ? FONTS.sizes.h1 : FONTS.sizes.h2,
}}
```

---

## 🚀 Ventajas del Sistema

1. **Consistencia Visual** - Un único lugar para definir colores, tipos, espacios
2. **Mantenimiento Fácil** - Cambios globales en un archivo
3. **Escalabilidad** - Agregar nuevas variaciones de colores es trivial
4. **Performance** - Reutilización de sombras multiplataforma
5. **Accesibilidad** - Colores y contrastes estandarizados
6. **Documentación** - Sistema autodocumentado con tokens

---

## 📝 Notas Importantes

- **Sombras**: Usa `SHADOW_STYLES` para consistencia entre iOS y Android
- **Gradientes**: Requiere `expo-linear-gradient` (ya instalado)
- **Retrocompatibilidad**: Los antiguos nombres como `Colors`, `Typography` aún funcionan
- **TypeScript**: Todos los valores están tipados correctamente

---

## 🎓 Ejemplo Completo

```typescript
import { StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import {
  COLORS,
  FONTS,
  SPACING,
  SIZES,
  SHADOW_STYLES,
  GRADIENTS,
  GlobalStyles,
} from '../styles/GlobalStyles';

export default function ExampleScreen() {
  return (
    <ScrollView style={GlobalStyles.container}>
      {/* HEADER CON GRADIENTE */}
      <LinearGradient
        colors={GRADIENTS.primary}
        style={{ padding: SPACING.lg }}
      >
        <Text style={{
          fontSize: FONTS.sizes.h1,
          fontWeight: FONTS.weights.bold,
          color: COLORS.textWhite,
        }}>
          Mi Aplicación
        </Text>
      </LinearGradient>

      {/* TARJETA */}
      <View style={{
        backgroundColor: COLORS.surface,
        margin: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: SIZES.radiusCard,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        ...SHADOW_STYLES.card,
      }}>
        <Text style={{
          fontSize: FONTS.sizes.h2,
          fontWeight: FONTS.weights.semibold,
          color: COLORS.textPrimary,
          marginBottom: SPACING.md,
        }}>
          Contenido
        </Text>
        <Text style={{
          fontSize: FONTS.sizes.body,
          color: COLORS.textSecondary,
          lineHeight: 24,
        }}>
          Descripción usando Design Tokens
        </Text>
      </View>

      {/* BOTÓN CON GRADIENTE */}
      <LinearGradient
        colors={GRADIENTS.success}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          marginHorizontal: SPACING.lg,
          borderRadius: SIZES.radiusBtn,
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: SPACING.lg,
            alignItems: 'center',
          }}
        >
          <Text style={{
            fontSize: FONTS.sizes.body,
            fontWeight: FONTS.weights.bold,
            color: COLORS.textWhite,
          }}>
            Guardar
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}
```

---

## 🤝 Contribuir

Al agregar nuevos estilos:

1. Primero verifica si el token existe en `GlobalStyles.ts`
2. Si no existe, agrégalo al token correspondiente
3. Usa el token en tu archivo de estilos
4. Documenta el cambio aquí si es relevante

---

**Última actualización**: Diciembre 8, 2024

