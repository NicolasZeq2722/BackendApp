/**
 * 🗄️ SERVICIO DE BASE DE DATOS LOCAL (SQLite)
 * 
 * Gestiona la base de datos SQLite local en el dispositivo móvil
 * Permite cacheo de datos y sincronización con el servidor
 */

import * as SQLite from 'expo-sqlite';

// Nombre de la base de datos
const DB_NAME = 'workable.db';

// Versión de la base de datos
const DB_VERSION = 1;

/**
 * Inicializar la base de datos
 * Crea las tablas si no existen
 */
export const initializeDatabase = async () => {
  try {
    console.log('🗄️ Inicializando base de datos local...');
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    
    // Ejecutar script SQL de inicialización
    await db.execAsync(`
      -- =======================================
      -- TABLA DE CONFIGURACIÓN DE LA APP
      -- =======================================
      CREATE TABLE IF NOT EXISTS app_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_url TEXT NOT NULL DEFAULT 'http://192.168.1.11:8080/api',
        api_timeout INTEGER DEFAULT 30000,
        db_version INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- =======================================
      -- TABLA DE AUTENTICACIÓN Y USUARIO
      -- =======================================
      CREATE TABLE IF NOT EXISTS user_auth (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        correo TEXT NOT NULL UNIQUE,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        rol TEXT NOT NULL CHECK(rol IN ('ASPIRANTE', 'RECLUTADOR', 'ADMIN')),
        token TEXT NOT NULL,
        refresh_token TEXT,
        token_expires_at DATETIME,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- =======================================
      -- TABLA DE CACHÉ DE OFERTAS
      -- =======================================
      CREATE TABLE IF NOT EXISTS cached_ofertas (
        id INTEGER PRIMARY KEY,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        salario REAL,
        estado TEXT CHECK(estado IN ('ABIERTA', 'CERRADA', 'PAUSADA')),
        modalidad TEXT CHECK(modalidad IN ('PRESENCIAL', 'REMOTO', 'HIBRIDO')),
        fecha_limite TEXT,
        reclutador_id INTEGER,
        reclutador_nombre TEXT,
        reclutador_apellido TEXT,
        empresa_id INTEGER,
        empresa_nombre TEXT,
        synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_favorite INTEGER DEFAULT 0
      );

      -- =======================================
      -- TABLA DE CACHÉ DE POSTULACIONES
      -- =======================================
      CREATE TABLE IF NOT EXISTS cached_postulaciones (
        id INTEGER PRIMARY KEY,
        oferta_id INTEGER NOT NULL,
        aspirante_id INTEGER NOT NULL,
        estado TEXT DEFAULT 'ENVIADA',
        fecha_postulacion DATETIME,
        synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- =======================================
      -- TABLA DE CACHÉ DE CITACIONES
      -- =======================================
      CREATE TABLE IF NOT EXISTS cached_citaciones (
        id INTEGER PRIMARY KEY,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        estado TEXT CHECK(estado IN ('PENDIENTE', 'REALIZADA', 'CANCELADA')),
        fecha_citacion DATETIME,
        hora TEXT,
        locacion TEXT,
        reclutador_id INTEGER,
        aspirante_id INTEGER,
        oferta_id INTEGER,
        synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- =======================================
      -- TABLA DE CACHÉ DE NOTIFICACIONES
      -- =======================================
      CREATE TABLE IF NOT EXISTS cached_notificaciones (
        id INTEGER PRIMARY KEY,
        titulo TEXT NOT NULL,
        contenido TEXT,
        tipo TEXT,
        leida INTEGER DEFAULT 0,
        usuario_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        synced_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- =======================================
      -- TABLA DE LOGS LOCALES
      -- =======================================
      CREATE TABLE IF NOT EXISTS app_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nivel TEXT CHECK(nivel IN ('DEBUG', 'INFO', 'WARN', 'ERROR')),
        mensaje TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- =======================================
      -- TABLA DE SINCRONIZACIÓN
      -- =======================================
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT NOT NULL,
        method TEXT NOT NULL CHECK(method IN ('GET', 'POST', 'PUT', 'DELETE')),
        payload TEXT,
        status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'SYNCED', 'FAILED')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        attempted_at DATETIME,
        last_error TEXT
      );

      -- =======================================
      -- ÍNDICES PARA OPTIMIZAR BÚSQUEDAS
      -- =======================================
      CREATE INDEX IF NOT EXISTS idx_user_auth_token ON user_auth(token);
      CREATE INDEX IF NOT EXISTS idx_user_auth_correo ON user_auth(correo);
      CREATE INDEX IF NOT EXISTS idx_cached_ofertas_estado ON cached_ofertas(estado);
      CREATE INDEX IF NOT EXISTS idx_cached_ofertas_favorite ON cached_ofertas(is_favorite);
      CREATE INDEX IF NOT EXISTS idx_cached_postulaciones_aspirante ON cached_postulaciones(aspirante_id);
      CREATE INDEX IF NOT EXISTS idx_cached_citaciones_estado ON cached_citaciones(estado);
      CREATE INDEX IF NOT EXISTS idx_cached_notificaciones_usuario ON cached_notificaciones(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_cached_notificaciones_leida ON cached_notificaciones(leida);
      CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
      CREATE INDEX IF NOT EXISTS idx_app_logs_nivel ON app_logs(nivel);

      -- =======================================
      -- INSERCIONES INICIALES
      -- =======================================
      INSERT OR IGNORE INTO app_config (api_url, api_timeout, db_version) 
      VALUES ('http://192.168.1.11:8080/api', 30000, 1);
    `);
    
    console.log('✅ Base de datos inicializada correctamente');
    return db;
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
};

/**
 * Obtener instancia de la base de datos
 */
export const getDatabase = async () => {
  try {
    return await SQLite.openDatabaseAsync(DB_NAME);
  } catch (error) {
    console.error('Error obteniendo base de datos:', error);
    throw error;
  }
};

/**
 * Guardar usuario autenticado en la BD local
 */
export const saveUserToDatabase = async (user: any) => {
  try {
    const db = await getDatabase();
    
    await db.runAsync(
      `INSERT OR REPLACE INTO user_auth (user_id, correo, nombre, apellido, rol, token) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user.id, user.correo, user.nombre, user.apellido, user.role || user.rol, user.token]
    );
    
    console.log('✅ Usuario guardado en BD local');
  } catch (error) {
    console.error('Error guardando usuario:', error);
  }
};

/**
 * Obtener usuario autenticado de la BD local
 */
export const getUserFromDatabase = async () => {
  try {
    const db = await getDatabase();
    
    const result = await db.getFirstAsync(
      'SELECT * FROM user_auth WHERE is_active = 1 LIMIT 1'
    );
    
    if (result) {
      console.log('✅ Usuario recuperado de BD local');
      return result;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
};

/**
 * Guardar ofertas en caché local
 */
export const cacheOfertas = async (ofertas: any[]) => {
  try {
    const db = await getDatabase();
    
    for (const oferta of ofertas) {
      await db.runAsync(
        `INSERT OR REPLACE INTO cached_ofertas 
         (id, titulo, descripcion, salario, estado, modalidad, fecha_limite, 
          reclutador_id, reclutador_nombre, reclutador_apellido, empresa_id, empresa_nombre) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          oferta.id,
          oferta.titulo,
          oferta.descripcion,
          oferta.salario,
          oferta.estado,
          oferta.modalidad,
          oferta.fechaLimite,
          oferta.reclutador?.id,
          oferta.reclutador?.nombre,
          oferta.reclutador?.apellido,
          oferta.empresa?.id,
          oferta.empresa?.nombre
        ]
      );
    }
    
    console.log(`✅ ${ofertas.length} ofertas cacheadas`);
  } catch (error) {
    console.error('Error cacheando ofertas:', error);
  }
};

/**
 * Obtener ofertas del caché local
 */
export const getCachedOfertas = async () => {
  try {
    const db = await getDatabase();
    
    const result = await db.getAllAsync(
      'SELECT * FROM cached_ofertas ORDER BY synced_at DESC'
    );
    
    console.log(`✅ ${result?.length || 0} ofertas obtenidas del caché`);
    return result || [];
  } catch (error) {
    console.error('Error obteniendo ofertas cacheadas:', error);
    return [];
  }
};

/**
 * Marcar oferta como favorita
 */
export const toggleOfertaFavorite = async (ofertaId: number, isFavorite: boolean) => {
  try {
    const db = await getDatabase();
    
    await db.runAsync(
      'UPDATE cached_ofertas SET is_favorite = ? WHERE id = ?',
      [isFavorite ? 1 : 0, ofertaId]
    );
    
    console.log(`✅ Oferta ${ofertaId} actualizada`);
  } catch (error) {
    console.error('Error actualizando favorito:', error);
  }
};

/**
 * Limpiar caché local (cuando cierra sesión)
 */
export const clearDatabase = async () => {
  try {
    const db = await getDatabase();
    
    await db.execAsync(`
      DELETE FROM user_auth;
      DELETE FROM cached_ofertas;
      DELETE FROM cached_postulaciones;
      DELETE FROM cached_citaciones;
      DELETE FROM cached_notificaciones;
    `);
    
    console.log('✅ Base de datos limpiada');
  } catch (error) {
    console.error('Error limpiando base de datos:', error);
  }
};

/**
 * Obtener estadísticas de caché
 */
export const getCacheStats = async () => {
  try {
    const db = await getDatabase();
    
    const ofertas = await db.getFirstAsync('SELECT COUNT(*) as count FROM cached_ofertas');
    const postulaciones = await db.getFirstAsync('SELECT COUNT(*) as count FROM cached_postulaciones');
    const citaciones = await db.getFirstAsync('SELECT COUNT(*) as count FROM cached_citaciones');
    const notificaciones = await db.getFirstAsync('SELECT COUNT(*) as count FROM cached_notificaciones');
    
    return {
      ofertas: (ofertas as any)?.count || 0,
      postulaciones: (postulaciones as any)?.count || 0,
      citaciones: (citaciones as any)?.count || 0,
      notificaciones: (notificaciones as any)?.count || 0,
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return null;
  }
};
