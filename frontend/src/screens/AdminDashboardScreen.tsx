// @ts-ignore - React hooks types handled by Expo
import React, { useState, useEffect } from 'react';
// @ts-ignore - react-native types handled by Expo
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
// @ts-ignore - Navigation types handled by Expo
import { useNavigation } from '@react-navigation/native';
import { AdminDashboardStyles } from '../styles/AdminStyles';
import adminService, { DashboardStats } from '../services/adminService';

// @ts-ignore - Component type handled by Expo
const AdminDashboardScreen = () => {
  // @ts-ignore - Navigation type handled by Expo
  const navigation = useNavigation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Error al cargar las estadísticas del dashboard';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // @ts-ignore - Component type handled by Expo
  const StatCard = ({ value, label }) => (
    <View style={AdminDashboardStyles.statCard}>
      <Text style={AdminDashboardStyles.statValue}>{value}</Text>
      <Text style={AdminDashboardStyles.statLabel}>{label}</Text>
    </View>
  );

  const navigateToOfertas = () => {
    navigation.navigate('AdminOfertas');
  };

  const navigateToUsuarios = () => {
    navigation.navigate('AdminUsuarios');
  };

  if (loading) {
    return (
      <View style={AdminDashboardStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={[AdminDashboardStyles.statLabel, { marginTop: 12 }]}>
          Cargando estadísticas...
        </Text>
      </View>
    );
  }

  return (
    <View style={AdminDashboardStyles.container}>
      {/* Header */}
      <View style={AdminDashboardStyles.header}>
        <Text style={AdminDashboardStyles.headerTitle}>Panel de Administrador</Text>
        <Text style={AdminDashboardStyles.headerSubtitle}>
          Resumen general de la plataforma
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={AdminDashboardStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={AdminDashboardStyles.contentContainer}>
          {/* Error Message */}
          {error && (
            <View style={AdminDashboardStyles.errorContainer}>
              <Text style={AdminDashboardStyles.errorText}>
                ⚠️ {error}
              </Text>
            </View>
          )}

          {/* Estadísticas Grid */}
          {stats && (
            <>
              <View style={AdminDashboardStyles.statsGrid}>
                <StatCard value={stats.totalOfertas} label="Total de Ofertas" />
                <StatCard value={stats.ofertasAbiertas} label="Ofertas Abiertas" />
                <StatCard value={stats.totalAspirantes} label="Total de Aspirantes" />
                <StatCard value={stats.totalReclutadores} label="Reclutadores" />
                <StatCard value={stats.totalPostulaciones} label="Postulaciones" />
                <StatCard value={stats.postulacionesAprobadas} label="Aprobadas" />
                <StatCard value={stats.totalCitaciones} label="Citaciones" />
                <StatCard value={stats.citacionesRealizadas} label="Realizadas" />
                <StatCard value={stats.usuariosActivos} label="Usuarios Activos" />
                <StatCard value={stats.usuariosInactivos} label="Usuarios Inactivos" />
              </View>

              {/* Main Action Buttons */}
              <View style={AdminDashboardStyles.buttonContainer}>
                <TouchableOpacity
                  style={AdminDashboardStyles.button}
                  onPress={navigateToOfertas}
                  activeOpacity={0.7}
                >
                  <Text style={AdminDashboardStyles.buttonText}>
                    📋 Gestionar Ofertas
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[AdminDashboardStyles.button, AdminDashboardStyles.buttonSecondary]}
                  onPress={navigateToUsuarios}
                  activeOpacity={0.7}
                >
                  <Text style={AdminDashboardStyles.buttonText}>
                    👥 Gestionar Usuarios
                  </Text>
                </TouchableOpacity>

                {/* Refresh Button */}
                <TouchableOpacity
                  style={[AdminDashboardStyles.button, { backgroundColor: '#17A2B8' }]}
                  onPress={loadDashboardStats}
                  activeOpacity={0.7}
                >
                  <Text style={AdminDashboardStyles.buttonText}>
                    🔄 Actualizar Estadísticas
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboardScreen;
