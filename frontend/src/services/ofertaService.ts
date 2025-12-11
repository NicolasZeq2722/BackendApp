import { ofertaService as baseOfertaService } from './api';

/**
 * Interfaz para estructura de Oferta
 */
export interface Oferta {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'ABIERTA' | 'CERRADA' | 'PAUSADA';
  salario: number;
  modalidad: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
  fechaLimite: string;
  reclutador?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  empresa?: {
    id: number;
    nombre: string;
  };
}

/**
 * Servicio para operaciones CRUD de ofertas
 * Usa la API base con interceptores JWT
 */
class OfertaServiceWrapper {
  /**
   * Obtener todas las ofertas
   */
  async getOfertas(): Promise<Oferta[]> {
    try {
      const response = await baseOfertaService.getAll();
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener ofertas';
      throw new Error(message);
    }
  }

  /**
   * Obtener oferta por ID
   */
  async getOfertaById(id: number): Promise<Oferta> {
    try {
      const response = await baseOfertaService.getById(id);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener oferta';
      throw new Error(message);
    }
  }

  /**
   * Crear nueva oferta
   */
  async createOferta(data: Partial<Oferta>): Promise<Oferta> {
    try {
      const response = await baseOfertaService.create(data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear oferta';
      throw new Error(message);
    }
  }

  /**
   * Actualizar oferta existente
   */
  async updateOferta(id: number, data: Partial<Oferta>): Promise<Oferta> {
    try {
      const response = await baseOfertaService.update(id, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar oferta';
      throw new Error(message);
    }
  }

  /**
   * Eliminar oferta
   */
  async deleteOferta(id: number): Promise<void> {
    try {
      await baseOfertaService.delete(id);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al eliminar oferta';
      throw new Error(message);
    }
  }

  /**
   * Eliminar oferta (alias)
   */
  async delete(id: number): Promise<void> {
    try {
      await baseOfertaService.delete(id);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al eliminar oferta';
      throw new Error(message);
    }
  }

  /**
   * Buscar ofertas por título
   */
  async searchOfertasByTitulo(titulo: string): Promise<Oferta[]> {
    try {
      const response = await baseOfertaService.search(titulo);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al buscar ofertas';
      throw new Error(message);
    }
  }

  /**
   * Obtener ofertas por ubicación (Si el endpoint existe en backend)
   */
  async searchOfertasByUbicacion(ubicacion: string): Promise<Oferta[]> {
    try {
      // Usar el método search con el nombre de la ubicación
      const response = await baseOfertaService.search(ubicacion);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al buscar por ubicación';
      throw new Error(message);
    }
  }

  /**
   * Obtener ofertas de un reclutador
   */
  async getOfertasByReclutador(reclutadorId: number): Promise<Oferta[]> {
    try {
      const response = await baseOfertaService.getByReclutador(reclutadorId);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener ofertas del reclutador';
      throw new Error(message);
    }
  }

  /**
   * Obtener todas las ofertas públicas (sin autenticación requerida)
   * Retorna solo ofertas con estado ABIERTA
   */
  async getAll(): Promise<any[]> {
    try {
      const response = await baseOfertaService.getAll();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener ofertas públicas';
      throw new Error(message);
    }
  }

  /**
   * Registrar postulación de aspirante a una oferta
   * POST /api/postulaciones
   */
  async registrarPostulacion(ofertaId: number): Promise<any> {
    try {
      // Simulación: en producción, llamaría a un endpoint real
      // const response = await basePostulacionService.create({ ofertaId });
      // return response.data;
      
      // Por ahora, retorna una promesa resuelta
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            success: true, 
            message: 'Postulación registrada correctamente' 
          });
        }, 500);
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrar postulación';
      throw new Error(message);
    }
  }

  /**
   * Obtener postulaciones del aspirante actual
   * GET /api/postulaciones/mis-postulaciones
   */
  async getMisPostulaciones(): Promise<any[]> {
    try {
      // Simulación: en producción llamaría al endpoint real
      return [];
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener postulaciones';
      throw new Error(message);
    }
  }

  /**
   * Cancelar postulación
   * DELETE /api/postulaciones/:id
   */
  async cancelarPostulacion(postulacionId: number): Promise<void> {
    try {
      // Simulación: en producción llamaría al endpoint real
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al cancelar postulación';
      throw new Error(message);
    }
  }
}

export default new OfertaServiceWrapper();
