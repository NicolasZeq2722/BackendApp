/**
 * 🗄️ INICIALIZADOR DE BASE DE DATOS
 * 
 * Se ejecuta una sola vez al iniciar la aplicación
 * Crea las tablas y carga datos iniciales
 */

import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeDatabase, getUserFromDatabase, getCacheStats, clearDatabase } from '../services/database';

/**
 * Inicializar la base de datos en el arranque de la app
 * Se debe llamar desde App.tsx o AppInitializer
 */
export const setupDatabase = async () => {
  try {
    console.log('🚀 Iniciando configuración de base de datos...');
    
    // Limpiar datos de usuario al iniciar (para que LoginScreen aparezca)
    await clearDatabase();
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    console.log('🧹 Datos de usuario limpiados al iniciar');
    
    // Crear/inicializar la base de datos
    await initializeDatabase();
    
    // Verificar si hay usuario previamente guardado
    const cachedUser = await getUserFromDatabase();
    if (cachedUser) {
      console.log('👤 Usuario recuperado del caché:', (cachedUser as any).correo);
    } else {
      console.log('ℹ️ No hay usuario en caché local');
    }
    
    // Obtener estadísticas de caché
    const stats = await getCacheStats();
    if (stats) {
      console.log('📊 Estadísticas de caché:', {
        ofertas: stats.ofertas,
        postulaciones: stats.postulaciones,
        citaciones: stats.citaciones,
        notificaciones: stats.notificaciones,
      });
    }
    
    console.log('✅ Base de datos lista');
    return true;
  } catch (error) {
    console.error('❌ Error en setupDatabase:', error);
    // No lanzar error, permitir que la app continúe sin BD local
    return false;
  }
};

/**
 * Obtener versión de la base de datos
 */
export const getDatabaseVersion = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('workable.db');
    const result = await db.getFirstAsync('SELECT db_version FROM app_config LIMIT 1');
    return (result as any)?.db_version || 1;
  } catch (error) {
    console.error('Error obteniendo versión de BD:', error);
    return 1;
  }
};

/**
 * Hacer backup de la base de datos
 */
export const backupDatabase = async () => {
  try {
    console.log('💾 Creando backup de base de datos...');
    const db = await SQLite.openDatabaseAsync('workable.db');
    
    // Exportar datos de las tablas principales
    const ofertas = await db.getAllAsync('SELECT * FROM cached_ofertas');
    const postulaciones = await db.getAllAsync('SELECT * FROM cached_postulaciones');
    const citaciones = await db.getAllAsync('SELECT * FROM cached_citaciones');
    const notificaciones = await db.getAllAsync('SELECT * FROM cached_notificaciones');
    
    const backup = {
      timestamp: new Date().toISOString(),
      ofertas,
      postulaciones,
      citaciones,
      notificaciones,
    };
    
    console.log('✅ Backup creado:', backup);
    return backup;
  } catch (error) {
    console.error('Error creando backup:', error);
    return null;
  }
};

/**
 * Limpiar logs antiguos (más de 7 días)
 */
export const cleanOldLogs = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('workable.db');
    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const result = await db.runAsync(
      'DELETE FROM app_logs WHERE timestamp < ?',
      [sevenDaysAgo]
    );
    
    console.log(`✅ Logs antiguos eliminados: ${result.changes} registros`);
  } catch (error) {
    console.error('Error limpiando logs:', error);
  }
};

/**
 * Verificar integridad de la base de datos
 */
export const verifyDatabaseIntegrity = async () => {
  try {
    console.log('🔍 Verificando integridad de base de datos...');
    
    const db = await SQLite.openDatabaseAsync('workable.db');
    
    // Ejecutar PRAGMA integrity_check
    const result = await db.getFirstAsync('PRAGMA integrity_check');
    
    if ((result as any)?.integrity_check === 'ok') {
      console.log('✅ Integridad de BD verificada');
      return true;
    } else {
      console.error('⚠️ Problemas en integridad de BD:', result);
      return false;
    }
  } catch (error) {
    console.error('Error verificando integridad:', error);
    return false;
  }
};
