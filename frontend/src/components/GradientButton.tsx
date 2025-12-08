/**
 * 🎯 GradientButton - Reusable Gradient Button Component
 * Componente principal de botón con gradiente
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import { Colors, Gradients } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius, Sizing, Shadows } from '../theme/spacing';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: any;
  textStyle?: any;
  loading?: boolean;
  disabled?: boolean;
  icon?: any;
  iconPosition?: 'left' | 'right';
}

const GradientButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
}: GradientButtonProps) => {
  // Determinar colores del gradiente según variant
  const getGradientColors = () => {
    switch (variant) {
      case 'secondary':
        return [Colors.Secondary, Colors.SecondaryDark];
      case 'success':
        return [Colors.Success, Colors.SuccessDark];
      case 'danger':
        return [Colors.Error, Colors.ErrorDark];
      case 'outline':
        return [Colors.White, Colors.White]; // Sin gradiente
      default: // primary
        return Gradients.primaryGradient;
    }
  };

  // Determinar altura según size
  const getButtonHeight = () => {
    switch (size) {
      case 'sm':
        return Sizing.buttonHeight.sm;
      case 'lg':
        return Sizing.buttonHeight.lg;
      default: // md
        return Sizing.buttonHeight.md;
    }
  };

  // Determinar tamaño de fuente según size
  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return Typography.labelMedium.fontSize;
      case 'lg':
        return Typography.bodyLarge.fontSize;
      default: // md
        return Typography.body.fontSize;
    }
  };

  const height = getButtonHeight();
  const fontSize = getFontSize();
  const gradientColors = getGradientColors();
  const isOutline = variant === 'outline';
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.button,
    {
      height,
      opacity: isDisabled ? 0.6 : 1,
    },
    !isOutline && {
      borderWidth: 0,
    },
    isOutline && {
      borderWidth: 2,
      borderColor: Colors.Primary,
      backgroundColor: Colors.White,
    },
    style,
  ];

  const textStyles = [
    styles.text,
    {
      fontSize,
      color: isOutline ? Colors.Primary : Colors.White,
    },
    textStyle,
  ];

  // Contenido del botón
  const content = (
    <View style={styles.content}>
      {icon && iconPosition === 'left' && (
        <View style={styles.iconLeft}>{icon}</View>
      )}
      
      {loading ? (
        <ActivityIndicator color={isOutline ? Colors.Primary : Colors.White} />
      ) : (
        <Text style={textStyles} numberOfLines={1}>
          {title}
        </Text>
      )}
      
      {icon && iconPosition === 'right' && (
        <View style={styles.iconRight}>{icon}</View>
      )}
    </View>
  );

  // Si es outline, no usar LinearGradient
  if (isOutline) {
    return (
      <TouchableOpacity
        style={buttonStyles}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  // Con gradiente
  return (
    <View
      style={[
        styles.gradient,
        {
          height,
          borderRadius: BorderRadius.lg,
        },
      ]}
    >
      {/* @ts-ignore */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      >
        <TouchableOpacity
          style={buttonStyles}
          onPress={onPress}
          disabled={isDisabled}
          activeOpacity={0.8}
        >
          {content}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    ...Shadows.elevation,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});

export default GradientButton;
