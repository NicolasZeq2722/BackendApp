import { StyleSheet } from 'react-native';

const COLORS = {
  primary: '#6200EE',
  secondary: '#03DAC6',
  accent: '#FF6C00',
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FFC107',
  white: '#FFFFFF',
  black: '#000000',
  gray200: '#F5F5F5',
  gray300: '#E0E0E0',
  gray500: '#9E9E9E',
  gray700: '#616161',
  lightBlue: '#E3F2FD',
  darkBlue: '#0D47A1',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

const FONTS = {
  regular: { fontSize: 14, fontWeight: '400' as const },
  medium: { fontSize: 16, fontWeight: '500' as const },
  semiBold: { fontSize: 16, fontWeight: '600' as const },
  bold: { fontSize: 18, fontWeight: '700' as const },
  title: { fontSize: 24, fontWeight: '700' as const },
  subtitle: { fontSize: 20, fontWeight: '600' as const },
};

export const AdminDashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray200,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    color: COLORS.white,
    ...FONTS.title,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    color: COLORS.white,
    ...FONTS.regular,
    opacity: 0.9,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    width: '48%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    color: COLORS.primary,
    ...FONTS.subtitle,
    marginBottom: SPACING.sm,
  },
  statLabel: {
    color: COLORS.gray700,
    ...FONTS.regular,
  },
  buttonContainer: {
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: COLORS.accent,
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.semiBold,
    marginLeft: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: COLORS.danger,
    borderLeftWidth: 4,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: 4,
  },
  errorText: {
    color: COLORS.danger,
    ...FONTS.medium,
  },
});

export const AdminOfertasStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray200,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    ...FONTS.subtitle,
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: COLORS.white,
    ...FONTS.title,
    lineHeight: 24,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  listContainer: {
    paddingBottom: SPACING.xl,
  },
  ofertaCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ofertaTitle: {
    color: COLORS.black,
    ...FONTS.semiBold,
    marginBottom: SPACING.sm,
  },
  ofertaDescripcion: {
    color: COLORS.gray700,
    ...FONTS.regular,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  ofertaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  infoPiece: {
    flex: 1,
  },
  infoLabel: {
    color: COLORS.gray500,
    ...FONTS.regular,
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    color: COLORS.black,
    ...FONTS.medium,
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  estadoAbierta: {
    backgroundColor: '#C8E6C9',
  },
  estadoCerrada: {
    backgroundColor: '#FFCCCC',
  },
  estadoPausada: {
    backgroundColor: '#FFF9C4',
  },
  estadoText: {
    ...FONTS.regular,
    fontSize: 12,
    fontWeight: '600',
  },
  estadoAbriertaText: {
    color: '#2E7D32',
  },
  estadoCerradaText: {
    color: '#C62828',
  },
  estadoPausadaText: {
    color: '#F57F17',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray300,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.sm / 2,
  },
  editButton: {
    backgroundColor: COLORS.lightBlue,
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  editButtonText: {
    color: COLORS.darkBlue,
    ...FONTS.medium,
    fontSize: 12,
  },
  deleteButtonText: {
    color: COLORS.danger,
    ...FONTS.medium,
    fontSize: 12,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    color: COLORS.gray500,
    ...FONTS.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: COLORS.danger,
    borderLeftWidth: 4,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: 4,
  },
  errorText: {
    color: COLORS.danger,
    ...FONTS.medium,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
  },
  modalTitle: {
    color: COLORS.black,
    ...FONTS.semiBold,
    marginBottom: SPACING.md,
  },
  modalButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    marginVertical: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: COLORS.danger,
  },
  cancelButton: {
    backgroundColor: COLORS.gray300,
  },
  confirmButtonText: {
    color: COLORS.white,
    ...FONTS.semiBold,
  },
  cancelButtonText: {
    color: COLORS.black,
    ...FONTS.semiBold,
  },
});

export const AdminUsuariosStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray200,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    color: COLORS.white,
    ...FONTS.subtitle,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  listContainer: {
    paddingBottom: SPACING.xl,
  },
  usuarioCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  nombreCompleto: {
    color: COLORS.black,
    ...FONTS.semiBold,
    flex: 1,
  },
  rolBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rolAspiranteBadge: {
    backgroundColor: '#E3F2FD',
  },
  rolReclutadorBadge: {
    backgroundColor: '#F3E5F5',
  },
  rolAdminBadge: {
    backgroundColor: '#FFF3E0',
  },
  rolText: {
    ...FONTS.regular,
    fontSize: 11,
    fontWeight: '600',
  },
  rolAspiranteText: {
    color: COLORS.darkBlue,
  },
  rolReclutadorText: {
    color: '#6A1B9A',
  },
  rolAdminText: {
    color: '#E65100',
  },
  cardContent: {
    marginBottom: SPACING.md,
  },
  infoRow: {
    marginBottom: SPACING.sm,
  },
  label: {
    color: COLORS.gray500,
    ...FONTS.regular,
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
    color: COLORS.black,
    ...FONTS.medium,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray300,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  statusActive: {
    backgroundColor: COLORS.success,
  },
  statusInactive: {
    backgroundColor: COLORS.danger,
  },
  statusText: {
    color: COLORS.gray700,
    ...FONTS.regular,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    color: COLORS.gray500,
    ...FONTS.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonInactive: {
    backgroundColor: COLORS.white,
  },
  filterButtonText: {
    ...FONTS.medium,
    fontSize: 12,
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  filterButtonTextInactive: {
    color: COLORS.primary,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: COLORS.danger,
    borderLeftWidth: 4,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: 4,
  },
  errorText: {
    color: COLORS.danger,
    ...FONTS.medium,
  },
});
