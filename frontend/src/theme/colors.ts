/**
 * 🎨 Color Theme for Workable App
 * Sistema de Diseño: Paleta de colores centralizada
 */

export const Colors = {
  // ========== NEUTROS / FONDOS ==========
  Navy: "#0F172A",           // Texto oscuro principal
  Slate: "#475569",          // Texto secundario
  SkyGray: "#E5E7EB",        // Fondos suaves
  Neutral50: "#F9FAFB",      // Fondo muy claro deshabilitado
  
  // ========== BLANCO / GRISES ==========
  White: "#FFFFFF",
  LightGray: "#CBD5E1",      // Bordes
  BorderGray: "#E2E8F0",     // Bordes de tarjetas
  BorderLight: "#E2E8F0",    // Alias para bordes
  DarkGray: "#9CA3AF",       // Texto terciario
  TextDark: "#0F172A",       // Texto oscuro
  TextLight: "#9CA3AF",      // Texto claro/hint
  
  // ========== PRIMARIO - AZUL ==========
  Primary: "#3B82F6",         // Azul principal (botones, links)
  PrimaryDark: "#1D4ED8",     // Azul oscuro (hover, active)
  PrimaryLight: "#DBEAFE",    // Azul muy claro (background)
  PrimaryTint: "#60A5FA",     // Azul medio
  
  // ========== SECUNDARIO - ÁMBAR ==========
  Secondary: "#F59E0B",       // Ámbar (acentos, warnings)
  SecondaryDark: "#D97706",   // Ámbar oscuro
  SecondaryLight: "#FEF3C7",  // Ámbar muy claro
  
  // ========== ÉXITO / ACCIONES ==========
  Success: "#10B981",         // Verde (éxito, checkmarks)
  SuccessDark: "#059669",     // Verde oscuro
  SuccessLight: "#D1FAE5",    // Verde muy claro
  
  // ========== ERROR / DESTRUCCIÓN ==========
  Error: "#EF4444",          // Rojo (errores, delete)
  ErrorDark: "#DC2626",      // Rojo oscuro
  ErrorLight: "#FEE2E2",     // Rojo muy claro
  
  // ========== WARNING ==========
  Warning: "#F59E0B",        // Ámbar (advertencias)
  WarningLight: "#FEF3C7",   // Ámbar muy claro
  
  // ========== INFO ==========
  Info: "#06B6D4",           // Cyan (información)
  InfoLight: "#CFFAFE",      // Cyan muy claro
  
  // ========== TRANSPARENCIAS ==========
  BlackTransparent10: "rgba(15, 23, 42, 0.1)",
  BlackTransparent20: "rgba(15, 23, 42, 0.2)",
  BlackTransparent30: "rgba(15, 23, 42, 0.3)",
  BlackTransparent50: "rgba(15, 23, 42, 0.5)",
  WhiteTransparent50: "rgba(255, 255, 255, 0.5)",
  WhiteTransparent80: "rgba(255, 255, 255, 0.8)",
};

// ========== ALIASES COMUNES ==========
export const ColorAliases = {
  background: Colors.White,
  backgroundAlt: Colors.SkyGray,
  text: Colors.Navy,
  textSecondary: Colors.Slate,
  textTertiary: Colors.DarkGray,
  border: Colors.LightGray,
  borderCard: Colors.BorderGray,
  button: Colors.Primary,
  buttonActive: Colors.PrimaryDark,
  buttonSecondary: Colors.Secondary,
  success: Colors.Success,
  error: Colors.Error,
  warning: Colors.Warning,
  info: Colors.Info,
};

// ========== GRADIENTES ==========
export const Gradients = {
  primaryGradient: [Colors.Primary, Colors.PrimaryDark],  // #3B82F6 -> #1D4ED8
  secondaryGradient: [Colors.Secondary, Colors.SecondaryDark], // #F59E0B -> #D97706
  successGradient: [Colors.Success, Colors.SuccessDark],  // #10B981 -> #059669
  errorGradient: [Colors.Error, Colors.ErrorDark],        // #EF4444 -> #DC2626
};

export default Colors;
