import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ofertaService, authService } from "../services/api";

const OfertasScreen = ({ navigation }: any) => {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [filteredOfertas, setFilteredOfertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  // Cargar usuario al montar el componente
  useEffect(() => {
    cargarUsuario();
  }, []);

  // 🔄 useFocusEffect: Recargar ofertas CADA VEZ que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 OfertasScreen en foco - Recargando datos...");
      cargarOfertas();

      // Función de limpieza (opcional)
      return () => {
        console.log("📴 OfertasScreen desenfocada");
      };
    }, [])
  );

  // Filtrar ofertas cuando cambia el texto de búsqueda o las ofertas
  useEffect(() => {
    if (searchText.trim()) {
      setFilteredOfertas(
        ofertas.filter((o) =>
          o.titulo.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setFilteredOfertas(ofertas);
    }
  }, [searchText, ofertas]);

  const cargarUsuario = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      console.log("👤 Usuario actual:", currentUser?.username);
    } catch (err) {
      console.error("❌ Error cargando usuario:", err);
    }
  };

  const cargarOfertas = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("⏳ Iniciando carga de ofertas...");

      const response = await ofertaService.getAll();

      console.log("📦 Ofertas recibidas del Backend:", response.data.length);
      console.log(
        "📋 Datos de ofertas:",
        JSON.stringify(response.data, null, 2)
      );

      if (response.data && Array.isArray(response.data)) {
        setOfertas(response.data);
        console.log("✅ Ofertas cargadas exitosamente:", response.data.length);
      } else {
        console.warn("⚠️ Respuesta inesperada:", response.data);
        setOfertas([]);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Error cargando ofertas";
      setError(errorMsg);
      console.error("❌ Error al cargar ofertas:", {
        status: err.response?.status,
        message: errorMsg,
        fullError: err,
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    console.log("🔄 Recarga manual iniciada por usuario (pull-down)");
    setRefreshing(true);
    await cargarOfertas();
    setRefreshing(false);
    console.log("✅ Recarga manual completada");
  };

  const handlePostularse = (ofertaId: number) => {
    if (!user) {
      Alert.alert("Aviso", "Debes iniciar sesión");
      return;
    }
    if (user.role !== "ASPIRANTE") {
      Alert.alert("Aviso", "Solo los aspirantes pueden postularse");
      return;
    }
    navigation.navigate('DetalleOferta', { ofertaId, canApply: true });
  };

  const handleCrearOferta = () => {
    if (user?.role !== "RECLUTADOR" && user?.role !== "ADMIN") {
      Alert.alert("Aviso", "Solo reclutadores pueden crear ofertas");
      return;
    }
    navigation.navigate('CrearOferta');
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {(user?.role === "RECLUTADOR" || user?.role === "ADMIN") && (
        <TouchableOpacity style={styles.createButton} onPress={handleCrearOferta}>
          <Text style={styles.createButtonText}>+ Nueva Oferta</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ofertas por título..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredOfertas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          // 🔐 LÓGICA DE ROLES - Según SecurityConfig.java
          // RECLUTADOR y ADMIN pueden editar/eliminar TODAS las ofertas
          const isRecruiterOrAdmin = user?.role === "ADMIN" || user?.role === "RECLUTADOR";
          const isAspirante = user?.role === "ASPIRANTE";

          console.log("👤 Usuario:", user?.username, "Rol:", user?.role);
          console.log("🔑 isRecruiterOrAdmin:", isRecruiterOrAdmin, "isAspirante:", isAspirante);

          return (
            <View style={styles.ofertaCard}>
              <Text style={styles.ofertaTitulo}>{item.titulo}</Text>
              <Text style={styles.ofertaEmpresa}>{item.empresa}</Text>

              <View style={styles.detallesRow}>
                <Text style={styles.detalleItem}>📍 {item.ubicacion}</Text>
                <Text style={styles.detalleItem}>💰 ${item.salario}</Text>
              </View>

              <Text style={styles.ofertaDescripcion} numberOfLines={2}>
                {item.descripcion}
              </Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.verDetallesBtn}
                  onPress={() => navigation.navigate('DetalleOferta', { ofertaId: item.id })}
                >
                  <Text style={styles.verDetallesText}>Ver Detalles</Text>
                </TouchableOpacity>

                {/* ✅ Solo ASPIRANTE puede postularse */}
                {isAspirante && (
                  <TouchableOpacity
                    style={styles.postularseBtn}
                    onPress={() => handlePostularse(item.id)}
                  >
                    <Text style={styles.postularseText}>Postularme</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* ✅ Solo RECLUTADOR y ADMIN ven botones de editar/eliminar */}
              {isRecruiterOrAdmin && (
                <View style={styles.adminActionButtons}>
                  <TouchableOpacity
                    style={[styles.adminButton, styles.editButton]}
                    onPress={() => {
                      console.log("✏️ Editando oferta ID:", item.id, "por usuario:", user?.username);
                      // ✅ Navegar a CrearOfertaScreen en modo edición (reutiliza la pantalla)
                      navigation.navigate('CrearOferta', { 
                        ofertaId: item.id,
                        editMode: true
                      });
                    }}
                  >
                    <Text style={styles.adminButtonText}>✏️ Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.adminButton, styles.deleteButton]}
                    onPress={() =>
                      Alert.alert(
                        "❌ Eliminar Oferta",
                        `¿Está seguro que desea eliminar "${item.titulo}"?\n\nEsta acción no se puede deshacer.`,
                        [
                          { text: "Cancelar", style: "cancel" },
                          {
                            text: "Eliminar",
                            style: "destructive",
                            onPress: async () => {
                              try {
                                console.log("🗑️ Eliminando oferta ID:", item.id, "por usuario:", user?.username);
                                await ofertaService.delete(item.id, user.id);
                                Alert.alert(
                                  "✅ Éxito",
                                  "Oferta eliminada correctamente"
                                );
                                cargarOfertas();
                              } catch (error: any) {
                                console.error("❌ Error eliminando oferta:", error);
                                Alert.alert(
                                  "Error",
                                  error.response?.data?.message ||
                                    "Error al eliminar oferta"
                                );
                              }
                            },
                          },
                        ]
                      )
                    }
                  >
                    <Text style={styles.adminButtonText}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay ofertas disponibles</Text>
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
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  ofertaCard: {
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
  ofertaTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  ofertaEmpresa: {
    fontSize: 13,
    color: "#FF6B35",
    fontWeight: "600",
    marginBottom: 8,
  },
  detallesRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detalleItem: {
    fontSize: 12,
    color: "#666",
    marginRight: 16,
  },
  ofertaDescripcion: {
    fontSize: 12,
    color: "#777",
    marginBottom: 10,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  verDetallesBtn: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    alignItems: "center",
  },
  verDetallesText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 13,
  },
  postularseBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  postularseText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  // ✅ NUEVOS estilos para botones de Admin
  adminActionButtons: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  adminButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  adminButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});

export default OfertasScreen;
