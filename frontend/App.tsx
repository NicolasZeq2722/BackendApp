import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { setupDatabase } from './src/utils/DatabaseInitializer';

// IMPORTANTE: El Polyfill de Hermes está en index.ts,
// así que App.tsx puede estar limpio.

export default function App() {
  // Inicializar la base de datos al arrancar la app
  useEffect(() => {
    console.log('🚀 Aplicación iniciando...');
    setupDatabase().then(() => {
      console.log('✅ Aplicación lista');
    });
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}