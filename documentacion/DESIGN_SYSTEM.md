# 🎨 Sistema de Diseño - Workable App

## 📋 Resumen Ejecutivo

Se ha implementado un **sistema de diseño completo y modular** para la aplicación Workable, asegurando consistencia visual y facilitando la reutilización de componentes en toda la aplicación.

### ✨ Características Implementadas

- ✅ **Paleta de colores** organizada y semántica (30+ colores)
- ✅ **Sistema de tipografía** con 14 niveles de escala
- ✅ **Tokens de espaciado** y dimensiones
- ✅ **Componentes reutilizables** (GradientButton, Card, TextInput)
- ✅ **Soporte para gradientes** con expo-linear-gradient
- ✅ **Temas de sombras** para iOS y Android
- ✅ **TypeScript** completamente tipado
- ✅ **Ejemplos de uso** documentados

---

## 🏗️ Estructura del Proyecto

```
frontend/src/
├── theme/                      # Sistema de diseño centralizado
│   ├── colors.ts              # Paleta de colores + gradientes
│   ├── typography.ts          # Sistema de tipografía
│   ├── spacing.ts             # Espaciado, radios, sombras
│   └── index.ts               # Export central del tema
│
├── components/                 # Componentes reutilizables
│   ├── GradientButton.tsx      # Botón con gradiente
│   ├── Card.tsx               # Contenedor estilizado
│   ├── TextInput.tsx          # Input de texto
│   └── index.ts               # Export de componentes
│
└── DESIGN_SYSTEM_USAGE.tsx    # Ejemplos de uso
```

---

## 🎯 Uso Rápido

### 1️⃣ Importar Componentes

```tsx
import { GradientButton, Card, TextInput } from '../components';
import { Colors, Typography, Spacing } from '../theme';
```

### 2️⃣ Usar GradientButton

```tsx
<GradientButton
  title="Iniciar Sesión"
  onPress={handleLogin}
  variant="primary"    // 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
  size="lg"           // 'sm' | 'md' | 'lg'
  loading={isLoading}
  disabled={isDisabled}
/>
```

### 3️⃣ Usar Card

```tsx
<Card elevated padding={Spacing.lg}>
  <Text>Contenido importante</Text>
  <GradientButton title="Acción" onPress={() => {}} />
</Card>
```

### 4️⃣ Usar TextInput

```tsx
<TextInput
  label="Usuario"
  placeholder="Ingresa tu usuario"
  value={username}
  onChangeText={setUsername}
  error={errors.username}
  keyboardType="default"
/>
```

---

## 🎨 Paleta de Colores

### Colores Primarios

| Variable | Hex | Uso |
|----------|-----|-----|
| `Colors.Primary` | `#3B82F6` | Botones, links, acciones |
| `Colors.PrimaryDark` | `#1D4ED8` | Hover, active |
| `Colors.PrimaryLight` | `#DBEAFE` | Fondos destacados |

### Colores de Estado

| Variable | Hex | Uso |
|----------|-----|-----|
| `Colors.Success` | `#10B981` | Éxito, validación |
| `Colors.Error` | `#EF4444` | Errores, eliminación |
| `Colors.Warning` | `#F59E0B` | Advertencias |
| `Colors.Info` | `#06B6D4` | Información |

### Colores Neutros

| Variable | Hex | Uso |
|----------|-----|-----|
| `Colors.White` | `#FFFFFF` | Fondos principales |
| `Colors.TextDark` | `#0F172A` | Texto principal |
| `Colors.TextLight` | `#9CA3AF` | Texto secundario |
| `Colors.BorderLight` | `#E2E8F0` | Bordes |

---

## 📝 Sistema de Tipografía

### Escala de Tamaños

```typescript
// Headings
Typography.heroLarge    // 40px - Héroe grande
Typography.h1          // 28px - Heading 1
Typography.h2          // 26px - Heading 2
Typography.h3          // 22px - Heading 3
Typography.h4          // 18px - Heading 4

// Body
Typography.bodyLarge   // 18px - Texto grande
Typography.body        // 16px - Texto normal
Typography.bodySmall   // 14px - Texto pequeño

// Labels & Captions
Typography.labelMedium // 12px - Etiqueta estándar
Typography.caption     // 12px - Pie de foto
Typography.captionSmall // 11px - Pie de foto pequeño
```

### Uso en Estilos

```tsx
const styles = StyleSheet.create({
  title: {
    ...Typography.h1,
    color: Colors.TextDark,
    marginBottom: Spacing.md,
  },
  
  subtitle: {
    ...Typography.h3,
    color: Colors.TextLight,
  },
  
  body: {
    ...Typography.body,
    color: Colors.TextDark,
    lineHeight: 24,
  },
});
```

---

## 📏 Sistema de Espaciado

```typescript
Spacing.xs      // 4px   - Micro espacios
Spacing.sm      // 8px   - Pequeño
Spacing.md      // 12px  - Mediano
Spacing.lg      // 16px  - Grande
Spacing.xl      // 24px  - Muy grande
Spacing.xxl     // 32px  - Gigante
Spacing.xxxl    // 48px  - Super gigante
```

---

## 🔴 Border Radius

```typescript
BorderRadius.sm     // 8px   - Inputs pequeños
BorderRadius.md     // 12px  - Estándar
BorderRadius.lg     // 14px  - Inputs/Botones
BorderRadius.xl     // 16px  - Tarjetas
BorderRadius.xxl    // 20px  - Más redondeado
BorderRadius.full   // 999px - Circular
```

---

## 🎯 Componentes Detallados

### GradientButton

**Props:**
```typescript
interface GradientButtonProps {
  title: string;                          // Texto del botón (requerido)
  onPress: () => void;                    // Callback de click (requerido)
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;                      // Estilos adicionales
  textStyle?: TextStyle;                  // Estilos de texto
  loading?: boolean;                      // Mostrar spinner
  disabled?: boolean;                     // Deshabilitar botón
  icon?: React.ReactNode;                 // Icono (Ionicons, etc)
  iconPosition?: 'left' | 'right';        // Posición del icono
}
```

**Ejemplos:**
```tsx
// Botón primary grande
<GradientButton
  title="Guardar"
  onPress={handleSave}
  size="lg"
/>

// Botón outline
<GradientButton
  title="Cancelar"
  onPress={handleCancel}
  variant="outline"
/>

// Botón con icono
<GradientButton
  title="Continuar"
  onPress={handleContinue}
  icon={<Ionicons name="arrow-forward" size={20} color="white" />}
  iconPosition="right"
/>

// Botón loading
<GradientButton
  title="Enviando..."
  onPress={() => {}}
  loading={isSubmitting}
  disabled={isSubmitting}
/>
```

---

### Card

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;        // Contenido (requerido)
  style?: ViewStyle;               // Estilos adicionales
  elevated?: boolean;              // Aumentar sombra
  onPress?: () => void;            // Hacer la tarjeta clickeable
  borderColor?: string;            // Color de borde
  padding?: number;                // Padding interno
}
```

**Ejemplos:**
```tsx
// Card simple
<Card padding={Spacing.lg}>
  <Text style={styles.title}>Oferta Disponible</Text>
  <Text>Descripción de la oferta</Text>
</Card>

// Card elevada con click
<Card elevated onPress={() => navigation.navigate('Details')}>
  <Text>Contenido clickeable</Text>
</Card>

// Card con padding custom
<Card padding={Spacing.xl} borderColor={Colors.Primary}>
  <GradientButton title="Acción" onPress={() => {}} />
</Card>
```

---

### TextInput

**Props:**
```typescript
interface TextInputProps {
  placeholder?: string;             // Placeholder text
  value?: string;                   // Valor actual
  onChangeText?: (text: string) => void; // Callback de cambio
  style?: ViewStyle;               // Estilos container
  inputStyle?: TextStyle;          // Estilos input
  error?: string;                  // Mensaje de error
  label?: string;                  // Etiqueta arriba
  icon?: React.ReactNode;          // Icono izquierdo
  secureTextEntry?: boolean;       // Para contraseñas
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  editable?: boolean;              // Editable o no
  multiline?: boolean;             // Multi-línea
  numberOfLines?: number;          // Número de líneas
  maxLength?: number;              // Máximo caracteres
  disabled?: boolean;              // Deshabilitar
}
```

**Ejemplos:**
```tsx
// Input simple
<TextInput
  placeholder="Ingresa tu nombre"
  value={name}
  onChangeText={setName}
/>

// Input con label y error
<TextInput
  label="Email"
  placeholder="tu@email.com"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  keyboardType="email-address"
/>

// Input password
<TextInput
  label="Contraseña"
  placeholder="••••••••"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
/>

// Input con icono
<TextInput
  placeholder="Buscar..."
  value={search}
  onChangeText={setSearch}
  icon={<Ionicons name="search" size={20} color={Colors.Primary} />}
/>
```

---

## 🎯 Patrones Comunes

### Formulario de Login

```tsx
import { GradientButton, Card, TextInput } from '../components';
import { Colors, Spacing } from '../theme';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email requerido';
    if (!password) newErrors.password = 'Contraseña requerida';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // API call...
    setLoading(false);
  };

  return (
    <Card padding={Spacing.xl}>
      <TextInput
        label="Email"
        placeholder="tu@email.com"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
      />

      <TextInput
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
      />

      <GradientButton
        title="Iniciar Sesión"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        size="lg"
        style={{ marginTop: Spacing.lg }}
      />
    </Card>
  );
}
```

### Lista de Tarjetas

```tsx
export function OfertasList() {
  const [ofertas] = useState([...]);

  return (
    <ScrollView>
      {ofertas.map((oferta) => (
        <Card
          key={oferta.id}
          elevated
          onPress={() => navigation.navigate('Details', { id: oferta.id })}
          style={{ marginVertical: Spacing.md }}
        >
          <Text style={styles.title}>{oferta.titulo}</Text>
          <Text style={styles.description}>{oferta.descripcion}</Text>
          
          <View style={{ flexDirection: 'row', gap: Spacing.md }}>
            <GradientButton
              title="Ver"
              onPress={() => {}}
              size="sm"
              style={{ flex: 1 }}
            />
            <GradientButton
              title="Postularme"
              onPress={() => {}}
              variant="success"
              size="sm"
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}
```

---

## 🔄 Migración de Estilos Antiguos

Para migrar de estilos antiguos a los nuevos componentes:

### Antes (Estilo Antiguo)
```tsx
<TouchableOpacity onPress={handleLogin}>
  <Text style={styles.buttonText}>Iniciar Sesión</Text>
</TouchableOpacity>

<View style={styles.card}>
  <TextInput
    style={styles.input}
    placeholder="Usuario"
    value={username}
    onChangeText={setUsername}
  />
</View>
```

### Después (Nuevo Sistema)
```tsx
<GradientButton
  title="Iniciar Sesión"
  onPress={handleLogin}
/>

<Card>
  <TextInput
    placeholder="Usuario"
    value={username}
    onChangeText={setUsername}
  />
</Card>
```

---

## 📱 Consideraciones de Plataforma

### Sombras (iOS vs Android)

```tsx
// iOS - shadowOffset
shadowColor: "#000",
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,

// Android - elevation
elevation: 4,
```

Los componentes manejan esto automáticamente con `Platform.OS`.

### Keyboard Aware Scrolling

Para formularios largos, usa `KeyboardAvoidingView`:

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  {/* Tu formulario */}
</KeyboardAvoidingView>
```

---

## 🧪 Testing de Componentes

```tsx
import { render } from '@testing-library/react-native';
import GradientButton from '../components/GradientButton';

describe('GradientButton', () => {
  it('renderiza correctamente', () => {
    const { getByText } = render(
      <GradientButton title="Test" onPress={() => {}} />
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('llama onPress cuando se toca', () => {
    const mockFn = jest.fn();
    const { getByText } = render(
      <GradientButton title="Test" onPress={mockFn} />
    );
    fireEvent.press(getByText('Test'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

---

## 🚀 Próximas Mejoras

- [ ] Componentes adicionales (Modal, Alert, Toast)
- [ ] Dark mode support
- [ ] Animaciones avanzadas
- [ ] Componentes de tabla/lista
- [ ] Accesibilidad mejorada
- [ ] Theme switching en runtime
- [ ] Storybook integration

---

## 📚 Recursos

- **Archivo de ejemplos:** `DESIGN_SYSTEM_USAGE.tsx`
- **Colores:** `theme/colors.ts`
- **Tipografía:** `theme/typography.ts`
- **Espaciado:** `theme/spacing.ts`
- **Componentes:** `components/`

---

## ✅ Checklist de Implementación

- ✅ Crear estructura de carpetas
- ✅ Definir paleta de colores
- ✅ Crear sistema de tipografía
- ✅ Crear tokens de espaciado
- ✅ Implementar GradientButton
- ✅ Implementar Card
- ✅ Implementar TextInput
- ✅ Crear ejemplos de uso
- ✅ Documentar el sistema
- ⏳ Migrar pantallas a nuevos componentes
- ⏳ Testing de componentes

---

**Última actualización:** 2024
**Versión:** 1.0.0
**Mantenedor:** Sistema de Diseño Workable
