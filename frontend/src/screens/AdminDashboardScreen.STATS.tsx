import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
} from 'react-native';
import statsService, { EstadisticasGenerales } from '../services/statsService';
import { COLORES, ESPACIADOS, TAMAÑOS_FUENTE, RADIOS } from '../utils';

interface StatCard {
  titulo: string;
  valor: number;
  subtitulo?: string;
  color: string;
  icono: string;
}

const AdminDashboardScreen = ({ navigation }: any) => {
  // ==================== ESTADOS ====================

  const [stats, setStats] = useState<EstadisticasGenerales | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ==================== EFECTOS ====================

  useEffect(() => {
    cargarStats();
  }, []);

  // ==================== FUNCIONES ====================

  /**
   * Cargar estadísticas generales
   */
  const cargarStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getGenerales();
      setStats(data);
    } catch (error: any) {
      console.warn('Error cargando stats:', error.message);
      // No mostrar alerta para no interrumpir la UX
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await cargarStats();
    setRefreshing(false);
  };

  /**
   * Preparar datos de tarjetas de stats
   */
  const getStatCards = (): StatCard[] => {
    if (!stats) return [];

    return [
      {
        titulo: 'Aspirantes Totales',
        valor: stats.totalAspirantes,
        subtitulo: `${stats.aspirantesActivos} activos`,
        color: '#3b82f6',
        icono: '👥',
      },
      {
        titulo: 'Reclutadores',
        valor: stats.totalReclutadores,
        subtitulo: `${stats.reclutadoresActivos} activos`,
        color: '#8b5cf6',
        icono: '💼',
      },
      {
        titulo: 'Ofertas',
        valor: stats.totalOfertas,
        subtitulo: `${stats.ofertasAbiertas} abiertas`,
        color: '#10b981',
        icono: '📋',
      },
      {
        titulo: 'Postulaciones',
        valor: stats.totalPostulaciones,
        subtitulo: `${stats.postulacionesPendientes} pendientes`,
        color: '#f59e0b',
        icono: '✍️',
      },
      {
        titulo: 'Empresas',
        valor: stats.totalEmpresas,
        subtitulo: `${stats.empresasActivas} activas`,
        color: '#ec4899',
        icono: '🏢',
      },
    ];
  };

  /**
   * Renderizar tarjeta de stat
   */
  const renderStatCard = ({ item }: { item: StatCard }) => (
    <View style={[styles.statCard, { borderLeftColor: item.color }]}>
      <Text style={styles.statIcon}>{item.icono}</Text>
      <Text style={styles.statTitulo}>{item.titulo}</Text>
      <Text style={styles.statValor}>{item.valor}</Text>
      {item.subtitulo && <Text style={styles.statSubtitulo}>{item.subtitulo}</Text>}
    </View>
  );

  /**
   * Renderizar sección de resumen rápido
   */
  const renderResumenRapido = () => (
    <View style={styles.resumenCard}>
      <Text style={styles.resumenTitulo}>📊 Resumen Rápido</Text>

      <View style={styles.resumenRow}>
        <Text style={styles.resumenLabel}>Tasa de Conversión:</Text>
        <Text style={styles.resumenValor}>
          {stats && stats.totalPostulaciones && stats.totalAspirantes
            ? Math.round((stats.totalPostulaciones / stats.totalAspirantes) * 100)
            : 0}
          %
        </Text>
      </View>

      <View style={styles.resumenRow}>
        <Text style={styles.resumenLabel}>Promedio Ofertas/Empresa:</Text>
        <Text style={styles.resumenValor}>
          {stats && stats.totalEmpresas
            ? (stats.totalOfertas / stats.totalEmpresas).toFixed(1)
            : 0}
        </Text>
      </View>

      <View style={styles.resumenRow}>
        <Text style={styles.resumenLabel}>Estado General:</Text>
        <View style={styles.estadoBadge}>
          <Text style={styles.estadoBadgeText}>✓ Activo</Text>
        </View>
      </View>
    </View>
  );

  /**
   * Renderizar sección de acciones rápidas
   */
  const renderAccionesRapidas = () => (
    <View style={styles.accionesCard}>
      <Text style={styles.accionesTitulo}>⚡ Acciones Rápidas</Text>

      <View style={styles.accionesGrid}>
        <View style={styles.accionItem}>
          <Text style={styles.accionIcono}>👥</Text>
          <Text style={styles.accionLabel}>Ver Usuarios</Text>
          <Text style={styles.accionValor}>{stats?.totalAspirantes || 0}</Text>
        </View>

        <View style={styles.accionItem}>
          <Text style={styles.accionIcono}>📋</Text>
          <Text style={styles.accionLabel}>Gestionar Ofertas</Text>
          <Text style={styles.accionValor}>{stats?.totalOfertas || 0}</Text>
        </View>

        <View style={styles.accionItem}>
          <Text style={styles.accionIcono}>✍️</Text>
          <Text style={styles.accionLabel}>Ver Postulaciones</Text>
          <Text style={styles.accionValor}>{stats?.totalPostulaciones || 0}</Text>
        </View>

        <View style={styles.accionItem}>
          <Text style={styles.accionIcono}>🏢</Text>
          <Text style={styles.accionLabel}>Ver Empresas</Text>
          <Text style={styles.accionValor}>{stats?.totalEmpresas || 0}</Text>
        </View>
      </View>
    </View>
  );

  // ==================== RENDER ====================

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Bienvenido Admin</Text>
      </View>

      {/* Contenido */}
      {loading && !stats ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORES.PRIMARY} />
          <Text style={styles.loadingText}>Cargando estadísticas...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORES.PRIMARY]} />
          }
        >
          {/* Tarjetas de Stats */}
          {stats && (
            <>
              <FlatList
                data={getStatCards()}
                keyExtractor={(item) => item.titulo}
                renderItem={renderStatCard}
                scrollEnabled={false}
                contentContainerStyle={styles.statsGrid}
                numColumns={2}
              />

              {/* Resumen Rápido */}
              {renderResumenRapido()}

              {/* Acciones Rápidas */}
              {renderAccionesRapidas()}

              {/* Footer Info */}
              <View style={styles.footerInfo}>
                <Text style={styles.footerText}>
                  ℹ️ Los datos se actualizan automáticamente cada vez que realices cambios
                </Text>
              </View>
            </>
          )}
        </ScrollView>
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

  scrollContent: {
    flex: 1,
    paddingHorizontal: ESPACIADOS.MD,
    paddingVertical: ESPACIADOS.BASE,
  },

  // ========== STATS GRID ==========

  statsGrid: {
    gap: ESPACIADOS.SM,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: RADIOS.BASE,
    padding: ESPACIADOS.MD,
    marginBottom: ESPACIADOS.SM,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  statIcon: {
    fontSize: TAMAÑOS_FUENTE.XXL,
    marginBottom: ESPACIADOS.SM,
  },

  statTitulo: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: COLORES.TEXT_SECONDARY,
    fontWeight: '500',
    marginBottom: ESPACIADOS.XS,
  },

  statValor: {
    fontSize: TAMAÑOS_FUENTE.XXL,
    fontWeight: '700',
    color: COLORES.TEXT_PRIMARY,
    marginBottom: ESPACIADOS.XS,
  },

  statSubtitulo: {
    fontSize: TAMAÑOS_FUENTE.XS,
    color: '#999',
  },

  // ========== RESUMEN RÁPIDO ==========

  resumenCard: {
    backgroundColor: '#fff',
    borderRadius: RADIOS.BASE,
    padding: ESPACIADOS.MD,
    marginVertical: ESPACIADOS.BASE,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  resumenTitulo: {
    fontSize: TAMAÑOS_FUENTE.LG,
    fontWeight: '700',
    color: COLORES.TEXT_PRIMARY,
    marginBottom: ESPACIADOS.MD,
  },

  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ESPACIADOS.SM,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  resumenLabel: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: COLORES.TEXT_SECONDARY,
    fontWeight: '500',
  },

  resumenValor: {
    fontSize: TAMAÑOS_FUENTE.BASE,
    fontWeight: '700',
    color: COLORES.PRIMARY,
  },

  estadoBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: ESPACIADOS.SM,
    paddingVertical: ESPACIADOS.XS,
    borderRadius: RADIOS.SM,
  },

  estadoBadgeText: {
    color: '#065f46',
    fontWeight: '600',
    fontSize: TAMAÑOS_FUENTE.XS,
  },

  // ========== ACCIONES RÁPIDAS ==========

  accionesCard: {
    backgroundColor: '#fff',
    borderRadius: RADIOS.BASE,
    padding: ESPACIADOS.MD,
    marginVertical: ESPACIADOS.BASE,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  accionesTitulo: {
    fontSize: TAMAÑOS_FUENTE.LG,
    fontWeight: '700',
    color: COLORES.TEXT_PRIMARY,
    marginBottom: ESPACIADOS.MD,
  },

  accionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACIADOS.SM,
  },

  accionItem: {
    width: '48%',
    backgroundColor: '#f3f4f6',
    borderRadius: RADIOS.BASE,
    padding: ESPACIADOS.MD,
    alignItems: 'center',
  },

  accionIcono: {
    fontSize: TAMAÑOS_FUENTE.XXL,
    marginBottom: ESPACIADOS.SM,
  },

  accionLabel: {
    fontSize: TAMAÑOS_FUENTE.XS,
    color: COLORES.TEXT_SECONDARY,
    fontWeight: '500',
    marginBottom: ESPACIADOS.XS,
  },

  accionValor: {
    fontSize: TAMAÑOS_FUENTE.LG,
    fontWeight: '700',
    color: COLORES.PRIMARY,
  },

  // ========== FOOTER ==========

  footerInfo: {
    backgroundColor: '#fef3c7',
    borderRadius: RADIOS.BASE,
    padding: ESPACIADOS.MD,
    marginVertical: ESPACIADOS.MD,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },

  footerText: {
    fontSize: TAMAÑOS_FUENTE.SM,
    color: '#92400e',
    fontWeight: '500',
  },

  // ========== LOADING ==========

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
});

export default AdminDashboardScreen;
