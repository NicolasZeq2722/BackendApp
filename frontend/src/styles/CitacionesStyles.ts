import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  SPACING,
  SIZES,
  SHADOW_STYLES,
  Border,
} from './GlobalStyles';

/**
 * 📅 CITACIONES SCREEN STYLES
 * Estilos refactorizados con Design Tokens profesionales
 */

export const citacionesStyles = StyleSheet.create({
  // ===== CONTENEDOR =====
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },

  // ===== TÍTULO =====
  title: {
    fontSize: FONTS.sizes.h1,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },

  // ===== LOADING =====
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== CITACIÓN ITEM (CARD) =====
  citacionItem: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: SIZES.radiusCard,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.card,
  },

  citacionItemPending: {
    backgroundColor: COLORS.warningLight,
    borderColor: COLORS.warning,
  },

  citacionItemConfirmed: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },

  citacionText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    fontWeight: FONTS.weights.medium,
  },

  citacionSubtext: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  citacionDate: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    fontWeight: FONTS.weights.regular,
  },

  // ===== BOTONES =====
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusBtn,
    alignItems: 'center',
    ...SHADOW_STYLES.small,
  },

  buttonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
  },

  addButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: SIZES.radiusCard,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOW_STYLES.card,
  },

  addButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },

  // ===== ESTADO VACÍO =====
  emptyText: {
    textAlign: 'center',
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
  },
