import axios from 'axios';

const API_URL = 'http://192.168.1.11:8080/api';

/**
 * Interfaz para una Postulación
 */
export interface Postulacion {
  id: number;
  ofertaId: number;
  ofertaTitulo?: string;
  ofertaEmpresa?: string;
  aspiranteId: number;
  aspiranteNombre?: string;
  aspiranteApellido?: string;
  aspiranteCorreo?: string;
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA';
  fechaPostulacion: string;
  fechaRespuesta?: string;
  comentarios?: string;
  reclutadorId?: number;
}

/**
 * Wrapper para servicios de Postulación
 */
class PostulacionServiceWrapper {
  /**
   * Crear una nueva postulación (aspirante se postula a oferta)
   * POST /api/postulacion
   */
  async create(ofertaId: number, aspiranteId: number): Promise<Postulacion> {
    try {
      const response = await axios.post(`${API_URL}/postulacion`, {
        ofertaId,
        aspiranteId,
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al crear postulación';
      throw new Error(message);
    }
  }

  /**
   * Obtener postulación por ID
   * GET /api/postulacion/:id
   */
  async getById(id: number, usuarioIdActual: number): Promise<Postulacion> {
    try {
      const response = await axios.get(`${API_URL}/postulacion/${id}?usuarioIdActual=${usuarioIdActual}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al obtener postulación';
      throw new Error(message);
    }
  }

  /**
   * Obtener todas las postulaciones
   * GET /api/postulacion (Admin only)
   */
  async getAll(): Promise<Postulacion[]> {
    try {
      const response = await axios.get(`${API_URL}/postulacion`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al obtener postulaciones';
      throw new Error(message);
    }
  }

  /**
   * Obtener postulaciones de una oferta específica
   * GET /api/postulacion/oferta/:ofertaId
   */
  async getByOferta(ofertaId: number, usuarioIdActual: number): Promise<Postulacion[]> {
    try {
      const response = await axios.get(
        `${API_URL}/postulacion/oferta/${ofertaId}?usuarioIdActual=${usuarioIdActual}`
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al obtener postulaciones de la oferta';
      throw new Error(message);
    }
  }

  /**
   * Obtener postulaciones de un aspirante
   * GET /api/postulacion/usuario/:usuarioId
   */
  async getByAspirante(usuarioId: number, usuarioIdActual: number): Promise<Postulacion[]> {
    try {
      const response = await axios.get(
        `${API_URL}/postulacion/usuario/${usuarioId}?usuarioIdActual=${usuarioIdActual}`
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al obtener postulaciones del aspirante';
      throw new Error(message);
    }
  }

  /**
   * Obtener mis postulaciones (del aspirante autenticado)
   * GET /api/postulacion/usuario/:usuarioId (cuando usuarioId = usuarioIdActual)
   */
  async getMisPostulaciones(usuarioId: number): Promise<Postulacion[]> {
    try {
      const response = await axios.get(
        `${API_URL}/postulacion/usuario/${usuarioId}?usuarioIdActual=${usuarioId}`
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al obtener tus postulaciones';
      throw new Error(message);
    }
  }

  /**
   * Obtener postulaciones de un reclutador (ofertas que creó)
   * GET /api/postulacion/reclutador/:reclutadorId
   */
  async getByReclutador(reclutadorId: number, usuarioIdActual: number): Promise<Postulacion[]> {
    try {
      const response = await axios.get(
        `${API_URL}/postulacion/reclutador/${reclutadorId}?usuarioIdActual=${usuarioIdActual}`
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al obtener postulaciones del reclutador';
      throw new Error(message);
    }
  }

  /**
   * Actualizar estado de una postulación
   * PUT /api/postulacion/:id/estado?estado=ACEPTADA/RECHAZADA&reclutadorId=X
   */
  async updateEstado(
    id: number,
    estado: 'ACEPTADA' | 'RECHAZADA',
    reclutadorId: number
  ): Promise<Postulacion> {
    try {
      const response = await axios.put(
        `${API_URL}/postulacion/${id}/estado?estado=${estado}&reclutadorId=${reclutadorId}`
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al actualizar estado de postulación';
      throw new Error(message);
    }
  }

  /**
   * Cancelar postulación (aspirante cancela su postulación)
   * DELETE /api/postulacion/:id?aspiranteId=X
   */
  async cancelar(id: number, aspiranteId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/postulacion/${id}?aspiranteId=${aspiranteId}`);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al cancelar postulación';
      throw new Error(message);
    }
  }

  /**
   * Obtener postulaciones por oferta y estado
   * GET /api/postulacion/oferta/:ofertaId/estado?estado=PENDIENTE&usuarioIdActual=X
   */
  async getByOfertaYEstado(
    ofertaId: number,
    estado: string,
    usuarioIdActual: number
  ): Promise<Postulacion[]> {
    try {
      const response = await axios.get(
        `${API_URL}/postulacion/oferta/${ofertaId}/estado?estado=${estado}&usuarioIdActual=${usuarioIdActual}`
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al obtener postulaciones por estado';
      throw new Error(message);
    }
  }

  /**
   * Obtener número total de postulaciones de un aspirante
   * GET /api/postulacion/contar/:usuarioId
   */
  async contar(usuarioId: number): Promise<number> {
    try {
      const response = await axios.get(`${API_URL}/postulacion/contar/${usuarioId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al contar postulaciones';
      throw new Error(message);
    }
  }
}

export default new PostulacionServiceWrapper();
