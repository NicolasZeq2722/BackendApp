import { aspiranteService as baseAspiranteService } from './api';

/**
 * Interfaz para Aspirante
 */
export interface Aspirante {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  estado: 'ACTIVO' | 'INACTIVO';
  fechaRegistro?: string;
  fotoPerfil?: string;
  descripcion?: string;
}

/**
 * Servicio para operaciones CRUD de aspirantes
 */
class AspiranteServiceWrapper {
  /**
   * Obtener todos los aspirantes (ADMIN)
   */
  async getAll(): Promise<Aspirante[]> {
    try {
      const response = await baseAspiranteService.getAll();
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener aspirantes');
    }
  }

  /**
   * Obtener aspirante por ID
   */
  async getById(id: number): Promise<Aspirante> {
    try {
      const response = await baseAspiranteService.getById(id);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener aspirante');
    }
  }

  /**
   * Obtener perfil actual del aspirante autenticado
   */
  async getMe(): Promise<Aspirante> {
    try {
      const response = await baseAspiranteService.getMe();
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener perfil');
    }
  }

  /**
   * Crear nuevo aspirante (ADMIN o registro público)
   */
  async create(data: Partial<Aspirante>): Promise<Aspirante> {
    try {
      const response = await baseAspiranteService.create(data);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear aspirante');
    }
  }

  /**
   * Actualizar aspirante
   */
  async update(id: number, data: Partial<Aspirante>): Promise<Aspirante> {
    try {
      const response = await baseAspiranteService.update(id, data);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar aspirante');
    }
  }

  /**
   * Activar aspirante (ADMIN)
   */
  async activate(id: number): Promise<Aspirante> {
    try {
      const response = await baseAspiranteService.activate(id);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al activar aspirante');
    }
  }

  /**
   * Desactivar aspirante (ADMIN)
   */
  async deactivate(id: number): Promise<Aspirante> {
    try {
      const response = await baseAspiranteService.deactivate(id);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al desactivar aspirante');
    }
  }

  /**
   * Eliminar aspirante (ADMIN)
   */
  async delete(id: number): Promise<void> {
    try {
      await baseAspiranteService.delete(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar aspirante');
    }
  }

  /**
   * Obtener aspirantes activos
   */
  async getActivos(): Promise<Aspirante[]> {
    try {
      const response = await baseAspiranteService.getAll();
      return response.filter((a: Aspirante) => a.estado === 'ACTIVO');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener aspirantes activos');
    }
  }

  /**
   * Obtener conteo total de aspirantes
   */
  async getCount(): Promise<number> {
    try {
      const aspirantes = await this.getAll();
      return aspirantes.length;
    } catch (error: any) {
      throw new Error('Error al contar aspirantes');
    }
  }
}

export default new AspiranteServiceWrapper();
