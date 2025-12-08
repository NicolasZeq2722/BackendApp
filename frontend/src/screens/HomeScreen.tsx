import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import {
  ofertaService,
  postulacionService,
  notificacionService,
} from "../services/api";

const HomeScreen = ({ navigation }: any) => {
  const authContext = React.useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, [user]);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const stats: any = {};

      if (user?.role === "ASPIRANTE") {
        const postulaciones = await postulacionService.getByAspirante(user.id);
        const notificaciones = await notificacionService.getNoLeidas(user.id);
        stats.postulaciones = postulaciones.data?.length || 0;
        stats.notificacionesNoLeidas = notificaciones.data?.length || 0;
      } else if (user?.role === "RECLUTADOR") {
        const ofertas = await ofertaService.getAll();
        const postulaciones = await postulacionService.getByReclutador(user.id);
        stats.ofertas = ofertas.data?.filter((o: any) => o.reclutadorId === user.id).length || 0;
        stats.postulaciones = postulaciones.data?.length || 0;
      } else if (user?.role === "ADMIN") {
        const ofertas = await ofertaService.getAll();
        stats.ofertas = ofertas.data?.length || 0;
      }

      setStats(stats);
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  const renderAspiranteHome = () => (
    <ScrollView style={styles.scrollView}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>¡Bienvenido, {user?.nombre}!</Text>
        <Text style={styles.welcomeSubtitle}>Aspirante de Empleo</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.postulaciones || 0}</Text>
          <Text style={styles.statLabel}>Postulaciones</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.notificacionesNoLeidas || 0}</Text>
          <Text style={styles.statLabel}>Notificaciones</Text>
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Ofertas')}
        >
          <Text style={styles.actionButtonEmoji}>🔍</Text>
          <Text style={styles.actionButtonText}>Buscar Ofertas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Postulaciones')}
        >
          <Text style={styles.actionButtonEmoji}>📋</Text>
          <Text style={styles.actionButtonText}>Mis Postulaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Citaciones')}
        >
          <Text style={styles.actionButtonEmoji}>📅</Text>
          <Text style={styles.actionButtonText}>Mis Citaciones</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderReclutadorHome = () => (
    <ScrollView style={styles.scrollView}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>¡Bienvenido, {user?.nombre}!</Text>
        <Text style={styles.welcomeSubtitle}>Reclutador</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.ofertas || 0}</Text>
          <Text style={styles.statLabel}>Mis Ofertas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.postulaciones || 0}</Text>
          <Text style={styles.statLabel}>Postulaciones</Text>
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CrearOferta')}
        >
          <Text style={styles.actionButtonEmoji}>➕</Text>
          <Text style={styles.actionButtonText}>Nueva Oferta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Postulaciones')}
        >
          <Text style={styles.actionButtonEmoji}>📝</Text>
          <Text style={styles.actionButtonText}>Postulaciones Recibidas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Citaciones')}
        >
          <Text style={styles.actionButtonEmoji}>📅</Text>
          <Text style={styles.actionButtonText}>Citaciones</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderAdminHome = () => (
    <ScrollView style={styles.scrollView}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Panel de Administración</Text>
        <Text style={styles.welcomeSubtitle}>Gestor del Sistema</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.ofertas || 0}</Text>
          <Text style={styles.statLabel}>Ofertas Activas</Text>
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Gestión</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Admin')}
        >
          <Text style={styles.actionButtonEmoji}>👥</Text>
          <Text style={styles.actionButtonText}>Gestionar Usuarios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Ofertas')}
        >
          <Text style={styles.actionButtonEmoji}>💼</Text>
          <Text style={styles.actionButtonText}>Ver Todas las Ofertas</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
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
      {user?.role === "ASPIRANTE" && renderAspiranteHome()}
      {user?.role === "RECLUTADOR" && renderReclutadorHome()}
      {user?.role === "ADMIN" && renderAdminHome()}
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeContainer: {
    backgroundColor: "#FF6B35",
    paddingVertical: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 20,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6B35",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  logoutButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 20,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
