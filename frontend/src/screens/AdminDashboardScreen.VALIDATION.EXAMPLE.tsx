/**
 * 🧪 Ejemplo de uso del validador de Admin Dashboard
 * 
 * Copia este código en AdminDashboardScreen.tsx para validar la configuración
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
// @ts-ignore - Validation module import
import AdminDashboardValidator, { ValidationResult } from '../utils/AdminDashboardValidation';

// @ts-ignore
const AdminDashboardScreenWithValidation = ({ navigation }: any) => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  /**
   * Ejecutar validaciones
   */
  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const results = await AdminDashboardValidator.runAllValidations();
      setValidationResults(results);
      AdminDashboardValidator.printReport(results);
      setShowValidation(true);
    } catch (err: any) {
      Alert.alert('Error', `Error durante validación: ${err.message}`);
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Auto-validar al montarse (desarrollo)
   */
  useEffect(() => {
    // Descomenta la siguiente línea para validar automáticamente al abrir la pantalla
    // handleValidate();
  }, []);

  if (showValidation && validationResults.length > 0) {
    return (
      <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            📊 Validación Admin Dashboard
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            {new Date().toLocaleString()}
          </Text>
        </View>

        {/* Resultados */}
        {validationResults.map((result, index) => (
          <View
            key={index}
            style={{
              backgroundColor: 'white',
              padding: 12,
              marginBottom: 12,
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor:
                result.status === 'success'
                  ? '#4CAF50'
                  : result.status === 'error'
                    ? '#F44336'
                    : '#FFC107',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: 18,
                  marginRight: 8,
                }}
              >
                {result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⚠️'}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 1 }}>
                {result.name}
              </Text>
            </View>

            <Text style={{ fontSize: 14, marginBottom: 8 }}>
              {result.message}
            </Text>

            {result.details && (
              <Text style={{ fontSize: 12, color: '#666', fontFamily: 'monospace' }}>
                {JSON.stringify(result.details, null, 2)}
              </Text>
            )}
          </View>
        ))}

        {/* Resumen */}
        <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
            📈 Resumen
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                {validationResults.filter((r) => r.status === 'success').length}
              </Text>
              <Text style={{ fontSize: 12, color: '#4CAF50' }}>Exitosas</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                {validationResults.filter((r) => r.status === 'error').length}
              </Text>
              <Text style={{ fontSize: 12, color: '#F44336' }}>Errores</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                {validationResults.filter((r) => r.status === 'warning').length}
              </Text>
              <Text style={{ fontSize: 12, color: '#FFC107' }}>Advertencias</Text>
            </View>
          </View>
        </View>

        {/* Botones */}
        <TouchableOpacity
          onPress={handleValidate}
          style={{
            backgroundColor: '#6200EE',
            padding: 12,
            borderRadius: 8,
            marginTop: 16,
            alignItems: 'center',
          }}
          disabled={isValidating}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {isValidating ? 'Validando...' : 'Validar de nuevo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowValidation(false)}
          style={{
            backgroundColor: '#03DAC6',
            padding: 12,
            borderRadius: 8,
            marginTop: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Ir al Dashboard
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isValidating && <ActivityIndicator size="large" color="#6200EE" />}

      <TouchableOpacity
        onPress={handleValidate}
        disabled={isValidating}
        style={{
          backgroundColor: '#6200EE',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          marginTop: 16,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          🧪 Validar Configuración
        </Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 16, fontSize: 12, color: '#666', textAlign: 'center' }}>
        Presiona el botón para validar que todos{'\n'}
        los servicios estén configurados correctamente
      </Text>
    </View>
  );
};

export default AdminDashboardScreenWithValidation;
