// 📋 GUÍA DE INTEGRACIÓN - Cómo usar tokens en tus pantallas
// Paso a paso para implementar el Design System

/**
 * =============================================
 * PASO 1: IMPORTAR LOS TOKENS
 * =============================================
 */

// En CUALQUIER archivo de pantalla, agrega estos imports:
import {
  COLORS,
  FONTS,
  SPACING,
  SIZES,
  SHADOW_STYLES,
  GRADIENTS,
  GlobalStyles,
} from '../styles/GlobalStyles';

// Luego puedes crear tu propio archivo de estilos:
const styles = StyleSheet.create({
  // tus estilos aquí
});

/**
 * =============================================
 * PASO 2: REEMPLAZAR VALORES HARDCODEADOS
 * =============================================
 */

// ❌ ANTES (hardcodeado)
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3B82F6',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
});

// ✅ DESPUÉS (con tokens)
const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,        // ← token de color
    padding: SPACING.lg,                    // ← token de espaciado
    borderRadius: SIZES.radiusCard,         // ← token de radio
    ...SHADOW_STYLES.card,                  // ← token de sombra
  },
  title: {
    fontSize: FONTS.sizes.h1,               // ← token de tamaño
    fontWeight: FONTS.weights.bold,         // ← token de peso
    color: COLORS.textPrimary,              // ← token de color
    marginBottom: SPACING.md,                // ← token de espaciado
  },
  button: {
    backgroundColor: COLORS.success,        // ← token de color
    paddingVertical: SPACING.sm,            // ← token de espaciado
    paddingHorizontal: SPACING.lg,          // ← token de espaciado
    borderRadius: SIZES.radiusBtn,          // ← token de radio
  },
});

/**
 * =============================================
 * PASO 3: USAR GLOBALSTYLES CUANDO SEA POSIBLE
 * =============================================
 */

// Si necesitas un container, usa:
<View style={GlobalStyles.container}>
  {/* contenido */}
</View>

// Si necesitas un botón:
<TouchableOpacity style={GlobalStyles.buttonPrimary}>
  <Text style={GlobalStyles.buttonText}>Enviar</Text>
</TouchableOpacity>

// Si necesitas una tarjeta:
<View style={GlobalStyles.card}>
  <Text style={GlobalStyles.h2Title}>Título</Text>
  <Text style={GlobalStyles.bodyText}>Contenido</Text>
</View>

// Si necesitas centrar contenido:
<View style={GlobalStyles.center}>
  {/* contenido centrado */}
</View>

/**
 * =============================================
 * PASO 4: COLORES SEGÚN EL CONTEXTO
 * =============================================
 */

// PRINCIPAL - Acciones importantes
backgroundColor: COLORS.primary              // Botones principales
borderColor: COLORS.primary                  // Bordes activos
color: COLORS.primary                        // Texto enfatizado

// SECUNDARIO - Acentos
backgroundColor: COLORS.secondary            // Elementos destacados
borderColor: COLORS.secondary                // Bordes acentuados

// SUCCESS - Confirmación
backgroundColor: COLORS.successLight         // Background de éxito
color: COLORS.success                        // Texto de éxito
borderColor: COLORS.success                  // Border de éxito

// ERROR - Errores/Problemas
backgroundColor: COLORS.errorLight           // Background de error
color: COLORS.error                          // Texto de error
borderColor: COLORS.error                    // Border de error

// WARNING - Advertencias
backgroundColor: COLORS.warningLight         // Background de advertencia
color: COLORS.warning                        // Texto de advertencia

// INFO - Información
backgroundColor: COLORS.infoLight            // Background de info
color: COLORS.info                           // Texto de info

// TEXTO
color: COLORS.textPrimary                    // Texto principal (negro)
color: COLORS.textSecondary                  // Texto secundario (gris)
color: COLORS.textLight                      // Texto deshabilitado (gris claro)
color: COLORS.textWhite                      // Texto sobre colores oscuros

/**
 * =============================================
 * PASO 5: ESPACIADO CONSISTENTE
 * =============================================
 */

// Nunca use números aleatorios para espaciado:
// ❌ padding: 23
// ❌ margin: 13
// ❌ gap: 7

// Use la escala:
padding: SPACING.xs        // 4px - Muy pequeño
padding: SPACING.sm        // 8px - Pequeño
padding: SPACING.md        // 16px - Medio
padding: SPACING.lg        // 24px - Grande
padding: SPACING.xl        // 32px - Muy grande
padding: SPACING['2xl']    // 48px - Extra grande
padding: SPACING['3xl']    // 64px - Enorme

// Combine para espaciado selectivo:
paddingHorizontal: SPACING.lg      // 24px left/right
paddingVertical: SPACING.sm        // 8px top/bottom
marginBottom: SPACING.md           // 16px bottom
marginTop: SPACING.lg              // 24px top
gap: SPACING.md                    // 16px entre items

/**
 * =============================================
 * PASO 6: TIPOGRAFÍA CORRECTA
 * =============================================
 */

// COMBINA TAMAÑO + PESO:

// Títulos Grandes
{
  fontSize: FONTS.sizes.hero,        // 32px
  fontWeight: FONTS.weights.bold,    // 700
  color: COLORS.textPrimary,
}

// Títulos H1
{
  fontSize: FONTS.sizes.h1,          // 28px
  fontWeight: FONTS.weights.bold,    // 700
  color: COLORS.textPrimary,
}

// Títulos H2
{
  fontSize: FONTS.sizes.h2,          // 24px
  fontWeight: FONTS.weights.semibold,// 600
  color: COLORS.textPrimary,
}

// Títulos H3 (subtítulos)
{
  fontSize: FONTS.sizes.h3,          // 20px
  fontWeight: FONTS.weights.semibold,// 600
  color: COLORS.textPrimary,
}

// Body (texto normal)
{
  fontSize: FONTS.sizes.body,        // 16px
  fontWeight: FONTS.weights.regular, // 400
  color: COLORS.textSecondary,
  lineHeight: 24,
}

// Body Bold (énfasis)
{
  fontSize: FONTS.sizes.body,        // 16px
  fontWeight: FONTS.weights.semibold,// 600
  color: COLORS.textPrimary,
}

// Small (labels, ayuda)
{
  fontSize: FONTS.sizes.small,       // 14px
  fontWeight: FONTS.weights.semibold,// 600
  color: COLORS.textSecondary,
}

// Caption (notas pequeñas)
{
  fontSize: FONTS.sizes.caption,     // 11px
  fontWeight: FONTS.weights.regular, // 400
  color: COLORS.textLight,
}

/**
 * =============================================
 * PASO 7: SOMBRAS EN TODAS LAS PLATAFORMAS
 * =============================================
 */

// Siempre usa SHADOW_STYLES (incluye elevation para Android):

// Para elementos pequeños:
...SHADOW_STYLES.small

// Para tarjetas (MÁS COMÚN):
...SHADOW_STYLES.card

// Para elementos grandes:
...SHADOW_STYLES.large

// Para overlays/modales:
...SHADOW_STYLES.xlarge

// Ejemplo:
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.lg,
    ...SHADOW_STYLES.card,  // ← Spread operator incluye iOS + Android
  },
});

/**
 * =============================================
 * PASO 8: GRADIENTES (LINEAL)
 * =============================================
 */

// INSTALADO: expo-linear-gradient (ya está en package.json)

import LinearGradient from 'expo-linear-gradient';

// EJEMPLO COMPLETO:
<LinearGradient
  colors={GRADIENTS.primary}           // ['#3B82F6', '#1D4ED8']
  start={{ x: 0, y: 0 }}               // Arriba-izquierda
  end={{ x: 1, y: 1 }}                 // Abajo-derecha
  style={{
    borderRadius: SIZES.radiusCard,
    overflow: 'hidden',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  }}
>
  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
    Contenido con gradiente
  </Text>
</LinearGradient>

// GRADIENTES DISPONIBLES:
GRADIENTS.primary    // ['#3B82F6', '#1D4ED8'] Azul
GRADIENTS.secondary  // ['#F59E0B', '#D97706'] Ámbar
GRADIENTS.success    // ['#10B981', '#047857'] Verde
GRADIENTS.error      // ['#EF4444', '#DC2626'] Rojo
GRADIENTS.info       // ['#06B6D4', '#0369A1'] Cian
GRADIENTS.warm       // ['#F59E0B', '#F59E0B'] Ámbar (sin gradiente)

/**
 * =============================================
 * PASO 9: ESTADOS (Hover, Active, Error)
 * =============================================
 */

// ESTADO NORMAL -> PRESIONADO
const [pressed, setPressed] = useState(false);

<TouchableOpacity
  onPressIn={() => setPressed(true)}
  onPressOut={() => setPressed(false)}
  style={pressed ? styles.buttonPressed : styles.button}
>
  <Text style={styles.buttonText}>Guardar</Text>
</TouchableOpacity>

// CON ESTILOS:
const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    ...SHADOW_STYLES.card,
  },
  buttonPressed: {
    backgroundColor: COLORS.primaryDark,  // ← Color oscuro al presionar
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    ...SHADOW_STYLES.small,  // ← Sombra más pequeña
    opacity: 0.9,
  },
});

// ESTADO ERROR EN INPUT:
const [error, setError] = useState(false);

<View style={error ? styles.inputError : styles.inputWrapper}>
  <TextInput
    style={styles.input}
    onChangeText={(text) => {
      setError(!text.includes('@'));
    }}
  />
</View>

const styles = StyleSheet.create({
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radiusInput,
    padding: SPACING.md,
  },
  inputError: {
    borderWidth: 2,
    borderColor: COLORS.error,           // ← Borde rojo
    backgroundColor: COLORS.errorLight,   // ← Fondo rojo claro
    borderRadius: SIZES.radiusInput,
    padding: SPACING.md,
  },
  error: {
    color: COLORS.error,
    fontSize: FONTS.sizes.small,
    marginTop: SPACING.xs,
  },
});

/**
 * =============================================
 * PASO 10: EJEMPLO COMPLETO (LoginScreen)
 * =============================================
 */

/*
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleLogin = () => {
    setEmailError(!email.includes('@'));
    // ... lógica de login
  };

  return (
    <ScrollView style={{ backgroundColor: COLORS.background }}>
      // HEADER GRADIENTE
      <LinearGradient
        colors={GRADIENTS.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>Iniciar Sesión</Text>
      </LinearGradient>

      // CONTENIDO
      <View style={{ padding: SPACING.lg }}>
        // EMAIL INPUT
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={[
            styles.inputWrapper,
            emailError && styles.inputError,
          ]}>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          {emailError && (
            <Text style={styles.errorText}>Email inválido</Text>
          )}
        </View>

        // PASSWORD INPUT
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        // BOTÓN LOGIN
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={handleLogin}
        >
          <LinearGradient
            colors={GRADIENTS.primary}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Ingresar</Text>
          </LinearGradient>
        </TouchableOpacity>

        // SIGNUP LINK
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingVertical: SPACING['2xl'],
    paddingHorizontal: SPACING.lg,
    ...SHADOW_STYLES.large,
  },
  title: {
    fontSize: FONTS.sizes.hero,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radiusInput,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    ...SHADOW_STYLES.small,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
    backgroundColor: COLORS.errorLight,
  },
  input: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.small,
    marginTop: SPACING.xs,
  },
  buttonWrapper: {
    marginTop: SPACING.xl,
    borderRadius: SIZES.radiusBtn,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    ...SHADOW_STYLES.card,
  },
  buttonText: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textWhite,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING['2xl'],
  },
  footerText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
  },
  linkText: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.primary,
  },
});
*/

/**
 * =============================================
 * CHECKLIST: ¿HICISTE TODO?
 * =============================================
 */

/*
✅ Importaste COLORS, FONTS, SPACING, SIZES, SHADOW_STYLES, GRADIENTS
✅ Reemplazaste colores hardcodeados con tokens de COLORS
✅ Reemplazaste números de padding/margin con SPACING
✅ Reemplazaste fontSize/fontWeight con FONTS
✅ Reemplazaste borderRadius con SIZES
✅ Usaste ...SHADOW_STYLES en lugar de shadowColor/shadowOffset
✅ Usaste LinearGradient con GRADIENTS para elementos con gradiente
✅ No hay ningún color en formato #XXXXXX en tus estilos
✅ No hay números aleatorios de espaciado (4, 7, 13, 23, etc)
✅ Usaste GlobalStyles.container, .card, .buttonPrimary cuando fue posible
✅ Documentaste tus estilos personalizados en los comentarios
*/

export default {};
