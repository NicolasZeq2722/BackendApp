/**
 * 📝 Typography Theme for Workable App
 * Sistema de tamaños y estilos de texto
 */

export const Typography = {
  // ========== TAMAÑOS DE FUENTE ==========
  // Basado en escala de 16px = 1rem
  
  // HERO / DISPLAYS
  heroLarge: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700" as const,
  },
  
  heroMedium: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  
  // TÍTULOS
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
  },
  
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  
  h4: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  
  // TEXTO NORMAL / BODY
  bodyLarge: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  
  // LABELS / PEQUEÑO
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  
  labelMedium: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600" as const,
  },
  
  labelSmall: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.3,
  },
  
  // CAPTION
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  
  captionSmall: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "400" as const,
  },
  
  // BOTONES
  buttonLarge: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600" as const,
  },
  
  button: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600" as const,
  },
  
  buttonSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600" as const,
  },
};

// ========== ESTILOS PREDEFINIDOS ==========
export const TextStyles = {
  // Hero / Displays
  heroLarge: `
    font-size: 40px;
    line-height: 48px;
    font-weight: 700;
  `,
  
  heroMedium: `
    font-size: 32px;
    line-height: 40px;
    font-weight: 700;
  `,
  
  // Títulos
  h1: `
    font-size: 28px;
    line-height: 36px;
    font-weight: 700;
  `,
  
  h2: `
    font-size: 24px;
    line-height: 32px;
    font-weight: 700;
  `,
  
  h3: `
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
  `,
  
  // Body
  body: `
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
  `,
  
  caption: `
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
  `,
};

export default Typography;
