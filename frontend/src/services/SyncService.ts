/**
 * 📡 SERVICIO DE SINCRONIZACIÓN CON EL SERVIDOR
 * 
 * Sincroniza los datos cacheados en la BD local
 * con el servidor cuando hay conexión disponible
 */

import * as Network from 'expo-network';
import { getDatabase } from './database';
import axios from 'axios';

/**
 * Verificar si hay conexión a internet
 */
export const checkInternetConnection = async () => {
  try {
    const networkState = await Network.getNetworkStateAsync();
    const isConnected = networkState.isInternetReachable;
    console.log(`📡 Conexión a internet: ${isConnected ? '✅ Conectado' : '❌ Desconectado'}`);
    return isConnected;
  } catch (error) {
    console.error('Error verificando conexión:', error);
    return false;
  }
};

/**
 * Sincronizar ofertas desde BD local con el servidor
 */
export const syncOfertas = async (accessToken: string) => {
  try {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      console.log('⚠️ Sin conexión, no se pueden sincronizar ofertas');
      return { synced: 0, error: 'Sin conexión' };
    }

    const db = await getDatabase();
    
    // Obtener todas las ofertas del caché
    const ofertas = await db.getAllAsync('SELECT * FROM cached_ofertas');
    
    if (!ofertas || ofertas.length === 0) {
      console.log('ℹ️ No hay ofertas para sincronizar');
      return { synced: 0 };
    }

    console.log(`📤 Sincronizando ${ofertas.length} ofertas...`);
    
    let syncCount = 0;
    for (const oferta of ofertas) {
      try {
        // Aquí iría la lógica de envío al servidor si es necesario
        // Por ahora solo actualizamos el timestamp de sincronización
        await db.runAsync(
          'UPDATE cached_ofertas SET synced_at = CURRENT_TIMESTAMP WHERE id = ?',
          [(oferta as any).id]
        );
        syncCount++;
      } catch (error) {
        console.error(`Error sincronizando oferta ${(oferta as any).id}:`, error);
      }
    }

    console.log(`✅ ${syncCount} ofertas sincronizadas`);
    return { synced: syncCount };
  } catch (error) {
    console.error('Error en syncOfertas:', error);
    return { synced: 0, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};

/**
 * Sincronizar cola de operaciones pendientes
 */
export const syncPendingOperations = async (accessToken: string) => {
  try {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      console.log('⚠️ Sin conexión, operaciones pendientes quedarán en cola');
      return { synced: 0, failed: 0 };
    }

    const db = await getDatabase();
    
    // Obtener todas las operaciones pendientes
    const pendingOps = await db.getAllAsync(
      "SELECT * FROM sync_queue WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT 10"
    );

    if (!pendingOps || pendingOps.length === 0) {
      console.log('ℹ️ No hay operaciones pendientes');
      return { synced: 0, failed: 0 };
    }

    console.log(`📤 Sincronizando ${pendingOps.length} operaciones pendientes...`);
    
    let syncCount = 0;
    let failedCount = 0;

    for (const op of pendingOps) {
      try {
        // Construir la URL
        const baseUrl = 'http://192.168.1.11:8080/api';
        const url = `${baseUrl}${(op as any).endpoint}`;

        // Preparar las opciones de la solicitud
        const config: any = {
          method: (op as any).method,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        };

        // Hacer la solicitud
        let response;
        if ((op as any).method === 'GET') {
          response = await axios.get(url, config);
        } else if ((op as any).method === 'POST') {
          response = await axios.post(url, (op as any).payload ? JSON.parse((op as any).payload) : {}, config);
        } else if ((op as any).method === 'PUT') {
          response = await axios.put(url, (op as any).payload ? JSON.parse((op as any).payload) : {}, config);
        } else if ((op as any).method === 'DELETE') {
          response = await axios.delete(url, config);
        }

        // Marcar como sincronizada
        await db.runAsync(
          "UPDATE sync_queue SET status = 'SYNCED', attempted_at = CURRENT_TIMESTAMP WHERE id = ?",
          [(op as any).id]
        );

        console.log(`✅ Operación ${(op as any).id} sincronizada`);
        syncCount++;
      } catch (error: any) {
        console.error(`❌ Error sincronizando operación ${(op as any).id}:`, error.message);
        
        // Actualizar con el error
        const errorMsg = error.message.substring(0, 255);
        await db.runAsync(
          "UPDATE sync_queue SET status = 'FAILED', last_error = ?, attempted_at = CURRENT_TIMESTAMP WHERE id = ?",
          [errorMsg, (op as any).id]
        );
        
        failedCount++;
      }
    }

    console.log(`✅ Sincronización completada: ${syncCount} exitosas, ${failedCount} fallidas`);
    return { synced: syncCount, failed: failedCount };
  } catch (error) {
    console.error('Error en syncPendingOperations:', error);
    return { synced: 0, failed: 0, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};

/**
 * Agregar una operación a la cola de sincronización
 * Se usará cuando no haya conexión
 */
export const addToSyncQueue = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  payload?: any
) => {
  try {
    const db = await getDatabase();
    
    await db.runAsync(
      `INSERT INTO sync_queue (endpoint, method, payload, status) 
       VALUES (?, ?, ?, 'PENDING')`,
      [endpoint, method, payload ? JSON.stringify(payload) : null]
    );
    
    console.log(`📝 Operación agregada a cola: ${method} ${endpoint}`);
  } catch (error) {
    console.error('Error agregando a sync_queue:', error);
  }
};

/**
 * Obtener el número de operaciones pendientes
 */
export const getPendingOperationCount = async () => {
  try {
    const db = await getDatabase();
    
    const result = await db.getFirstAsync(
      "SELECT COUNT(*) as count FROM sync_queue WHERE status = 'PENDING'"
    );
    
    return (result as any)?.count || 0;
  } catch (error) {
    console.error('Error obteniendo conteo de operaciones:', error);
    return 0;
  }
};

/**
 * Monitorear conexión y sincronizar automáticamente
 */
export const startAutoSync = async (accessToken: string, interval: number = 30000) => {
  console.log('🔄 Iniciando sincronización automática...');
  
  // Sincronizar inmediatamente
  await syncPendingOperations(accessToken);
  
  // Luego sincronizar periódicamente
  const syncInterval = setInterval(async () => {
    const isConnected = await checkInternetConnection();
    if (isConnected) {
      await syncPendingOperations(accessToken);
    }
  }, interval);

  // Retornar función para detener la sincronización
  return () => {
    clearInterval(syncInterval);
    console.log('⏹️ Sincronización automática detenida');
  };
};
