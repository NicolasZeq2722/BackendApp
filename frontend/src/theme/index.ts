/**
 * 🎨 Theme System - Central Export
 * Todo lo necesario para estilar la aplicación
 */

export { Colors, ColorAliases, Gradients } from './colors';
export { Typography, TextStyles } from './typography';
export { Spacing, BorderRadius, Sizing, Shadows, Animations } from './spacing';

// Importar y exportar todo para facilitar el uso
import * as ColorsModule from './colors';
import * as TypographyModule from './typography';
import * as SpacingModule from './spacing';

export const Theme = {
  ...ColorsModule,
  ...TypographyModule,
  ...SpacingModule,
} as const;

export default Theme;
