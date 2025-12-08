import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Contexto
import { AuthContext } from '../context/AuthContext';

// Pantallas - Login
import LoginScreen from '../screens/LoginScreen';

// Pantallas - Autenticadas
import HomeScreen from '../screens/HomeScreen';
import OfertasScreen from '../screens/OfertasScreen';
import DetalleOfertaScreen from '../screens/DetalleOfertaScreen';
import PostulacionesScreen from '../screens/PostulacionesScreen';
import CitacionesScreen from '../screens/CitacionesScreen';
import NotificacionesScreen from '../screens/NotificacionesScreen';
import UsuariosScreen from '../screens/UsuariosScreen';
import CrearUsuarioScreen from '../screens/CrearUsuarioScreen';
import CrearOfertaScreen from '../screens/CrearOfertaScreen';
import AdminScreen from '../screens/AdminScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      {user ? (
        // Stack de Usuario Autenticado
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Home' }}
          />
          <Stack.Screen 
            name="Ofertas" 
            component={OfertasScreen}
            options={{ title: 'Ofertas' }}
          />
          <Stack.Screen 
            name="DetalleOferta" 
            component={DetalleOfertaScreen}
            options={{ title: 'Detalle de Oferta' }}
          />
          <Stack.Screen 
            name="Postulaciones" 
            component={PostulacionesScreen}
            options={{ title: 'Postulaciones' }}
          />
          <Stack.Screen 
            name="Citaciones" 
            component={CitacionesScreen}
            options={{ title: 'Citaciones' }}
          />
          <Stack.Screen 
            name="Notificaciones" 
            component={NotificacionesScreen}
            options={{ title: 'Notificaciones' }}
          />
          <Stack.Screen 
            name="Usuarios" 
            component={UsuariosScreen}
            options={{ title: 'Usuarios' }}
          />
          <Stack.Screen 
            name="CrearUsuario" 
            component={CrearUsuarioScreen}
            options={{ title: 'Crear Usuario' }}
          />
          <Stack.Screen 
            name="CrearOferta" 
            component={CrearOfertaScreen}
            options={{ title: 'Crear Oferta' }}
          />
          <Stack.Screen 
            name="Admin" 
            component={AdminScreen}
            options={{ title: 'Admin' }}
          />
        </>
      ) : (
        // Stack de No Autenticado
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
      )}
    </Stack.Navigator>
  );
}

