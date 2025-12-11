import axios from 'axios';

const API_URL = 'http://192.168.1.11:8080/api';

/**
 * Interfaz para una Notificación
 */
export interface Notificacion {
  id: number;
  usuarioId: number;
  usuarioNombre?: string;
  tipo: 'POSTULACION_ACEPTADA' | 'POSTULACION_RECHAZADA' | 'NUEVA_OFERTA' | 'GENERAL' | 'RESPUESTA_POSTULACION';
  titulo: string;
  mensaje: string;
  leida: boolean;
  fechaCreacion: string;
  ofertaId?: number;
  postulacionId?: number;
  relacionadoId?: number;
}

/**
 * Wrapper para servicios de Notificación
 */
class NotificacionServiceWrapper {
  /**
   * Obtener notificaciones del aspirante autenticado
   * GET /api/notificacion/aspirante
   */
  async getMisNotificaciones(): Promise<Notificacion[]> {
    try {
      const response = await axios.get(`${API_URL}/notificacion/aspirante`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al obtener notificaciones';
      throw new Error(message);
    }
  }

  /**
   * Obtener notificaciones de un usuario específico (por ID)
   * GET /api/notificacion/usuario/:usuarioId
   */
  async getByUsuario(usuarioId: number): Promise<Notificacion[]> {
    try {
      const response = await axios.get(`${API_URL}/notificacion/usuario/${usuarioId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al obtener notificaciones del usuario';
      throw new Error(message);
    }
  }

  /**
   * Obtener notificaciones NO leídas de un usuario
   * GET /api/notificacion/usuario/:usuarioId/no-leidas
   */
  async getNoLeidas(usuarioId: number): Promise<Notificacion[]> {
    try {
      const response = await axios.get(`${API_URL}/notificacion/usuario/${usuarioId}/no-leidas`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al obtener notificaciones no leídas';
      throw new Error(message);
    }
  }

  /**
   * Contar notificaciones NO leídas
   * GET /api/notificacion/usuario/:usuarioId/contar
   */
  async contarNoLeidas(usuarioId: number): Promise<number> {
    try {
      const response = await axios.get(`${API_URL}/notificacion/usuario/${usuarioId}/contar`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al contar notificaciones';
      throw new Error(message);
    }
  }

  /**
   * Marcar una notificación como leída
   * PUT /api/notificacion/:id/marcar-leida
   */
  async marcarComoLeida(id: number): Promise<Notificacion> {
    try {
      const response = await axios.put(`${API_URL}/notificacion/${id}/marcar-leida`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al marcar notificación como leída';
      throw new Error(message);
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   * PUT /api/notificacion/usuario/:usuarioId/todas-leidas
   */
  async marcarTodasComoLeida(usuarioId: number): Promise<void> {
    try {
      await axios.put(`${API_URL}/notificacion/usuario/${usuarioId}/todas-leidas`);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al marcar todas las notificaciones como leídas';
      throw new Error(message);
    }
  }

  /**
   * Crear una notificación (ADMIN only)
   * POST /api/notificacion
   */
  async create(notificacion: Omit<Notificacion, 'id' | 'fechaCreacion'>): Promise<Notificacion> {
    try {
      const response = await axios.post(`${API_URL}/notificacion`, notificacion);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al crear notificación';
      throw new Error(message);
    }
  }

  /**
   * Eliminar una notificación
   * DELETE /api/notificacion/:id
   */
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/notificacion/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al eliminar notificación';
      throw new Error(message);
    }
  }
}

export default new NotificacionServiceWrapper();
