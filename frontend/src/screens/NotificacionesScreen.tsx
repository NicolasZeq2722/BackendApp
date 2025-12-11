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
import notificacionService, { Notificacion } from '../services/notificacionService';

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

const NotificacionesScreen = ({ navigation }: any) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [notificacionesFiltradas, setNotificacionesFiltradas] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODAS');
  const [busqueda, setBusqueda] = useState('');
  const [noLeidasCount, setNoLeidasCount] = useState(0);

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
        await cargarNotificaciones();
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar tus notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const data = await notificacionService.getMisNotificaciones();
      setNotificaciones(data || []);

      // Contar no leídas
      const noLeidas = data?.filter((n) => !n.leida) || [];
      setNoLeidasCount(noLeidas.length);

      aplicarFiltros(data || [], filtroEstado, busqueda);
    } catch (error: any) {
      console.error('Error cargando notificaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar tus notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await cargarNotificaciones();
    } finally {
      setRefreshing(false);
    }
  };

  const aplicarFiltros = (datos: Notificacion[], estado: string, buscar: string) => {
    let resultado = datos;

    // Filtrar por estado
    if (estado === 'NO_LEIDAS') {
      resultado = resultado.filter((n) => !n.leida);
    } else if (estado === 'LEIDAS') {
      resultado = resultado.filter((n) => n.leida);
    }

    // Filtrar por búsqueda
    if (buscar.trim()) {
      const termino = buscar.toLowerCase();
      resultado = resultado.filter(
        (n) =>
          n.titulo?.toLowerCase().includes(termino) ||
          n.mensaje?.toLowerCase().includes(termino) ||
          n.tipo?.toLowerCase().includes(termino)
      );
    }

    setNotificacionesFiltradas(resultado);
  };

  const handleBusqueda = (texto: string) => {
    setBusqueda(texto);
    aplicarFiltros(notificaciones, filtroEstado, texto);
  };

  const handleFiltroEstado = (estado: string) => {
    setFiltroEstado(estado);
    aplicarFiltros(notificaciones, estado, busqueda);
  };

  const handleMarcarLeida = async (notificacionId: number, esLeida: boolean) => {
    if (!esLeida) {
      try {
        await notificacionService.marcarComoLeida(notificacionId);
        await cargarNotificaciones();
      } catch (error: any) {
        Alert.alert('Error', 'No se pudo marcar como leída');
      }
    }
  };

  const handleMarcarTodasLeidas = async () => {
    Alert.alert(
      'Marcar todas como leídas',
      '¿Deseas marcar todas las notificaciones como leídas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, marcar todas',
          onPress: async () => {
            try {
              if (user?.id) {
                await notificacionService.marcarTodasComoLeida(user.id);
                await cargarNotificaciones();
                Alert.alert('Éxito', 'Todas las notificaciones marcadas como leídas');
              }
            } catch (error: any) {
              Alert.alert('Error', 'No se pudo marcar todas como leídas');
            }
          },
        },
      ]
    );
  };

  const getTipoIconoColor = (tipo: string) => {
    switch (tipo) {
      case 'POSTULACION_ACEPTADA':
        return { icono: '✅', color: COLORES.verde };
      case 'POSTULACION_RECHAZADA':
        return { icono: '❌', color: COLORES.rojo };
      case 'NUEVA_OFERTA':
        return { icono: '💼', color: COLORES.azul };
      case 'RESPUESTA_POSTULACION':
        return { icono: '📧', color: COLORES.naranja };
      case 'GENERAL':
        return { icono: '📢', color: COLORES.principal };
      default:
        return { icono: '📬', color: COLORES.grisOscuro };
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diferencia = ahora.getTime() - date.getTime();
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 1) return 'Hace unos segundos';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas}h`;
    if (dias < 7) return `Hace ${dias} días`;

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderNotificacionItem = ({ item }: { item: Notificacion }) => {
    const { icono, color } = getTipoIconoColor(item.tipo);

    return (
      <TouchableOpacity
        style={[
          styles.notificacionCard,
          !item.leida && styles.notificacionCardNoLeida,
        ]}
        onPress={() => handleMarcarLeida(item.id, item.leida)}
      >
        {/* Indicador de leída/no leída */}
        {!item.leida && <View style={styles.indicadorNoLeida} />}

        {/* Icono y contenido */}
        <View style={styles.cardContent}>
          <View style={[styles.iconoContainer, { backgroundColor: color }]}>
            <Text style={styles.icono}>{icono}</Text>
          </View>

          <View style={styles.textoContainer}>
            <Text style={[styles.titulo, !item.leida && styles.tituloNegrita]}>
              {item.titulo}
            </Text>
            <Text style={styles.mensaje} numberOfLines={2}>
              {item.mensaje}
            </Text>
            <Text style={styles.fecha}>{formatearFecha(item.fechaCreacion)}</Text>
          </View>
        </View>

        {/* Badge de tipo */}
        <View style={styles.tipoBadge}>
          <Text style={styles.tipoBadgeText}>{item.tipo.replace(/_/g, ' ')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORES.principal} />
        <Text style={styles.loadingText}>Cargando notificaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Notificaciones</Text>
            <Text style={styles.headerSubtitle}>
              {noLeidasCount > 0 ? `${noLeidasCount} nuevas` : 'Sin notificaciones nuevas'}
            </Text>
          </View>
          {noLeidasCount > 0 && (
            <TouchableOpacity
              style={styles.marcarLeidasBtn}
              onPress={handleMarcarTodasLeidas}
            >
              <Text style={styles.marcarLeidasBtnText}>Marcar todas como leídas</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar en notificaciones..."
          value={busqueda}
          onChangeText={handleBusqueda}
          placeholderTextColor={COLORES.grisOscuro}
        />
      </View>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        {['TODAS', 'NO_LEIDAS', 'LEIDAS'].map((estado) => (
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
              {estado === 'TODAS'
                ? '📋 Todas'
                : estado === 'NO_LEIDAS'
                ? '⭐ No leídas'
                : '✓ Leídas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de notificaciones */}
      {notificacionesFiltradas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            {filtroEstado === 'NO_LEIDAS' ? '✨ Todo al día' : '📭 Sin notificaciones'}
          </Text>
          <Text style={styles.emptyText}>
            {filtroEstado === 'NO_LEIDAS'
              ? 'No tienes notificaciones sin leer'
              : 'Aquí aparecerán tus notificaciones'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={notificacionesFiltradas}
          renderItem={renderNotificacionItem}
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  marcarLeidasBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: ESPACIADOS.md,
    paddingVertical: ESPACIADOS.sm,
    borderRadius: RADIOS.lg,
  },
  marcarLeidasBtnText: {
    color: COLORES.blanco,
    fontSize: TAMAÑOS_FUENTE.xs,
    fontWeight: 'bold',
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
  notificacionCard: {
    backgroundColor: COLORES.blanco,
    borderRadius: RADIOS.lg,
    padding: ESPACIADOS.lg,
    marginBottom: ESPACIADOS.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificacionCardNoLeida: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: COLORES.principal,
  },
  indicadorNoLeida: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORES.principal,
    marginRight: ESPACIADOS.md,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ESPACIADOS.md,
  },
  icono: {
    fontSize: TAMAÑOS_FUENTE.xl,
  },
  textoContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: TAMAÑOS_FUENTE.md,
    color: COLORES.texto,
    marginBottom: ESPACIADOS.xs,
  },
  tituloNegrita: {
    fontWeight: 'bold',
  },
  mensaje: {
    fontSize: TAMAÑOS_FUENTE.sm,
    color: COLORES.textoClaro,
    marginBottom: ESPACIADOS.xs,
    lineHeight: 18,
  },
  fecha: {
    fontSize: TAMAÑOS_FUENTE.xs,
    color: COLORES.grisOscuro,
  },
  tipoBadge: {
    backgroundColor: COLORES.gris,
    paddingHorizontal: ESPACIADOS.sm,
    paddingVertical: ESPACIADOS.xs,
    borderRadius: RADIOS.md,
    marginLeft: ESPACIADOS.md,
  },
  tipoBadgeText: {
    fontSize: TAMAÑOS_FUENTE.xs,
    color: COLORES.grisOscuro,
    fontWeight: '500',
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

export default NotificacionesScreen;
