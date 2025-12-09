import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { citacionService, authService, postulacionService, ofertaService, usuarioService } from "../services/api";

const CitacionesScreen = ({ navigation }: any) => {
  const [citaciones, setCitaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCitacion, setEditingCitacion] = useState<any>(null);
  const [aspirantes, setAspirantes] = useState<any[]>([]);
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [formData, setFormData] = useState({
    detallesCitacion: "",
    fechaCitacion: new Date(),
    horaCitacion: "09:00",
    enlaceVideoLlamada: "",
    empresa: "",
    aspiranteId: "",
    ofertaId: "",
  });

  // 🔄 Cargar datos al montar
  useEffect(() => {
    cargarUsuario();
    cargarAspirantes();
    cargarOfertas();
  }, []);

  // 🔄 useFocusEffect: Recargar citaciones cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 CitacionesScreen en foco - Recargando citaciones...");
      cargarCitaciones();
      return () => {
        console.log("📴 CitacionesScreen desenfocada");
      };
    }, [])
  );

  const cargarUsuario = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      console.log("👤 Usuario actual:", currentUser?.username, "Rol:", currentUser?.role);
    } catch (error) {
      console.error("❌ Error cargando usuario:", error);
    }
  };

  const cargarCitaciones = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();

      if (currentUser?.role === "ASPIRANTE" && currentUser?.id) {
        const response = await citacionService.getByAspirante(currentUser.id);
        setCitaciones(response.data || []);
        console.log("📋 Citaciones del aspirante:", response.data?.length || 0);
      } else if ((currentUser?.role === "RECLUTADOR" || currentUser?.role === "ADMIN") && currentUser?.id) {
        const response = await citacionService.getByReclutador(currentUser.id);
        setCitaciones(response.data || []);
        console.log("📋 Citaciones del reclutador/admin:", response.data?.length || 0);
      }
    } catch (error) {
      console.error("❌ Error cargando citaciones:", error);
      Alert.alert("Error", "No se pudieron cargar las citaciones");
    } finally {
      setLoading(false);
    }
  };

  const cargarAspirantes = async () => {
    try {
      // ✅ CAMBIO: Usar getByRole en lugar de getAll
      // Evita error 403 (acceso denegado a getAll) y trae solo aspirantes
      console.log("👥 Cargando aspirantes desde /users/role/ASPIRANTE");
      const response = await usuarioService.getByRole("ASPIRANTE");
      setAspirantes(response.data || []);
      console.log("✅ Aspirantes cargados:", response.data?.length || 0);
    } catch (error) {
      console.error("❌ Error cargando aspirantes:", error);
      Alert.alert("Error", "No se pudieron cargar los aspirantes");
    }
  };

  const cargarOfertas = async () => {
    try {
      const response = await ofertaService.getAll();
      setOfertas(response.data || []);
      console.log("💼 Ofertas cargadas:", response.data?.length || 0);
    } catch (error) {
      console.error("❌ Error cargando ofertas:", error);
    }
  };

  const onRefresh = async () => {
    console.log("🔄 Recarga manual (pull-down)");
    setRefreshing(true);
    await cargarCitaciones();
    setRefreshing(false);
  };

  const openCreateModal = () => {
    setFormData({
      detallesCitacion: "",
      fechaCitacion: new Date(),
      horaCitacion: "09:00",
      enlaceVideoLlamada: "",
      empresa: "",
      aspiranteId: "",
      ofertaId: "",
    });
    setEditingCitacion(null);
    setModalVisible(true);
  };

  const openEditModal = (citacion: any) => {
    setFormData({
      detallesCitacion: citacion.detallesCitacion,
      fechaCitacion: new Date(citacion.fechaCitacion),
      horaCitacion: citacion.horaCitacion,
      enlaceVideoLlamada: citacion.enlaceVideoLlamada || "",
      empresa: citacion.empresa,
      aspiranteId: citacion.aspirante?.id?.toString() || "",
      ofertaId: citacion.oferta?.id?.toString() || "",
    });
    setEditingCitacion(citacion);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCitacion(null);
  };

  const handleSave = async () => {
    // ✅ VALIDACIONES iniciales
    if (!formData.detallesCitacion || !formData.aspiranteId || !formData.ofertaId) {
      Alert.alert("Error", "Por favor complete todos los campos requeridos");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "No se pudo obtener el ID del usuario. Por favor vuelva a iniciar sesión");
      return;
    }

    try {
      const aspiranteId = parseInt(formData.aspiranteId);
      const ofertaId = parseInt(formData.ofertaId);

      // 🔍 PASO 1: Buscar la postulación que coincida con aspirante + oferta
      let postulacionId: number | null = null;

      if (!editingCitacion) {
        try {
          const response = await postulacionService.getByAspirante(aspiranteId);
          const postulaciones = response.data || [];
          
          const postulacion = postulaciones.find(
            (p: any) => p.oferta?.id === ofertaId || p.ofertaId === ofertaId
          );

          if (!postulacion) {
            Alert.alert(
              "Error",
              `No existe una postulación del aspirante a esta oferta. Asegúrate que el aspirante se haya postulado a la oferta.`
            );
            return;
          }

          postulacionId = postulacion.id;
          console.log("✅ Postulación encontrada:", postulacionId);
        } catch (error) {
          console.error("❌ Error buscando postulación:", error);
          Alert.alert("Error", "No se pudo verificar la postulación del aspirante");
          return;
        }
      } else {
        postulacionId = editingCitacion.postulacion?.id;
        if (!postulacionId) {
          Alert.alert("Error", "No se puede obtener la postulación de esta citación");
          return;
        }
      }

      // 📦 PASO 2: Construir payload con estructura correcta
      const citacionData = {
        postulacionId: postulacionId,
        reclutadorId: user.id,
        detallesCitacion: formData.detallesCitacion,
        fechaCitacion: formData.fechaCitacion.toISOString().split("T")[0],
        hora: formData.horaCitacion,
        linkMeet: formData.enlaceVideoLlamada || "",
        observaciones: "",
      };

      // ✅ VALIDACIÓN FINAL
      if (!citacionData.postulacionId || !citacionData.reclutadorId) {
        console.error("❌ Validación fallida:", citacionData);
        Alert.alert("Error", "Los datos están incompletos. Intente de nuevo.");
        return;
      }

      console.log("📤 Payload enviado:", JSON.stringify(citacionData, null, 2));

      if (editingCitacion) {
        console.log("✏️ Actualizando citación:", editingCitacion.id);
        await citacionService.update(editingCitacion.id, citacionData, user.id);
        Alert.alert("✅ Éxito", "Citación actualizada correctamente");
      } else {
        console.log("➕ Creando nueva citación");
        await citacionService.create(citacionData, user.id);
        Alert.alert("✅ Éxito", "Citación creada correctamente");
      }
      closeModal();
      cargarCitaciones();
    } catch (error: any) {
      console.error("❌ Error al guardar citación:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      
      const errorMessage = error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Error desconocido";
      
      Alert.alert(
        "Error al guardar citación",
        `${errorMessage}\n\nAsegúrate de que:\n- El aspirante esté postulado\n- Todos los campos sean válidos`
      );
    }
  };

  const handleDelete = (citacion: any) => {
    Alert.alert(
      "❌ Eliminar Citación",
      `¿Está seguro que desea eliminar la citación del ${new Date(citacion.fechaCitacion).toLocaleDateString()}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("🗑️ Eliminando citación:", citacion.id);
              await citacionService.delete(citacion.id, user.id);
              Alert.alert("✅ Éxito", "Citación eliminada correctamente");
              cargarCitaciones();
            } catch (error: any) {
              console.error("❌ Error al eliminar citación:", error);
              Alert.alert("Error", error.response?.data?.message || "Error al eliminar citación");
            }
          },
        },
      ]
    );
  };

  const handleConfirmarAsistencia = async (citacion: any) => {
    Alert.alert(
      "✅ Confirmar Asistencia",
      "¿Confirmas tu asistencia a esta citación?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              console.log("✓ Confirmando asistencia para citación:", citacion.id);
              await citacionService.cambiarEstado(citacion.id, "CONFIRMADA", user.id);
              cargarCitaciones();
              Alert.alert("✅ Éxito", "Asistencia confirmada");
            } catch (err) {
              console.error("❌ Error confirmando asistencia:", err);
              Alert.alert("Error", "No se pudo confirmar");
            }
          },
        },
      ]
    );
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "CONFIRMADA":
        return "#4CAF50";
      case "CANCELADA":
        return "#f44336";
      case "PENDIENTE":
        return "#FF9800";
      default:
        return "#999";
    }
  };

  const renderCitacion = ({ item }: any) => (
    <View style={styles.citacionCard}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.titulo}>{item.detallesCitacion}</Text>
          <Text style={styles.empresa}>🏢 {item.empresa}</Text>
        </View>
        <View style={[styles.estatusBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
          <Text style={styles.estatusText}>{item.estado}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>📅 Fecha:</Text>
        <Text style={styles.value}>{new Date(item.fechaCitacion).toLocaleDateString()}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>🕐 Hora:</Text>
        <Text style={styles.value}>{item.horaCitacion}</Text>
      </View>

      {item.enlaceVideoLlamada && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>🔗 Video:</Text>
          <Text style={styles.linkText} numberOfLines={1}>{item.enlaceVideoLlamada}</Text>
        </View>
      )}

      <View style={styles.actionsContainer}>
        {user?.role === "ASPIRANTE" && item.estado === "PENDIENTE" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleConfirmarAsistencia(item)}
          >
            <Text style={styles.actionButtonText}>✓ Confirmar</Text>
          </TouchableOpacity>
        )}

        {(user?.role === "RECLUTADOR" || user?.role === "ADMIN") && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => openEditModal(item)}
            >
              <Text style={styles.actionButtonText}>✏️ Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.actionButtonText}>🗑️ Eliminar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Cargando citaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {(user?.role === "RECLUTADOR" || user?.role === "ADMIN") && (
        <TouchableOpacity style={styles.createButton} onPress={openCreateModal}>
          <Text style={styles.createButtonText}>+ Nueva Citación</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={citaciones}
        renderItem={renderCitacion}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>Sin citaciones</Text>
            <Text style={styles.emptySubtext}>
              {user?.role === "RECLUTADOR" || user?.role === "ADMIN"
                ? "Crea una nueva citación presionando el botón +"
                : "No tienes citaciones programadas"}
            </Text>
          </View>
        }
      />

      {/* Modal para crear/editar citación */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCitacion ? "✏️ Editar Citación" : "➕ Nueva Citación"}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Detalles *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Entrevista, Prueba técnica, etc."
                  value={formData.detallesCitacion}
                  onChangeText={(text) =>
                    setFormData({ ...formData, detallesCitacion: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Empresa</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de la empresa"
                  value={formData.empresa}
                  onChangeText={(text) =>
                    setFormData({ ...formData, empresa: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Aspirante *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.aspiranteId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, aspiranteId: value })
                    }
                  >
                    <Picker.Item label="Seleccionar aspirante" value="" />
                    {aspirantes.map((asp) => (
                      <Picker.Item key={asp.id} label={asp.username} value={asp.id.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Oferta *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.ofertaId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, ofertaId: value })
                    }
                  >
                    <Picker.Item label="Seleccionar oferta" value="" />
                    {ofertas.map((of) => (
                      <Picker.Item key={of.id} label={of.titulo} value={of.id.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fecha *</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {formData.fechaCitacion.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={formData.fechaCitacion}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setFormData({
                          ...formData,
                          fechaCitacion: selectedDate,
                        });
                      }
                    }}
                  />
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hora *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  value={formData.horaCitacion}
                  onChangeText={(text) =>
                    setFormData({ ...formData, horaCitacion: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Link de Videollamada</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://meet.google.com/..."
                  value={formData.enlaceVideoLlamada}
                  onChangeText={(text) =>
                    setFormData({ ...formData, enlaceVideoLlamada: text })
                  }
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>{editingCitacion ? "Actualizar" : "Crear"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  citacionCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  empresa: {
    fontSize: 13,
    color: "#FF6B35",
    fontWeight: "600",
    marginTop: 4,
  },
  estatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  estatusText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    marginVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    minWidth: 70,
  },
  value: {
    fontSize: 12,
    color: "#333",
    flex: 1,
  },
  linkText: {
    fontSize: 12,
    color: "#2196F3",
    textDecorationLine: "underline",
    flex: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  dateButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#FF6B35",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default CitacionesScreen;
