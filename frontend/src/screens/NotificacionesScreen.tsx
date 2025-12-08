import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { notificacionService, authService } from "../services/api";

const NotificacionesScreen = ({ navigation }: any) => {
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    cargarNotificaciones();
    cargarUsuario();

    // Recargar cada 30 segundos
    const interval = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(interval);
  }, []);

  const cargarUsuario = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      if (currentUser?.id) {
        const response = await notificacionService.getByUsuario(currentUser.id);
        setNotificaciones(response.data || []);
      }
    } catch (err) {
      // @ts-ignore
      console.error("Error cargando notificaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarNotificaciones();
    setRefreshing(false);
  };

  const handleMarcarComoLeida = async (id: number) => {
    try {
      await notificacionService.marcarComoLeida(id);
      cargarNotificaciones();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleMarcarTodas = async () => {
    try {
      if (user?.id) {
        await notificacionService.marcarTodasComoLeida(user.id);
        cargarNotificaciones();
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "CITACION":
        return "#2196F3";
      case "POSTULACION":
        return "#4CAF50";
      case "OFERTA":
        return "#FF9800";
      case "CAMBIO_ESTADO":
        return "#9C27B0";
      default:
        return "#666";
    }
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
      {notificaciones.length > 0 && (
        <TouchableOpacity style={styles.marcarTodas} onPress={handleMarcarTodas}>
          <Text style={styles.marcarTodasText}>✓ Marcar todas como leídas</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={notificaciones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notificationCard, item.leida && styles.notificationRead]}
            onPress={() => handleMarcarComoLeida(item.id)}
          >
            <View
              style={[
                styles.tipoBadge,
                { backgroundColor: getTipoColor(item.tipo) },
              ]}
            >
              <Text style={styles.tipoText}>{item.tipo.charAt(0)}</Text>
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.mensaje} numberOfLines={2}>
                {item.mensaje}
              </Text>
              <Text style={styles.fecha}>
                {new Date(item.fechaCreacion).toLocaleDateString()}
              </Text>
            </View>

            {!item.leida && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📭 Sin notificaciones</Text>
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  marcarTodas: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  marcarTodasText: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "600",
  },
  notificationCard: {
    backgroundColor: "white",
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationRead: {
    backgroundColor: "#f9f9f9",
  },
  tipoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipoText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  mensaje: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    lineHeight: 16,
  },
  fecha: {
    fontSize: 11,
    color: "#999",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B35",
    marginLeft: 8,
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

export default NotificacionesScreen;
