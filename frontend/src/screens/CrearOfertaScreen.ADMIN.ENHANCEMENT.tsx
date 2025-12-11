// @ts-ignore - React hooks types handled by Expo
import React, { useState, useEffect } from 'react';
// @ts-ignore
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
// @ts-ignore - These components are available but TypeScript doesn't recognize them
const Platform = require('react-native').Platform;
// @ts-ignore
const KeyboardAvoidingView = require('react-native').KeyboardAvoidingView;
// @ts-ignore
const SafeAreaView = require('react-native').SafeAreaView;
// @ts-ignore - Navigation types handled by Expo
import { useNavigation, useRoute } from '@react-navigation/native';
// @ts-ignore - ofertaService module resolution handled by Expo
import ofertaService, { Oferta } from '../services/ofertaService';
import { GlobalStyles } from '../styles/GlobalStyles';

type CrearOfertaScreenProps = {
  navigation?: any;
  route?: any;
};

// @ts-ignore - Component type handled by Expo
const CrearOfertaScreen = () => {
  const navigation = useNavigation();
  // @ts-ignore - Route type handled by Expo
  const route = useRoute();
  const ofertaAEditar = route?.params?.ofertaAEditar;
  const isEditing = !!ofertaAEditar;

  // Form State
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [salario, setSalario] = useState('');
  const [estado, setEstado] = useState<'ABIERTA' | 'CERRADA' | 'PAUSADA'>('ABIERTA');
  const [modalidad, setModalidad] = useState<'PRESENCIAL' | 'REMOTO' | 'HIBRIDO'>('REMOTO');
  const [fechaLimite, setFechaLimite] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize form with oferta data if editing
  useEffect(() => {
    if (isEditing && ofertaAEditar) {
      setTitulo(ofertaAEditar.titulo || '');
      setDescripcion(ofertaAEditar.descripcion || '');
      setSalario(ofertaAEditar.salario?.toString() || '');
      setEstado(ofertaAEditar.estado || 'ABIERTA');
      setModalidad(ofertaAEditar.modalidad || 'REMOTO');
      setFechaLimite(ofertaAEditar.fechaLimite || '');
    }
  }, [isEditing, ofertaAEditar]);

  /**
   * Valida los campos del formulario
   */
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    if (!salario.trim()) {
      newErrors.salario = 'El salario es obligatorio';
    } else if (isNaN(Number(salario))) {
      newErrors.salario = 'El salario debe ser un número válido';
    }
    if (!fechaLimite.trim()) {
      newErrors.fechaLimite = 'La fecha límite es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Crea o actualiza la oferta
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validación', 'Por favor completa todos los campos correctamente');
      return;
    }

    try {
      setLoading(true);

      // Obtener reclutador ID del usuario autenticado
      // @ts-ignore - AsyncStorage types handled by Expo
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const reclutadorId = user?.id || 1; // Default a 1 si no hay usuario

      // Estructura del objeto respetando relaciones anidadas (CRÍTICO para backend)
      const ofertaData: Partial<Oferta> = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        salario: Number(salario),
        estado,
        modalidad,
        fechaLimite: fechaLimite.trim(),
      };

      let message = '';

      if (isEditing && ofertaAEditar?.id) {
        // Editar oferta existente
        await ofertaService.updateOferta(ofertaAEditar.id, ofertaData);
        message = 'Oferta actualizada correctamente';
      } else {
        // Crear nueva oferta
        await ofertaService.createOferta(ofertaData);
        message = 'Oferta creada correctamente';
      }

      Alert.alert('Éxito', message, [
        {
          text: 'OK',
          onPress: () => {
            // Volver a AdminOfertasScreen (se refrescará automáticamente via useFocusEffect)
            navigation.goBack();
          },
        },
      ]);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Error al procesar la oferta';
      Alert.alert('Error', errorMessage);
      console.error('Error detallado:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert('Descartar cambios', '¿Descartas los cambios realizados?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Sí, descartar',
        style: 'destructive',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  // @ts-ignore - Component type handled by Expo
  const StateButton = ({
    value,
    label,
  }) => (
    <TouchableOpacity
      style={[
        { padding: 10, borderRadius: 8, marginRight: 8, marginBottom: 8 },
        estado === value
          ? { backgroundColor: '#6200EE', borderWidth: 2, borderColor: '#6200EE' }
          : { backgroundColor: '#E0E0E0', borderWidth: 2, borderColor: '#BDBDBD' },
      ]}
      onPress={() => setEstado(value)}
    >
      <Text
        style={{
          color: estado === value ? '#FFFFFF' : '#000000',
          fontWeight: '600',
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // @ts-ignore - Component type handled by Expo
  const ModalityButton = ({
    value,
    label,
  }) => (
    <TouchableOpacity
      style={[
        { padding: 10, borderRadius: 8, marginRight: 8, marginBottom: 8 },
        modalidad === value
          ? { backgroundColor: '#03DAC6', borderWidth: 2, borderColor: '#03DAC6' }
          : { backgroundColor: '#E0E0E0', borderWidth: 2, borderColor: '#BDBDBD' },
      ]}
      onPress={() => setModalidad(value)}
    >
      <Text
        style={{
          color: modalidad === value ? '#FFFFFF' : '#000000',
          fontWeight: '600',
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // @ts-ignore - Component type handled by Expo
  const InputField = ({
    label,
    placeholder,
    value,
    onChangeText,
    multiline = false,
    keyboardType = 'default',
    error,
  }) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#000' }}>
        {label}
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: error ? '#F44336' : '#BDBDBD',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: multiline ? 12 : 8,
          fontSize: 14,
          minHeight: multiline ? 100 : 40,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        placeholder={placeholder}
        placeholderTextColor="#9E9E9E"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        editable={!loading}
      />
      {error && (
        <Text style={{ fontSize: 12, color: '#F44336', marginTop: 4 }}>
          ⚠️ {error}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {/* Header */}
          <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 24, color: '#000' }}>
            {isEditing ? `Editar: ${titulo || 'Oferta'}` : 'Nueva Oferta'}
          </Text>

          {/* Form Fields */}
          <InputField
            label="Título *"
            placeholder="Ej: Desarrollador React Native Senior"
            value={titulo}
            onChangeText={setTitulo}
            error={errors.titulo}
          />

          <InputField
            label="Descripción *"
            placeholder="Describe el puesto, responsabilidades, requisitos..."
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            error={errors.descripcion}
          />

          <InputField
            label="Salario (COP) *"
            placeholder="Ej: 5000000"
            value={salario}
            onChangeText={setSalario}
            keyboardType="numeric"
            error={errors.salario}
          />

          <InputField
            label="Fecha Límite (YYYY-MM-DD) *"
            placeholder="Ej: 2025-12-31"
            value={fechaLimite}
            onChangeText={setFechaLimite}
            error={errors.fechaLimite}
          />

          {/* Estado Selection */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#000' }}>
              Estado *
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <StateButton value="ABIERTA" label="Abierta" />
              <StateButton value="CERRADA" label="Cerrada" />
              <StateButton value="PAUSADA" label="Pausada" />
            </View>
          </View>

          {/* Modalidad Selection */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#000' }}>
              Modalidad *
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <ModalityButton value="PRESENCIAL" label="Presencial" />
              <ModalityButton value="REMOTO" label="Remoto" />
              <ModalityButton value="HIBRIDO" label="Híbrido" />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#6200EE',
                paddingVertical: 14,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: loading ? 0.6 : 1,
              }}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                  {isEditing ? '💾 Actualizar Oferta' : '➕ Crear Oferta'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#E0E0E0',
                paddingVertical: 14,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: loading ? 0.6 : 1,
              }}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={{ color: '#000000', fontSize: 16, fontWeight: '600' }}>
                ❌ Descartar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CrearOfertaScreen;
