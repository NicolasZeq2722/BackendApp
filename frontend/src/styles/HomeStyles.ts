import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  SPACING,
  SIZES,
  SHADOW_STYLES,
  Border,
  GRADIENTS,
} from './GlobalStyles';

/**
 * 🏠 HOME SCREEN STYLES
 * Estilos refactorizados con Design Tokens profesionales
 * Incluye header con gradiente, tarjetas de estadísticas y menú de navegación
 */

export const homeStyles = StyleSheet.create({
  // ===== CONTENEDOR PRINCIPAL =====
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: SPACING.lg,
  },

  // ===== HEADER PERSONALIZADO CON GRADIENTE =====
  // NOTA: Envuelve el contenido en <LinearGradient colors={GRADIENTS.primary}>
  header: {
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: SIZES.radiusCard + 8,
    borderBottomRightRadius: SIZES.radiusCard + 8,
    ...SHADOW_STYLES.large,
  },

  welcomeContainer: {
    alignItems: 'center',
  },

  welcomeText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    marginBottom: SPACING.xs,
    opacity: 0.9,
  },

  userName: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.hero,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },

  userRole: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusBadge,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  userRoleText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semibold,
  },

  // ===== CONTENEDOR DE ESTADÍSTICAS =====
  statsContainer: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.card,
  },

  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },

  statsIcon: {
    fontSize: FONTS.sizes.h1,
    marginRight: SPACING.sm,
    color: COLORS.primary,
  },

  statsTitle: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },

  // Estados de carga y error en stats
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
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    borderRadius: SIZES.radiusCard,
    paddingHorizontal: SPACING.md,
  },

  errorText: {
    fontSize: FONTS.sizes.small,
    color: COLORS.error,
    textAlign: 'center',
    fontWeight: FONTS.weights.medium,
  },

  // Grid de estadísticas
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },

  statCard: {
    width: '48%',
    backgroundColor: COLORS.gray[50],
    borderRadius: SIZES.radiusCard,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.small,
  },

  statCardHighlight: {
    backgroundColor: COLORS.primaryVery,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },

  statNumber: {
    fontSize: FONTS.sizes.hero,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },

  statLabel: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: FONTS.weights.medium,
    lineHeight: 16,
  },

  statSubtext: {
    fontSize: FONTS.sizes.tiny,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    fontWeight: FONTS.weights.regular,
  },

  // ===== MENÚ DE NAVEGACIÓN =====
  menuContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },

  menuTitle: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },

  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },

  // Botón del menú
  menuButton: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.card,
  },

  menuButtonActive: {
    backgroundColor: COLORS.primaryVery,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },

  menuButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },

  menuIcon: {
    fontSize: FONTS.sizes.h1,
    marginBottom: SPACING.sm,
    color: COLORS.primary,
  },

  menuButtonText: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
  },

  menuButtonSubtext: {
    fontSize: FONTS.sizes.tiny,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },

  // ===== BOTÓN LOGOUT ESPECIAL =====
  logoutButtonContainer: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  // Para envolver en gradiente: <LinearGradient colors={GRADIENTS.error}>
  logoutButton: {
    borderRadius: SIZES.radiusCard,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    ...SHADOW_STYLES.card,
  },

  logoutButtonFallback: {
    backgroundColor: COLORS.error,
    borderRadius: SIZES.radiusCard,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    ...SHADOW_STYLES.card,
  },

  logoutButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  logoutIcon: {
    fontSize: FONTS.sizes.h2,
    color: COLORS.textWhite,
    marginBottom: SPACING.xs,
  },

  logoutButtonText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textWhite,
  },

  // ===== ANIMACIONES & ESTADOS =====
  fadeIn: {
    opacity: 1,
  },

  fadeOut: {
    opacity: 0,
  },

  skeletonLoader: {
    backgroundColor: COLORS.gray[200],
    borderRadius: SIZES.radiusCard,
    marginBottom: SPACING.md,
    minHeight: 100,
  },

  // ===== HELPER: Contenedor con padding y centrado =====
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },

  emptyStateIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
    opacity: 0.5,
  },

  emptyStateText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
});