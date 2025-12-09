import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { ofertaService, postulacionService, authService } from "../services/api";

const DetalleOfertaScreen = ({ navigation, route }: any) => {
  const { ofertaId } = route.params || {};
  const [oferta, setOferta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [yaPostulado, setYaPostulado] = useState(false);
  const [postulando, setPostulando] = useState(false);

  useEffect(() => {
    console.log("🔍 DetalleOfertaScreen montado con ofertaId:", ofertaId);
    if (!ofertaId) {
      console.error("❌ No se recibió ofertaId en route.params");
      Alert.alert("Error", "No se recibió el ID de la oferta");
      return;
    }
    cargarOferta();
    cargarUsuario();
  }, [ofertaId]);

  const cargarOferta = async () => {
    try {
      setLoading(true);
      console.log("📥 Cargando oferta con ID:", ofertaId);
      const response = await ofertaService.getById(Number(ofertaId));
      console.log("✅ Oferta cargada:", response.data);
      setOferta(response.data);
    } catch (err: any) {
      console.error("❌ Error cargando oferta:", err);
      console.error("Respuesta de error:", err.response?.data);
      Alert.alert("Error", "No se pudo cargar la oferta");
    } finally {
      setLoading(false);
    }
  };

  const cargarUsuario = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);

    // Verificar si ya se postuló
    if (currentUser?.role === "ASPIRANTE" && currentUser?.id) {
      try {
        const response = await postulacionService.getByAspirante(currentUser.id);
        const yaPostulada = response.data?.some((p: any) => p.ofertaId === Number(ofertaId));
        setYaPostulado(yaPostulada);
      } catch (err) {
        // @ts-ignore
        console.error("Error verificando postulación:", err);
      }
    }
  };

  const handlePostularse = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión");
      return;
    }

    if (user.role !== "ASPIRANTE") {
      Alert.alert("Error", "Solo los aspirantes pueden postularse");
      return;
    }

    if (yaPostulado) {
      Alert.alert("Aviso", "Ya te has postulado a esta oferta");
      return;
    }

    setPostulando(true);
    try {
      await postulacionService.postularse(ofertaId, user.id);
      Alert.alert("Éxito", "Te has postulado exitosamente");
      setYaPostulado(true);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Error al postularse");
    } finally {
      setPostulando(false);
    }
  };

  const handleEliminarOferta = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión");
      return;
    }

    if (user.role !== "ADMIN" && user.role !== "RECLUTADOR") {
      Alert.alert("Error", "No tienes permisos para eliminar ofertas");
      return;
    }

    Alert.alert(
      "❌ Eliminar Oferta",
      `¿Está seguro que desea eliminar "${oferta.titulo}"?\n\nEsta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              console.log(
                "🗑️ Eliminando oferta ID:",
                oferta.id,
                "por usuario:",
                user?.username
              );
              await ofertaService.delete(oferta.id, user.id);
              Alert.alert("✅ Éxito", "Oferta eliminada correctamente", [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error: any) {
              console.error("❌ Error eliminando oferta:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Error al eliminar oferta"
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!oferta) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se pudo cargar la oferta</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header de la oferta */}
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>{oferta.titulo}</Text>
        <Text style={styles.empresa}>{oferta.empresa}</Text>
        <Text style={styles.estado}>{oferta.estado}</Text>
      </View>

      {/* Información clave */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📍 Ubicación</Text>
          <Text style={styles.infoValue}>{oferta.ubicacion}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>💰 Salario</Text>
          <Text style={styles.infoValue}>${oferta.salario}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>⏰ Tipo</Text>
          <Text style={styles.infoValue}>{oferta.tipo || "Tiempo completo"}</Text>
        </View>
      </View>

      {/* Descripción */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Descripción del Puesto</Text>
        <Text style={styles.descripcion}>{oferta.descripcion}</Text>
      </View>

      {/* Habilidades requeridas */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Habilidades Requeridas</Text>
        <View style={styles.skillsContainer}>
          {oferta.habilidadesRequeridas?.split(",").map((skill: string, idx: number) => (
            <View key={idx} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill.trim()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Beneficios */}
      {oferta.beneficios && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Beneficios</Text>
          <Text style={styles.descripcion}>{oferta.beneficios}</Text>
        </View>
      )}

      {/* Botones de acción */}
      <View style={styles.actionContainer}>
        {user?.role === "ASPIRANTE" && (
          <TouchableOpacity
            style={[
              styles.postularseBtn,
              (yaPostulado || postulando) && styles.buttonDisabled,
            ]}
            onPress={handlePostularse}
            disabled={yaPostulado || postulando}
          >
            {postulando ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.postularseBtnText}>
                {yaPostulado ? "Ya Postulado ✓" : "Postularme"}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {(user?.role === "RECLUTADOR" || user?.role === "ADMIN") && (
          <>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                console.log("✏️ Navegando a edición de oferta:", oferta.id);
                navigation.navigate("CrearOferta", { ofertaId: oferta.id });
              }}
            >
              <Text style={styles.editBtnText}>✏️ Editar Oferta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleEliminarOferta}
            >
              <Text style={styles.deleteBtnText}>🗑️ Eliminar Oferta</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  empresa: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
  },
  estado: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  infoContainer: {
    backgroundColor: "white",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  infoValue: {
    fontSize: 14,
    color: "#666",
  },
  sectionContainer: {
    backgroundColor: "white",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillTag: {
    backgroundColor: "#FF6B35",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skillText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 10,
  },
  postularseBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  postularseBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  editBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  editBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  backBtnText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default DetalleOfertaScreen;
