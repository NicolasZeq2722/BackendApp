/**
 * 📚 USAGE EXAMPLES - Sistema de Diseño Workable
 * 
 * Este archivo demuestra cómo usar los nuevos componentes y el sistema de temas
 * en tu aplicación React Native.
 * 
 * NOTA: Este archivo es solo de referencia y no se importa en la aplicación
 */

// ============================================================
// 1️⃣ IMPORTAR COMPONENTES Y TEMA
// ============================================================

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';

// Importar componentes
import { GradientButton, Card, TextInput } from './components';

// Importar tema
import { Colors, ColorAliases, Gradients } from './theme/colors';
import { Typography } from './theme/typography';
import { Spacing, BorderRadius, Sizing } from './theme/spacing';

// ============================================================
// 2️⃣ USAR EN LOGINSCREEN (EJEMPLO)
// ============================================================

export function LoginScreenExample() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const handleLogin = async () => {
    const newErrors: typeof errors = {};
    
    if (!username) newErrors.username = 'Usuario requerido';
    if (!password) newErrors.password = 'Contraseña requerida';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Hacer login
    console.log('Login con:', username, password);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Card con form */}
      <Card style={styles.formCard} padding={Spacing.xl}>
        {/* Input usuario */}
        <TextInput
          label="Usuario"
          placeholder="Ingresa tu usuario"
          value={username}
          onChangeText={setUsername}
          error={errors.username}
          keyboardType="default"
        />

        {/* Input contraseña */}
        <TextInput
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
        />

        {/* Botón login */}
        <GradientButton
          title="Iniciar Sesión"
          onPress={handleLogin}
          size="lg"
          style={styles.loginButton}
        />

        {/* Botón registro con variant outline */}
        <GradientButton
          title="Crear Cuenta"
          onPress={() => console.log('Ir a registro')}
          variant="outline"
          size="md"
          style={styles.registerButton}
        />
      </Card>
    </ScrollView>
  );
}

// ============================================================
// 3️⃣ USAR EN HOMESCREEN (EJEMPLO)
// ============================================================

export function HomeScreenExample() {
  return (
    <ScrollView style={styles.container}>
      {/* Card 1 - Ofertas disponibles */}
      <Card elevated style={styles.contentCard}>
        <View>
          <Text style={styles.cardTitle}>Ofertas Disponibles</Text>
          <Text style={styles.cardContent}>
            Tienes 5 nuevas ofertas que se ajustan a tu perfil
          </Text>
          
          <GradientButton
            title="Ver Ofertas"
            onPress={() => console.log('Ver ofertas')}
            size="md"
            style={styles.actionButton}
          />
        </View>
      </Card>

      {/* Card 2 - Postulaciones pendientes */}
      <Card elevated style={styles.contentCard}>
        <View>
          <Text style={styles.cardTitle}>Postulaciones</Text>
          <Text style={styles.cardContent}>
            3 postulaciones están en proceso de revisión
          </Text>
          
          <GradientButton
            title="Ver Postulaciones"
            onPress={() => console.log('Ver postulaciones')}
            variant="secondary"
            size="md"
            style={styles.actionButton}
          />
        </View>
      </Card>

      {/* Card 3 - Notificaciones */}
      <Card elevated style={styles.contentCard}>
        <Text style={styles.cardTitle}>Notificaciones</Text>
        
        <View style={styles.notificationItem}>
          <Text style={styles.notificationText}>
            ✅ Tu perfil fue aceptado
          </Text>
        </View>
        
        <View style={[styles.notificationItem, { borderTopWidth: 1, borderTopColor: Colors.BorderLight }]}>
          <Text style={styles.notificationText}>
            📅 Nueva cita de entrevista
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

// ============================================================
// 4️⃣ USAR EN OFERTASSCREEN (EJEMPLO CON BÚSQUEDA)
// ============================================================

export function OfertasScreenExample() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <ScrollView style={styles.container}>
      {/* Buscador */}
      <Card style={styles.filterCard} padding={Spacing.md}>
        <TextInput
          placeholder="Buscar ofertas..."
          value={searchText}
          onChangeText={setSearchText}
          keyboardType="default"
        />

        <GradientButton
          title="Filtrar"
          onPress={() => console.log('Filtrar')}
          size="sm"
          style={styles.filterButton}
        />
      </Card>

      {/* Lista de ofertas */}
      {[1, 2, 3].map((id) => (
        <Card key={id} elevated style={styles.ofertaCard}>
          <Text style={styles.ofertaTitle}>Posición de Desarrollador</Text>
          <Text style={styles.ofertaDescription}>
            Buscamos un desarrollador React Native con experiencia
          </Text>
          
          <View style={styles.ofertaFooter}>
            <GradientButton
              title="Ver Detalles"
              onPress={() => console.log(`Ver oferta ${id}`)}
              size="sm"
              style={{ flex: 1, marginRight: Spacing.sm }}
            />
            
            <GradientButton
              title="Postularse"
              onPress={() => console.log(`Postularse a ${id}`)}
              variant="success"
              size="sm"
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

// ============================================================
// 5️⃣ VARIANTES DE BOTONES
// ============================================================

export function ButtonVariantsExample() {
  return (
    <View style={styles.buttonGrid}>
      <GradientButton
        title="Primary"
        onPress={() => {}}
        variant="primary"
      />
      
      <GradientButton
        title="Secondary"
        onPress={() => {}}
        variant="secondary"
      />
      
      <GradientButton
        title="Success"
        onPress={() => {}}
        variant="success"
      />
      
      <GradientButton
        title="Danger"
        onPress={() => {}}
        variant="danger"
      />
      
      <GradientButton
        title="Outline"
        onPress={() => {}}
        variant="outline"
      />
    </View>
  );
}

// ============================================================
// 6️⃣ VARIANTES DE TAMAÑO
// ============================================================

export function SizeVariantsExample() {
  return (
    <View style={styles.container}>
      <GradientButton title="Small" onPress={() => {}} size="sm" />
      <GradientButton title="Medium" onPress={() => {}} size="md" />
      <GradientButton title="Large" onPress={() => {}} size="lg" />
    </View>
  );
}

// ============================================================
// 7️⃣ USANDO TEMA EN ESTILOS PERSONALIZADOS
// ============================================================

export function CustomStylesExample() {
  const customStyles = StyleSheet.create({
    customCard: {
      backgroundColor: Colors.PrimaryLight,
      padding: Spacing.lg,
      borderRadius: BorderRadius.xl,
      marginVertical: Spacing.md,
    },
    
    customText: {
      ...Typography.h2,
      color: Colors.Primary,
      marginBottom: Spacing.md,
    },
    
    customButton: {
      marginTop: Spacing.lg,
      paddingHorizontal: Spacing.xl,
    },
  });

  return (
    <View style={customStyles.customCard}>
      <Text style={customStyles.customText}>
        Usando tema en estilos personalizados
      </Text>
      
      <GradientButton
        title="Acción"
        onPress={() => {}}
        style={customStyles.customButton}
      />
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  
  scrollContent: {
    padding: Spacing.lg,
  },
  
  formCard: {
    marginVertical: Spacing.lg,
  },
  
  loginButton: {
    marginTop: Spacing.lg,
  },
  
  registerButton: {
    marginTop: Spacing.md,
  },
  
  contentCard: {
    marginVertical: Spacing.md,
  },
  
  cardTitle: {
    ...Typography.h3,
    color: Colors.TextDark,
    marginBottom: Spacing.sm,
  },
  
  cardContent: {
    ...Typography.body,
    color: Colors.TextLight,
    marginBottom: Spacing.md,
  },
  
  actionButton: {
    marginTop: Spacing.md,
  },
  
  notificationItem: {
    paddingVertical: Spacing.md,
  },
  
  notificationText: {
    ...Typography.body,
    color: Colors.TextDark,
  },
  
  filterCard: {
    marginBottom: Spacing.lg,
  },
  
  filterButton: {
    marginTop: Spacing.md,
  },
  
  ofertaCard: {
    marginVertical: Spacing.sm,
  },
  
  ofertaTitle: {
    ...Typography.h4,
    color: Colors.TextDark,
    marginBottom: Spacing.xs,
  },
  
  ofertaDescription: {
    ...Typography.body,
    color: Colors.TextLight,
    marginBottom: Spacing.md,
  },
  
  ofertaFooter: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  
  buttonGrid: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
});

// ============================================================
// GUÍA DE USO - COPIAR Y PEGAR
// ============================================================

/*

✅ IMPORTAR COMPONENTES:
import { GradientButton, Card, TextInput } from '../components';

✅ IMPORTAR TEMA:
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

✅ USAR GRADIENTBUTTON:
<GradientButton
  title="Hacer algo"
  onPress={() => handleAction()}
  variant="primary"  // 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
  size="md"          // 'sm' | 'md' | 'lg'
  loading={isLoading}
  disabled={isDisabled}
/>

✅ USAR CARD:
<Card elevated padding={Spacing.lg}>
  <Text>Contenido de la tarjeta</Text>
</Card>

✅ USAR TEXTINPUT:
<TextInput
  label="Etiqueta"
  placeholder="Placeholder"
  value={value}
  onChangeText={setValue}
  error={errorMessage}
  secureTextEntry={isPassword}
/>

✅ USAR COLORES:
backgroundColor: Colors.Primary
color: Colors.TextDark
borderColor: Colors.BorderLight

✅ USAR ESPACIOS:
padding: Spacing.lg           // 16px
margin: Spacing.md            // 12px
gap: Spacing.sm               // 8px

✅ USAR TIPOGRAFÍA:
...Typography.h1              // Heading 1
...Typography.body            // Body text
...Typography.captionSmall    // Caption pequeño

*/
