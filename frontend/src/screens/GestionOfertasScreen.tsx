import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { ofertaService } from '../services/api';
import { OfertaResponse } from '../types/oferta';

// ==================== INTERFACES ====================

interface FormOferta {
  id?: number;
  titulo: string;
  descripcion: string;
  salario: string;
  numeroVacantes: string;
  modalidad: 'REMOTO' | 'PRESENCIAL' | 'HIBRIDO';
  tipoContrato: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'TEMPORAL' | 'PRESTACION_SERVICIOS' | 'PRACTICAS';
  municipioId: string;
  nivelExperiencia: 'SIN_EXPERIENCIA' | 'BASICO' | 'INTERMEDIO' | 'AVANZADO' | 'EXPERTO';
  estado: 'ABIERTA' | 'CERRADA' | 'PAUSADA';
  fechaLimite: string;
}

const initialFormState: FormOferta = {
  titulo: '',
  descripcion: '',
  salario: '',
  numeroVacantes: '',
  modalidad: 'PRESENCIAL',
  tipoContrato: 'TIEMPO_COMPLETO',
  municipioId: '1',
  nivelExperiencia: 'INTERMEDIO',
  estado: 'ABIERTA',
  fechaLimite: '',
};

// ==================== PANTALLA ====================

export const GestionOfertasScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [ofertas, setOfertas] = useState<OfertaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<FormOferta>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ==================== FUNCIONES ====================

  const cargarOfertas = async () => {
    try {
      setLoading(true);
      const data = await ofertaService.getAll();
      // Filtrar solo las ofertas del reclutador actual
      const misofertas = data.filter(
        (oferta: any) => oferta.empresa?.reclutadores?.some((r: any) => r.id === user?.usuarioId)
      );
      setOfertas(misofertas);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar las ofertas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarOfertas();
    setRefreshing(false);
  };

  useEffect(() => {
    cargarOfertas();
  }, []);

  const handleAbrirFormulario = (oferta?: OfertaResponse) => {
    if (oferta) {
      setEditingId(oferta.id);
      setForm({
        id: oferta.id,
        titulo: oferta.titulo,
        descripcion: oferta.descripcion,
        salario: oferta.salario?.toString() || '',
        numeroVacantes: oferta.numeroVacantes?.toString() || '',
        modalidad: oferta.modalidad || 'PRESENCIAL',
        tipoContrato: oferta.tipoContrato || 'TIEMPO_COMPLETO',
        municipioId: oferta.municipio?.id?.toString() || '1',
        nivelExperiencia: oferta.nivelExperiencia || 'INTERMEDIO',
        estado: oferta.estado || 'ABIERTA',
        fechaLimite: oferta.fechaLimite || '',
      });
    } else {
      setEditingId(null);
      setForm(initialFormState);
    }
    setModalVisible(true);
  };

  const handleCerrarFormulario = () => {
    setModalVisible(false);
    setForm(initialFormState);
    setEditingId(null);
  };

  const validarForm = (): boolean => {
    if (!form.titulo.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return false;
    }
    if (!form.descripcion.trim()) {
      Alert.alert('Error', 'La descripción es requerida');
      return false;
    }
    if (!form.salario || parseInt(form.salario) < 0) {
      Alert.alert('Error', 'El salario debe ser un número válido');
      return false;
    }
    if (!form.numeroVacantes || parseInt(form.numeroVacantes) < 1) {
      Alert.alert('Error', 'El número de vacantes debe ser mayor a 0');
      return false;
    }
    if (!form.fechaLimite) {
      Alert.alert('Error', 'La fecha límite es requerida');
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validarForm()) return;

    try {
      setLoading(true);

      const datosEnviar = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        salario: parseInt(form.salario),
        numeroVacantes: parseInt(form.numeroVacantes),
        modalidad: form.modalidad,
        tipoContrato: form.tipoContrato,
        municipioId: parseInt(form.municipioId),
        nivelExperiencia: form.nivelExperiencia,
        estado: form.estado,
        fechaLimite: form.fechaLimite,
      };

      if (editingId) {
        await ofertaService.update(editingId, datosEnviar);
        Alert.alert('Éxito', 'Oferta actualizada correctamente');
      } else {
        await ofertaService.create(datosEnviar);
        Alert.alert('Éxito', 'Oferta creada correctamente');
      }

      handleCerrarFormulario();
      await cargarOfertas();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar la oferta');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = (ofertaId: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta oferta?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              setLoading(true);
              await ofertaService.delete(ofertaId);
              Alert.alert('Éxito', 'Oferta eliminada correctamente');
              await cargarOfertas();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar la oferta');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // ==================== COMPONENTES ====================

  const renderOfertaItem = ({ item }: { item: OfertaResponse }) => (
    <View style={styles.ofertaCard}>
      <View style={styles.ofertaHeader}>
        <Text style={styles.ofertaTitulo}>{item.titulo}</Text>
        <View style={[
          styles.estadoBadge,
          item.estado === 'ABIERTA' && styles.estadoAbierta,
          item.estado === 'CERRADA' && styles.estadoCerrada,
          item.estado === 'PAUSADA' && styles.estadoPausada,
        ]}>
          <Text style={styles.estadoText}>{item.estado}</Text>
        </View>
      </View>

      <Text style={styles.ofertaDescripcion} numberOfLines={2}>
        {item.descripcion}
      </Text>

      <View style={styles.ofertaDetalles}>
        <Text style={styles.detalleTexto}>💰 ${item.salario?.toLocaleString()}</Text>
        <Text style={styles.detalleTexto}>📍 {item.modalidad}</Text>
        <Text style={styles.detalleTexto}>👥 {item.numeroVacantes} vacantes</Text>
      </View>

      <View style={styles.ofertaAcciones}>
        <TouchableOpacity
          style={[styles.boton, styles.botonEditar]}
          onPress={() => handleAbrirFormulario(item)}
        >
          <Text style={styles.botonTexto}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, styles.botonEliminar]}
          onPress={() => handleEliminar(item.id)}
        >
          <Text style={styles.botonTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFormulario = () => {
    if (!modalVisible) return null;
    
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <ScrollView
            style={styles.formulario}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                {editingId ? 'Editar Oferta' : 'Nueva Oferta'}
              </Text>
              <TouchableOpacity onPress={handleCerrarFormulario}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Campo Título */}
            <View style={styles.campoGrupo}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Desarrollador Java Senior"
                placeholderTextColor="#999"
                value={form.titulo}
                onChangeText={(text) => setForm({ ...form, titulo: text })}
              />
            </View>

            {/* Campo Descripción */}
            <View style={styles.campoGrupo}>
              <Text style={styles.label}>Descripción *</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Describe la oferta, responsabilidades, requisitos..."
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={4}
                value={form.descripcion}
                onChangeText={(text) => setForm({ ...form, descripcion: text })}
              />
            </View>

            {/* Salario */}
            <View style={styles.campoGrupo}>
              <Text style={styles.label}>Salario (mensual) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 3000000"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={form.salario}
                onChangeText={(text) => setForm({ ...form, salario: text })}
              />
            </View>

            {/* Número de Vacantes */}
            <View style={styles.campoGrupo}>
              <Text style={styles.label}>Número de Vacantes *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 3"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={form.numeroVacantes}
                onChangeText={(text) => setForm({ ...form, numeroVacantes: text })}
              />
            </View>

            {/* Modalidad */}
            <View style={styles.campoGrupo}>
              <Text style={styles.label}>Modalidad *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.modalidad}
                  onValueChange={(itemValue) =>
                    setForm({ ...form, modalidad: itemValue })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Presencial" value="PRESENCIAL" />
                  <Picker.Item label="Remoto" value="REMOTO" />
                  <Picker.Item label="Híbrido" value="HIBRIDO" />
                </Picker>
              </View>
            </View>

            {/* Tipo de Contrato */}
            <View style={styles.campoGrupo}>
              <Text style={styles.label}>Tipo de Contrato *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.tipoContrato}
                  onValueChange={(itemValue) =>
                    setForm({ ...form, tipoContrato: itemValue })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Tiempo Completo" value="TIEMPO_COMPLETO" />
                  <Picker.Item label="Medio Tiempo" value="MEDIO_TIEMPO" />
                  <Picker.Item label="Temporal" value="TEMPORAL" />
                  <Picker.Item label="Prestación de Servicios" value="PRESTACION_SERVICIOS" />
                  <Picker.Item label="Prácticas" value="PRACTICAS" />
                </Picker>
              </View>
            </View>

            {/* Nivel de Experiencia */}
            <View style={styles.campoGrupo}>
              <Text style={styles.label}>Nivel de Experiencia *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.nivelExperiencia}
                  onValueChange={(itemValue) =>
                    setForm({ ...form, nivelExperiencia: itemValue })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Sin Experiencia" value="SIN_EXPERIENCIA" />
                  <Picker.Item label="Básico" value="BASICO" />
                  <Picker.Item label="Intermedio" value="INTERMEDIO" />
                  <Picker.Item label="Avanzado" value="AVANZADO" />
                  <Picker.Item label="Experto" value="EXPERTO" />
                </Picker>
              </View>
            </View>

            {/* Estado */}
            <View style={styles.campoGrupo}>
              <Text style={styles.label}>Estado *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.estado}
                  onValueChange={(itemValue) =>
                    setForm({ ...form, estado: itemValue })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Abierta" value="ABIERTA" />
                  <Picker.Item label="Cerrada" value="CERRADA" />
                  <Picker.Item label="Pausada" value="PAUSADA" />
                </Picker>
              </View>
            </View>

            {/* Fecha Límite */}
            <View style={styles.campoGrupo}>
              <Text style={styles.label}>Fecha Límite (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-12-31"
                placeholderTextColor="#999"
                value={form.fechaLimite}
                onChangeText={(text) => setForm({ ...form, fechaLimite: text })}
              />
            </View>

            {/* Botones */}
            <View style={styles.botonesFormulario}>
              <TouchableOpacity
                style={[styles.boton, styles.botonGuardar]}
                onPress={handleGuardar}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.botonTexto}>
                    {editingId ? 'Actualizar' : 'Crear Oferta'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.boton, styles.botonCancelar]}
                onPress={handleCerrarFormulario}
                disabled={loading}
              >
                <Text style={styles.botonTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
    );
  };

  // ==================== RENDER ====================

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Mis Ofertas</Text>
        <TouchableOpacity
          style={styles.botonCrear}
          onPress={() => handleAbrirFormulario()}
        >
          <Text style={styles.botonCrearText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando ofertas...</Text>
        </View>
      ) : ofertas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tienes ofertas creadas</Text>
          <Text style={styles.emptySubtext}>
            Toca "+ Nueva" para crear tu primera oferta
          </Text>
        </View>
      ) : (
        <FlatList
          data={ofertas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOfertaItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
        />
      )}

      {/* Formulario Modal */}
      {renderFormulario()}
    </View>
  );
};

// ==================== ESTILOS ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },

  botonCrear: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },

  botonCrearText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  // ========== CARD OFERTA ==========

  ofertaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  ofertaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  ofertaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    paddingRight: 8,
  },

  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  estadoAbierta: {
    backgroundColor: '#e8f5e9',
  },

  estadoCerrada: {
    backgroundColor: '#ffebee',
  },

  estadoPausada: {
    backgroundColor: '#fff3e0',
  },

  estadoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },

  ofertaDescripcion: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },

  ofertaDetalles: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 8,
  },

  detalleTexto: {
    fontSize: 12,
    color: '#555',
  },

  ofertaAcciones: {
    flexDirection: 'row',
    gap: 8,
  },

  boton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },

  botonEditar: {
    backgroundColor: '#007AFF',
  },

  botonEliminar: {
    backgroundColor: '#ff3b30',
  },

  botonTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },

  // ========== MODAL FORMULARIO ==========

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 999,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '50%',
  },

  formulario: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 12,
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },

  closeButton: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },

  campoGrupo: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },

  inputMultiline: {
    textAlignVertical: 'top',
    paddingVertical: 12,
    minHeight: 100,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },

  picker: {
    color: '#000',
    backgroundColor: '#f9f9f9',
  },

  botonesFormulario: {
    flexDirection: 'column',
    gap: 10,
    marginVertical: 20,
    marginBottom: 30,
  },

  botonGuardar: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
  },

  botonCancelar: {
    backgroundColor: '#999',
    paddingVertical: 12,
  },
});

export default GestionOfertasScreen;
