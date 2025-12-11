// @ts-ignore - React hooks and react-native types handled by Expo
import React, { useEffect, useState, useCallback } from 'react';
// @ts-ignore - react-native types handled by Expo
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
// @ts-ignore - Navigation types handled by Expo
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ofertaService, postulacionService } from '../services/api';

// Colores y estilos base
const COLORES = {
  principal: '#FF6B35',
  acento: '#004E89',
  fondo: '#F5F7FA',
  blanco: '#FFFFFF',
  gris: '#E0E0E0',
  grisOscuro: '#757575',
  texto: '#333333',
  textoClaro: '#666666',
  verde: '#4CAF50',
  naranja: '#FF9800',
  rojo: '#F44336',
  azul: '#2196F3',
};

const ESPACIADOS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

const TAMAÑOS_FUENTE = {
  xs: 12,
  sm: 13,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
};

const RADIOS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

interface Postulacion {
  id: number;
  ofertaId: number;
  ofertaTitulo: string;
  aspiranteId: number;
  aspiranteNombre: string;
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';
  fechaPostulacion: string;
  fechaRespuesta?: string;
  comentarios?: string;
}

interface Oferta {
  id: number;
  titulo: string;
  empresa?: any;
}

const GestionarCandidatosScreen = ({ navigation, route }: any) => {
  const reclutadorId = route.params?.reclutadorId;

  const [candidatos, setCandidatos] = useState<Postulacion[]>([]);
  const [candidatosFiltrados, setCandidatosFiltrados] = useState<Postulacion[]>([]);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<string>('TODAS');

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      setLoading(true);
      await Promise.all([cargarOfertas(), cargarCandidatos()]);
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los candidatos');
    } finally {
      setLoading(false);
    }
  };

  const cargarOfertas = async () => {
    try {
      const response = await ofertaService.getByReclutador(reclutadorId);
      const data = response.data || [];
      setOfertas(data);
    } catch (error) {
      console.error('Error cargando ofertas:', error);
    }
  };

  const cargarCandidatos = async () => {
    try {
      const response = await postulacionService.getByReclutador(reclutadorId);
      const data = response.data || [];
      setCandidatos(data);
      aplicarFiltros(data, filtroEstado, busqueda, ofertaSeleccionada);
    } catch (error) {
      console.error('Error cargando candidatos:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await cargarCandidatos();
    } finally {
      setRefreshing(false);
    }
  };

  const aplicarFiltros = (
    datos: Postulacion[],
    estado: string,
    buscar: string,
    oferta: string
  ) => {
    let resultado = datos;

    // Filtrar por oferta
    if (oferta !== 'TODAS') {
      resultado = resultado.filter((c) => c.ofertaId.toString() === oferta);
    }

    // Filtrar por estado
    if (estado !== 'TODOS') {
      resultado = resultado.filter((c) => c.estado === estado);
    }

    // Filtrar por búsqueda
    if (buscar.trim()) {
      const termino = buscar.toLowerCase();
      resultado = resultado.filter(
        (c) =>
          c.aspiranteNombre?.toLowerCase().includes(termino) ||
          c.ofertaTitulo?.toLowerCase().includes(termino)
      );
    }

    setCandidatosFiltrados(resultado);
  };

  const handleBusqueda = (texto: string) => {
    setBusqueda(texto);
    aplicarFiltros(candidatos, filtroEstado, texto, ofertaSeleccionada);
  };

  const handleFiltroEstado = (estado: string) => {
    setFiltroEstado(estado);
    aplicarFiltros(candidatos, estado, busqueda, ofertaSeleccionada);
  };

  const handleFiltroOferta = (ofertaId: string) => {
    setOfertaSeleccionada(ofertaId);
    aplicarFiltros(candidatos, filtroEstado, busqueda, ofertaId);
  };

  const cambiarEstado = async (postulacion: Postulacion, nuevoEstado: 'ACEPTADA' | 'RECHAZADA') => {
    Alert.alert(
      `${nuevoEstado === 'ACEPTADA' ? '✅ Aceptar' : '❌ Rechazar'} Candidato`,
      `¿Cambiar estado de ${postulacion.aspiranteNombre} a ${nuevoEstado}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              console.log(`Cambiando postulación ${postulacion.id} a ${nuevoEstado}`);
              // Usar el método cambiarEstado de postulacionService desde api
              const userData = await AsyncStorage.getItem('user');
              const userParsed = userData ? JSON.parse(userData) : null;
              
              await postulacionService.cambiarEstado(postulacion.id, nuevoEstado, userParsed?.id || reclutadorId);

              // Actualizar estado local
              const updated = candidatos.map((c) =>
                c.id === postulacion.id ? { ...c, estado: nuevoEstado } : c
              );
              setCandidatos(updated);
              aplicarFiltros(updated, filtroEstado, busqueda, ofertaSeleccionada);

              Alert.alert('✅ Éxito', `Candidato ${nuevoEstado.toLowerCase()}`);
            } catch (error: any) {
              console.error('Error actualizando estado:', error);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Error al actualizar estado'
              );
            }
          },
        },
      ]
    );
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACEPTADA':
        return COLORES.verde;
      case 'RECHAZADA':
        return COLORES.rojo;
      case 'PENDIENTE':
        return COLORES.naranja;
      case 'CANCELADA':
        return COLORES.grisOscuro;
      default:
        return COLORES.textoClaro;
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return fecha;
    }
  };

  const renderCandidatoItem = ({ item }: { item: Postulacion }) => (
    <View style={[styles.candidatoCard, { borderLeftColor: getEstadoColor(item.estado) }]}>
      {/* Header */}
      <View style={styles.candidatoHeader}>
        <View style={styles.candidatoInfo}>
          <Text style={styles.candidatoNombre} numberOfLines={1}>
            {item.aspiranteNombre}
          </Text>
          <Text style={styles.ofertaTitulo} numberOfLines={1}>
            {item.ofertaTitulo}
          </Text>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
          <Text style={styles.estadoText}>{item.estado}</Text>
        </View>
      </View>

      {/* Detalles */}
      <View style={styles.detallesContainer}>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>📅 Postulación:</Text>
          <Text style={styles.detalleValue}>{formatearFecha(item.fechaPostulacion)}</Text>
        </View>

        {item.comentarios && (
          <View style={styles.detalleRow}>
            <Text style={styles.detalleLabel}>💬 Comentarios:</Text>
            <Text style={[styles.detalleValue, { flex: 0 }]} numberOfLines={2}>
              {item.comentarios}
            </Text>
          </View>
        )}
      </View>

      {/* Acciones - Solo para pendientes */}
      {item.estado === 'PENDIENTE' && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORES.verde }]}
            onPress={() => cambiarEstado(item, 'ACEPTADA')}
          >
            <Text style={styles.actionButtonText}>✅ Aceptar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: COLORES.rojo }]}
            onPress={() => cambiarEstado(item, 'RECHAZADA')}
          >
            <Text style={styles.actionButtonText}>❌ Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Estado final */}
      {item.estado !== 'PENDIENTE' && (
        <View style={[styles.statusMessage, { backgroundColor: getEstadoColor(item.estado) + '15' }]}>
          <Text
            style={[
              styles.statusMessageText,
              { color: getEstadoColor(item.estado) },
            ]}
          >
            {item.estado === 'ACEPTADA'
              ? '✅ Candidato aceptado'
              : item.estado === 'RECHAZADA'
              ? '❌ Candidato rechazado'
              : '⚠️ Candidato cancelado'}
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORES.principal} />
        <Text style={styles.loadingText}>Cargando candidatos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Gestionar Candidatos</Text>
      </View>

      {/* Búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre de candidato..."
        value={busqueda}
        onChangeText={handleBusqueda}
        placeholderTextColor={COLORES.textoClaro}
      />

      {/* Filtro de ofertas */}
      <View style={styles.filtrosContainer}>
        <Text style={styles.filtroLabel}>Oferta:</Text>
        <View style={styles.filterButtonsRow}>
          <TouchableOpacity
            key="todas"
            style={[
              styles.filtroButton,
              ofertaSeleccionada === 'TODAS' && [
                styles.filtroButtonActivo,
                { backgroundColor: COLORES.principal },
              ],
            ]}
            onPress={() => handleFiltroOferta('TODAS')}
          >
            <Text
              style={[
                styles.filtroButtonText,
                ofertaSeleccionada === 'TODAS' && styles.filtroButtonTextActivo,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>

          {ofertas.map((oferta) => (
            <TouchableOpacity
              key={oferta.id}
              style={[
                styles.filtroButton,
                ofertaSeleccionada === oferta.id.toString() && [
                  styles.filtroButtonActivo,
                  { backgroundColor: COLORES.principal },
                ],
              ]}
              onPress={() => handleFiltroOferta(oferta.id.toString())}
            >
              <Text
                style={[
                  styles.filtroButtonText,
                  ofertaSeleccionada === oferta.id.toString() &&
                    styles.filtroButtonTextActivo,
                ]}
                numberOfLines={1}
              >
                {oferta.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filtro de estado */}
      <View style={styles.filtrosContainer}>
        <Text style={styles.filtroLabel}>Estado:</Text>
        <View style={styles.filterButtonsRow}>
          {['TODOS', 'PENDIENTE', 'ACEPTADA', 'RECHAZADA'].map((estado) => (
            <TouchableOpacity
              key={estado}
              style={[
                styles.filtroButton,
                filtroEstado === estado && [
                  styles.filtroButtonActivo,
                  { backgroundColor: COLORES.principal },
                ],
              ]}
              onPress={() => handleFiltroEstado(estado)}
            >
              <Text
                style={[
                  styles.filtroButtonText,
                  filtroEstado === estado && styles.filtroButtonTextActivo,
                ]}
              >
                {estado}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lista de candidatos */}
      <FlatList
        data={candidatosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCandidatoItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORES.principal]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {busqueda || filtroEstado !== 'TODOS' || ofertaSeleccionada !== 'TODAS'
                ? 'No hay candidatos que coincidan'
                : 'Aún no tienes candidatos'}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    paddingHorizontal: ESPACIADOS.md,
    paddingTop: ESPACIADOS.md,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORES.fondo,
  },

  loadingText: {
    marginTop: ESPACIADOS.md,
    fontSize: TAMAÑOS_FUENTE.md,
    color: COLORES.textoClaro,
  },

  headerContainer: {
    marginBottom: ESPACIADOS.lg,
  },

  headerTitle: {
    fontSize: TAMAÑOS_FUENTE.xxl,
    fontWeight: '700',
    color: COLORES.principal,
  },

  searchInput: {
    borderWidth: 1.5,
    borderColor: COLORES.principal,
    borderRadius: RADIOS.lg,
    paddingHorizontal: ESPACIADOS.md,
    paddingVertical: ESPACIADOS.sm,
    marginBottom: ESPACIADOS.md,
    fontSize: TAMAÑOS_FUENTE.sm,
    backgroundColor: COLORES.blanco,
    color: COLORES.texto,
  },

  filtrosContainer: {
    marginBottom: ESPACIADOS.md,
  },

  filtroLabel: {
    fontSize: TAMAÑOS_FUENTE.sm,
    fontWeight: '600',
    color: COLORES.texto,
    marginBottom: ESPACIADOS.sm,
  },

  filterButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIADOS.sm,
  },

  filtroButton: {
    paddingHorizontal: ESPACIADOS.sm,
    paddingVertical: ESPACIADOS.xs,
    borderRadius: RADIOS.md,
    borderWidth: 1,
    borderColor: COLORES.gris,
    backgroundColor: COLORES.blanco,
  },

  filtroButtonActivo: {
    borderWidth: 0,
  },

  filtroButtonText: {
    fontSize: TAMAÑOS_FUENTE.xs,
    fontWeight: '500',
    color: COLORES.textoClaro,
  },

  filtroButtonTextActivo: {
    color: COLORES.blanco,
    fontWeight: '600',
  },

  candidatoCard: {
    backgroundColor: COLORES.blanco,
    borderRadius: RADIOS.lg,
    padding: ESPACIADOS.lg,
    marginBottom: ESPACIADOS.md,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  candidatoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ESPACIADOS.md,
  },

  candidatoInfo: {
    flex: 1,
    marginRight: ESPACIADOS.md,
  },

  candidatoNombre: {
    fontSize: TAMAÑOS_FUENTE.lg,
    fontWeight: '700',
    color: COLORES.texto,
    marginBottom: ESPACIADOS.xs,
  },

  ofertaTitulo: {
    fontSize: TAMAÑOS_FUENTE.sm,
    fontWeight: '500',
    color: COLORES.textoClaro,
  },

  estadoBadge: {
    paddingHorizontal: ESPACIADOS.sm,
    paddingVertical: ESPACIADOS.xs,
    borderRadius: RADIOS.md,
    minWidth: 70,
    alignItems: 'center',
  },

  estadoText: {
    color: COLORES.blanco,
    fontSize: TAMAÑOS_FUENTE.xs,
    fontWeight: '600',
  },

  detallesContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: RADIOS.md,
    paddingHorizontal: ESPACIADOS.md,
    paddingVertical: ESPACIADOS.sm,
    marginBottom: ESPACIADOS.md,
  },

  detalleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: ESPACIADOS.xs,
  },

  detalleLabel: {
    fontSize: TAMAÑOS_FUENTE.sm,
    fontWeight: '500',
    color: COLORES.textoClaro,
  },

  detalleValue: {
    fontSize: TAMAÑOS_FUENTE.sm,
    fontWeight: '600',
    color: COLORES.texto,
    flex: 1,
    textAlign: 'right',
  },

  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ESPACIADOS.md,
  },

  actionButton: {
    flex: 1,
    paddingVertical: ESPACIADOS.md,
    borderRadius: RADIOS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionButtonText: {
    color: COLORES.blanco,
    fontSize: TAMAÑOS_FUENTE.sm,
    fontWeight: '600',
  },

  statusMessage: {
    paddingVertical: ESPACIADOS.md,
    paddingHorizontal: ESPACIADOS.lg,
    borderRadius: RADIOS.md,
    alignItems: 'center',
  },

  statusMessageText: {
    fontSize: TAMAÑOS_FUENTE.sm,
    fontWeight: '600',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },

  emptyText: {
    fontSize: TAMAÑOS_FUENTE.md,
    fontWeight: '500',
    color: COLORES.textoClaro,
    textAlign: 'center',
  },
});

export default GestionarCandidatosScreen;
