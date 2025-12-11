/**
 * Configuración centralizada de Axios
 * Maneja interceptores, errores globales y autenticación
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, DEFAULTS } from './constantes';
import {
  mapearErrorAPI,
  normalizarRuta,
  logearAPICall,
  logearAPIRespuesta,
  logearAPIError,
} from './apiUtils';

let interceptorRegistrado = false;

/**
 * Crear instancia de Axios configurada
 */
export const crearInstanciaAxios = () => {
  const instancia = axios.create({
    baseURL: API_BASE_URL,
    timeout: DEFAULTS.TIMEOUT_API,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Registrar interceptores solo una vez
  if (!interceptorRegistrado) {
    registrarInterceptores(instancia);
    interceptorRegistrado = true;
  }

  return instancia;
};

/**
 * Registrar interceptores de request/response
 */
const registrarInterceptores = (instancia: any) => {
  /**
   * Interceptor de Request:
   * - Agregar token JWT
   * - Normalizar ruta
   * - Loguear llamadas
   */
  instancia.interceptors.request.use(
    async (config: any) => {
      try {
        // Obtener token del almacenamiento
        const token = await AsyncStorage.getItem('@app_token');

        // Agregar token si existe
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Normalizar ruta
        config.url = normalizarRuta(config.url || '');

        // Loguear llamada
        logearAPICall(config.method?.toUpperCase() || 'UNKNOWN', config.url, config.data);

        return config;
      } catch (error) {
        console.error('Error en interceptor de request:', error);
        return Promise.reject(error);
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /**
   * Interceptor de Response:
   * - Procesar respuestas exitosas
   * - Manejar errores globalmente
   * - Renovar token si es necesario
   */
  instancia.interceptors.response.use(
    (response: any) => {
      // Loguear respuesta exitosa
      logearAPIRespuesta(
        response.config.method?.toUpperCase() || 'UNKNOWN',
        response.config.url || '',
        response.data
      );

      return response;
    },
    async (error: any) => {
      const config = error.config;

      // Loguear error
      logearAPIError(
        config?.method?.toUpperCase() || 'UNKNOWN',
        config?.url || '',
        error
      );

      // Si es error 401, podría ser token expirado
      if (error.response?.status === 401) {
        try {
          // Intentar refrescar token
          const tokenRefrescado = await intentarRefrescarToken();

          if (tokenRefrescado && config) {
            // Reintentar la solicitud original con nuevo token
            config.headers.Authorization = `Bearer ${tokenRefrescado}`;
            return instancia(config);
          }
        } catch (refreshError) {
          console.error('Error refrescando token:', refreshError);
          // Token inválido, redirigir a login sería responsabilidad de quien maneja el error
        }
      }

      // Manejar error genérico
      const mensajeError = mapearErrorAPI(error);

      // Crear nuevo error con mensaje mejorado
      const errorMejorado = new Error(mensajeError);
      Object.assign(errorMejorado, {
        original: error,
        status: error.response?.status,
        data: error.response?.data,
      });

      return Promise.reject(errorMejorado);
    }
  );
};

/**
 * Intentar refrescar token (si el backend lo soporta)
 */
const intentarRefrescarToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem('@app_refresh_token');

    if (!refreshToken) {
      return null;
    }

    // Este endpoint debe existir en el backend
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const nuevoToken = response.data.token;

    // Guardar nuevo token
    await AsyncStorage.setItem('@app_token', nuevoToken);

    return nuevoToken;
  } catch (error) {
    console.error('No se pudo refrescar token:', error);
    return null;
  }
};

/**
 * Instancia global de Axios
 */
export const axiosInstance = crearInstanciaAxios();

/**
 * Funciones auxiliares de autenticación
 */

/**
 * Guardar tokens después del login
 */
export const guardarTokens = async (token: string, refreshToken?: string) => {
  try {
    await AsyncStorage.setItem('@app_token', token);
    if (refreshToken) {
      await AsyncStorage.setItem('@app_refresh_token', refreshToken);
    }
  } catch (error) {
    console.error('Error guardando tokens:', error);
    throw error;
  }
};

/**
 * Obtener token actual
 */
export const obtenerToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('@app_token');
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
};

/**
 * Limpiar tokens (logout)
 */
export const limpiarTokens = async () => {
  try {
    await AsyncStorage.removeItem('@app_token');
    await AsyncStorage.removeItem('@app_refresh_token');
    await AsyncStorage.removeItem('@app_usuario');
  } catch (error) {
    console.error('Error limpiando tokens:', error);
    throw error;
  }
};

/**
 * Verificar si hay token válido
 */
export const tieneTokenValido = async (): Promise<boolean> => {
  try {
    const token = await obtenerToken();
    return !!token;
  } catch {
    return false;
  }
};

/**
 * Decodificar JWT (sin verificación, solo lectura)
 */
export const decodificarJWT = (token: string): any => {
  try {
    const partes = token.split('.');
    if (partes.length !== 3) {
      throw new Error('Token JWT inválido');
    }

    const payload = partes[1];
    const decodificado = atob(payload);
    return JSON.parse(decodificado);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

/**
 * Verificar si token está expirado
 */
export const estaTokenExpirado = (token: string): boolean => {
  try {
    const decoded = decodificarJWT(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    // exp está en segundos, convertir a milisegundos
    const expiresAt = decoded.exp * 1000;
    return Date.now() >= expiresAt;
  } catch {
    return true;
  }
};

/**
 * Obtener información del usuario desde el token
 */
export const obtenerUsuarioDelToken = async (): Promise<any | null> => {
  try {
    const token = await obtenerToken();
    if (!token || estaTokenExpirado(token)) {
      return null;
    }

    const decoded = decodificarJWT(token);
    return decoded || null;
  } catch {
    return null;
  }
};

/**
 * Configurar header de autorización manualmente (si es necesario)
 */
export const establecerAuthorizacionManual = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

/**
 * Realizar request con reintentos automáticos
 */
export const requestConReintentos = async <T,>(
  metodo: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  datos?: any,
  reintentos: number = 3
): Promise<T> => {
  let ultimoError: any;

  for (let intento = 0; intento < reintentos; intento++) {
    try {
      const response = await (axiosInstance[metodo] as any)(url, datos);
      return response.data;
    } catch (error) {
      ultimoError = error;

      // No reintentar errores de validación o autenticación
      const status = (error as any).status;
      if (status === 400 || status === 401 || status === 403 || status === 404) {
        throw error;
      }

      // Esperar antes de reintentar (con backoff exponencial)
      if (intento < reintentos - 1) {
        const retraso = 1000 * Math.pow(2, intento);
        await new Promise((resolve) => setTimeout(resolve, retraso));
      }
    }
  }

  throw ultimoError;
};

export default axiosInstance;
