import axios from 'axios';

const API_URL = 'http://192.168.1.11:8080/api';

/**
 * Interfaz para Reclutador
 */
export interface Reclutador {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  estado: 'ACTIVO' | 'INACTIVO';
  empresa: { id: number; nombre: string };
  fechaRegistro?: string;
}

/**
 * Servicio para operaciones CRUD de reclutadores
 */
class ReclutadorServiceWrapper {
  /**
   * Obtener todos los reclutadores (ADMIN)
   */
  async getAll(): Promise<Reclutador[]> {
    try {
      const response = await axios.get(`${API_URL}/reclutador`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener reclutadores');
    }
  }

  /**
   * Obtener reclutador por ID
   */
  async getById(id: number): Promise<Reclutador> {
    try {
      const response = await axios.get(`${API_URL}/reclutador/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener reclutador');
    }
  }

  /**
   * Obtener reclutadores por empresa
   */
  async getByEmpresa(empresaId: number): Promise<Reclutador[]> {
    try {
      const response = await axios.get(`${API_URL}/reclutador/empresa/${empresaId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener reclutadores de empresa');
    }
  }

  /**
   * Crear nuevo reclutador (ADMIN)
   */
  async create(data: Partial<Reclutador>): Promise<Reclutador> {
    try {
      const response = await axios.post(`${API_URL}/reclutador`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear reclutador');
    }
  }

  /**
   * Actualizar reclutador
   */
  async update(id: number, data: Partial<Reclutador>): Promise<Reclutador> {
    try {
      const response = await axios.put(`${API_URL}/reclutador/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar reclutador');
    }
  }

  /**
   * Eliminar reclutador (ADMIN)
   */
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/reclutador/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar reclutador');
    }
  }

  /**
   * Obtener reclutadores activos
   */
  async getActivos(): Promise<Reclutador[]> {
    try {
      const response = await this.getAll();
      return response.filter((r: Reclutador) => r.estado === 'ACTIVO');
    } catch (error: any) {
      throw new Error('Error al obtener reclutadores activos');
    }
  }

  /**
   * Obtener conteo total de reclutadores
   */
  async getCount(): Promise<number> {
    try {
      const reclutadores = await this.getAll();
      return reclutadores.length;
    } catch (error: any) {
      throw new Error('Error al contar reclutadores');
    }
  }
}

export default new ReclutadorServiceWrapper();
