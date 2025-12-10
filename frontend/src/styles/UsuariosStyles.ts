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
 * 👥 USUARIOS SCREEN STYLES
 * Estilos refactorizados con Design Tokens profesionales
 * Incluye formularios, listados y controles de usuario
 */

export const usersStyles = StyleSheet.create({
  // ===== CONTENEDOR =====
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ===== HEADER =====
  header: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: Border.width.thin,
    borderBottomColor: COLORS.cardBorder,
    ...SHADOW_STYLES.small,
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
    borderRadius: SIZES.radiusBtn,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW_STYLES.small,
  },

  addButtonIcon: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    marginRight: SPACING.xs,
  },

  addButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semibold,
  },

  // ===== LOADING =====
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },

  loadingText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },

  // ===== ERROR =====
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },

  errorIcon: {
    fontSize: 50,
    marginBottom: SPACING.md,
    color: COLORS.error,
  },

  errorText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontWeight: FONTS.weights.medium,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusBtn,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOW_STYLES.small,
  },

  retryButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semibold,
  },

  // ===== LISTA =====
  listContainer: {
    padding: SPACING.md,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: SPACING.lg,
    color: COLORS.textLight,
  },

  emptyText: {
    fontSize: FONTS.sizes.h2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },

  emptySubtext: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textLight,
    textAlign: 'center',
  },

  // ===== CARD DE USUARIO =====
  userCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    // Sombra para tarjetas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  userEmail: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },

  // ===== ESTADO Y ROL =====
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },

  roleBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusBadge, // Usando SIZES en lugar de Border.radius
    backgroundColor: COLORS.primary, // 'info' mapeado a primary
  },

  roleBadgeAdmin: {
    backgroundColor: COLORS.secondary, // 'accent' mapeado a secondary
  },

  roleBadgeText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.tiny, // 'xs' mapeado a tiny
    fontWeight: FONTS.weights.semibold,
  },

  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusBadge,
  },

  statusBadgeActive: {
    backgroundColor: COLORS.success,
  },

  statusBadgeInactive: {
    backgroundColor: COLORS.textLight, // 'gray[400]' mapeado a textLight
  },

  statusBadgeText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.tiny,
    fontWeight: FONTS.weights.semibold,
  },

  // ===== ACCIONES =====
  actionsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },

  actionButton: {
    borderRadius: SIZES.radiusBtn,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  editButton: {
    backgroundColor: COLORS.secondary, // 'warning' mapeado a secondary (amber)
  },

  deleteButton: {
    backgroundColor: COLORS.error,
  },

  actionButtonIcon: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.small,
    marginRight: SPACING.xs,
  },

  actionButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.medium,
  },

  // ===== MODAL DE FORMULARIO =====
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },

  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.xl,
    width: '100%',
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: Border.width.thin,
    borderBottomColor: COLORS.cardBorder,
  },

  modalTitle: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },

  closeButton: {
    padding: SPACING.sm,
  },

  closeButtonText: {
    fontSize: FONTS.sizes.h2,
    color: COLORS.textSecondary,
  },

  // ===== FORMULARIO =====
  formContainer: {
    marginBottom: SPACING.lg,
  },

  inputGroup: {
    marginBottom: SPACING.lg,
  },

  inputLabel: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  input: {
    backgroundColor: COLORS.background, // 'gray[50]'
    borderWidth: Border.width.thin,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radiusInput,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
  },

  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },

  // ===== PICKER & SWITCH =====
  pickerContainer: {
    backgroundColor: COLORS.background,
    borderWidth: Border.width.thin,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radiusInput,
    overflow: 'hidden',
  },

  picker: {
    height: 50,
    color: COLORS.textPrimary,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },

  switchLabel: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
    flex: 1,
  },

  // ===== BOTONES DEL MODAL =====
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },

  modalButton: {
    flex: 1,
    borderRadius: SIZES.radiusBtn,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    backgroundColor: COLORS.inputBorder, // 'gray[300]'
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