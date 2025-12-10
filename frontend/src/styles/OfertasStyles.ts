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
 * 💼 OFERTAS SCREEN STYLES
 * Estilos refactorizados con Design Tokens profesionales
 * Tarjetas con sombras multiplataforma y tipografía escalable
 */

export const productsStyles = StyleSheet.create({
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

  // Header
  header: {
    backgroundColor: COLORS.textWhite,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderBottomWidth: Border.width.thin,
    borderBottomColor: COLORS.gray[200],
  },
  headerTitle: {
    fontSize: FONTS.sizes.h1,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
  },

  // Actions
  actionsContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.textWhite,
    borderBottomWidth: Border.width.thin,
    borderBottomColor: COLORS.gray[200],
  },

  // Cards
  list: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.textWhite,
    borderRadius: Border.radius.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: Border.width.thin,
    borderColor: COLORS.gray[200],
    ...SHADOW_STYLES.small,
  },
  cardContent: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  cardMeta: {
    fontSize: FONTS.sizes.caption,
    color: COLORS.gray[500],
    marginBottom: SPACING.xs,
  },
  cardPrice: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.success,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },

  // Buttons
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: Border.radius.md,
    alignItems: 'center',
    ...SHADOW_STYLES.small,
  },
  primaryButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  },
  secondaryButton: {
    backgroundColor: COLORS.textWhite,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: Border.radius.md,
    borderWidth: Border.width.thin,
    borderColor: COLORS.gray[300],
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  },
  actionButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: Border.radius.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: COLORS.info,
  },
  editButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  deleteButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.body,
    color: COLORS.gray[500],
    textAlign: 'center',
  },

  // Error State
  errorContainer: {
    backgroundColor: COLORS.gray[50],
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: Border.radius.md,
    borderWidth: Border.width.thin,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    marginBottom: SPACING.sm,
  },
  retryButton: {
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
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
    backgroundColor: COLORS.textWhite,
    borderRadius: Border.radius.lg,
    padding: SPACING.xl,
    margin: SPACING.lg,
    maxHeight: '80%',
    width: '90%',
    ...SHADOW_STYLES.large,
  },
  modalHeader: {
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.sizes.h1,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  // Form
  formContainer: {
    marginBottom: SPACING.lg,
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
    borderWidth: Border.width.thin,
    borderColor: COLORS.gray[300],
    borderRadius: Border.radius.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: Border.width.thin,
    borderColor: COLORS.gray[300],
    borderRadius: Border.radius.md,
    backgroundColor: COLORS.background,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },

  // Additional missing styles
  pickerContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  cancelButton: {
    backgroundColor: COLORS.textWhite,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: Border.radius.md,
    borderWidth: Border.width.thin,
    borderColor: COLORS.gray[300],
    alignItems: 'center',
    flex: 1,
  },
  cancelButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: Border.radius.md,
    alignItems: 'center',
    flex: 1,
  },
  saveButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  },
});