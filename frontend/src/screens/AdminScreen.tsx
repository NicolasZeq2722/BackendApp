import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { usuarioService, authService } from "../services/api";

const AdminScreen = ({ navigation }: any) => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarUsuarios();
    cargarUsuarioActual();
  }, []);

  const cargarUsuarioActual = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);

    // Verificar que sea admin
    if (currentUser?.role !== "ADMIN") {
      Alert.alert("Acceso Denegado", "Solo los administradores pueden acceder aquí");
      navigation.goBack();
    }
  };

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getAll();
      setUsuarios(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error cargando usuarios");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarUsuarios();
    setRefreshing(false);
  };

  const handleEliminarUsuario = (userId: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Deseas eliminar este usuario?",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await usuarioService.delete(userId);
              setUsuarios(usuarios.filter((u) => u.id !== userId));
              Alert.alert("Éxito", "Usuario eliminado");
            } catch (err: any) {
              Alert.alert("Error", err.response?.data?.message || "Error eliminando usuario");
            }
          },
        },
      ]
    );
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "#9C27B0";
      case "RECLUTADOR":
        return "#2196F3";
      case "ASPIRANTE":
        return "#4CAF50";
      case "ADSO":
        return "#FF9800";
      default:
        return "#666";
    }
  };

  const renderUsuario = ({ item }: any) => (
    <View style={styles.usuarioCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.nombre}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: getRoleBadgeColor(item.role) },
          ]}
        >
          <Text style={styles.roleBadgeText}>{item.role}</Text>
        </View>
      </View>

      <View style={styles.detallesContainer}>
        <Text style={styles.detalle}>📱 {item.numeroTelefono || "Sin teléfono"}</Text>
        <Text style={styles.detalle}>🆔 ID: {item.id}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => Alert.alert("Editar", "Función de editar no implementada aún")}
        >
          <Text style={styles.editBtnText}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleEliminarUsuario(item.id)}
        >
          <Text style={styles.deleteBtnText}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
        <Text style={styles.headerSubtitle}>Total: {usuarios.length} usuarios</Text>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CrearUsuario')}
      >
        <Text style={styles.createButtonText}>+ Nuevo Usuario</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUsuario}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📭 Sin usuarios</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
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
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  createButton: {
    backgroundColor: "#4CAF50",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginHorizontal: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  usuarioCard: {
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: "#666",
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  detallesContainer: {
    marginBottom: 10,
  },
  detalle: {
    fontSize: 12,
    color: "#666",
    marginVertical: 3,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  editBtnText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#f44336",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteBtnText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});

export default AdminScreen;
