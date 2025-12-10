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
 * 📂 CATEGORIES SCREEN STYLES
 * Estilos refactorizados con Design Tokens profesionales
 */

export const categoriesStyles = StyleSheet.create({
  // ===== CONTENEDOR =====
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ===== HEADER =====
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOW_STYLES.card,
    zIndex: 1,
    borderBottomWidth: Border.width.thin,
    borderBottomColor: COLORS.cardBorder,
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },

  // ===== BOTÓN AGREGAR =====
  addButton: {
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusBtn,
    ...SHADOW_STYLES.small,
  },

  addButtonIcon: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textWhite,
    marginRight: SPACING.xs,
  },

  addButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semibold,
  },

  // ===== LISTA DE CATEGORÍAS =====
  listContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  // ===== TARJETA DE CATEGORÍA =====
  categoryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.card,
  },

  categoryCardHighlight: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.primaryVery,
  },

  categoryCardHeader: {
    marginBottom: SPACING.md,
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  categoryDescription: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  categoryMeta: {
    fontSize: FONTS.sizes.tiny,
    color: COLORS.textLight,
    fontWeight: FONTS.weights.regular,
  },

  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: Border.radius.full,
    marginRight: SPACING.sm,
  },

  statusBadgeActive: {
    backgroundColor: COLORS.success + '20',
  },

  statusBadgeInactive: {
    backgroundColor: COLORS.error + '20',
  },

  statusBadgeText: {
    fontSize: FONTS.sizes.tiny,
    fontWeight: FONTS.weights.medium,
  },

  statusBadgeTextActive: {
    color: COLORS.success,
  },

  statusBadgeTextInactive: {
    color: COLORS.error,
  },

  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: Border.radius.md,
    minWidth: 80,
    justifyContent: 'center',
  },

  editButton: {
    backgroundColor: COLORS.warning + '15',
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
  },

  deleteButton: {
    backgroundColor: COLORS.error + '15',
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },

  actionButtonIcon: {
    fontSize: 14,
    marginRight: SPACING.xs,
  },

  actionButtonText: {
    fontSize: FONTS.sizes.tiny,
    fontWeight: FONTS.weights.medium,
  },

  editButtonText: {
    color: COLORS.warning,
  },

  deleteButtonText: {
    color: COLORS.error,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },

  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },

  errorIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },

  errorText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: Border.radius.md,
  },

  retryButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
    opacity: 0.5,
  },

  emptyText: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },

  emptySubtext: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },

  modalContent: {
    backgroundColor: COLORS.textWhite,
    borderRadius: Border.radius.xl,
    width: '100%',
    maxHeight: '80%',
    ...SHADOW_STYLES.large,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },

  modalTitle: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: Border.radius.full,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.bold,
  },

  formContainer: {
    padding: SPACING.lg,
    maxHeight: 400,
  },

  inputGroup: {
    marginBottom: SPACING.lg,
  },

  inputLabel: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: Border.radius.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.textWhite,
  },

  inputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },

  switchLabel: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.medium,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    gap: SPACING.md,
  },

  modalButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: Border.radius.md,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: COLORS.gray[100],
    borderWidth: 1,
    borderColor: COLORS.gray[300],
  },

  saveButton: {
    backgroundColor: COLORS.primary,
  },

  modalButtonText: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
  },

  cancelButtonText: {
    color: COLORS.textSecondary,
  },

  saveButtonText: {
    color: COLORS.textWhite,
  },
});