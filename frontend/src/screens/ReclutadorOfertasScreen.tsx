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
import { ofertaService } from '../services/api';

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
  border: '#E0E0E0',
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

interface Oferta {
  id: number;
  titulo: string;
  descripcion: string;
  empresa?: any;
  ubicacion?: string;
  salario?: number;
  estado: 'ABIERTA' | 'CERRADA' | 'PAUSADA';
  modalidad: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
  fechaLimite?: string;
  candidatos?: number;
  reclutadorId?: number;
  fechaCreacion?: string;
}

const ReclutadorOfertasScreen = ({ navigation }: any) => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [ofertasFiltradas, setOfertasFiltradas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [busqueda, setBusqueda] = useState('');

  // Recargar datos cuando la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [user])
  );

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('user');
      const userParsed = userData ? JSON.parse(userData) : null;
      setUser(userParsed);

      if (userParsed?.id) {
        await cargarOfertas(userParsed.id);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar tus ofertas');
    } finally {
      setLoading(false);
    }
  };

  const cargarOfertas = async (reclutadorId: number) => {
    try {
      setLoading(true);
      console.log('⏳ Cargando ofertas del reclutador ID:', reclutadorId);
      
      const response = await ofertaService.getByReclutador(reclutadorId);
      const data = response.data || [];
      
      console.log('📦 Ofertas recibidas:', data.length);
      setOfertas(data);
      aplicarFiltros(data, filtroEstado, busqueda);
    } catch (error: any) {
      console.error('Error cargando ofertas:', error);
      Alert.alert('Error', 'No se pudieron cargar tus ofertas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user?.id) {
        await cargarOfertas(user.id);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const aplicarFiltros = (datos: Oferta[], estado: string, buscar: string) => {
    let resultado = datos;

    // Filtrar por estado
    if (estado !== 'TODOS') {
      resultado = resultado.filter((o) => o.estado === estado);
    }

    // Filtrar por búsqueda
    if (buscar.trim()) {
      const termino = buscar.toLowerCase();
      resultado = resultado.filter(
        (o) =>
          o.titulo?.toLowerCase().includes(termino) ||
          o.empresa?.nombre?.toLowerCase().includes(termino) ||
          o.descripcion?.toLowerCase().includes(termino)
      );
    }

    setOfertasFiltradas(resultado);
  };

  const handleBusqueda = (texto: string) => {
    setBusqueda(texto);
    aplicarFiltros(ofertas, filtroEstado, texto);
  };

  const handleFiltroEstado = (estado: string) => {
    setFiltroEstado(estado);
    aplicarFiltros(ofertas, estado, busqueda);
  };

  const handleCrearOferta = () => {
    navigation.navigate('CrearOferta');
  };

  const handleEditarOferta = (ofertaId: number) => {
    console.log('✏️ Editando oferta ID:', ofertaId);
    navigation.navigate('CrearOferta', {
      ofertaId,
      editMode: true,
    });
  };

  const handleEliminarOferta = (oferta: Oferta) => {
    Alert.alert(
      '❌ Eliminar Oferta',
      `¿Está seguro que desea eliminar "${oferta.titulo}"?\n\nEsta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Eliminando oferta ID:', oferta.id);
              await ofertaService.delete(oferta.id);

              // Actualizar estado inmediatamente
              setOfertas((prevOfertas) =>
                prevOfertas.filter((o) => o.id !== oferta.id)
              );

              Alert.alert('✅ Éxito', 'Oferta eliminada correctamente');
              console.log('✅ Oferta ID', oferta.id, 'eliminada');
            } catch (error: any) {
              console.error('❌ Error eliminando oferta:', error);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Error al eliminar oferta'
              );
            }
          },
        },
      ]
    );
  };

  const handleVerCandidatos = (ofertaId: number) => {
    console.log('👥 Ver candidatos de oferta ID:', ofertaId);
    navigation.navigate('GestionarCandidatos', { reclutadorId: user?.id });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ABIERTA':
        return COLORES.verde;
      case 'CERRADA':
        return COLORES.rojo;
      case 'PAUSADA':
        return COLORES.naranja;
      default:
        return COLORES.grisOscuro;
    }
  };

  const renderOfertaItem = ({ item }: { item: Oferta }) => (
    <View style={[styles.ofertaCard, { borderLeftColor: getEstadoColor(item.estado) }]}>
      {/* Header */}
      <View style={styles.ofertaHeader}>
        <View style={styles.ofertaInfo}>
          <Text style={styles.ofertaTitulo} numberOfLines={2}>
            {item.titulo}
          </Text>
          <Text style={styles.ofertaEmpresa} numberOfLines={1}>
            {item.empresa?.nombre || 'Empresa desconocida'}
          </Text>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
          <Text style={styles.estadoText}>{item.estado}</Text>
        </View>
      </View>

      {/* Detalles */}
      <View style={styles.detallesContainer}>
        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>📍 Modalidad:</Text>
          <Text style={styles.detalleValue}>{item.modalidad || 'N/A'}</Text>
        </View>

        {item.salario && (
          <View style={styles.detalleRow}>
            <Text style={styles.detalleLabel}>💰 Salario:</Text>
            <Text style={styles.detalleValue}>${item.salario.toLocaleString()}</Text>
          </View>
        )}

        <View style={styles.detalleRow}>
          <Text style={styles.detalleLabel}>👥 Candidatos:</Text>
          <Text style={styles.detalleValue}>{item.candidatos || 0}</Text>
        </View>
      </View>

      {/* Descripción */}
      <Text style={styles.ofertaDescripcion} numberOfLines={2}>
        {item.descripcion}
      </Text>

      {/* Botones de acción */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORES.acento }]}
          onPress={() => handleVerCandidatos(item.id)}
        >
          <Text style={styles.actionButtonText}>👥 Candidatos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORES.naranja }]}
          onPress={() => handleEditarOferta(item.id)}
        >
          <Text style={styles.actionButtonText}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORES.rojo }]}
          onPress={() => handleEliminarOferta(item)}
        >
          <Text style={styles.actionButtonText}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORES.principal} />
        <Text style={styles.loadingText}>Cargando mis ofertas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mis Ofertas Publicadas</Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: COLORES.principal }]}
          onPress={handleCrearOferta}
        >
          <Text style={styles.createButtonText}>+ Nueva Oferta</Text>
        </TouchableOpacity>
      </View>

      {/* Búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por título o empresa..."
        value={busqueda}
        onChangeText={handleBusqueda}
        placeholderTextColor={COLORES.textoClaro}
      />

      {/* Filtros de estado */}
      <View style={styles.filtrosContainer}>
        {['TODOS', 'ABIERTA', 'CERRADA', 'PAUSADA'].map((estado) => (
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

      {/* Lista de ofertas */}
      <FlatList
        data={ofertasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOfertaItem}
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
              {busqueda || filtroEstado !== 'TODOS'
                ? 'No hay ofertas que coincidan'
                : 'Aún no has publicado ofertas'}
            </Text>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: COLORES.principal }]}
              onPress={handleCrearOferta}
            >
              <Text style={styles.emptyButtonText}>+ Crear Primera Oferta</Text>
            </TouchableOpacity>
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
    paddingTop: ESPACIADOS.sm,
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
    marginBottom: ESPACIADOS.md,
  },

  createButton: {
    paddingVertical: ESPACIADOS.md,
    paddingHorizontal: ESPACIADOS.lg,
    borderRadius: RADIOS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },

  createButtonText: {
    color: COLORES.blanco,
    fontWeight: '600',
    fontSize: TAMAÑOS_FUENTE.md,
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
    flexDirection: 'row',
    marginBottom: ESPACIADOS.md,
    justifyContent: 'space-between',
  },

  filtroButton: {
    paddingHorizontal: ESPACIADOS.sm,
    paddingVertical: ESPACIADOS.xs,
    borderRadius: RADIOS.md,
    borderWidth: 1,
    borderColor: COLORES.gris,
    backgroundColor: COLORES.blanco,
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
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

  ofertaCard: {
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

  ofertaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ESPACIADOS.md,
  },

  ofertaInfo: {
    flex: 1,
    marginRight: ESPACIADOS.md,
  },

  ofertaTitulo: {
    fontSize: TAMAÑOS_FUENTE.lg,
    fontWeight: '700',
    color: COLORES.texto,
    marginBottom: ESPACIADOS.xs,
  },

  ofertaEmpresa: {
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
    alignItems: 'center',
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

  ofertaDescripcion: {
    fontSize: TAMAÑOS_FUENTE.sm,
    lineHeight: 18,
    color: COLORES.textoClaro,
    marginBottom: ESPACIADOS.md,
  },

  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ESPACIADOS.sm,
    marginTop: ESPACIADOS.md,
  },

  actionButton: {
    flex: 1,
    paddingVertical: ESPACIADOS.sm,
    borderRadius: RADIOS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionButtonText: {
    color: COLORES.blanco,
    fontSize: TAMAÑOS_FUENTE.xs,
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
    marginBottom: ESPACIADOS.lg,
    textAlign: 'center',
  },

  emptyButton: {
    paddingHorizontal: ESPACIADOS.lg,
    paddingVertical: ESPACIADOS.md,
    borderRadius: RADIOS.lg,
  },

  emptyButtonText: {
    color: COLORES.blanco,
    fontWeight: '600',
    fontSize: TAMAÑOS_FUENTE.sm,
  },
});

export default ReclutadorOfertasScreen;
