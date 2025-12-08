import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { postulacionService, authService } from "../services/api";

const PostulacionesScreen = ({ navigation }: any) => {
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
    loadPostulaciones();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadPostulaciones = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser?.role === "ASPIRANTE" && currentUser?.id) {
        const response = await postulacionService.getByAspirante(currentUser.id);
        setPostulaciones(response.data || []);
      } else if (currentUser?.role === "RECLUTADOR" && currentUser?.id) {
        const response = await postulacionService.getByReclutador(currentUser.id);
        setPostulaciones(response.data || []);
      } else if (currentUser?.role === "ADMIN") {
        const response = await postulacionService.getAll();
        setPostulaciones(response.data || []);
      }
    } catch (error) {
      console.error("Error loading postulaciones:", error);
      Alert.alert("Error", "No se pudieron cargar las postulaciones");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadPostulaciones();
    } finally {
      setRefreshing(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "ACEPTADA":
        return "#4CAF50";
      case "RECHAZADA":
        return "#f44336";
      case "ENVIADA":
        return "#FF9800";
      case "EN_REVISION":
        return "#2196F3";
      default:
        return "#999";
    }
  };

  const renderPostulacion = ({ item }: any) => {
    // ✅ Validar que exista oferta antes de navegar
    const handleNavigateToOferta = () => {
      // 🔍 DEPURACIÓN: Log del objeto postulación
      console.log("📦 Objeto postulación completo:", JSON.stringify(item, null, 2));
      
      // Intentar obtener ID de oferta de varias formas posibles
      // Orden de preferencia: item.oferta.id > item.ofertaId
      const ofertaId = item.oferta?.id || item.ofertaId;
      
      console.log("🔍 Buscando ofertaId...");
      console.log("   - item.oferta?.id:", item.oferta?.id);
      console.log("   - item.ofertaId:", item.ofertaId);
      console.log("   - ofertaId final:", ofertaId);
      
      if (!ofertaId) {
        console.error("❌ No se encontró ofertaId en la postulación:", item);
        Alert.alert(
          "Error",
          "Los datos de la oferta no están disponibles. Por favor intente más tarde.",
          [{ text: "OK" }]
        );
        return;
      }
      
      console.log("✅ Navegando a DetalleOferta con ofertaId:", ofertaId);
      navigation.navigate('DetalleOferta', { ofertaId });
    };

    return (
      <TouchableOpacity
        style={styles.postulacionCard}
        onPress={handleNavigateToOferta}
      >
        <View style={styles.headerRow}>
          <Text style={styles.ofertaTitulo} numberOfLines={2}>
            {item.ofertaTitulo || item.oferta?.titulo || "Oferta sin título"}
          </Text>
          <View style={[styles.estatusBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
            <Text style={styles.estatusText}>{item.estado}</Text>
          </View>
        </View>

        <Text style={styles.empresa}>{item.empresa || item.oferta?.empresa || "Empresa desconocida"}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Postulación:</Text>
          <Text style={styles.value}>{new Date(item.fechaPostulacion).toLocaleDateString()}</Text>
      </View>

      {item.feedback && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackLabel}>Feedback:</Text>
          <Text style={styles.feedbackText}>{item.feedback}</Text>
        </View>
      )}

      {item.estado === "EN_REVISION" && (
        <View style={styles.reviewingBadge}>
          <Text style={styles.reviewingText}>⏳ En revisión...</Text>
        </View>
      )}
    </TouchableOpacity>
    );
  };  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={postulaciones}
        renderItem={renderPostulacion}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>📝 Sin postulaciones</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postulacionCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 14,
    marginVertical: 8,
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
    marginBottom: 8,
  },
  ofertaTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  empresa: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  estatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estatusText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    marginVertical: 4,
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
  feedbackContainer: {
    backgroundColor: "#f9f9f9",
    borderLeftWidth: 3,
    borderLeftColor: "#FF9800",
    padding: 10,
    marginTop: 8,
    borderRadius: 4,
  },
  feedbackLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 12,
    color: "#333",
    lineHeight: 16,
  },
  reviewingBadge: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 8,
    alignItems: "center",
  },
  reviewingText: {
    color: "#2196F3",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});

export default PostulacionesScreen;
