import { StyleSheet } from 'react-native';

/**
 * ============================================
 * 🎨 DESIGN TOKENS - SISTEMA DE DISEÑO
 * ============================================
 * Fuente centralizada de verdad para colores, tipografía, espaciado y más.
 */

// ============================================
// 🎭 PALETA DE COLORES
// ============================================
export const COLORS = {
  // Primarios (Blue - Azul Profesional)
  primary: '#3B82F6',          // Azul principal
  primaryDark: '#1D4ED8',      // Azul oscuro (estados activos, gradientes)
  primaryLight: '#DBEAFE',     // Azul claro (backgrounds, estados hover)
  primaryVery: '#EFF6FF',      // Azul muy claro (backgrounds suaves)

  // Secundarios (Amber - Ámbar/Dorado)
  secondary: '#F59E0B',        // Ámbar secundario
  secondaryDark: '#D97706',    // Ámbar oscuro (gradientes)
  secondaryLight: '#FEF3C7',   // Ámbar claro (backgrounds)

  // Éxito (Green)
  success: '#10B981',          // Verde éxito
  successDark: '#34D399',      // Verde oscuro/claro
  successLight: '#D1FAE5',     // Verde muy claro

  // Error (Red)
  error: '#EF4444',            // Rojo error
  errorDark: '#DC2626',        // Rojo oscuro
  errorLight: '#FEE2E2',       // Rojo claro

  // Warning (Amber)
  warning: '#F59E0B',          // Aviso/Warning
  warningLight: '#FEF3C7',     // Warning claro

  // Info (Cyan)
  info: '#06B6D4',             // Información (cyan/turquesa)
  infoLight: '#CFFAFE',        // Info claro

  // Neutros & Fondos
  background: '#F8FAFC',       // Fondo general (Sky Gray muy claro)
  surface: '#FFFFFF',          // Superficie blanca (Cards, Inputs)
  cardBorder: '#E2E8F0',       // Borde específico de tarjetas
  inputBorder: '#CBD5E1',      // Borde para inputs
  divider: '#E2E8F0',          // Línea divisoria

  // Texto
  textPrimary: '#0F172A',      // Navy (Títulos, texto principal)
  textSecondary: '#475569',    // Slate (Subtítulos, descripciones)
  textLight: '#94A3B8',        // Divider Gray (Placeholders, desactivado)
  textWhite: '#FFFFFF',        // Texto sobre fondos oscuros
  textInverse: '#1E293B',      // Texto inverso (sobre colores claros)

  // Grises (Escala completa)
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Overlay para modales y componentes
  overlayDark: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
};

// ============================================
// 🌈 GRADIENTES (para expo-linear-gradient)
// ============================================
export const GRADIENTS = {
  primary: [COLORS.primary, COLORS.primaryDark],           // Azul
  secondary: [COLORS.secondary, COLORS.secondaryDark],     // Ámbar
  success: [COLORS.success, COLORS.successDark],           // Verde
  error: [COLORS.error, COLORS.errorDark],                 // Rojo
  info: [COLORS.info, COLORS.primary],                     // Cian -> Azul
  warm: [COLORS.secondary, COLORS.warning],                // Ámbar cálido
};

// ============================================
// 📝 TIPOGRAFÍA
// ============================================
export const FONTS = {
  sizes: {
    hero: 32,        // Títulos muy grandes
    h1: 26,          // Títulos de sección principal
    h2: 20,          // Subtítulos
    h3: 18,          // Títulos de subsección
    body: 16,        // Texto normal / body
    small: 14,       // Badges, detalles
    tiny: 12,        // Etiquetas muy pequeñas
    caption: 11,     // Descripciones mínimas
  },
  weights: {
    regular: '400' as '400',
    medium: '500' as '500',
    semibold: '600' as '600',
    bold: '700' as '700',
    heavy: '800' as '800',
  },
};

// Para retrocompatibilidad con código existente
export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400' as '400',
    medium: '500' as '500',
    semibold: '600' as '600',
    bold: '700' as '700',
  },
};

// ============================================
// 🔲 ESPACIADO
// ============================================
export const SPACING = {
  xs: 4,       // 4px - gaps mínimos
  sm: 8,       // 8px - pequeños espacios
  md: 16,      // 16px - espaciado estándar
  lg: 24,      // 24px - espaciado grande
  xl: 32,      // 32px - muy grande
  '2xl': 48,   // 48px - extra grande
  '3xl': 64,   // 64px - máximo
};

export const Spacing = SPACING; // Retrocompatibilidad

// ============================================
// 🎯 TAMAÑOS & BORDES
// ============================================
export const SIZES = {
  // Márgenes y Paddings
  base: 8,
  padding: 16,         // Relleno estándar de contenedores
  cardPadding: 20,     // Relleno específico de tarjetas

  // Border Radius
  radiusBtn: 10,       // Botones
  radiusInput: 14,     // Campos de texto
  radiusCard: 16,      // Tarjetas
  radiusBadge: 50,     // Badges (pill shape)
};

export const Border = {
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  width: {
    thin: 1,
    medium: 2,
    thick: 4,
  },
};

// ============================================
// 🎭 SOMBRAS (MULTIPLATAFORMA)
// ============================================
export const SHADOW_STYLES = {
  // Sombra pequeña (cards sutiles)
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  // Sombra estándar (tarjetas normales - lo más usado)
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },

  // Sombra grande (modales, popups)
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },

  // Sombra extra (dialogs importantes)
  xlarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
};

// Retrocompatibilidad
export const Shadows = {
  small: SHADOW_STYLES.small,
  medium: SHADOW_STYLES.card,
  large: SHADOW_STYLES.large,
};

// ============================================
// 🎯 ESTILOS GLOBALES REUTILIZABLES
// ============================================
export const GlobalStyles = StyleSheet.create({
  // ===== CONTENEDORES =====
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
  },

  // ===== BOTONES =====
  // NOTA: Para botones principales con gradiente, envuelve en <LinearGradient>
  buttonPrimary: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    ...SHADOW_STYLES.card,
  },
  buttonPrimaryDisabled: {
    opacity: 0.5,
  },
  buttonSecondary: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Border.width.thin,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.small,
  },
  buttonOutline: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonDanger: {
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW_STYLES.card,
  },
  buttonSuccess: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW_STYLES.card,
  },

  // Textos de botones
  buttonTextPrimary: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
  },
  buttonTextSecondary: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
  },
  buttonTextOutline: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
  },
  buttonTextDanger: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
  },
  buttonTextSuccess: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
  },

  // ===== TARJETAS (CARDS) =====
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SIZES.cardPadding,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.card,
  },
  cardElevated: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SIZES.cardPadding,
    marginBottom: SPACING.md,
    ...SHADOW_STYLES.large,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardBody: {
    paddingVertical: SPACING.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },

  // ===== INPUTS =====
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radiusInput,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.surface,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  inputIcon: {
    fontSize: FONTS.sizes.h3,
    color: COLORS.textLight,
    marginRight: SPACING.sm,
  },
  inputError: {
    color: COLORS.error,
    fontSize: FONTS.sizes.small,
    marginTop: SPACING.xs,
  },

  // ===== TIPOGRAFÍA =====
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
  small: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: FONTS.sizes.caption,
    color: COLORS.textLight,
  },

  // ===== ESTADOS =====
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  errorContainer: {
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
    textAlign: 'left',
    fontWeight: FONTS.weights.medium,
  },
  successContainer: {
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
    textAlign: 'left',
    fontWeight: FONTS.weights.medium,
  },
  warningContainer: {
    backgroundColor: COLORS.warningLight,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },

  // ===== LISTAS =====
  listItem: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    marginVertical: SPACING.xs,
    borderRadius: SIZES.radiusCard,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.small,
  },
  listItemTitle: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  listItemSubtitle: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
  },
  listItemHighlight: {
    backgroundColor: COLORS.primaryVery,
    borderColor: COLORS.primary,
  },

  // ===== HEADERS =====
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    ...SHADOW_STYLES.large,
  },
  headerTitle: {
    fontSize: FONTS.sizes.h1,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: SPACING.sm,
  },

  // ===== BADGES =====
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusBadge,
    alignSelf: 'flex-start',
  },
  badgePrimary: {
    backgroundColor: COLORS.primaryLight,
  },
  badgePrimaryText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.tiny,
    fontWeight: FONTS.weights.semibold,
  },
  badgeSuccess: {
    backgroundColor: COLORS.successLight,
  },
  badgeSuccessText: {
    color: COLORS.success,
    fontSize: FONTS.sizes.tiny,
    fontWeight: FONTS.weights.semibold,
  },
  badgeError: {
    backgroundColor: COLORS.errorLight,
  },
  badgeErrorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.tiny,
    fontWeight: FONTS.weights.semibold,
  },

  // ===== UTILIDADES FLEXBOX =====
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },

  // ===== PADDING HELPERS =====
  p0: { padding: 0 },
  p1: { padding: SPACING.xs },
  p2: { padding: SPACING.sm },
  p3: { padding: SPACING.md },
  p4: { padding: SPACING.lg },
  p5: { padding: SPACING.xl },
  px: { paddingHorizontal: SPACING.md },
  py: { paddingVertical: SPACING.md },

  // ===== MARGIN HELPERS =====
  m0: { margin: 0 },
  m1: { margin: SPACING.xs },
  m2: { margin: SPACING.sm },
  m3: { margin: SPACING.md },
  m4: { margin: SPACING.lg },
  m5: { margin: SPACING.xl },

  // Margin Top
  mt0: { marginTop: 0 },
  mt1: { marginTop: SPACING.xs },
  mt2: { marginTop: SPACING.sm },
  mt3: { marginTop: SPACING.md },
  mt4: { marginTop: SPACING.lg },
  mt5: { marginTop: SPACING.xl },

  // Margin Bottom
  mb0: { marginBottom: 0 },
  mb1: { marginBottom: SPACING.xs },
  mb2: { marginBottom: SPACING.sm },
  mb3: { marginBottom: SPACING.md },
  mb4: { marginBottom: SPACING.lg },
  mb5: { marginBottom: SPACING.xl },

  // Margin Horizontal
  mx: { marginHorizontal: SPACING.md },
  mx1: { marginHorizontal: SPACING.xs },
  mx2: { marginHorizontal: SPACING.sm },
  mx3: { marginHorizontal: SPACING.md },

  // ===== DIVIDERS =====
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },

  // ===== SHADOWS (Compatibilidad) =====
  shadowSmall: {
    ...SHADOW_STYLES.small,
  },
  shadowMedium: {
    ...SHADOW_STYLES.card,
  },
  shadowLarge: {
    ...SHADOW_STYLES.large,
  },
});

// Exportar Colors con alias para retrocompatibilidad
export const Colors = COLORS;