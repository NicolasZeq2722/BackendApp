/**
 * ⌨️ TextInput - Reusable Text Input Component
 * Campo de entrada estilizado
 */

import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { BorderRadius, Spacing, Sizing } from '../theme/spacing';

interface TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: any;
  inputStyle?: any;
  error?: string;
  label?: string;
  icon?: any;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  returnKeyType?: 'done' | 'next' | 'search' | 'send' | 'go';
  onSubmitEditing?: () => void;
  disabled?: boolean;
}

const TextInput = ({
  placeholder,
  value,
  onChangeText,
  style,
  inputStyle,
  error,
  label,
  icon,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  returnKeyType = 'done',
  onSubmitEditing,
  disabled = false,
}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? Colors.Error
    : isFocused
    ? Colors.Primary
    : Colors.BorderLight;

  const inputHeight = multiline ? undefined : Sizing.inputHeight.md;

  const containerStyles = [
    styles.container,
    style,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    {
      borderColor,
      height: inputHeight,
      backgroundColor: disabled ? Colors.Neutral50 : Colors.White,
    },
  ];

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      <View style={inputContainerStyles}>
        {icon && (
          <View style={styles.iconLeft}>
            {icon}
          </View>
        )}

        <RNTextInput
          style={[
            styles.input,
            {
              paddingLeft: icon ? 0 : Spacing.md,
              color: Colors.TextDark,
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.TextLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={editable && !disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.labelMedium,
    color: Colors.TextDark,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.White,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight,
    color: Colors.TextDark,
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  errorText: {
    ...Typography.captionSmall,
    color: Colors.Error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.sm,
  },
});

export default TextInput;
