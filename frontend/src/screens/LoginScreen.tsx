// @ts-ignore - React hooks and react-native types handled by Expo
import React, { useState, useContext, useCallback } from 'react';
// @ts-ignore - react-native types handled by Expo
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  // @ts-ignore
  Platform,
  // @ts-ignore
  KeyboardAvoidingView,
  // @ts-ignore
  SafeAreaView,
  // @ts-ignore
  TextInputProps,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { loginStyles } from '../styles/LoginStyles';
import { COLORS } from '../styles/GlobalStyles';

/**
 * 🔐 COMPONENTE INPUT FIELD EXTERNO
 * Componente estable para inputs de login
 */
interface InputFieldProps extends TextInputProps {
  label: string;
  icon: string;
  isFocused: boolean;
  // onFocus y onBlur ya vienen incluidos en TextInputProps, no es necesario redefinirlos
  // a menos que quieras cambiar su firma estrictamente.
}

const InputField = React.memo((props: InputFieldProps) => {
  const {
    label,
    icon,
    isFocused,
    ...textInputProps // Aquí van value, onChangeText, onFocus, onBlur, editable...
  } = props;

  return (
    <View style={loginStyles.inputContainer}>
      <Text style={loginStyles.inputLabel}>{label}</Text>
      <View
        style={[
          loginStyles.inputWrapper,
          isFocused && loginStyles.inputWrapperFocused,
        ]}
      >
        <Text style={loginStyles.inputIcon}>{icon}</Text>
        <TextInput
          {...textInputProps}
          style={loginStyles.input}
          placeholderTextColor={COLORS.textLight}
        />
      </View>
    </View>
  );
});

InputField.displayName = 'InputField';

/**
 * 🔐 COMPONENTE ERROR MESSAGE EXTERNO
 */
interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = React.memo(({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <View style={loginStyles.errorContainer}>
      <Text style={loginStyles.errorIcon}>⚠️</Text>
      <Text style={loginStyles.errorText}>{message}</Text>
    </View>
  );
});

ErrorMessage.displayName = 'ErrorMessage';

/**
 * 🔐 COMPONENTE LOGIN BUTTON EXTERNO
 */
interface LoginButtonProps {
  onPress: () => void;
  isLoading: boolean;
}

const LoginButton = React.memo(({ onPress, isLoading }: LoginButtonProps) => {
  return (
    <View style={loginStyles.buttonContainer}>
      <TouchableOpacity
        style={[
          loginStyles.loginButton,
          isLoading && loginStyles.loginButtonDisabled,
        ]}
        onPress={onPress}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <View style={loginStyles.loadingContainer}>
            <ActivityIndicator color={COLORS.textWhite} size="small" />
            <Text style={loginStyles.loadingText}>Iniciando sesión...</Text>
          </View>
        ) : (
          <Text style={loginStyles.loginButtonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>
    </View>
  );
});

LoginButton.displayName = 'LoginButton';

/**
 * 🔐 COMPONENTES INFORMATIVOS
 */
const CredentialsDisplay = React.memo(() => (
  <View style={loginStyles.credentialsContainer}>
    <Text style={loginStyles.credentialsTitle}>🔑 Credenciales de prueba</Text>
    <Text style={loginStyles.credentialsText}>
      Admin: admin / admin123{'\n'}
      Reclutador: reclutador / reclu123{'\n'}
      Aspirante: aspirante / aspi123
    </Text>
  </View>
));
CredentialsDisplay.displayName = 'CredentialsDisplay';

const FooterDisplay = React.memo(() => (
  <View style={loginStyles.footerContainer}>
    <Text style={loginStyles.footerText}>
      © 2025 Workable{'\n'}
      Versión 1.0.0 - Sistema de Empleo
    </Text>
  </View>
));
FooterDisplay.displayName = 'FooterDisplay';

/**
 * 🔐 PANTALLA PRINCIPAL DE LOGIN
 */
export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // ===== CALLBACKS =====
  
  const handleUsernameChange = useCallback((text: string) => {
    setUsername(text);
    if (error) setError('');
  }, [error]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (error) setError('');
  }, [error]);

  // Callbacks para el foco
  const handleUsernameFocus = useCallback(() => setFocusedInput('username'), []);
  const handleUsernameBlur = useCallback(() => setFocusedInput(null), []);
  const handlePasswordFocus = useCallback(() => setFocusedInput('password'), []);
  const handlePasswordBlur = useCallback(() => setFocusedInput(null), []);

  const handleLogin = useCallback(async () => {
    if (!username || !password) {
      setError('Por favor ingrese usuario y contraseña');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      console.log('🔐 Intentando login con usuario:', trimmedUsername);
      
      const result = await login(trimmedUsername, trimmedPassword);
      
      if (result.success) {
        console.log('Login exitoso');
        // La navegación la maneja el AppNavigator basado en el user del AuthContext
      } else {
        setError(result.error || 'Credenciales inválidas');
      }
    } catch (err: any) {
      console.log('Login error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [username, password, login]);

  return (
    <SafeAreaView style={loginStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={loginStyles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={loginStyles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header */}
          <View style={loginStyles.headerContainer}>
            <Text style={loginStyles.appTitle}>Workable</Text>
            <Text style={loginStyles.appSubtitle}>Sistema de Empleo</Text>
          </View>

          {/* Formulario */}
          <View style={loginStyles.formContainer}>
            <Text style={loginStyles.formTitle}>Iniciar Sesión</Text>

            <ErrorMessage message={error} />

            <InputField
              label="Usuario"
              icon="👤" // ✅ Icono restaurado
              value={username}
              onChangeText={handleUsernameChange}
              isFocused={focusedInput === 'username'}
              onFocus={handleUsernameFocus}
              onBlur={handleUsernameBlur}
              editable={!loading}
              placeholder="Ingrese su usuario"
              autoCapitalize="none"
            />

            <InputField
              label="Contraseña"
              icon="🔒" // ✅ Icono restaurado
              value={password}
              onChangeText={handlePasswordChange}
              isFocused={focusedInput === 'password'}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              editable={!loading}
              placeholder="Ingrese su contraseña"
              secureTextEntry={true}
            />

            <LoginButton onPress={handleLogin} isLoading={loading} />
          </View>

          <CredentialsDisplay />
          <FooterDisplay />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}