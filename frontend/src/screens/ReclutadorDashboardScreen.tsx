// @ts-ignore - React hooks and react-native types handled by Expo
import React, { useEffect, useState, useCallback } from 'react';
// @ts-ignore - react-native types handled by Expo
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
// @ts-ignore - Navigation types handled by Expo
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ofertaService, postulacionService } from '../services/api';

// Colores y estilos base
const COLORES = {
  principal: '#FF6B35',
  acento: '#004E89',
  fondo: '#F5F7FA',
  blanco: '#FFFFFF',
  gris: '#E0E0E0',
  grisOscuro: '#757575',
  texto: '#333333',
  textoClaro: '#666666',
  verde: '#4CAF50',
  naranja: '#FF9800',
  rojo: '#F44336',
  azul: '#2196F3',
};

const ESPACIADOS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

const TAMAÑOS_FUENTE = {
  xs: 12,
  sm: 13,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
};

const RADIOS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

const ReclutadorDashboardScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalOfertas: 0,
    ofertasAbiertas: 0,
    ofertasCerradas: 0,
    postulacionesPendientes: 0,
    postulacionesAceptadas: 0,
    postulacionesRechazadas: 0,
    totalCandidatos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('user');
      const userParsed = userData ? JSON.parse(userData) : null;
      setUser(userParsed);

      if (userParsed?.id) {
        await cargarEstadisticas(userParsed.id);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async (reclutadorId: number) => {
    try {
      // Obtener todas las ofertas del reclutador
      const ofertasResponse = await ofertaService.getByReclutador(reclutadorId);
      const ofertas = ofertasResponse.data || [];

      const totalOfertas = ofertas.length;
      const ofertasAbiertas = ofertas.filter((o: any) => o.estado === 'ABIERTA').length;
      const ofertasCerradas = ofertas.filter((o: any) => o.estado === 'CERRADA').length;

      // Obtener postulaciones del reclutador
      const postulacionesResponse = await postulacionService.getByReclutador(reclutadorId);
      const postulaciones = postulacionesResponse.data || [];

      const postulacionesPendientes = postulaciones.filter((p: any) => p.estado === 'PENDIENTE').length;
      const postulacionesAceptadas = postulaciones.filter((p: any) => p.estado === 'ACEPTADA').length;
      const postulacionesRechazadas = postulaciones.filter((p: any) => p.estado === 'RECHAZADA').length;
      const totalCandidatos = postulaciones.length;

      setStats({
        totalOfertas,
        ofertasAbiertas,
        ofertasCerradas,
        postulacionesPendientes,
        postulacionesAceptadas,
        postulacionesRechazadas,
        totalCandidatos,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user?.id) {
        await cargarEstadisticas(user.id);
      }
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORES.principal} />
        <Text style={styles.loadingText}>Cargando panel...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORES.principal]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel de Reclutador</Text>
        <Text style={styles.headerSubtitle}>Bienvenido, {user?.nombre}</Text>
      </View>

      {/* Ofertas Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>📋 Mis Ofertas</Text>

        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={[styles.statCard, { borderLeftColor: COLORES.principal }]}
            onPress={() => navigation.navigate('ReclutadorOfertas')}
          >
            <Text style={styles.statNumber}>{stats.totalOfertas}</Text>
            <Text style={styles.statLabel}>Total de Ofertas</Text>
          </TouchableOpacity>

          <View style={[styles.statCard, { borderLeftColor: COLORES.verde }]}>
            <Text style={styles.statNumber}>{stats.ofertasAbiertas}</Text>
            <Text style={styles.statLabel}>Abiertas</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: COLORES.rojo }]}>
            <Text style={styles.statNumber}>{stats.ofertasCerradas}</Text>
            <Text style={styles.statLabel}>Cerradas</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORES.principal }]}
          onPress={() => navigation.navigate('ReclutadorOfertas')}
        >
          <Text style={styles.actionButtonText}>Ver Todas mis Ofertas</Text>
        </TouchableOpacity>
      </View>

      {/* Postulaciones Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>👥 Postulaciones Recibidas</Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: COLORES.azul }]}>
            <Text style={styles.statNumber}>{stats.totalCandidatos}</Text>
            <Text style={styles.statLabel}>Total de Candidatos</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: COLORES.naranja }]}>
            <Text style={styles.statNumber}>{stats.postulacionesPendientes}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: COLORES.verde }]}>
            <Text style={styles.statNumber}>{stats.postulacionesAceptadas}</Text>
            <Text style={styles.statLabel}>Aceptadas</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: COLORES.rojo }]}>
            <Text style={styles.statNumber}>{stats.postulacionesRechazadas}</Text>
            <Text style={styles.statLabel}>Rechazadas</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORES.acento }]}
          onPress={() => navigation.navigate('GestionarCandidatos', { reclutadorId: user?.id })}
        >
          <Text style={styles.actionButtonText}>Gestionar Candidatos</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: COLORES.verde }]}
            onPress={() => navigation.navigate('CrearOferta')}
          >
            <Text style={styles.quickActionText}>➕ Nueva Oferta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: COLORES.azul }]}
            onPress={() => navigation.navigate('ReclutadorOfertas')}
          >
            <Text style={styles.quickActionText}>📋 Mis Ofertas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: COLORES.naranja }]}
            onPress={() => navigation.navigate('Citaciones')}
          >
            <Text style={styles.quickActionText}>📅 Citaciones</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    paddingHorizontal: ESPACIADOS.md,
    paddingTop: ESPACIADOS.md,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORES.fondo,
  },

  loadingText: {
    marginTop: ESPACIADOS.md,
    fontSize: TAMAÑOS_FUENTE.md,
    color: COLORES.textoClaro,
  },

  header: {
    marginBottom: ESPACIADOS.xl,
  },

  headerTitle: {
    fontSize: TAMAÑOS_FUENTE.xxl,
    fontWeight: '700',
    color: COLORES.principal,
    marginBottom: ESPACIADOS.sm,
  },

  headerSubtitle: {
    fontSize: TAMAÑOS_FUENTE.md,
    color: COLORES.textoClaro,
  },

  sectionContainer: {
    marginBottom: ESPACIADOS.xl,
  },

  sectionTitle: {
    fontSize: TAMAÑOS_FUENTE.lg,
    fontWeight: '700',
    color: COLORES.texto,
    marginBottom: ESPACIADOS.md,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: ESPACIADOS.lg,
  },

  statCard: {
    width: '48%',
    backgroundColor: COLORES.blanco,
    borderRadius: RADIOS.lg,
    padding: ESPACIADOS.lg,
    marginBottom: ESPACIADOS.md,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  statNumber: {
    fontSize: TAMAÑOS_FUENTE.xxl,
    fontWeight: '700',
    color: COLORES.principal,
    marginBottom: ESPACIADOS.xs,
  },

  statLabel: {
    fontSize: TAMAÑOS_FUENTE.sm,
    color: COLORES.textoClaro,
    fontWeight: '500',
  },

  actionButton: {
    paddingVertical: ESPACIADOS.md,
    paddingHorizontal: ESPACIADOS.lg,
    borderRadius: RADIOS.lg,
    alignItems: 'center',
    marginBottom: ESPACIADOS.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },

  actionButtonText: {
    color: COLORES.blanco,
    fontSize: TAMAÑOS_FUENTE.md,
    fontWeight: '600',
  },

  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ESPACIADOS.md,
  },

  quickActionButton: {
    flex: 1,
    paddingVertical: ESPACIADOS.md,
    paddingHorizontal: ESPACIADOS.sm,
    borderRadius: RADIOS.lg,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },

  quickActionText: {
    color: COLORES.blanco,
    fontSize: TAMAÑOS_FUENTE.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ReclutadorDashboardScreen;
