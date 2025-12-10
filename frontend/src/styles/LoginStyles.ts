import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONTS,
  SPACING,
  SIZES,
  SHADOW_STYLES,
} from './GlobalStyles';

export const loginStyles = StyleSheet.create({
  // ===== CONTENEDOR PRINCIPAL =====
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },

  // ===== HEADER CON LOGO =====
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },

  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  appTitle: {
    fontSize: FONTS.sizes.hero,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textWhite,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },

  appSubtitle: {
    fontSize: FONTS.sizes.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },

  // ===== FORMULARIO =====
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusCard,
    padding: SPACING.xl,
    ...SHADOW_STYLES.large,
  },

  formTitle: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  // ===== INPUTS =====
  inputContainer: {
    marginBottom: SPACING.lg,
  },

  inputLabel: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 2, // Borde fijo para evitar saltos
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radiusInput,
    paddingHorizontal: SPACING.md,
    height: 55, // Altura fija
    // Eliminé paddingVertical para evitar conflictos con el texto centrado
  },

  inputWrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },

  inputIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },

  input: {
    flex: 1,
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
    height: '100%',
  },

  // ===== ERRORES =====
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: SIZES.radiusBtn,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  errorIcon: {
    fontSize: 16,
    color: COLORS.error,
    marginRight: SPACING.xs,
  },

  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.small,
    flex: 1,
    fontWeight: FONTS.weights.medium,
  },

  // ===== BOTÓN =====
  buttonContainer: {
    marginTop: SPACING.md,
  },

  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusBtn,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    ...SHADOW_STYLES.small,
  },

  loginButtonDisabled: {
    opacity: 0.7,
    backgroundColor: COLORS.textLight,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  loadingText: {
    color: COLORS.textWhite,
    marginLeft: SPACING.sm,
    fontSize: FONTS.sizes.body,
  },

  loginButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },

  // ===== CREDENCIALES Y FOOTER =====
  credentialsContainer: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.radiusCard,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  credentialsTitle: {
    color: COLORS.textWhite,
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.small,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },

  credentialsText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FONTS.sizes.tiny,
    textAlign: 'center',
    lineHeight: 18,
  },

  footerContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },

  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: FONTS.sizes.tiny,
    textAlign: 'center',
  },
});