import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ofertaService from '../services/ofertaService';
import { COLORES, ESPACIADOS, TAMAÑOS_FUENTE, RADIOS } from '../utils';

// ==================== INTERFACES ====================

interface IOferta {
  id: number;
  titulo: string;
  descripcion: string;
  salario: number;
  modalidad: 'REMOTO' | 'PRESENCIAL' | 'HIBRIDO';
  municipio: { id: number; nombre: string };
  empresa: { id: number; nombre: string };
  estado: string;
  numeroVacantes: number;
}

// ==================== COMPONENTE ====================

const HomeAspiranteScreen = ({ navigation }: any) => {
  // ==================== ESTADOS ====================

  const [ofertas, setOfertas] = useState<IOferta[]>([]);
  const [ofertasFiltradas, setOfertasFiltradas] = useState<IOferta[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState('');
  const [postulando, setPostulando] = useState<number | null>(null);

  // ==================== EFECTOS ====================

  useEffect(() => {
    cargarOfertas();
  }, []);

  // Filtrar ofertas cuando cambia búsqueda o modalidad
  useEffect(() => {
    aplicarFiltros();
  }, [busqueda, modalidadSeleccionada, ofertas]);

  // ==================== FUNCIONES ====================

  /**
   * Cargar ofertas públicas del endpoint
   */
  const cargarOfertas = async () => {
    try {
      setLoading(true);
      const data = await ofertaService.getAll();
      // Filtrar solo ofertas activas
      const ofertasActivas = data.filter((o: any) => o.estado === 'ABIERTA');
      setOfertas(ofertasActivas);
      setOfertasFiltradas(ofertasActivas);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar las ofertas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh para recargar ofertas
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await cargarOfertas();
    setRefreshing(false);
  };

  /**
   * Aplicar filtros a las ofertas
   */
  const aplicarFiltros = () => {
    let resultado = [...ofertas];

    // Filtro por título (búsqueda)
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(
        (oferta) =>
          oferta.titulo.toLowerCase().includes(termino) ||
          oferta.empresa.nombre.toLowerCase().includes(termino) ||
          oferta.descripcion.toLowerCase().includes(termino)
      );
    }

    // Filtro por modalidad
    if (modalidadSeleccionada) {
      resultado = resultado.filter((oferta) => oferta.modalidad === modalidadSeleccionada);
    }

    setOfertasFiltradas(resultado);
  };

  /**
   * Registrar postulación a una oferta
   */
  const handlePostularme = async (oferta: IOferta) => {
    Alert.alert(
      '¿Estás seguro?',
      `¿Deseas postularte a "${oferta.titulo}" en ${oferta.empresa.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Postularme',
          onPress: async () => {
            await realizarPostulacion(oferta.id);
          },
          style: 'default',
        },
      ]
    );
  };

  /**
   * Realizar la postulación
   */
  const realizarPostulacion = async (ofertaId: number) => {
    try {
      setPostulando(ofertaId);
      await ofertaService.registrarPostulacion(ofertaId);
      Alert.alert('Éxito', '¡Te has postulado correctamente!', [{ text: 'OK' }]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo registrar la postulación');
    } finally {
      setPostulando(null);
    }
  };

  /**
   * Renderizar cada tarjeta de oferta
   */
  const renderOfertaCard = ({ item }: { item: IOferta }) => {
    const modalidadColor = {
      REMOTO: '#3b82f6',
      PRESENCIAL: '#10b981',
      HIBRIDO: '#f59e0b',
    }[item.modalidad];

    const salarioFormato = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(item.salario);

    return (
      <View style={styles.ofertaCard}>
        {/* Header de la tarjeta */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.ofertaTitulo} numberOfLines={2}>
              {item.titulo}
            </Text>
            <Text style={styles.empresaNombre}>{item.empresa.nombre}</Text>
          </View>
          <View style={[styles.modalidadBadge, { backgroundColor: modalidadColor }]}>
            <Text style={styles.modalidadText}>{item.modalidad}</Text>
          </View>
        </View>

        {/* Descripción */}
        <Text style={styles.descripcion} numberOfLines={3}>
          {item.descripcion}
        </Text>

        {/* Detalles */}
        <View style={styles.detallesContainer}>
          <View style={styles.detalle}>
            <Text style={styles.detalleLabel}>💰 Salario</Text>
            <Text style={styles.detalleValor}>{salarioFormato}</Text>
          </View>
          <View style={styles.detalle}>
            <Text style={styles.detalleLabel}>📍 Ubicación</Text>
            <Text style={styles.detalleValor}>{item.municipio.nombre}</Text>
          </View>
          <View style={styles.detalle}>
            <Text style={styles.detalleLabel}>🎯 Vacantes</Text>
            <Text style={styles.detalleValor}>{item.numeroVacantes}</Text>
          </View>
        </View>

        {/* Botón de postulación */}
        <TouchableOpacity
          style={[styles.botonPostular, postulando === item.id && styles.botonPostularDisabled]}
          onPress={() => handlePostularme(item)}
          disabled={postulando === item.id}
        >
          {postulando === item.id ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.botonPostularText}>✓ Postularme</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Header vacío cuando no hay ofertas
   */
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No hay ofertas disponibles</Text>
      <Text style={styles.emptySubtitle}>
        Intenta cambiar los filtros o vuelve más tarde
      </Text>
    </View>
  );

  // ==================== RENDER ====================

  return (
    <View style={styles.container}>
      {/* Header de bienvenida */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenido 👋</Text>
        <Text style={styles.welcomeSubtext}>Encuentra tu empleo ideal</Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título, empresa..."
          placeholderTextColor="#999"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Filtro de modalidad */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por modalidad:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={modalidadSeleccionada}
            onValueChange={(itemValue) => setModalidadSeleccionada(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Todas las modalidades" value="" />
            <Picker.Item label="Remoto" value="REMOTO" />
            <Picker.Item label="Presencial" value="PRESENCIAL" />
            <Picker.Item label="Híbrido" value="HIBRIDO" />
          </Picker>
        </View>
      </View>

      {/* Lista de ofertas */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORES.PRIMARY} />
          <Text style={styles.loadingText}>Cargando ofertas...</Text>
        </View>
      ) : (
        <FlatList
          data={ofertasFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOfertaCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORES.PRIMARY}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Contador de ofertas */}
      {!loading && ofertasFiltradas.length > 0 && (
        <View style={styles.footerCounter}>
          <Text style={styles.counterText}>
            Se encontraron {ofertasFiltradas.length} oferta
            {ofertasFiltradas.length !== 1 ? 's' : ''}
          </Text>
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

  // ========== HEADER ==========

  header: {
    backgroundColor: COLORES.PRIMARY,
    paddingHorizontal: ESPACIADOS.MD,
    paddingTop: ESPACIADOS.LG,
    paddingBottom: ESPACIADOS.LG,
  },

  welcomeText: {
    fontSize: TAMAÑOS_FUENTE.XXL,
    fontWeight: '700',
    color: '#fff',
    marginBottom: ESPACIADOS.SM,
  },

  welcomeSubtext: {
    fontSize: TAMAÑOS_FUENTE.BASE,
    color: '#e0e7ff',
  },

  // ========== BÚSQUEDA ==========

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
    color: COLORES.TEXT_PRIMARY,
  },

  // ========== FILTROS ==========

  filterContainer: {
    paddingHorizontal: ESPACIADOS.MD,
    paddingVertical: ESPACIADOS.BASE,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  filterLabel: {
    fontSize: TAMAÑOS_FUENTE.SM,
    fontWeight: '600',
    color: COLORES.TEXT_PRIMARY,
    marginBottom: ESPACIADOS.SM,
  },

  pickerWrapper: {
    backgroundColor: '#f3f4f6',
    borderRadius: RADIOS.BASE,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  picker: {
    height: 45,
    color: COLORES.TEXT_PRIMARY,
  },

  // ========== LISTA ==========

  listContent: {
    paddingHorizontal: ESPACIADOS.MD,
    paddingVertical: ESPACIADOS.BASE,
  },

  // ========== TARJETA OFERTA ==========

  ofertaCard: {
    backgroundColor: '#fff',
    borderRadius: RADIOS.LG,
    padding: ESPACIADOS.MD,
    marginBottom: ESPACIADOS.MD,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ESPACIADOS.BASE,
  },

  cardTitleContainer: {
    flex: 1,
    marginRight: ESPACIADOS.SM,
  },

  ofertaTitulo: {
    fontSize: TAMAÑOS_FUENTE.LG,
    fontWeight: '700',
    color: COLORES.TEXT_PRIMARY,
    marginBottom: ESPACIADOS.XS,
  },

  empresaNombre: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: COLORES.TEXT_SECONDARY,
    fontWeight: '500',
  },

  modalidadBadge: {
    paddingHorizontal: ESPACIADOS.SM,
    paddingVertical: ESPACIADOS.XS,
    borderRadius: RADIOS.BASE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalidadText: {
    color: '#fff',
    fontSize: TAMAÑOS_FUENTE.XS,
    fontWeight: '600',
  },

  // ========== DESCRIPCIÓN ==========

  descripcion: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: COLORES.TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: ESPACIADOS.BASE,
  },

  // ========== DETALLES ==========

  detallesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: RADIOS.BASE,
    padding: ESPACIADOS.SM,
    marginBottom: ESPACIADOS.BASE,
  },

  detalle: {
    flex: 1,
    alignItems: 'center',
  },

  detalleLabel: {
    fontSize: TAMAÑOS_FUENTE.XS,
    color: COLORES.TEXT_SECONDARY,
    marginBottom: ESPACIADOS.XS,
  },

  detalleValor: {
    fontSize: TAMAÑOS_FUENTE.SM,
    fontWeight: '600',
    color: COLORES.TEXT_PRIMARY,
  },

  // ========== BOTÓN POSTULAR ==========

  botonPostular: {
    backgroundColor: COLORES.SUCCESS,
    borderRadius: RADIOS.BASE,
    paddingVertical: ESPACIADOS.SM,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botonPostularDisabled: {
    opacity: 0.6,
  },

  botonPostularText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: TAMAÑOS_FUENTE.BASE,
  },

  // ========== ESTADOS VACÍOS ==========

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: ESPACIADOS.BASE,
    fontSize: TAMAÑOS_FUENTE.BASE,
    color: COLORES.TEXT_SECONDARY,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ESPACIADOS.MD,
  },

  emptyTitle: {
    fontSize: TAMAÑOS_FUENTE.LG,
    fontWeight: '600',
    color: COLORES.TEXT_PRIMARY,
    marginBottom: ESPACIADOS.SM,
  },

  emptySubtitle: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: COLORES.TEXT_SECONDARY,
    textAlign: 'center',
  },

  // ========== FOOTER ==========

  footerCounter: {
    paddingHorizontal: ESPACIADOS.MD,
    paddingVertical: ESPACIADOS.SM,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  counterText: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: COLORES.TEXT_SECONDARY,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeAspiranteScreen;
