/**
 * GUÍA: Cómo integrar las utilidades en api.ts
 * Este archivo muestra el patrón recomendado para usar las utilidades
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  axiosInstance,
  guardarTokens,
  obtenerToken,
  mapearErrorAPI,
  reintentar,
  conTimeout,
} from '@/utils';

// ============================================================
// ANTES (Patrón anterior sin utilidades)
// ============================================================

// ❌ No usar esto (sin utilidades)
/*
const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.11:8080/api',
  timeout: 10000,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@app_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token } = response.data;
      await AsyncStorage.setItem('@app_token', token);
      return response.data;
    } catch (error) {
      throw new Error('Login fallido');
    }
  },
};
*/

// ============================================================
// DESPUÉS (Patrón mejorado con utilidades)
// ============================================================

/**
 * Servicio de autenticación mejorado
 * ✅ Usa utilidades para manejo de tokens y errores
 */
export const authService = {
  /**
   * Iniciar sesión con email y contraseña
   */
  login: async (email: string, password: string) => {
    try {
      const response = await conTimeout(
        axiosInstance.post('/auth/login', { email, password }),
        10000 // 10 segundos timeout
      );

      const { token, refreshToken } = response.data;

      // Usar utilidad para guardar tokens
      await guardarTokens(token, refreshToken);

      return response.data;
    } catch (error) {
      // Mapear error a mensaje amigable
      throw new Error(mapearErrorAPI(error));
    }
  },

  /**
   * Registrar nuevo usuario
   */
  register: async (datos: { email: string; password: string; nombre: string }) => {
    try {
      const response = await axiosInstance.post('/auth/register', datos);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  /**
   * Cerrar sesión
   */
  logout: async () => {
    // Utilidad para limpiar almacenamiento
    await limpiarTokens();
  },

  /**
   * Obtener usuario actual
   */
  getMe: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },
};

/**
 * Servicio de ofertas mejorado
 * ✅ Usa utilidades para reintentos y manejo de errores
 */
export const ofertaService = {
  /**
   * Obtener todas las ofertas (con reintentos)
   */
  getAll: async () => {
    try {
      // Reintentar hasta 3 veces si falla
      const datos = await reintentar(
        () => axiosInstance.get('/oferta'),
        3,
        1000
      );
      return datos.data || datos;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  /**
   * Obtener oferta por ID
   */
  getById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/oferta/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  /**
   * Obtener ofertas del reclutador actual
   */
  getByReclutador: async (reclutadorId: number) => {
    try {
      const response = await axiosInstance.get('/oferta', {
        params: { reclutadorId },
      });
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  /**
   * Buscar ofertas por título
   */
  search: async (titulo: string) => {
    try {
      const response = await axiosInstance.get('/oferta', {
        params: { titulo },
      });
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  /**
   * Crear nueva oferta
   */
  create: async (datos: any) => {
    try {
      const response = await axiosInstance.post('/oferta', datos);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  /**
   * Actualizar oferta
   */
  update: async (id: number, datos: any) => {
    try {
      const response = await axiosInstance.put(`/oferta/${id}`, datos);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  /**
   * Eliminar oferta
   */
  delete: async (id: number) => {
    try {
      await axiosInstance.delete(`/oferta/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  /**
   * Filtrar por estado
   */
  getByEstado: async (estado: 'ABIERTA' | 'CERRADA' | 'PAUSADA') => {
    try {
      const response = await axiosInstance.get('/oferta', {
        params: { estado },
      });
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  /**
   * Filtrar por modalidad
   */
  getByModalidad: async (modalidad: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO') => {
    try {
      const response = await axiosInstance.get('/oferta', {
        params: { modalidad },
      });
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },
};

/**
 * Servicio de usuarios mejorado
 */
export const usuarioService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/usuario');
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  getById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/usuario/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  create: async (datos: any) => {
    try {
      const response = await axiosInstance.post('/usuario', datos);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  update: async (id: number, datos: any) => {
    try {
      const response = await axiosInstance.put(`/usuario/${id}`, datos);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  delete: async (id: number) => {
    try {
      await axiosInstance.delete(`/usuario/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },
};

/**
 * Servicio de postulaciones mejorado
 */
export const postulacionService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/postulacion');
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  getById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/postulacion/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  create: async (datos: any) => {
    try {
      const response = await axiosInstance.post('/postulacion', datos);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  getByOferta: async (ofertaId: number) => {
    try {
      const response = await axiosInstance.get('/postulacion', {
        params: { ofertaId },
      });
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },
};

/**
 * Servicio de citaciones mejorado
 */
export const citacionService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/citacion');
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  create: async (datos: any) => {
    try {
      const response = await axiosInstance.post('/citacion', datos);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  update: async (id: number, datos: any) => {
    try {
      const response = await axiosInstance.put(`/citacion/${id}`, datos);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },
};

/**
 * Servicio de notificaciones mejorado
 */
export const notificacionService = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/notificacion');
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  markAsRead: async (id: number) => {
    try {
      const response = await axiosInstance.put(`/notificacion/${id}/read`);
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },
};

/**
 * Servicio de estadísticas mejorado
 */
export const statsService = {
  getDashboard: async () => {
    try {
      const response = await axiosInstance.get('/stats/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  getUsuariosStats: async () => {
    try {
      const response = await axiosInstance.get('/stats/usuarios');
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },

  getOfertasStats: async () => {
    try {
      const response = await axiosInstance.get('/stats/ofertas');
      return response.data;
    } catch (error) {
      throw new Error(mapearErrorAPI(error));
    }
  },
};

// ============================================================
// VENTAJAS DEL NUEVO PATRÓN
// ============================================================

/*
✅ ANTES vs DESPUÉS:

1. Manejo de errores
   ❌ throw new Error('Error genérico')
   ✅ throw new Error(mapearErrorAPI(error)) // Mensaje amigable

2. Tokens
   ❌ AsyncStorage.setItem manualmente
   ✅ guardarTokens(token, refreshToken) // Función reutilizable

3. Reintentos
   ❌ Código de retry manual en cada servicio
   ✅ reintentar() // Una línea, reutilizable

4. Timeout
   ❌ Configurado globalmente solamente
   ✅ conTimeout() // Configurable por request

5. Mantenibilidad
   ❌ Lógica dispersa en múltiples servicios
   ✅ Lógica centralizada en utilidades

6. Testabilidad
   ❌ Difícil testear por acoplamiento
   ✅ Funciones puras fáciles de testear

7. Escalabilidad
   ❌ Agregar feature = cambiar múltiples archivos
   ✅ Agregar feature = cambiar utilidades

8. Documentación
   ❌ Sin documentación clara
   ✅ JSDoc + ejemplos en cada función
*/

export default {
  authService,
  ofertaService,
  usuarioService,
  postulacionService,
  citacionService,
  notificacionService,
  statsService,
};
