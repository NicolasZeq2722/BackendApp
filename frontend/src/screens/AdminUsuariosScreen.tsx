import React, { useState, useEffect } from 'react';
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
import aspiranteService, { Aspirante } from '../services/aspiranteService';
import { COLORES, ESPACIADOS, TAMAÑOS_FUENTE, RADIOS } from '../utils';

const AdminUsuariosScreen = ({ navigation }: any) => {
  // ==================== ESTADOS ====================

  const [usuarios, setUsuarios] = useState<Aspirante[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Aspirante[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS');

  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [usuarioEditable, setUsuarioEditable] = useState<Partial<Aspirante>>({});

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
  });

  // ==================== EFECTOS ====================

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [busqueda, filtroEstado, usuarios]);

  // ==================== FUNCIONES ====================

  /**
   * Cargar usuarios (aspirantes)
   */
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await aspiranteService.getAll();
      setUsuarios(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await cargarUsuarios();
    setRefreshing(false);
  };

  /**
   * Aplicar filtros
   */
  const aplicarFiltros = () => {
    let resultado = [...usuarios];

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(
        (u) =>
          u.nombre.toLowerCase().includes(termino) ||
          u.apellido.toLowerCase().includes(termino) ||
          u.correo.toLowerCase().includes(termino)
      );
    }

    // Filtro por estado
    if (filtroEstado !== 'TODOS') {
      resultado = resultado.filter((u) => u.estado === filtroEstado);
    }

    setUsuariosFiltrados(resultado);
  };

  /**
   * Abrir modal de crear usuario
   */
  const abrirModalCrear = () => {
    setFormData({ nombre: '', apellido: '', correo: '', telefono: '' });
    setModalCrearVisible(true);
  };

  /**
   * Crear usuario
   */
  const crearUsuario = async () => {
    if (!formData.nombre || !formData.correo) {
      Alert.alert('Error', 'Nombre y correo son requeridos');
      return;
    }

    try {
      await aspiranteService.create(formData);
      Alert.alert('Éxito', 'Usuario creado correctamente');
      setModalCrearVisible(false);
      setFormData({ nombre: '', apellido: '', correo: '', telefono: '' });
      await cargarUsuarios();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  /**
   * Abrir modal de editar usuario
   */
  const abrirModalEditar = (usuario: Aspirante) => {
    setUsuarioEditable({ ...usuario });
    setModalEditarVisible(true);
  };

  /**
   * Actualizar usuario
   */
  const actualizarUsuario = async () => {
    if (!usuarioEditable.id) return;

    try {
      await aspiranteService.update(usuarioEditable.id, usuarioEditable);
      Alert.alert('Éxito', 'Usuario actualizado correctamente');
      setModalEditarVisible(false);
      await cargarUsuarios();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  /**
   * Activar usuario
   */
  const activarUsuario = async (id: number) => {
    Alert.alert('Confirmar', '¿Activar este usuario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Activar',
        onPress: async () => {
          try {
            await aspiranteService.activate(id);
            Alert.alert('Éxito', 'Usuario activado');
            await cargarUsuarios();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  /**
   * Desactivar usuario
   */
  const desactivarUsuario = async (id: number) => {
    Alert.alert('Confirmar', '¿Desactivar este usuario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Desactivar',
        onPress: async () => {
          try {
            await aspiranteService.deactivate(id);
            Alert.alert('Éxito', 'Usuario desactivado');
            await cargarUsuarios();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  /**
   * Eliminar usuario
   */
  const eliminarUsuario = async (id: number, nombre: string) => {
    Alert.alert('Confirmar Eliminación', `¿Eliminar a ${nombre}? Esta acción es irreversible.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: async () => {
          try {
            await aspiranteService.delete(id);
            Alert.alert('Éxito', 'Usuario eliminado');
            await cargarUsuarios();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  /**
   * Renderizar cada fila de usuario
   */
  const renderUsuarioItem = ({ item }: { item: Aspirante }) => {
    const esActivo = item.estado === 'ACTIVO';

    return (
      <View style={[styles.usuarioCard, !esActivo && styles.usuarioCardInactivo]}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.nombreContainer}>
            <Text style={styles.nombre}>
              {item.nombre} {item.apellido}
            </Text>
            <Text style={styles.correo}>{item.correo}</Text>
          </View>
          <View style={[styles.estadoBadge, esActivo ? styles.badgeActivo : styles.badgeInactivo]}>
            <Text style={styles.estadoText}>{item.estado}</Text>
          </View>
        </View>

        {/* Detalles */}
        <Text style={styles.detalleText}>📱 {item.telefono || 'Sin teléfono'}</Text>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.btnAccion, styles.btnEditar]}
            onPress={() => abrirModalEditar(item)}
          >
            <Text style={styles.btnText}>✏️ Editar</Text>
          </TouchableOpacity>

          {esActivo ? (
            <TouchableOpacity
              style={[styles.btnAccion, styles.btnDesactivar]}
              onPress={() => desactivarUsuario(item.id)}
            >
              <Text style={styles.btnText}>⊘ Desactivar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.btnAccion, styles.btnActivar]}
              onPress={() => activarUsuario(item.id)}
            >
              <Text style={styles.btnText}>✓ Activar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.btnAccion, styles.btnEliminar]}
            onPress={() => eliminarUsuario(item.id, item.nombre)}
          >
            <Text style={styles.btnText}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * Modal para crear usuario
   */
  const renderModalCrear = () => {
    if (!modalCrearVisible) return null;
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear Nuevo Usuario</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={formData.apellido}
            onChangeText={(text) => setFormData({ ...formData, apellido: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={formData.correo}
            onChangeText={(text) => setFormData({ ...formData, correo: text })}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={formData.telefono}
            onChangeText={(text) => setFormData({ ...formData, telefono: text })}
            keyboardType="phone-pad"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.btnCancelar]}
              onPress={() => setModalCrearVisible(false)}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalBtn, styles.btnGuardar]} onPress={crearUsuario}>
              <Text style={styles.btnText}>Crear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Modal para editar usuario
   */
  const renderModalEditar = () => {
    if (!modalEditarVisible) return null;
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Usuario</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={usuarioEditable.nombre || ''}
            onChangeText={(text) => setUsuarioEditable({ ...usuarioEditable, nombre: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={usuarioEditable.apellido || ''}
            onChangeText={(text) => setUsuarioEditable({ ...usuarioEditable, apellido: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={usuarioEditable.telefono || ''}
            onChangeText={(text) => setUsuarioEditable({ ...usuarioEditable, telefono: text })}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.btnCancelar]}
              onPress={() => setModalEditarVisible(false)}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.btnGuardar]}
              onPress={actualizarUsuario}
            >
              <Text style={styles.btnText}>Guardar</Text>
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
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
        <Text style={styles.headerSubtitle}>Manage aspirantes</Text>
      </View>

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, correo..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        {(['TODOS', 'ACTIVO', 'INACTIVO'] as const).map((estado) => (
          <TouchableOpacity
            key={estado}
            style={[styles.filterBtn, filtroEstado === estado && styles.filterBtnActive]}
            onPress={() => setFiltroEstado(estado)}
          >
            <Text
              style={[
                styles.filterBtnText,
                filtroEstado === estado && styles.filterBtnTextActive,
              ]}
            >
              {estado}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón crear */}
      <TouchableOpacity style={styles.btnCrear} onPress={abrirModalCrear}>
        <Text style={styles.btnCrearText}>+ Crear Usuario</Text>
      </TouchableOpacity>

      {/* Lista */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORES.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={usuariosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUsuarioItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORES.PRIMARY]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay usuarios</Text>
            </View>
          }
        />
      )}

      {/* Modales */}
      {renderModalCrear()}
      {renderModalEditar()}

      {/* Footer contador */}
      {!loading && usuariosFiltrados.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Total: {usuariosFiltrados.length} usuarios</Text>
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

  filterContainer: {
    paddingHorizontal: ESPACIADOS.MD,
    paddingVertical: ESPACIADOS.SM,
    flexDirection: 'row',
    gap: ESPACIADOS.SM,
  },

  filterBtn: {
    paddingHorizontal: ESPACIADOS.BASE,
    paddingVertical: ESPACIADOS.XS,
    borderRadius: RADIOS.BASE,
    backgroundColor: '#e5e7eb',
  },

  filterBtnActive: {
    backgroundColor: COLORES.PRIMARY,
  },

  filterBtnText: {
    color: COLORES.TEXT_PRIMARY,
    fontWeight: '500',
    fontSize: TAMAÑOS_FUENTE.XS,
  },

  filterBtnTextActive: {
    color: '#fff',
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

  usuarioCard: {
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

  usuarioCardInactivo: {
    opacity: 0.7,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ESPACIADOS.BASE,
  },

  nombreContainer: {
    flex: 1,
  },

  nombre: {
    fontSize: TAMAÑOS_FUENTE.BASE,
    fontWeight: '700',
    color: COLORES.TEXT_PRIMARY,
  },

  correo: {
    fontSize: TAMAÑOS_FUENTE.XS,
    color: COLORES.TEXT_SECONDARY,
    marginTop: ESPACIADOS.XS,
  },

  estadoBadge: {
    paddingHorizontal: ESPACIADOS.SM,
    paddingVertical: ESPACIADOS.XS,
    borderRadius: RADIOS.SM,
  },

  badgeActivo: {
    backgroundColor: '#d1fae5',
  },

  badgeInactivo: {
    backgroundColor: '#fee2e2',
  },

  estadoText: {
    fontWeight: '600',
    fontSize: TAMAÑOS_FUENTE.XS,
  },

  detalleText: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: COLORES.TEXT_SECONDARY,
    marginBottom: ESPACIADOS.SM,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: ESPACIADOS.SM,
    marginTop: ESPACIADOS.BASE,
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

  btnActivar: {
    backgroundColor: '#d1fae5',
  },

  btnDesactivar: {
    backgroundColor: '#fecaca',
  },

  btnEliminar: {
    backgroundColor: '#fee2e2',
  },

  btnText: {
    fontWeight: '600',
    fontSize: TAMAÑOS_FUENTE.XS,
    color: COLORES.TEXT_PRIMARY,
  },

  // ========== MODAL ==========

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: RADIOS.LG,
    borderTopRightRadius: RADIOS.LG,
    padding: ESPACIADOS.MD,
    maxHeight: '80%',
  },

  modalTitle: {
    fontSize: TAMAÑOS_FUENTE.LG,
    fontWeight: '700',
    color: COLORES.TEXT_PRIMARY,
    marginBottom: ESPACIADOS.MD,
  },

  input: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: ESPACIADOS.BASE,
    paddingVertical: ESPACIADOS.SM,
    borderRadius: RADIOS.BASE,
    marginBottom: ESPACIADOS.BASE,
    fontSize: TAMAÑOS_FUENTE.BASE,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: ESPACIADOS.SM,
    marginTop: ESPACIADOS.MD,
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

  btnGuardar: {
    backgroundColor: COLORES.PRIMARY,
  },

  // ========== ESTADOS ==========

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
});

export default AdminUsuariosScreen;
