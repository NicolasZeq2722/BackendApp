/**
 * 🎴 Card - Reusable Card Container Component
 * Componente de contenedor estilizado
 */

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing, Shadows } from '../theme/spacing';

interface CardProps {
  children: any;
  style?: any;
  elevated?: boolean;
  onPress?: () => void;
  borderColor?: string;
  padding?: number;
}

const Card = ({
  children,
  style,
  elevated = false,
  onPress,
  borderColor = Colors.BorderLight,
  padding = Spacing.lg,
}: CardProps) => {
  const cardStyles = [
    styles.card,
    {
      padding,
      borderColor,
      backgroundColor: Colors.White,
    },
    elevated && Shadows.iosShadowMedium,
    elevated && {
      elevation: Shadows.elevation.md,
    },
    !elevated && Shadows.iosShadow,
    !elevated && {
      elevation: Shadows.elevation.sm,
    },
    style,
  ];

  if (onPress) {
    return (
      <View
        style={cardStyles}
        onTouchEnd={onPress}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={cardStyles}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default Card;
