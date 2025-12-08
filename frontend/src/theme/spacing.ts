/**
 * 📐 Spacing & Sizing Theme for Workable App
 * Sistema de espacios, tamaños y radios
 */

// ========== ESPACIADO ==========
export const Spacing = {
  // Micro espacios
  xs: 4,      // 0.25rem
  sm: 8,      // 0.5rem
  md: 12,     // 0.75rem
  lg: 16,     // 1rem
  xl: 24,     // 1.5rem
  xxl: 32,    // 2rem
  xxxl: 48,   // 3rem
  
  // Alias comunes
  tiny: 4,
  small: 8,
  medium: 12,
  large: 16,
  xLarge: 24,
  xxLarge: 32,
  xxxLarge: 48,
};

// ========== BORDER RADIUS ==========
export const BorderRadius = {
  // Radios de esquina
  none: 0,
  sm: 8,          // Para inputs pequeños
  md: 12,         // Estándar
  lg: 14,         // Inputs (requerimiento)
  xl: 16,         // Tarjetas (requerimiento)
  xxl: 20,        // Más redondeado
  full: 999,      // Circular (pills, avatars)
};

// ========== TAMAÑOS COMUNES ==========
export const Sizing = {
  // Alturas de botones
  buttonHeight: {
    sm: 32,
    md: 44,
    lg: 56,
  },
  
  // Alturas de inputs
  inputHeight: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  
  // Tamaños de avatar
  avatarSize: {
    xs: 32,
    sm: 40,
    md: 48,
    lg: 64,
    xl: 80,
  },
  
  // Tamaños de iconos
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },
  
  // Ancho de línea
  dividerHeight: 1,
};

// ========== SOMBRAS ==========
export const Shadows = {
  // Shadow definitions para iOS
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  iosShadowMedium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  
  iosShadowLarge: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  
  // Elevación para Android
  elevation: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
};

// ========== ANIMACIONES ==========
export const Animations = {
  durations: {
    fast: 150,      // ms
    normal: 300,    // ms
    slow: 500,      // ms
  },
  
  timingFunctions: {
    easeOut: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0.0, 0.2, 1)",
  },
};

export default {
  Spacing,
  BorderRadius,
  Sizing,
  Shadows,
  Animations,
};
