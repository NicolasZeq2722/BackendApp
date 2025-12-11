import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import ofertaService from '../services/ofertaService';
import { COLORES, ESPACIADOS, TAMAÑOS_FUENTE, RADIOS } from '../utils';

interface IOferta {
  id: number;
  titulo: string;
  descripcion: string;
  salario: number;
  modalidad: 'REMOTO' | 'PRESENCIAL' | 'HIBRIDO';
  estado: string;
  fechaLimite: string;
  empresa?: { nombre: string };
}

const AdminOfertasScreen = ({ navigation }: any) => {
  // ==================== ESTADOS ====================

  const [ofertas, setOfertas] = useState<IOferta[]>([]);
  const [ofertasFiltradas, setOfertasFiltradas] = useState<IOferta[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<IOferta | null>(null);
  const [eliminando, setEliminando] = useState(false);

  // ==================== EFECTOS ====================

  useEffect(() => {
    cargarOfertas();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [busqueda, ofertas]);

  // ==================== FUNCIONES ====================

  /**
   * Cargar ofertas
   */
  const cargarOfertas = async () => {
    try {
      setLoading(true);
      const data = await ofertaService.getAll();
      setOfertas(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await cargarOfertas();
    setRefreshing(false);
  };

  /**
   * Aplicar filtros
   */
  const aplicarFiltros = () => {
    let resultado = [...ofertas];

    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(
        (o) =>
          o.titulo.toLowerCase().includes(termino) ||
          o.descripcion.toLowerCase().includes(termino) ||
          o.empresa?.nombre.toLowerCase().includes(termino)
      );
    }

    setOfertasFiltradas(resultado);
  };

  /**
   * Ir a crear/editar oferta
   */
  const irACrearOferta = (oferta?: IOferta) => {
    navigation.navigate('CrearOferta', { ofertaAEditar: oferta || null });
  };

  /**
   * Abrir modal de eliminar
   */
  const abrirModalEliminar = (oferta: IOferta) => {
    setOfertaSeleccionada(oferta);
    setModalEliminarVisible(true);
  };

  /**
   * Confirmar eliminación
   */
  const confirmarEliminacion = async () => {
    if (!ofertaSeleccionada) return;

    try {
      setEliminando(true);
      await ofertaService.delete(ofertaSeleccionada.id);
      Alert.alert('Éxito', 'Oferta eliminada correctamente');
      setModalEliminarVisible(false);
      setOfertaSeleccionada(null);
      await cargarOfertas();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setEliminando(false);
    }
  };

  /**
   * Renderizar tarjeta de oferta
   */
  const renderOfertaItem = ({ item }: { item: IOferta }) => {
    const getColorEstado = (estado: string) => {
      switch (estado) {
        case 'ABIERTA':
          return '#d1fae5';
        case 'CERRADA':
          return '#fee2e2';
        case 'PAUSADA':
          return '#fef3c7';
        default:
          return '#e5e7eb';
      }
    };

    const getColorModalidad = (modalidad: string) => {
      switch (modalidad) {
        case 'REMOTO':
          return '#3b82f6';
        case 'PRESENCIAL':
          return '#10b981';
        case 'HIBRIDO':
          return '#f59e0b';
        default:
          return '#6b7280';
      }
    };

    const salarioFormato = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(item.salario);

    return (
      <View style={styles.ofertaCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.titulo} numberOfLines={2}>
              {item.titulo}
            </Text>
            <Text style={styles.empresa}>{item.empresa?.nombre || 'Sin empresa'}</Text>
          </View>
          <View style={[styles.estadoBadge, { backgroundColor: getColorEstado(item.estado) }]}>
            <Text style={styles.estadoText}>{item.estado}</Text>
          </View>
        </View>

        {/* Descripción */}
        <Text style={styles.descripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>💰 Salario</Text>
            <Text style={styles.infoValor}>{salarioFormato}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>📍 Modalidad</Text>
            <View style={[styles.modalidadBadge, { backgroundColor: getColorModalidad(item.modalidad) }]}>
              <Text style={styles.modalidadText}>{item.modalidad}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>📅 Límite</Text>
            <Text style={styles.infoValor}>{new Date(item.fechaLimite).toLocaleDateString('es-CO')}</Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.btnAccion, styles.btnEditar]}
            onPress={() => irACrearOferta(item)}
          >
            <Text style={styles.btnText}>✏️ Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnAccion, styles.btnEliminar]}
            onPress={() => abrirModalEliminar(item)}
          >
            <Text style={styles.btnText}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * Modal de confirmación
   */
  const renderModalEliminar = () => {
    if (!modalEliminarVisible) return null;
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>¿Eliminar oferta?</Text>
          <Text style={styles.modalMessage}>{ofertaSeleccionada?.titulo}</Text>
          <Text style={styles.modalWarning}>Esta acción no se puede deshacer.</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.btnCancelar]}
              onPress={() => setModalEliminarVisible(false)}
              disabled={eliminando}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.btnConfirmar]}
              onPress={confirmarEliminacion}
              disabled={eliminando}
            >
              {eliminando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Eliminar</Text>
              )}
            </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Gestión de Ofertas</Text>
        <Text style={styles.headerSubtitle}>Manage all job offers</Text>
      </View>

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título, empresa..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Botón crear */}
      <TouchableOpacity style={styles.btnCrear} onPress={() => irACrearOferta()}>
        <Text style={styles.btnCrearText}>+ Nueva Oferta</Text>
      </TouchableOpacity>

      {/* Lista */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORES.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={ofertasFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOfertaItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORES.PRIMARY]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay ofertas</Text>
            </View>
          }
        />
      )}

      {/* Modal */}
      {renderModalEliminar()}

      {/* Footer */}
      {!loading && ofertasFiltradas.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Total: {ofertasFiltradas.length} ofertas</Text>
        </View>
      )}
    </View>
  );
};

// ==================== ESTILOS ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  header: {
    backgroundColor: COLORES.PRIMARY,
    paddingHorizontal: ESPACIADOS.MD,
    paddingTop: ESPACIADOS.LG,
    paddingBottom: ESPACIADOS.LG,
  },

  headerTitle: {
    fontSize: TAMAÑOS_FUENTE.XXL,
    fontWeight: '700',
    color: '#fff',
    marginBottom: ESPACIADOS.SM,
  },

  headerSubtitle: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: '#e0e7ff',
  },

  searchContainer: {
    paddingHorizontal: ESPACIADOS.MD,
    paddingVertical: ESPACIADOS.BASE,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  searchInput: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: ESPACIADOS.BASE,
    paddingVertical: ESPACIADOS.SM,
    borderRadius: RADIOS.BASE,
    fontSize: TAMAÑOS_FUENTE.SM,
  },

  btnCrear: {
    marginHorizontal: ESPACIADOS.MD,
    marginVertical: ESPACIADOS.SM,
    backgroundColor: '#10b981',
    paddingVertical: ESPACIADOS.SM,
    borderRadius: RADIOS.BASE,
    alignItems: 'center',
  },

  btnCrearText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: TAMAÑOS_FUENTE.BASE,
  },

  listContent: {
    paddingHorizontal: ESPACIADOS.MD,
    paddingVertical: ESPACIADOS.BASE,
  },

  ofertaCard: {
    backgroundColor: '#fff',
    borderRadius: RADIOS.BASE,
    padding: ESPACIADOS.MD,
    marginBottom: ESPACIADOS.MD,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ESPACIADOS.BASE,
  },

  titleContainer: {
    flex: 1,
    marginRight: ESPACIADOS.SM,
  },

  titulo: {
    fontSize: TAMAÑOS_FUENTE.BASE,
    fontWeight: '700',
    color: COLORES.TEXT_PRIMARY,
    marginBottom: ESPACIADOS.XS,
  },

  empresa: {
    fontSize: TAMAÑOS_FUENTE.XS,
    color: COLORES.TEXT_SECONDARY,
  },

  estadoBadge: {
    paddingHorizontal: ESPACIADOS.SM,
    paddingVertical: ESPACIADOS.XS,
    borderRadius: RADIOS.SM,
  },

  estadoText: {
    fontWeight: '600',
    fontSize: TAMAÑOS_FUENTE.XS,
  },

  descripcion: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: COLORES.TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: ESPACIADOS.BASE,
  },

  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    borderRadius: RADIOS.BASE,
    padding: ESPACIADOS.SM,
    marginBottom: ESPACIADOS.BASE,
  },

  infoItem: {
    flex: 1,
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: TAMAÑOS_FUENTE.XS,
    color: COLORES.TEXT_SECONDARY,
    marginBottom: ESPACIADOS.XS,
  },

  infoValor: {
    fontSize: TAMAÑOS_FUENTE.SM,
    fontWeight: '600',
    color: COLORES.TEXT_PRIMARY,
  },

  modalidadBadge: {
    paddingHorizontal: ESPACIADOS.SM,
    paddingVertical: ESPACIADOS.XS,
    borderRadius: RADIOS.SM,
  },

  modalidadText: {
    color: '#fff',
    fontSize: TAMAÑOS_FUENTE.XS,
    fontWeight: '600',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: ESPACIADOS.SM,
  },

  btnAccion: {
    flex: 1,
    paddingVertical: ESPACIADOS.XS,
    borderRadius: RADIOS.SM,
    alignItems: 'center',
  },

  btnEditar: {
    backgroundColor: '#dbeafe',
  },

  btnEliminar: {
    backgroundColor: '#fee2e2',
  },

  btnText: {
    fontWeight: '600',
    fontSize: TAMAÑOS_FUENTE.XS,
    color: COLORES.TEXT_PRIMARY,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: TAMAÑOS_FUENTE.BASE,
    color: COLORES.TEXT_SECONDARY,
  },

  footer: {
    paddingHorizontal: ESPACIADOS.MD,
    paddingVertical: ESPACIADOS.SM,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  footerText: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: COLORES.TEXT_SECONDARY,
    textAlign: 'center',
  },

  // ========== MODAL ==========

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: RADIOS.LG,
    padding: ESPACIADOS.MD,
    width: '85%',
  },

  modalTitle: {
    fontSize: TAMAÑOS_FUENTE.LG,
    fontWeight: '700',
    color: COLORES.TEXT_PRIMARY,
    marginBottom: ESPACIADOS.SM,
  },

  modalMessage: {
    fontSize: TAMAÑOS_FUENTE.BASE,
    color: COLORES.TEXT_SECONDARY,
    marginBottom: ESPACIADOS.XS,
  },

  modalWarning: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: '#dc2626',
    fontWeight: '500',
    marginBottom: ESPACIADOS.MD,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: ESPACIADOS.SM,
  },

  modalBtn: {
    flex: 1,
    paddingVertical: ESPACIADOS.SM,
    borderRadius: RADIOS.BASE,
    alignItems: 'center',
  },

  btnCancelar: {
    backgroundColor: '#e5e7eb',
  },

  btnConfirmar: {
    backgroundColor: '#dc2626',
  },
});

export default AdminOfertasScreen;

