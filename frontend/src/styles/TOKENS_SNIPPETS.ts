// 🎨 DESIGN TOKENS - SNIPPETS DE USO COMÚN
// Copia y pega estos ejemplos en tus pantallas

import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  SPACING,
  SIZES,
  SHADOW_STYLES,
  GRADIENTS,
  GlobalStyles,
} from './GlobalStyles';

/**
 * ============================================
 * 📦 EJEMPLOS DE COMPONENTES CON TOKENS
 * ============================================
 */

// ============================================
// 1️⃣ BOTÓN SIMPLE (sin gradiente)
// ============================================
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    alignItems: 'center',
    ...SHADOW_STYLES.card,
  },
  secondary: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  danger: {
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    alignItems: 'center',
    ...SHADOW_STYLES.card,
  },
  buttonText: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textWhite,
  },
});

// ============================================
// 2️⃣ TARJETA (CARD) - Estándar
// ============================================
export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.md,
    ...SHADOW_STYLES.card,
  },
  cardElevated: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW_STYLES.large,
  },
  cardTitle: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  cardBody: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
});

// ============================================
// 3️⃣ CAMPO DE ENTRADA (INPUT)
// ============================================
export const inputStyles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radiusInput,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  wrapperFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    ...SHADOW_STYLES.small,
  },
  wrapperError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  icon: {
    fontSize: FONTS.sizes.h3,
    color: COLORS.textLight,
    marginRight: SPACING.sm,
  },
  error: {
    color: COLORS.error,
    fontSize: FONTS.sizes.small,
    marginTop: SPACING.xs,
  },
});

// ============================================
// 4️⃣ BADGE (Etiqueta)
// ============================================
export const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusBadge,
    alignSelf: 'flex-start',
  },
  primary: {
    backgroundColor: COLORS.primaryLight,
  },
  primaryText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semibold,
  },
  success: {
    backgroundColor: COLORS.successLight,
  },
  successText: {
    color: COLORS.success,
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semibold,
  },
  error: {
    backgroundColor: COLORS.errorLight,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semibold,
  },
});

// ============================================
// 5️⃣ HEADER CON GRADIENTE
// ============================================
// En tu componente, envuelve con LinearGradient:
// <LinearGradient colors={GRADIENTS.primary} style={headerStyles.gradient}>
//   {/* contenido */}
// </LinearGradient>

export const headerStyles = StyleSheet.create({
  gradient: {
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    ...SHADOW_STYLES.large,
  },
  title: {
    fontSize: FONTS.sizes.hero,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});

// ============================================
// 6️⃣ ALERTAS Y MENSAJES
// ============================================
export const alertStyles = StyleSheet.create({
  error: {
    backgroundColor: COLORS.errorLight,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.medium,
  },
  success: {
    backgroundColor: COLORS.successLight,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  successText: {
    color: COLORS.success,
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.medium,
  },
  warning: {
    backgroundColor: COLORS.warningLight,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  warningText: {
    color: COLORS.warning,
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.medium,
  },
});

// ============================================
// 7️⃣ LISTA / ITEM
// ============================================
export const listStyles = StyleSheet.create({
  item: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    marginVertical: SPACING.xs,
    borderRadius: SIZES.radiusCard,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.small,
  },
  itemHighlight: {
    backgroundColor: COLORS.primaryVery,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  title: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
  },
  meta: {
    fontSize: FONTS.sizes.tiny,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});

// ============================================
// 8️⃣ GRID / 2 COLUMNAS
// ============================================
export const gridStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  item: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.card,
  },
  number: {
    fontSize: FONTS.sizes.h1,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

// ============================================
// 9️⃣ DIVIDER / SEPARADOR
// ============================================
export const dividerStyles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },
  vertical: {
    width: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: SPACING.md,
  },
});

// ============================================
// 🔟 TIPOGRAFÍA ÚTIL
// ============================================
export const typographyStyles = StyleSheet.create({
  // Títulos
  hero: {
    fontSize: FONTS.sizes.hero,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  h1: {
    fontSize: FONTS.sizes.h1,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
  },

  // Body
  body: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  bodyStrong: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
  },

  // Pequeños
  small: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: FONTS.sizes.caption,
    color: COLORS.textLight,
  },
});

/**
 * ============================================
 * 🎯 SNIPPETS DE USO EN COMPONENTES
 * ============================================
 */

/*
// SNIPPET 1: Pantalla básica
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { GlobalStyles, COLORS, SPACING, FONTS } from '../styles/GlobalStyles';

export default function MyScreen() {
  return (
    <ScrollView style={GlobalStyles.container}>
      <View style={{ padding: SPACING.lg }}>
        <Text style={[typographyStyles.h1, { marginBottom: SPACING.lg }]}>
          Título
        </Text>
        <Text style={typographyStyles.body}>Descripción</Text>
      </View>
    </ScrollView>
  );
}
*/

/*
// SNIPPET 2: Botón con gradiente
import LinearGradient from 'expo-linear-gradient';
import { GRADIENTS, SIZES } from '../styles/GlobalStyles';

<LinearGradient
  colors={GRADIENTS.primary}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{
    borderRadius: SIZES.radiusBtn,
    overflow: 'hidden',
  }}
>
  <TouchableOpacity
    style={{
      paddingVertical: SPACING.lg,
      paddingHorizontal: SPACING.xl,
      alignItems: 'center',
    }}
  >
    <Text style={buttonStyles.buttonText}>Guardar</Text>
  </TouchableOpacity>
</LinearGradient>
*/

/*
// SNIPPET 3: Tarjeta con contenido
<View style={cardStyles.card}>
  <Text style={cardStyles.cardTitle}>Título de Tarjeta</Text>
  <Text style={cardStyles.cardBody}>
    Contenido de la tarjeta con descripción
  </Text>
</View>
*/

/*
// SNIPPET 4: Input con label
<View style={inputStyles.container}>
  <Text style={inputStyles.label}>Email</Text>
  <View style={inputStyles.wrapper}>
    <Text style={inputStyles.icon}>📧</Text>
    <TextInput
      style={inputStyles.input}
      placeholder="tu@email.com"
      placeholderTextColor={COLORS.textLight}
    />
  </View>
</View>
*/

export default {};
