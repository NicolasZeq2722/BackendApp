import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { loginStyles } from '../styles/LoginStyles';
import { COLORS } from '../styles/GlobalStyles';

/**
 * 🔐 COMPONENTE INPUT FIELD EXTERNO
 * Componente estable para inputs de login
 * Se define FUERA de LoginScreen para prevenir remontajes
 */
interface InputFieldProps extends TextInputProps {
  label: string;
  icon: string;
  value: string;
  onChangeText: (text: string) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  editable: boolean;
}

const InputField = React.memo((props: InputFieldProps) => {
  const {
    label,
    icon,
    value,
    onChangeText,
    isFocused,
    onFocus,
    onBlur,
    editable,
    ...textInputProps
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
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          editable={editable}
          placeholderTextColor={COLORS.textLight}
        />
      </View>
    </View>
  );
});

InputField.displayName = 'InputField';

/**
 * 🔐 COMPONENTE ERROR MESSAGE EXTERNO
 * Componente estable para mostrar errores
 */
interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = React.memo((props: ErrorMessageProps) => {
  const { message } = props;

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
 * Botón de login con estado de carga
 */
interface LoginButtonProps {
  onPress: () => void;
  isLoading: boolean;
}

const LoginButton = React.memo((props: LoginButtonProps) => {
  const { onPress, isLoading } = props;

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
            <ActivityIndicator color={COLORS.white} size="small" />
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
 * 🔐 COMPONENTE CREDENTIALS DISPLAY EXTERNO
 * Muestra las credenciales de prueba
 */
const CredentialsDisplay = React.memo(() => {
  return (
    <View style={loginStyles.credentialsContainer}>
      <Text style={loginStyles.credentialsTitle}>🔑 Credenciales de prueba</Text>
      <Text style={loginStyles.credentialsText}>
        Admin: admin / admin123{'\n'}
        Reclutador: reclutador / reclu123{'\n'}
        Aspirante: aspirante / aspi123
      </Text>
    </View>
  );
});

CredentialsDisplay.displayName = 'CredentialsDisplay';

/**
 * 🔐 COMPONENTE FOOTER EXTERNO
 * Footer del login screen
 */
const FooterDisplay = React.memo(() => {
  return (
    <View style={loginStyles.footerContainer}>
      <Text style={loginStyles.footerText}>
        © 2025 Workable{'\n'}
        Versión 1.0.0 - Sistema de Empleo
      </Text>
    </View>
  );
});

FooterDisplay.displayName = 'FooterDisplay';

/**
 * 🔐 PANTALLA PRINCIPAL DE LOGIN
 * Componente estable sin sub-componentes internos
 * Todos los sub-componentes están extraídos y memorizados
 */
export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // ===== CALLBACKS ESTABLES CON useCallback =====
  // Estos callbacks NO cambian de referencia en cada render
  // Evita que los componentes memorizados se re-rendericen innecesariamente

  const handleUsernameChange = useCallback((text: string) => {
    setUsername(text);
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('');
  }, [error]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('');
  }, [error]);

  const handleUsernameFocus = useCallback(() => {
    setFocusedInput('username');
  }, []);

  const handleUsernameBlur = useCallback(() => {
    setFocusedInput(null);
  }, []);

  const handlePasswordFocus = useCallback(() => {
    setFocusedInput('password');
  }, []);

  const handlePasswordBlur = useCallback(() => {
    setFocusedInput(null);
  }, []);

  const handleLogin = useCallback(async () => {
    if (!username || !password) {
      setError('Por favor ingrese usuario y contraseña');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // ✅ Sanitizar inputs eliminando espacios en blanco
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      console.log('🔐 Intentando login con usuario:', trimmedUsername);
      const result = await login(trimmedUsername, trimmedPassword);
      if (result.success) {
        console.log('Login exitoso');
        // AuthContext manejará la navegación automáticamente
      } else {
        setError(result.error || 'Credenciales inválidas');
      }
    } catch (error: any) {
      console.log('Login error:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [username, password, login]);

  return (
    <SafeAreaView style={loginStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={loginStyles.keyboardAvoidingView}
        enabled={true}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={loginStyles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header con logo y título */}
          <View style={loginStyles.headerContainer}>
            <Text style={loginStyles.appTitle}>Workable</Text>
            <Text style={loginStyles.appSubtitle}>Sistema de Empleo</Text>
          </View>

          {/* Formulario de login */}
          <View style={loginStyles.formContainer}>
            <Text style={loginStyles.formTitle}>Iniciar Sesión</Text>

            {/* Error message - Componente externo memorizado */}
            <ErrorMessage message={error} />

            {/* Campo de usuario - Componente externo memorizado */}
            <InputField
              label="Usuario"
              icon=""
              value={username}
              onChangeText={handleUsernameChange}
              isFocused={focusedInput === 'username'}
              onFocus={handleUsernameFocus}
              onBlur={handleUsernameBlur}
              editable={!loading}
              placeholder="Ingrese su usuario"
              autoCapitalize="none"
            />

            {/* Campo de contraseña - Componente externo memorizado */}
            <InputField
              label="Contraseña"
              icon=""
              value={password}
              onChangeText={handlePasswordChange}
              isFocused={focusedInput === 'password'}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              editable={!loading}
              placeholder="Ingrese su contraseña"
              secureTextEntry={true}
            />

            {/* Botón de login - Componente externo memorizado */}
            <LoginButton onPress={handleLogin} isLoading={loading} />
          </View>

          {/* Credenciales de prueba - Componente externo memorizado */}
          <CredentialsDisplay />

          {/* Footer - Componente externo memorizado */}
          <FooterDisplay />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
