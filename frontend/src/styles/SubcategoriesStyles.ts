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
 * 📑 SUBCATEGORIES SCREEN STYLES
 * Estilos refactorizados con Design Tokens profesionales
 */

export const subcategoriesStyles = StyleSheet.create({
  // ===== CONTENEDOR =====
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ===== LOADING =====
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
  },

  // ===== HEADER =====
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderBottomWidth: Border.width.thin,
    borderBottomColor: COLORS.cardBorder,
  },

  headerTitle: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  headerSubtitle: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
  },

  // ===== ACCIONES =====
  actionsContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: Border.width.thin,
    borderBottomColor: COLORS.cardBorder,
  },

  // ===== LISTA DE TARJETAS =====
  list: {
    flex: 1,
  },

  listContent: {
    padding: SPACING.lg,
  },

  // ===== TARJETA =====
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOW_STYLES.card,
  },

  cardHighlight: {
    backgroundColor: COLORS.primaryVery,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },

  cardContent: {
    flex: 1,
    marginBottom: SPACING.md,
  },

  cardTitle: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  cardSubtitle: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  cardMeta: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray[500],
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },

  // Buttons
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Border.radius.md,
    alignItems: 'center',
    ...Shadows.small,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Border.radius.md,
    borderWidth: Border.width.thin,
    borderColor: Colors.gray[300],
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.black,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  actionButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Border.radius.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: Colors.info,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  deleteButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[500],
    textAlign: 'center',
  },

  // Error State
  errorContainer: {
    backgroundColor: Colors.gray[50],
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Border.radius.md,
    borderWidth: Border.width.thin,
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.sm,
  },
  retryButton: {
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: Colors.error,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    textDecorationLine: 'underline',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Border.radius.lg,
    padding: Spacing.xl,
    margin: Spacing.lg,
    maxHeight: '80%',
    width: '90%',
    ...Shadows.large,
  },
  modalHeader: {
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
    textAlign: 'center',
  },

  // Form
  formContainer: {
    marginBottom: Spacing.lg,
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
    borderWidth: Border.width.thin,
    borderColor: Colors.gray[300],
    borderRadius: Border.radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.base,
    color: Colors.black,
    backgroundColor: Colors.background,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: Border.width.thin,
    borderColor: Colors.gray[300],
    borderRadius: Border.radius.md,
    backgroundColor: Colors.background,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
});