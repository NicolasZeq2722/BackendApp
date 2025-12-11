/**
 * Utilidades para manejo de API y errores
 */

import axios from 'axios';
import { DEFAULTS, MENSAJES } from './constantes';

/**
 * Mapear errores de API a mensajes amigables
 */
export const mapearErrorAPI = (error: any): string => {
  if (error.response) {
    // El servidor respondió con un código de error
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data.message || 'Solicitud inválida';
      case 401:
        return 'No autorizado. Por favor inicia sesión de nuevo.';
      case 403:
        return 'No tienes permiso para realizar esta acción';
      case 404:
        return 'Recurso no encontrado';
      case 409:
        return data.message || 'Conflicto en los datos';
      case 500:
        return 'Error del servidor. Intenta más tarde.';
      case 503:
        return 'El servidor está en mantenimiento. Intenta más tarde.';
      default:
        return data.message || MENSAJES.ERROR_GENERICO;
    }
  } else if (error.request) {
    // La solicitud se hizo pero no se recibió respuesta
    return MENSAJES.ERROR_RED;
  } else {
    // Algo pasó en la configuración de la solicitud
    return error.message || MENSAJES.ERROR_GENERICO;
  }
};

/**
 * Reintentar una función asíncrona N veces
 */
export const reintentar = async <T,>(
  funcion: () => Promise<T>,
  reintentos: number = DEFAULTS.REINTENTOS_API,
  retrasoMs: number = 1000
): Promise<T> => {
  let ultimoError: any;

  for (let intento = 0; intento < reintentos; intento++) {
    try {
      return await funcion();
    } catch (error) {
      ultimoError = error;
      if (intento < reintentos - 1) {
        await new Promise((resolve) => setTimeout(resolve, retrasoMs * Math.pow(2, intento)));
      }
    }
  }

  throw ultimoError;
};

/**
 * Envolver llamada a API con timeout
 */
export const conTimeout = async <T,>(
  promesa: Promise<T>,
  tiempoMs: number = DEFAULTS.TIMEOUT_API
): Promise<T> => {
  return Promise.race([
    promesa,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error('La solicitud tardó demasiado. Intenta de nuevo.')),
        tiempoMs
      )
    ),
  ]);
};

/**
 * Procesar respuesta de API y validar estructura
 */
export const procesarRespuesta = <T,>(respuesta: any): T => {
  if (!respuesta) {
    throw new Error('Respuesta vacía del servidor');
  }

  // Si la respuesta es un array, devolverlo directamente
  if (Array.isArray(respuesta)) {
    return respuesta as T;
  }

  // Si la respuesta tiene datos, devolverlos
  if (respuesta.data !== undefined) {
    return respuesta.data as T;
  }

  // Si la respuesta es un objeto con propiedades útiles, devolverla
  return respuesta as T;
};

/**
 * Validar que una respuesta tenga la estructura esperada
 */
export const validarEstructura = <T,>(
  respuesta: any,
  camposRequeridos: (keyof T)[]
): respuesta is T => {
  if (typeof respuesta !== 'object' || respuesta === null) {
    return false;
  }

  return camposRequeridos.every((campo) => campo in respuesta);
};

/**
 * Formatear parámetros de consulta
 */
export const formatearParams = (params: Record<string, any>): Record<string, any> => {
  const paramsLimpios: Record<string, any> = {};

  for (const [clave, valor] of Object.entries(params)) {
    // Omitir valores vacíos, null, undefined
    if (valor !== null && valor !== undefined && valor !== '') {
      paramsLimpios[clave] = valor;
    }
  }

  return paramsLimpios;
};

/**
 * Crear headers personalizados
 */
export const crearHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Determinar si el error es de autenticación
 */
export const esErrorAutenticacion = (error: any): boolean => {
  if (error?.response?.status === 401) {
    return true;
  }

  if (error?.response?.status === 403) {
    return true;
  }

  const mensaje = error?.response?.data?.message?.toLowerCase() || '';
  return mensaje.includes('unauthorized') || mensaje.includes('token');
};

/**
 * Determinar si el error es de conexión
 */
export const esErrorConexion = (error: any): boolean => {
  if (!error.response) {
    return true;
  }

  return error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND';
};

/**
 * Determinar si es seguro reintentar (no reintentar POST, PUT, DELETE sin cuidado)
 */
export const esSeguroReintentar = (metodo: string): boolean => {
  return metodo.toUpperCase() === 'GET';
};

/**
 * Construir URL completa con parámetros
 */
export const construirURL = (
  baseURL: string,
  ruta: string,
  params?: Record<string, any>
): string => {
  let url = `${baseURL}${ruta}`;

  if (params && Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    for (const [clave, valor] of Object.entries(params)) {
      if (valor !== null && valor !== undefined && valor !== '') {
        queryParams.append(clave, String(valor));
      }
    }
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
};

/**
 * Utilidad para debug de llamadas API (solo en desarrollo)
 */
export const logearAPICall = (metodo: string, url: string, datos?: any) => {
  if (__DEV__) {
    console.log(`[API] ${metodo} ${url}`);
    if (datos) {
      console.log('[API] Datos:', datos);
    }
  }
};

/**
 * Utilidad para debug de respuestas API (solo en desarrollo)
 */
export const logearAPIRespuesta = (metodo: string, url: string, respuesta: any) => {
  if (__DEV__) {
    console.log(`[API] ${metodo} ${url} - Respuesta:`, respuesta);
  }
};

/**
 * Utilidad para debug de errores API (solo en desarrollo)
 */
export const logearAPIError = (metodo: string, url: string, error: any) => {
  if (__DEV__) {
    console.log(`[API] ${metodo} ${url} - Error:`, error.response?.data || error.message);
  }
};

/**
 * Parsear error de validación del servidor
 */
export const parsearErroresValidacion = (
  error: any
): Record<string, string> => {
  const errores: Record<string, string> = {};

  if (error?.response?.data?.errors) {
    // Formato estándar Spring: { errors: { campo: "mensaje" } }
    Object.assign(errores, error.response.data.errors);
  } else if (error?.response?.data?.fieldErrors) {
    // Formato alternativo
    Object.assign(errores, error.response.data.fieldErrors);
  } else if (error?.response?.data?.validationErrors) {
    // Otro formato posible
    Object.assign(errores, error.response.data.validationErrors);
  }

  return errores;
};

/**
 * Aplicar transformaciones comunes a respuestas
 */
export const transformarRespuesta = <T,>(respuesta: any): T => {
  // Si es un array, retornarlo como está
  if (Array.isArray(respuesta)) {
    return respuesta as T;
  }

  // Si tiene propiedad 'data', extraerla
  if (respuesta?.data) {
    return respuesta.data as T;
  }

  // Si tiene propiedad 'content' (para paginación)
  if (respuesta?.content) {
    return respuesta.content as T;
  }

  // Si es un objeto, retornarlo como está
  return respuesta as T;
};

/**
 * Validar si una URL es válida
 */
export const validarURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Normalizar rutas API
 */
export const normalizarRuta = (ruta: string): string => {
  // Asegurar que empiece con /
  if (!ruta.startsWith('/')) {
    ruta = '/' + ruta;
  }

  // Remover barras múltiples
  ruta = ruta.replace(/\/+/g, '/');

  // Remover barra final si existe
  if (ruta.endsWith('/') && ruta.length > 1) {
    ruta = ruta.slice(0, -1);
  }

  return ruta;
};
