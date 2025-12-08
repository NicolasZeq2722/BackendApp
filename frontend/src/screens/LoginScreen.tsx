import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { loginStyles } from '../styles/LoginStyles';
import { Colors } from '../styles/GlobalStyles';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = async () => {
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
  };

  return (
    <View style={loginStyles.container}>
      <ScrollView 
        contentContainerStyle={loginStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header con logo y título */}
        <View style={loginStyles.headerContainer}>
          <View style={loginStyles.logoContainer}>
            <Text style={loginStyles.logoIcon}>💼</Text>
          </View>
          <Text style={loginStyles.appTitle}>Workable</Text>
          <Text style={loginStyles.appSubtitle}>Sistema de Empleo</Text>
        </View>

        {/* Formulario de login */}
        <View style={loginStyles.formContainer}>
          <Text style={loginStyles.formTitle}>Iniciar Sesión</Text>
          
          {/* Error message */}
          {error ? (
            <View style={loginStyles.errorContainer}>
              <Text style={loginStyles.errorIcon}>⚠️</Text>
              <Text style={loginStyles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          {/* Campo de usuario */}
          <View style={loginStyles.inputContainer}>
            <Text style={loginStyles.inputLabel}>Usuario</Text>
            <View style={[
              loginStyles.inputWrapper,
              focusedInput === 'username' && loginStyles.inputWrapperFocused
            ]}>
              <Text style={loginStyles.inputIcon}>👤</Text>
              <TextInput
                style={loginStyles.input}
                placeholder="Ingrese su usuario"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                onFocus={() => setFocusedInput('username')}
                onBlur={() => setFocusedInput(null)}
                editable={!loading}
              />
            </View>
          </View>
          
          {/* Campo de contraseña */}
          <View style={loginStyles.inputContainer}>
            <Text style={loginStyles.inputLabel}>Contraseña</Text>
            <View style={[
              loginStyles.inputWrapper,
              focusedInput === 'password' && loginStyles.inputWrapperFocused
            ]}>
              <Text style={loginStyles.inputIcon}>🔒</Text>
              <TextInput
                style={loginStyles.input}
                placeholder="Ingrese su contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                editable={!loading}
              />
            </View>
          </View>
          
          {/* Botón de login */}
          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity 
              style={[
                loginStyles.loginButton,
                loading && loginStyles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={loginStyles.loadingContainer}>
                  <ActivityIndicator color={Colors.white} size="small" />
                  <Text style={loginStyles.loadingText}>Iniciando sesión...</Text>
                </View>
              ) : (
                <Text style={loginStyles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Credenciales de prueba */}
        <View style={loginStyles.credentialsContainer}>
          <Text style={loginStyles.credentialsTitle}>🔑 Credenciales de prueba</Text>
          <Text style={loginStyles.credentialsText}>
            Admin: admin / admin123{'\n'}
            Reclutador: reclutador / reclu123{'\n'}
            Aspirante: aspirante / aspi123
          </Text>
        </View>

        {/* Footer */}
        <View style={loginStyles.footerContainer}>
          <Text style={loginStyles.footerText}>
            © 2025 Workable{'\n'}
            Versión 1.0.0 - Sistema de Empleo
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
