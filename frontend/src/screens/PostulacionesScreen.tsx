import React, { useEffect, useState, useCallback } from 'react';
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
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import postulacionService, { Postulacion } from '../services/postulacionService';

const { width } = Dimensions.get('window');

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

const PostulacionesScreen = ({ navigation }: any) => {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [postulacionesFiltradas, setPostulacionesFiltradas] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarOpcionesEliminar, setMostrarOpcionesEliminar] = useState<number | null>(null);

  // Cargar datos cuando la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('user');
      const userParsed = userData ? JSON.parse(userData) : null;
      setUser(userParsed);

      if (userParsed?.id) {
        await cargarPostulaciones(userParsed.id);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar tus postulaciones');
    } finally {
      setLoading(false);
    }
  };

  const cargarPostulaciones = async (usuarioId: number) => {
    try {
      setLoading(true);
      const data = await postulacionService.getMisPostulaciones(usuarioId);
      setPostulaciones(data || []);
      aplicarFiltros(data || [], filtroEstado, busqueda);
    } catch (error: any) {
      console.error('Error cargando postulaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar tus postulaciones');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user?.id) {
        await cargarPostulaciones(user.id);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const aplicarFiltros = (datos: Postulacion[], estado: string, buscar: string) => {
    let resultado = datos;

    // Filtrar por estado
    if (estado !== 'TODOS') {
      resultado = resultado.filter((p) => p.estado === estado);
    }

    // Filtrar por búsqueda
    if (buscar.trim()) {
      const termino = buscar.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.ofertaTitulo?.toLowerCase().includes(termino) ||
          p.ofertaEmpresa?.toLowerCase().includes(termino) ||
          p.aspiranteNombre?.toLowerCase().includes(termino)
      );
    }

    setPostulacionesFiltradas(resultado);
  };

  const handleBusqueda = (texto: string) => {
    setBusqueda(texto);
    aplicarFiltros(postulaciones, filtroEstado, texto);
  };

  const handleFiltroEstado = (estado: string) => {
    setFiltroEstado(estado);
    aplicarFiltros(postulaciones, estado, busqueda);
  };

  const handleCancelarPostulacion = async (postulacionId: number) => {
    Alert.alert(
      'Cancelar Postulación',
      '¿Estás seguro que deseas cancelar esta postulación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user?.id) {
                Alert.alert('Error', 'Usuario no identificado');
                return;
              }
              await postulacionService.cancelar(postulacionId, user.id);
              Alert.alert('Éxito', 'Postulación cancelada');
              await cargarPostulaciones(user.id);
              setMostrarOpcionesEliminar(null);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo cancelar la postulación');
            }
          },
        },
      ]
    );
  };

  const getEstadoBadgeColor = (estado: string) => {
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
        return COLORES.azul;
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderPostulacionItem = ({ item }: { item: Postulacion }) => (
    <TouchableOpacity
      style={styles.postulacionCard}
      onPress={() => setMostrarOpcionesEliminar(mostrarOpcionesEliminar === item.id ? null : item.id)}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo} numberOfLines={2}>
            {item.ofertaTitulo || 'Sin título'}
          </Text>
          <Text style={styles.empresa}>{item.ofertaEmpresa || 'Empresa desconocida'}</Text>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoBadgeColor(item.estado) }]}>
          <Text style={styles.estadoText}>{item.estado}</Text>
        </View>
      </View>

      {/* Detalles */}
      <View style={styles.detalles}>
        <Text style={styles.detalleText}>
          📅 Postulación: {formatearFecha(item.fechaPostulacion)}
        </Text>
        {item.fechaRespuesta && (
          <Text style={styles.detalleText}>📅 Respuesta: {formatearFecha(item.fechaRespuesta)}</Text>
        )}
        {item.comentarios && (
          <Text style={styles.comentarios} numberOfLines={2}>
            💬 {item.comentarios}
          </Text>
        )}
      </View>

      {/* Opciones expandibles */}
      {mostrarOpcionesEliminar === item.id && item.estado === 'PENDIENTE' && (
        <View style={styles.opcionesContainer}>
          <TouchableOpacity
            style={[styles.btnOpcion, styles.btnCancelar]}
            onPress={() => handleCancelarPostulacion(item.id)}
          >
            <Text style={styles.btnTexto}>Cancelar Postulación</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORES.principal} />
        <Text style={styles.loadingText}>Cargando postulaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Postulaciones</Text>
        <Text style={styles.headerSubtitle}>{postulacionesFiltradas.length} postulaciones</Text>
      </View>

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por oferta, empresa..."
          value={busqueda}
          onChangeText={handleBusqueda}
          placeholderTextColor={COLORES.grisOscuro}
        />
      </View>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        {['TODOS', 'PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA'].map((estado) => (
          <TouchableOpacity
            key={estado}
            style={[
              styles.filtroBtn,
              filtroEstado === estado && styles.filtroBtnActivo,
            ]}
            onPress={() => handleFiltroEstado(estado)}
          >
            <Text
              style={[
                styles.filtroBtnText,
                filtroEstado === estado && styles.filtroBtnTextActivo,
              ]}
            >
              {estado === 'TODOS' ? '📊 Todos' : estado}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de postulaciones */}
      {postulacionesFiltradas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>📭 Sin postulaciones</Text>
          <Text style={styles.emptyText}>
            {busqueda || filtroEstado !== 'TODOS'
              ? 'No hay postulaciones que coincidan con tu búsqueda'
              : 'Aún no tienes postulaciones. ¡Empieza a postularte a ofertas!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={postulacionesFiltradas}
          renderItem={renderPostulacionItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.fondo,
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
  header: {
    backgroundColor: COLORES.principal,
    paddingHorizontal: ESPACIADOS.lg,
    paddingTop: ESPACIADOS.xl,
    paddingBottom: ESPACIADOS.lg,
  },
  headerTitle: {
    fontSize: TAMAÑOS_FUENTE.xxl,
    fontWeight: 'bold',
    color: COLORES.blanco,
  },
  headerSubtitle: {
    fontSize: TAMAÑOS_FUENTE.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: ESPACIADOS.sm,
  },
  searchContainer: {
    paddingHorizontal: ESPACIADOS.lg,
    paddingVertical: ESPACIADOS.md,
  },
  searchInput: {
    backgroundColor: COLORES.blanco,
    borderRadius: RADIOS.lg,
    paddingHorizontal: ESPACIADOS.lg,
    paddingVertical: ESPACIADOS.md,
    fontSize: TAMAÑOS_FUENTE.md,
    borderWidth: 1,
    borderColor: COLORES.border,
    color: COLORES.texto,
  },
  filtrosContainer: {
    paddingHorizontal: ESPACIADOS.lg,
    paddingVertical: ESPACIADOS.md,
    flexDirection: 'row',
    gap: ESPACIADOS.sm,
    flexWrap: 'wrap',
  },
  filtroBtn: {
    paddingHorizontal: ESPACIADOS.md,
    paddingVertical: ESPACIADOS.sm,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.blanco,
    borderWidth: 1,
    borderColor: COLORES.border,
  },
  filtroBtnActivo: {
    backgroundColor: COLORES.principal,
    borderColor: COLORES.principal,
  },
  filtroBtnText: {
    fontSize: TAMAÑOS_FUENTE.sm,
    color: COLORES.texto,
  },
  filtroBtnTextActivo: {
    color: COLORES.blanco,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: ESPACIADOS.lg,
    paddingVertical: ESPACIADOS.md,
    gap: ESPACIADOS.md,
  },
  postulacionCard: {
    backgroundColor: COLORES.blanco,
    borderRadius: RADIOS.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORES.principal,
    paddingHorizontal: ESPACIADOS.lg,
    paddingVertical: ESPACIADOS.lg,
    marginBottom: ESPACIADOS.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ESPACIADOS.md,
  },
  tituloContainer: {
    flex: 1,
    marginRight: ESPACIADOS.md,
  },
  titulo: {
    fontSize: TAMAÑOS_FUENTE.lg,
    fontWeight: 'bold',
    color: COLORES.texto,
    marginBottom: ESPACIADOS.sm,
  },
  empresa: {
    fontSize: TAMAÑOS_FUENTE.sm,
    color: COLORES.textoClaro,
  },
  estadoBadge: {
    paddingHorizontal: ESPACIADOS.md,
    paddingVertical: ESPACIADOS.sm,
    borderRadius: RADIOS.md,
  },
  estadoText: {
    color: COLORES.blanco,
    fontSize: TAMAÑOS_FUENTE.sm,
    fontWeight: 'bold',
  },
  detalles: {
    marginVertical: ESPACIADOS.md,
  },
  detalleText: {
    fontSize: TAMAÑOS_FUENTE.sm,
    color: COLORES.textoClaro,
    marginBottom: ESPACIADOS.sm,
  },
  comentarios: {
    fontSize: TAMAÑOS_FUENTE.sm,
    color: COLORES.textoClaro,
    fontStyle: 'italic',
    marginTop: ESPACIADOS.md,
    paddingLeft: ESPACIADOS.md,
    borderLeftWidth: 2,
    borderLeftColor: COLORES.principal,
  },
  opcionesContainer: {
    marginTop: ESPACIADOS.md,
    paddingTop: ESPACIADOS.md,
    borderTopWidth: 1,
    borderTopColor: COLORES.border,
  },
  btnOpcion: {
    paddingVertical: ESPACIADOS.md,
    borderRadius: RADIOS.md,
    alignItems: 'center',
  },
  btnCancelar: {
    backgroundColor: COLORES.rojo,
  },
  btnTexto: {
    color: COLORES.blanco,
    fontSize: TAMAÑOS_FUENTE.md,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ESPACIADOS.lg,
  },
  emptyTitle: {
    fontSize: TAMAÑOS_FUENTE.xl,
    fontWeight: 'bold',
    color: COLORES.texto,
    marginBottom: ESPACIADOS.md,
  },
  emptyText: {
    fontSize: TAMAÑOS_FUENTE.md,
    color: COLORES.textoClaro,
    textAlign: 'center',
  },
});

export default PostulacionesScreen;
