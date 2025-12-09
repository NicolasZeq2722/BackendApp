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
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[600],
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },

  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Border.radius.full,
    marginRight: Spacing.sm,
  },

  statusBadgeActive: {
    backgroundColor: Colors.success + '20',
  },

  statusBadgeInactive: {
    backgroundColor: Colors.error + '20',
  },

  statusBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },

  statusBadgeTextActive: {
    color: Colors.success,
  },

  statusBadgeTextInactive: {
    color: Colors.error,
  },

  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Border.radius.md,
    minWidth: 80,
    justifyContent: 'center',
  },

  editButton: {
    backgroundColor: Colors.warning + '15',
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },

  deleteButton: {
    backgroundColor: Colors.error + '15',
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },

  actionButtonIcon: {
    fontSize: 14,
    marginRight: Spacing.xs,
  },

  actionButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },

  editButtonText: {
    color: Colors.warning,
  },

  deleteButtonText: {
    color: Colors.error,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },

  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.gray[600],
    textAlign: 'center',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },

  errorIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },

  errorText: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Border.radius.md,
  },

  retryButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
    opacity: 0.5,
  },

  emptyText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },

  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Border.radius.xl,
    width: '100%',
    maxHeight: '80%',
    ...Shadows.large,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },

  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: Border.radius.full,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 18,
    color: Colors.gray[600],
    fontWeight: Typography.fontWeight.bold,
  },

  formContainer: {
    padding: Spacing.lg,
    maxHeight: 400,
  },

  inputGroup: {
    marginBottom: Spacing.lg,
  },

  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: Border.radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.base,
    color: Colors.black,
    backgroundColor: Colors.white,
  },

  inputFocused: {
    borderColor: Colors.primary,
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
    paddingVertical: Spacing.sm,
  },

  switchLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.black,
    fontWeight: Typography.fontWeight.medium,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    gap: Spacing.md,
  },

  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Border.radius.md,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: Colors.gray[100],
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },

  saveButton: {
    backgroundColor: Colors.primary,
  },

  modalButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },

  cancelButtonText: {
    color: Colors.gray[600],
  },

  saveButtonText: {
    color: Colors.white,
  },
});